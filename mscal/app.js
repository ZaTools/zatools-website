/**
 * MS_cal Web版 アプリケーションロジック
 * SwiftUI版と同等の機能を提供
 */

class MSCalApp {
    constructor() {
        this.dataManager = new MSDataManager();
        this.currentEvaluation = new MSEvaluation('');
        this.init();
    }

    init() {
        // 言語設定を初期化
        languageManager.updateUI();
        
        this.setupUI();
        this.bindEvents();
        this.setCurrentDate();
        this.updateEDSSDisplay();
    }

    setupUI() {
        this.createFSGrid();
        this.createWalkingGrid();
        this.updatePatientSelector();
    }

    createFSGrid() {
        const fsGrid = document.getElementById('fs-grid');
        fsGrid.innerHTML = '';

        FunctionalSystem.allCases.forEach(system => {
            const fsItem = document.createElement('div');
            fsItem.className = 'fs-item';
            
            const maxGrade = FunctionalSystem.getMaxGrade(system);
            const allowsX = FunctionalSystem.allowsX(system);
            
            fsItem.innerHTML = `
                <div class="fs-label">
                    <span data-text="${system}">${languageManager.getText(system)}</span>
                    <span class="fs-range">(0-${maxGrade}${allowsX ? ', X' : ''})</span>
                    <button class="fs-help-button" data-system="${system}" title="${languageManager.getText('help')}">
                        <i class="fas fa-question-circle"></i>
                    </button>
                </div>
                <div class="fs-controls">
                    <div class="grade-selector" data-system="${system}">
                        ${Array.from({length: maxGrade + 1}, (_, i) => 
                            `<button class="grade-button" data-grade="${i}">${i}</button>`
                        ).join('')}
                        ${allowsX ? '<button class="grade-button x-button" data-grade="X">X</button>' : ''}
                    </div>
                </div>
            `;
            
            fsGrid.appendChild(fsItem);
        });
    }

    createWalkingGrid() {
        const walkingGrid = document.getElementById('walking-grid');
        walkingGrid.innerHTML = '';

        WalkingAbility.allCases.forEach(ability => {
            const walkingOption = document.createElement('div');
            walkingOption.className = 'walking-option';
            walkingOption.dataset.ability = ability;
            
            // EDSS範囲を取得
            const range = WalkingAbility.getEDSSRange(ability);
            const rangeText = range[0] === range[1] ? 
                `EDSS ${range[0].toFixed(1)}` : 
                `EDSS ${range[0].toFixed(1)}-${range[1].toFixed(1)}`;
            
            walkingOption.innerHTML = `
                <div class="walking-title">${rangeText}</div>
                <div class="walking-description" data-text="${ability}">${languageManager.getText('walkingAbilities.' + ability)}</div>
            `;
            
            walkingGrid.appendChild(walkingOption);
        });

        // デフォルトで「正常」を選択
        walkingGrid.querySelector('[data-ability="normal"]').classList.add('active');
    }

