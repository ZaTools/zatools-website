/**
 * MS_cal データモデル（SwiftUI DataModel.swiftから移植）
 * 多発性硬化症 EDSS/FS評価に必要なデータ構造
 */

// 機能系統（FS）の定義
class FunctionalSystem {
    static PYRAMIDAL = 'pyramidal';
    static CEREBELLAR = 'cerebellar';
    static BRAINSTEM = 'brainstem';
    static SENSORY = 'sensory';
    static BOWEL_BLADDER = 'bowelBladder';
    static VISUAL = 'visual';
    static CEREBRAL = 'cerebral';
    static OTHER = 'other';
    
    static allCases = [
        this.PYRAMIDAL,
        this.CEREBELLAR,
        this.BRAINSTEM,
        this.SENSORY,
        this.BOWEL_BLADDER,
        this.VISUAL,
        this.CEREBRAL,
        this.OTHER
    ];
    
    static getDisplayName(system) {
        const displayNames = {
            'pyramidal': '錐体路機能',
            'cerebellar': '小脳機能',
            'brainstem': '脳幹機能',
            'sensory': '感覚機能',
            'bowelBladder': '膀胱直腸機能',
            'visual': '視覚機能',
            'cerebral': '精神機能',
            'other': 'その他'
        };
        return displayNames[system] || system;
    }
    
    static getMaxGrade(system) {
        const maxGrades = {
            'pyramidal': 6,
            'cerebellar': 5,
            'brainstem': 5,
            'sensory': 6,
            'bowelBladder': 6,
            'visual': 6,
            'cerebral': 5,
            'other': 1
        };
        return maxGrades[system] || 0;
    }
    
    static allowsX(system) {
        return system === this.CEREBELLAR || system === this.VISUAL;
    }
}

// FS評価グレードクラス
class FSGrade {
    constructor(system, grade = 0, isX = false) {
        this.system = system;
        this.grade = Math.min(Math.max(grade, 0), FunctionalSystem.getMaxGrade(system));
        this.isX = isX && FunctionalSystem.allowsX(system);
    }
    
    get displayValue() {
        if (this.isX && FunctionalSystem.allowsX(this.system)) {
            return 'X';
        }
        return this.grade.toString();
    }
}

// 歩行能力評価（ガイドライン準拠）
class WalkingAbility {
    static NORMAL = 'normal';
    static MILD_500M = 'mild500m';
    static MODERATE_300M = 'moderate300m';
    static SEVERE_200M = 'severe200m';
    static VERY_LIMITED_100M = 'veryLimited100m';
    static ASSISTANCE_UNILATERAL_100M = 'assistanceUnilateral100m';
    static ASSISTANCE_BILATERAL_20M = 'assistanceBilateral20m';
    static WHEELCHAIR_5M = 'wheelchair5m';
    static WHEELCHAIR_LIMITED = 'wheelchairLimited';
    static BEDBOUND = 'bedbound';
    static BEDBOUND_LIMITED = 'bedboundLimited';
    static HELPLESS = 'helpless';
    static TOTALLY_HELPLESS = 'totallyHelpless';
    
    static allCases = [
        this.NORMAL,
        this.MILD_500M,
        this.MODERATE_300M,
        this.SEVERE_200M,
        this.VERY_LIMITED_100M,
        this.ASSISTANCE_UNILATERAL_100M,
        this.ASSISTANCE_BILATERAL_20M,
        this.WHEELCHAIR_5M,
        this.WHEELCHAIR_LIMITED,
        this.BEDBOUND,
        this.BEDBOUND_LIMITED,
        this.HELPLESS,
        this.TOTALLY_HELPLESS
    ];
    
    static getDisplayName(ability) {
        const displayNames = {
            'normal': '正常（制限なし）',
            'mild500m': '500m歩行可能（歩行完全）',
            'moderate300m': '300m歩行可能（歩行完全）',
            'severe200m': '200m歩行可能',
            'veryLimited100m': '100m歩行可能',
            'assistanceUnilateral100m': '100m歩行可能（片側補助必要）',
            'assistanceBilateral20m': '20m歩行可能（両側補助必要）',
            'wheelchair5m': '5m未満のみ歩行可能（車椅子主体）',
            'wheelchairLimited': '数歩のみ可能（車椅子に制限）',
            'bedbound': 'ベッド・椅子主体（セルフケア可能）',
            'bedboundLimited': 'ベッド主体（腕機能制限あり）',
            'helpless': 'ベッド患者（コミュニケーション・食事可能）',
            'totallyHelpless': '全介助状態（コミュニケーション・嚥下困難）'
        };
        return displayNames[ability] || ability;
    }
    
