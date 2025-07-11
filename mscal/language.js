// 多言語対応システム
class LanguageManager {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = {
            ja: {
                // ページタイトル・ヘッダー
                pageTitle: 'MS_cal - 多発性硬化症評価ツール',
                headerTitle: 'MS_cal - 多発性硬化症評価ツール',
                subtitle: 'EDSS (Expanded Disability Status Scale) / FS (Functional Systems) 評価',
                
                // 患者情報
                patientInfo: '患者情報',
                patientId: '患者ID',
                patientIdPlaceholder: '患者IDを入力',
                evaluationDate: '評価日',
                
                // 機能系統評価
                fsEvaluation: '機能系統 (FS) 評価',
                pyramidal: '錐体路',
                cerebellar: '小脳',
                brainstem: '脳幹',
                sensory: '感覚',
                bowelBladder: '腸管・膀胱',
                visual: '視覚',
                cerebral: '大脳',
                other: 'その他',
                
                // 歩行能力評価
                walkingEvaluation: '歩行能力評価',
                walkingAbility: '歩行距離・能力',
                walkingAbilities: {
                    normal: '正常（制限なし）',
                    mild500m: '500m歩行可能（歩行完全）',
                    moderate300m: '300m歩行可能（歩行完全）',
                    severe200m: '200m歩行可能',
                    veryLimited100m: '100m歩行可能',
                    assistanceUnilateral100m: '100m歩行可能（片側補助必要）',
                    assistanceBilateral20m: '20m歩行可能（両側補助必要）',
                    wheelchair5m: '5m未満のみ歩行可能（車椅子主体）',
                    wheelchairLimited: '数歩のみ可能（車椅子に制限）',
                    bedbound: 'ベッド・椅子主体（セルフケア可能）',
                    bedboundLimited: 'ベッド主体（腕機能制限あり）',
                    helpless: 'ベッド患者（コミュニケーション・食事可能）',
                    totallyHelpless: '全介助状態（コミュニケーション・嚥下困難）'
                },
                
                // EDSS結果
                edssResult: 'EDSS結果',
                edssScore: 'EDSSスコア',
                calculationBasis: '計算根拠',
                warnings: '警告',
                
                // ボタン
                save: '保存',
                reset: 'リセット',
                history: '履歴',
                help: 'ヘルプ',
                language: '言語',
                
                // 免責事項
                disclaimer: '免責事項: このツールは医学的助言の代替ではありません。臨床判断は必ず医師が行ってください。',
                
                // FS定義
                fsDefinitions: {
                    pyramidal: {
                        title: '錐体路機能',
                        grades: {
                            0: '正常',
                            1: '異常な徴候のみ、障害なし',
                            2: '軽度の障害',
                            3: '軽度から中等度の対麻痺または片麻痺；重度の単麻痺',
                            4: '著明な対麻痺または片麻痺；中等度の四肢麻痺；または単麻痺',
                            5: '対麻痺、片麻痺、または著明な四肢麻痺',
                            6: '四肢麻痺'
                        }
                    },
                    cerebellar: {
                        title: '小脳機能',
                        grades: {
                            0: '正常',
                            1: '異常な徴候のみ、障害なし',
                            2: '軽度の失調',
                            3: '中等度の体幹または四肢失調',
                            4: '重度の失調（全四肢）',
                            5: '失調のため協調運動不能',
                            'X': '錐体路の脱力により評価不能'
                        }
                    },
                    brainstem: {
                        title: '脳幹機能',
                        grades: {
                            0: '正常',
                            1: '徴候のみ',
                            2: '中等度の眼振またはその他の軽度の障害',
                            3: '重度の眼振、著明な眼外筋脱力、または中等度の他の障害',
                            4: '著明な構音障害または嚥下障害、またはその他の著明な障害',
                            5: '構音障害または嚥下障害が不能'
                        }
                    },
                    sensory: {
                        title: '感覚機能',
                        grades: {
                            0: '正常',
                            1: '振動または図形覚のみの軽度低下',
                            2: '軽度の触覚または痛覚低下、または位置覚低下',
                            3: '中等度の触覚または痛覚低下、または位置覚低下',
                            4: '著明な触覚または痛覚低下、または位置覚低下、または位置覚消失',
                            5: '感覚消失（頭部以下）',
                            6: '頭部から感覚消失'
                        }
                    },
                    bowelBladder: {
                        title: '腸管・膀胱機能',
                        grades: {
                            0: '正常',
                            1: '軽度の排尿躊躇、切迫、または尿保持',
                            2: '中等度の排尿躊躇、切迫、尿保持、または稀な尿失禁',
                            3: '頻繁な尿失禁',
                            4: '導尿がほぼ必要',
                            5: '膀胱機能消失',
                            6: '膀胱および腸管機能消失'
                        }
                    },
                    visual: {
                        title: '視覚機能',
                        grades: {
                            0: '正常',
                            1: '暗点、視覚的敏捷性低下',
                            2: '両眼で矯正視力6/9以上、または中等度暗点',
                            3: '良い方の眼で矯正視力6/9-6/12、または著明暗点',
                            4: '良い方の眼で矯正視力6/15-6/24、または中度視野欠損',
                            5: '良い方の眼で矯正視力6/30-6/60',
                            6: '良い方の眼で矯正視力6/60未満',
                            'X': '視神経蒼白による評価'
                        }
                    },
                    cerebral: {
                        title: '大脳機能（精神機能）',
                        grades: {
                            0: '正常',
                            1: '気分変化のみ（障害なし）',
                            2: '軽度の認知機能低下',
                            3: '中等度の認知機能低下',
                            4: '著明な認知機能低下',
                            5: '認知機能障害または慢性脳症候群'
                        }
                    },
                    other: {
                        title: 'その他の神経機能',
                        grades: {
                            0: 'なし',
                            1: '他のMS関連神経機能異常'
                        }
                    }
                }
            },
            en: {
                // Page title and header
                pageTitle: 'MS_cal - Multiple Sclerosis Assessment Tool',
                headerTitle: 'MS_cal - Multiple Sclerosis Assessment Tool',
                subtitle: 'EDSS (Expanded Disability Status Scale) / FS (Functional Systems) Assessment',
                
                // Patient information
                patientInfo: 'Patient Information',
                patientId: 'Patient ID',
                patientIdPlaceholder: 'Enter patient ID',
                evaluationDate: 'Assessment Date',
                
                // Functional systems evaluation
                fsEvaluation: 'Functional Systems (FS) Assessment',
                pyramidal: 'Pyramidal',
                cerebellar: 'Cerebellar',
                brainstem: 'Brainstem',
                sensory: 'Sensory',
                bowelBladder: 'Bowel & Bladder',
                visual: 'Visual',
                cerebral: 'Cerebral',
                other: 'Other',
                
                // Walking ability assessment
                walkingEvaluation: 'Walking Ability Assessment',
                walkingAbility: 'Walking Distance/Ability',
                walkingAbilities: {
                    normal: 'Normal (no restrictions)',
                    mild500m: 'Able to walk ~500m (full walking)',
                    moderate300m: 'Able to walk ~300m (full walking)',
                    severe200m: 'Able to walk ~200m',
                    veryLimited100m: 'Able to walk ~100m',
                    assistanceUnilateral100m: 'Able to walk ~100m (unilateral assistance required)',
                    assistanceBilateral20m: 'Able to walk ~20m (bilateral assistance required)',
                    wheelchair5m: 'Able to walk less than 5m only (wheelchair-dependent)',
                    wheelchairLimited: 'Able to walk only a few steps (wheelchair-restricted)',
                    bedbound: 'Bed/chair bound (self-care possible)',
                    bedboundLimited: 'Bed-bound (with limited arm function)',
                    helpless: 'Bedridden patient (able to communicate and eat)',
                    totallyHelpless: 'Totally helpless state (unable to communicate and swallow)'
                },
                
                // EDSS results
                edssResult: 'EDSS Result',
                edssScore: 'EDSS Score',
                calculationBasis: 'Calculation Basis',
                warnings: 'Warnings',
                
                // Buttons
                save: 'Save',
                reset: 'Reset',
                history: 'History',
                help: 'Help',
                language: 'Language',
                
                // Disclaimer
                disclaimer: 'Disclaimer: This tool is not a substitute for medical advice. Clinical decisions must always be made by physicians.',
                
                // FS definitions
                fsDefinitions: {
                    pyramidal: {
                        title: 'Pyramidal Functions',
                        grades: {
                            0: 'Normal',
                            1: 'Abnormal signs only without disability',
                            2: 'Minimal disability',
                            3: 'Mild or moderate paraparesis or hemiparesis; severe monoparesis',
                            4: 'Marked paraparesis or hemiparesis; moderate quadriparesis; or monoplegia',
                            5: 'Paraplegia, hemiplegia, or marked quadriparesis',
                            6: 'Quadriplegia'
                        }
                    },
                    cerebellar: {
                        title: 'Cerebellar Functions',
                        grades: {
                            0: 'Normal',
                            1: 'Abnormal signs only without disability',
                            2: 'Mild ataxia',
                            3: 'Moderate truncal or limb ataxia',
                            4: 'Severe ataxia in all limbs',
                            5: 'Unable to perform coordinated movements due to ataxia',
                            'X': 'Cannot be tested due to weakness (pyramidal)'
                        }
                    },
                    brainstem: {
                        title: 'Brainstem Functions',
                        grades: {
                            0: 'Normal',
                            1: 'Signs only',
                            2: 'Moderate nystagmus or other mild disability',
                            3: 'Severe nystagmus, marked extraocular weakness, or moderate disability of other cranial nerves',
                            4: 'Marked dysarthria or other marked disability',
                            5: 'Inability to swallow or speak'
                        }
                    },
                    sensory: {
                        title: 'Sensory Functions',
                        grades: {
                            0: 'Normal',
                            1: 'Vibration or figure-writing decrease only, in one or two limbs',
                            2: 'Mild decrease in touch or pain or position sense, and/or moderate decrease in vibration in one or two limbs',
                            3: 'Moderate decrease in touch or pain or position sense, and/or essentially lost vibration in one or two limbs',
                            4: 'Marked decrease in touch or pain or lost position sense, alone or combined, in one or two limbs',
                            5: 'Loss (essentially) of sensation in one or two limbs',
                            6: 'Sensation essentially lost below the head'
                        }
                    },
                    bowelBladder: {
                        title: 'Bowel and Bladder Functions',
                        grades: {
                            0: 'Normal',
                            1: 'Mild urinary hesitancy, urgency, or retention',
                            2: 'Moderate urinary hesitancy, urgency, retention of bowel or bladder, or rare urinary incontinence',
                            3: 'Frequent urinary incontinence',
                            4: 'In need of almost constant catheterization',
                            5: 'Loss of bladder function',
                            6: 'Loss of bowel and bladder function'
                        }
                    },
                    visual: {
                        title: 'Visual Functions',
                        grades: {
                            0: 'Normal',
                            1: 'Scotoma with visual acuity (corrected) better than 20/30',
                            2: 'Worse eye with scotoma with maximal visual acuity (corrected) of 20/30 to 20/59',
                            3: 'Worse eye with large scotoma, or moderate decrease in fields, but with maximal visual acuity (corrected) of 20/60 to 20/99',
                            4: 'Worse eye with marked decrease of fields and maximal visual acuity (corrected) of 20/100 to 20/200',
                            5: 'Worse eye with maximal visual acuity (corrected) less than 20/200',
                            6: 'Grade 5 plus maximal visual acuity of better eye of 20/60 or less',
                            'X': 'Can be added to grades 0 through 6 for presence of temporal pallor of optic discs'
                        }
                    },
                    cerebral: {
                        title: 'Cerebral (Mental) Functions',
                        grades: {
                            0: 'Normal',
                            1: 'Mood alteration only (does not affect DSS score)',
                            2: 'Mild decrease in mentation',
                            3: 'Moderate decrease in mentation',
                            4: 'Marked decrease in mentation (chronic brain syndrome - moderate)',
                            5: 'Dementia or chronic brain syndrome - severe or incompetent'
                        }
                    },
                    other: {
                        title: 'Other Functions',
                        grades: {
                            0: 'None',
                            1: 'Any other neurologic findings attributed to MS'
                        }
                    }
                }
            }
        };
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        this.updateUI();
    }
    
    getText(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return key; // フォールバック
            }
        }
        
        return value;
    }
    
    updateUI() {
        // テキスト要素を更新
        document.querySelectorAll('[data-text]').forEach(element => {
            const key = element.getAttribute('data-text');
            element.textContent = this.getText(key);
        });
        
        // プレースホルダーを更新
        document.querySelectorAll('[data-placeholder]').forEach(element => {
            const key = element.getAttribute('data-placeholder');
            element.placeholder = this.getText(key);
        });
        
        // タイトルを更新
        document.title = this.getText('pageTitle');
        
        // 選択肢を更新
        this.updateSelectOptions();
        
        // FSヘルプボタンを更新
        this.updateFSHelp();
    }
    
    updateSelectOptions() {
        // 歩行能力の選択肢を更新
        const walkingSelect = document.getElementById('walkingAbility');
        if (walkingSelect) {
            const options = walkingSelect.querySelectorAll('option');
            options.forEach(option => {
                const key = option.value;
                if (key && this.getText(key)) {
                    option.textContent = this.getText(key);
                }
            });
        }
    }
    
    updateFSHelp() {
        // FSヘルプモーダルの内容を更新
        const fsNames = ['pyramidal', 'cerebellar', 'brainstem', 'sensory', 'bowelBladder', 'visual', 'cerebral', 'other'];
        
        fsNames.forEach(fsName => {
            const modal = document.getElementById(`${fsName}HelpModal`);
            if (modal) {
                const title = modal.querySelector('.modal-title');
                const content = modal.querySelector('.fs-definition-content');
                
                if (title) {
                    title.textContent = this.getText(`fsDefinitions.${fsName}.title`);
                }
                
                if (content) {
                    const fsDefinition = this.translations[this.currentLanguage].fsDefinitions[fsName];
                    if (fsDefinition) {
                        content.innerHTML = Object.entries(fsDefinition.grades)
                            .map(([grade, desc]) => `<div class="grade-item"><strong>Grade ${grade}:</strong> ${desc}</div>`)
                            .join('');
                    }
                }
            }
        });
    }
}

// グローバルインスタンス
const languageManager = new LanguageManager(); 