    bindEvents() {
        // FS評価のイベント
        document.getElementById('fs-grid').addEventListener('click', (e) => {
            if (e.target.classList.contains('grade-button')) {
                this.handleFSGradeSelection(e);
            } else if (e.target.closest('.fs-help-button')) {
                this.showFSDefinition(e.target.closest('.fs-help-button').dataset.system);
            }
        });

        // 歩行能力評価のイベント
        document.getElementById('walking-grid').addEventListener('click', (e) => {
            const option = e.target.closest('.walking-option');
            if (option) {
                this.handleWalkingAbilitySelection(option);
            }
        });

        // 患者ID、評価日、メモの変更イベント
        document.getElementById('patient-id').addEventListener('input', () => {
            this.currentEvaluation.patientId = document.getElementById('patient-id').value;
        });

        document.getElementById('evaluation-date').addEventListener('change', () => {
            this.currentEvaluation.evaluationDate = new Date(document.getElementById('evaluation-date').value);
        });

        document.getElementById('notes').addEventListener('input', () => {
            this.currentEvaluation.notes = document.getElementById('notes').value;
        });

        // ボタンイベント
        document.getElementById('save-evaluation').addEventListener('click', () => {
            this.saveEvaluation();
        });

        document.getElementById('reset-evaluation').addEventListener('click', () => {
            this.resetEvaluation();
        });

        document.getElementById('show-history').addEventListener('click', () => {
            this.toggleHistory();
        });

        // 患者選択イベント
        document.getElementById('patient-selector').addEventListener('change', (e) => {
            this.loadPatientHistory(e.target.value);
        });
        
        // 言語切り替えイベント
        document.getElementById('langJa').addEventListener('click', () => {
            this.switchLanguage('ja');
        });
        
        document.getElementById('langEn').addEventListener('click', () => {
            this.switchLanguage('en');
        });
        
        // モーダルの閉じるボタンイベント
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.modal').style.display = 'none';
            });
        });
        
        // モーダル外クリックで閉じる
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    handleFSGradeSelection(e) {
        const button = e.target;
        const system = button.closest('.grade-selector').dataset.system;
        const grade = button.dataset.grade;
        
        // 同じFS内の他のボタンの選択を解除
        const gradeSelector = button.closest('.grade-selector');
        gradeSelector.querySelectorAll('.grade-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 選択されたボタンをアクティブにする
        button.classList.add('active');
        
        // FSグレードを更新
        if (grade === 'X') {
            this.currentEvaluation.updateFSGrade(system, 0, true);
        } else {
            this.currentEvaluation.updateFSGrade(system, parseInt(grade), false);
        }
        
        this.updateEDSSDisplay();
    }

    handleWalkingAbilitySelection(option) {
        // 他の選択を解除
        document.querySelectorAll('.walking-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // 選択されたオプションをアクティブにする
        option.classList.add('active');
        
        // 歩行能力を更新
        this.currentEvaluation.walkingAbility = option.dataset.ability;
        this.updateEDSSDisplay();
    }

    updateEDSSDisplay() {
        const edssScore = this.currentEvaluation.calculateEDSS();
        const edssResult = new EDSSResult(this.currentEvaluation.fsGrades, this.currentEvaluation.walkingAbility);
        
        document.getElementById('edss-score').textContent = edssScore.toFixed(1);
        document.getElementById('edss-description').textContent = edssResult.description;
        
        // 警告表示を更新
        this.updateWarningsDisplay(edssResult.warnings);
        
        // 計算根拠を表示
        this.updateCalculationBasis(edssResult.calculationBasis);
    }
    
    updateWarningsDisplay(warnings) {
        let warningsContainer = document.getElementById('warnings-container');
        
        // 警告コンテナが存在しない場合は作成
        if (!warningsContainer) {
            warningsContainer = document.createElement('div');
            warningsContainer.id = 'warnings-container';
            warningsContainer.className = 'warnings-container';
            
            const edssResult = document.querySelector('.edss-result');
            edssResult.parentNode.insertBefore(warningsContainer, edssResult.nextSibling);
        }
        
        // 警告を表示
        if (warnings.length > 0) {
            warningsContainer.innerHTML = warnings.map(warning => `
                <div class="warning-item">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${warning}</span>
                </div>
            `).join('');
            warningsContainer.style.display = 'block';
        } else {
            warningsContainer.style.display = 'none';
        }
    }
    
    updateCalculationBasis(basis) {
        let basisContainer = document.getElementById('calculation-basis');
        
        if (!basisContainer) {
            basisContainer = document.createElement('div');
            basisContainer.id = 'calculation-basis';
            basisContainer.className = 'calculation-basis';
            
            const edssDetails = document.querySelector('.edss-details');
            edssDetails.parentNode.insertBefore(basisContainer, edssDetails.nextSibling);
        }
        
        basisContainer.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${basis}</span>
        `;
    }

    setCurrentDate() {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        document.getElementById('evaluation-date').value = dateString;
        this.currentEvaluation.evaluationDate = today;
    }

    saveEvaluation() {
        if (!this.currentEvaluation.patientId.trim()) {
            alert('患者IDを入力してください。');
            return;
        }

        this.dataManager.saveEvaluation(this.currentEvaluation);
        alert('評価を保存しました。');
        this.updatePatientSelector();
    }

    resetEvaluation() {
        if (confirm('現在の評価をリセットしますか？')) {
            this.currentEvaluation = new MSEvaluation('');
            this.resetUI();
            this.setCurrentDate();
            this.updateEDSSDisplay();
        }
    }

    resetUI() {
        // 患者情報をクリア
        document.getElementById('patient-id').value = '';
        document.getElementById('notes').value = '';
        
        // FSグレードをリセット
        document.querySelectorAll('.grade-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // 最初のグレード（0）を選択
        document.querySelectorAll('.grade-selector').forEach(selector => {
            const firstButton = selector.querySelector('[data-grade="0"]');
            if (firstButton) {
                firstButton.classList.add('active');
            }
        });
        
        // 歩行能力を正常にリセット
        document.querySelectorAll('.walking-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('[data-ability="normal"]').classList.add('active');
        this.currentEvaluation.walkingAbility = 'normal';
    }

    toggleHistory() {
        const historySection = document.getElementById('history-section');
        const isVisible = historySection.style.display !== 'none';
        
        if (isVisible) {
            historySection.style.display = 'none';
            document.getElementById('show-history').innerHTML = '<i class="fas fa-history"></i> 履歴表示';
        } else {
            historySection.style.display = 'block';
            document.getElementById('show-history').innerHTML = '<i class="fas fa-eye-slash"></i> 履歴非表示';
            this.updatePatientSelector();
        }
    }

    updatePatientSelector() {
        const selector = document.getElementById('patient-selector');
        const patientIds = this.dataManager.getAllPatientIds();
        
        selector.innerHTML = '<option value="">患者を選択してください</option>';
        
        patientIds.forEach(patientId => {
            const option = document.createElement('option');
            option.value = patientId;
            option.textContent = patientId;
            selector.appendChild(option);
        });
    }

    loadPatientHistory(patientId) {
        const historyList = document.getElementById('history-list');
        
        if (!patientId) {
            historyList.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">患者を選択してください</p>';
            return;
        }
        
        const evaluations = this.dataManager.getEvaluationsForPatient(patientId);
        
        if (evaluations.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">この患者の評価履歴がありません</p>';
            return;
        }
        
        historyList.innerHTML = evaluations.map(evaluation => {
            const date = new Date(evaluation.evaluationDate).toLocaleDateString('ja-JP');
            const time = new Date(evaluation.evaluationDate).toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="history-item">
                    <div class="history-info">
                        <div class="history-date">${date} ${time}</div>
                        <div class="history-details">
                            ${evaluation.notes ? `メモ: ${evaluation.notes.substring(0, 50)}${evaluation.notes.length > 50 ? '...' : ''}` : 'メモなし'}
                        </div>
                    </div>
                    <div class="history-edss">${evaluation.calculatedEDSS.toFixed(1)}</div>
                </div>
            `;
        }).join('');
    }

    // 評価履歴から選択された評価を読み込む（将来的な機能拡張用）
    loadEvaluation(evaluation) {
        this.currentEvaluation = evaluation;
        
        // UIを更新
        document.getElementById('patient-id').value = evaluation.patientId;
        document.getElementById('evaluation-date').value = evaluation.evaluationDate.toISOString().split('T')[0];
        document.getElementById('notes').value = evaluation.notes;
        
        // FSグレードを復元
        this.resetUI();
        FunctionalSystem.allCases.forEach(system => {
            const fsGrade = evaluation.getFSGrade(system);
            const selector = document.querySelector(`[data-system="${system}"]`);
            
            if (fsGrade.isX) {
                const xButton = selector.querySelector('[data-grade="X"]');
                if (xButton) {
                    xButton.classList.add('active');
                }
            } else {
                const gradeButton = selector.querySelector(`[data-grade="${fsGrade.grade}"]`);
                if (gradeButton) {
                    gradeButton.classList.add('active');
                }
            }
        });
        
        // 歩行能力を復元
        document.querySelectorAll('.walking-option').forEach(option => {
            option.classList.remove('active');
        });
        const walkingOption = document.querySelector(`[data-ability="${evaluation.walkingAbility}"]`);
        if (walkingOption) {
            walkingOption.classList.add('active');
        }
        
        this.updateEDSSDisplay();
    }
    
    switchLanguage(lang) {
        languageManager.setLanguage(lang);
        
        // UIの更新
        this.createFSGrid();
        this.createWalkingGrid();
        this.updateEDSSDisplay();
        
        // 言語ボタンの状態更新
        document.getElementById('langJa').classList.toggle('active', lang === 'ja');
        document.getElementById('langEn').classList.toggle('active', lang === 'en');
    }
    
    showFSDefinition(system) {
        const modal = document.getElementById(`${system}HelpModal`);
        if (modal) {
            modal.style.display = 'block';
            // 内容を更新（言語切り替え時に対応）
            languageManager.updateFSHelp();
        }
    }
    

}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new MSCalApp();
});

// PWA対応（将来的な拡張）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // サービスワーカーの登録は将来的に実装
        console.log('MS_cal Web版が読み込まれました');
    });
} 