    static getEDSSRange(ability) {
        const ranges = {
            'normal': [0.0, 3.5],
            'mild500m': [4.0, 4.0],
            'moderate300m': [4.5, 4.5],
            'severe200m': [5.0, 5.0],
            'veryLimited100m': [5.5, 5.5],
            'assistanceUnilateral100m': [6.0, 6.0],
            'assistanceBilateral20m': [6.5, 6.5],
            'wheelchair5m': [7.0, 7.0],
            'wheelchairLimited': [7.5, 7.5],
            'bedbound': [8.0, 8.0],
            'bedboundLimited': [8.5, 8.5],
            'helpless': [9.0, 9.0],
            'totallyHelpless': [9.5, 9.5]
        };
        return ranges[ability] || [0.0, 0.0];
    }
}

// MS評価記録クラス
class MSEvaluation {
    constructor(patientId, evaluationDate = new Date()) {
        this.id = this.generateUUID();
        this.patientId = patientId;
        this.evaluationDate = evaluationDate;
        this.fsGrades = {};
        this.walkingAbility = WalkingAbility.NORMAL;
        this.calculatedEDSS = 0.0;
        this.notes = '';
        
        // 全FSを初期化
        FunctionalSystem.allCases.forEach(system => {
            this.fsGrades[system] = new FSGrade(system);
        });
    }
    
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    updateFSGrade(system, grade, isX = false) {
        this.fsGrades[system] = new FSGrade(system, grade, isX);
    }
    
    getFSGrade(system) {
        return this.fsGrades[system] || new FSGrade(system);
    }
    
    calculateEDSS() {
        this.calculatedEDSS = EDSSCalculator.calculateEDSS(this.fsGrades, this.walkingAbility);
        return this.calculatedEDSS;
    }
}

// データ永続化マネージャー
class MSDataManager {
    constructor() {
        this.evaluations = [];
        this.storageKey = 'MSEvaluations';
        this.loadEvaluations();
    }
    
    saveEvaluation(evaluation) {
        const index = this.evaluations.findIndex(e => e.id === evaluation.id);
        if (index >= 0) {
            this.evaluations[index] = evaluation;
        } else {
            this.evaluations.push(evaluation);
        }
        this.saveEvaluations();
    }
    
    deleteEvaluation(evaluation) {
        this.evaluations = this.evaluations.filter(e => e.id !== evaluation.id);
        this.saveEvaluations();
    }
    
    getEvaluationsForPatient(patientId) {
        return this.evaluations
            .filter(e => e.patientId === patientId)
            .sort((a, b) => new Date(b.evaluationDate) - new Date(a.evaluationDate));
    }
    
    getAllPatientIds() {
        const patientIds = [...new Set(this.evaluations.map(e => e.patientId))];
        return patientIds.sort();
    }
    
    saveEvaluations() {
        try {
            const data = JSON.stringify(this.evaluations);
            localStorage.setItem(this.storageKey, data);
        } catch (error) {
            console.error('評価データの保存に失敗しました:', error);
        }
    }
    
    loadEvaluations() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.evaluations = parsed.map(e => {
                    const evaluation = new MSEvaluation(e.patientId, new Date(e.evaluationDate));
                    evaluation.id = e.id;
                    evaluation.walkingAbility = e.walkingAbility;
                    evaluation.calculatedEDSS = e.calculatedEDSS;
                    evaluation.notes = e.notes || '';
                    
                    // FSグレードを復元
                    FunctionalSystem.allCases.forEach(system => {
                        if (e.fsGrades[system]) {
                            evaluation.fsGrades[system] = new FSGrade(
                                system,
                                e.fsGrades[system].grade,
                                e.fsGrades[system].isX
                            );
                        }
                    });
                    
                    return evaluation;
                });
            }
        } catch (error) {
            console.error('評価データの読み込みに失敗しました:', error);
            this.evaluations = [];
        }
    }
}

// FS定義情報（将来的な機能拡張用）
class FSDefinition {
    constructor(system, grade, definition) {
        this.system = system;
        this.grade = grade;
        this.definition = definition;
    }
}

// EDSS計算結果
class EDSSResult {
    constructor(fsGrades, walkingAbility) {
        this.score = EDSSCalculator.calculateEDSS(fsGrades, walkingAbility);
        this.description = EDSSCalculator.getEDSSDescription(this.score, languageManager.currentLanguage);
        this.warnings = EDSSCalculator.validateFSCombination(fsGrades);
        this.calculationBasis = EDSSCalculator.getCalculationBasis(fsGrades, walkingAbility);
    }
} 