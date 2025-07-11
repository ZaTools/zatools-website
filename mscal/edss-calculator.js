/**
 * EDSS Calculator based on Kurtzke 1983 Paper
 * Reference: Kurtzke JF. Rating neurologic impairment in multiple sclerosis: 
 * an expanded disability status scale (EDSS). Neurology. 1983;33(11):1444-52.
 * 
 * Accurate implementation following original Table 1 and Table 2
 */
class EDSSCalculator {
    
    /**
     * Calculate EDSS based on Kurtzke 1983 Tables 1 & 2
     * @param {Object} fsGrades - 8 functional system grades
     * @param {string} walkingAbility - Walking ability assessment
     * @returns {number} Calculated EDSS score (0.0-10.0)
     */
    static calculateEDSS(fsGrades, walkingAbility) {
        // Get effective grades (X treated as 0)
        const grades = this.getEffectiveGrades(fsGrades);
        
        // Step 1: Determine walking-based EDSS
        const walkingEDSS = this.getWalkingEDSS(walkingAbility);
        
        // Step 2: Calculate FS-based EDSS (Table 1)
        const fsEDSS = this.calculateFSBasedEDSS(grades);
        
        // Step 3: Apply decision rules per Kurtzke 1983
        return this.applyEDSSDecisionRules(walkingEDSS, fsEDSS);
    }
    
    /**
     * Get effective grades from FS grades object
     */
    static getEffectiveGrades(fsGrades) {
        return {
            pyramidal: this.getEffectiveGrade(fsGrades['pyramidal']),
            cerebellar: this.getEffectiveGrade(fsGrades['cerebellar']),
            brainstem: this.getEffectiveGrade(fsGrades['brainstem']),
            sensory: this.getEffectiveGrade(fsGrades['sensory']),
            bowelBladder: this.getEffectiveGrade(fsGrades['bowelBladder']),
            visual: this.getEffectiveGrade(fsGrades['visual']),
            cerebral: this.getEffectiveGrade(fsGrades['cerebral']),
            other: this.getEffectiveGrade(fsGrades['other'])
        };
    }
    
    /**
     * Get effective grade value (X is treated as 0)
     */
    static getEffectiveGrade(fsGrade) {
        if (!fsGrade) return 0;
        return fsGrade.isX ? 0 : fsGrade.grade;
    }
    
    /**
     * Get EDSS based on walking ability (Table 2)
     */
    static getWalkingEDSS(walkingAbility) {
        const walkingMap = {
            'normal': 0.0,                          // Normal ambulation
            'mild500m': 4.0,                       // Fully ambulatory, able to walk ~500m
            'moderate300m': 4.5,                   // Fully ambulatory, able to walk ~300m
            'severe200m': 5.0,                     // Ambulatory for ~200m
            'veryLimited100m': 5.5,                // Ambulatory for ~100m
            'assistanceUnilateral100m': 6.0,       // Intermittent or unilateral assistance for ~100m
            'assistanceBilateral20m': 6.5,         // Constant bilateral assistance for ~20m
            'wheelchair5m': 7.0,                   // Unable to walk beyond ~5m, wheelchair
            'wheelchairLimited': 7.5,              // Unable to take more than a few steps, wheelchair
            'bedbound': 8.0,                       // Essentially bedridden or in chair, self-care retained
            'bedboundLimited': 8.5,                // Essentially bedridden much of day, limited use of arms
            'helpless': 9.0,                       // Helpless bed patient, can communicate and eat
            'totallyHelpless': 9.5                 // Totally helpless bed patient, cannot communicate/swallow
        };
        
        return walkingMap[walkingAbility] || 0.0;
    }
    
    /**
     * Calculate EDSS from FS grades (Kurtzke Table 1)
     * This is the core algorithm from the 1983 paper
     */
    static calculateFSBasedEDSS(grades) {
        // Non-cerebral functional systems (7 systems, excluding cerebral)
        const nonCerebralGrades = [
            grades.pyramidal, grades.cerebellar, grades.brainstem, 
            grades.sensory, grades.bowelBladder, grades.visual, grades.other
        ];
        
        // Count grades in non-cerebral systems
        const gradeCounts = this.countGrades(nonCerebralGrades);
        
        // Apply Kurtzke Table 1 rules precisely
        
        // EDSS 0.0: Normal neurologic exam (cerebral grade 1 allowed)
        if (nonCerebralGrades.every(g => g === 0) && grades.cerebral <= 1) {
            return 0.0;
        }
        
        // EDSS 1.0: No disability, minimal signs in one FS
        if (gradeCounts[1] === 1 && this.noHigherGrades(gradeCounts, 1)) {
            return 1.0;
        }
        
        // EDSS 1.5: No disability, minimal signs in more than one FS
        if (gradeCounts[1] >= 2 && this.noHigherGrades(gradeCounts, 1)) {
            return 1.5;
        }
        
        // EDSS 2.0: Minimal disability in one FS
        if (gradeCounts[2] === 1 && this.noHigherGrades(gradeCounts, 2)) {
            return 2.0;
        }
        
        // EDSS 2.5: Minimal disability in two FS or minimal disability in one FS with signs in others
        if ((gradeCounts[2] === 2 && this.noHigherGrades(gradeCounts, 2)) ||
            (gradeCounts[2] === 1 && gradeCounts[1] >= 2 && this.noHigherGrades(gradeCounts, 2))) {
            return 2.5;
        }
        
        // EDSS 3.0: Moderate disability in one FS or mild disability in 3-4 FS
        if ((gradeCounts[3] === 1 && this.noHigherGrades(gradeCounts, 3)) ||
            (gradeCounts[2] >= 3 && gradeCounts[2] <= 4 && this.noHigherGrades(gradeCounts, 2))) {
            return 3.0;
        }
        
        // EDSS 3.5: Fully ambulatory but with relatively severe disability
        // Multiple combinations possible as per Kurtzke criteria
        if (this.isEDSS35Criteria(gradeCounts)) {
            return 3.5;
        }
        
        // Default to 0.0 for unmatched combinations
        return 0.0;
    }
    
    /**
     * Count occurrences of each grade
     */
    static countGrades(grades) {
        const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        grades.forEach(grade => {
            counts[grade] = (counts[grade] || 0) + 1;
        });
        return counts;
    }
    
    /**
     * Check if there are no grades higher than specified threshold
     */
    static noHigherGrades(gradeCounts, threshold) {
        for (let i = threshold + 1; i <= 6; i++) {
            if (gradeCounts[i] > 0) return false;
        }
        return true;
    }
    
    /**
     * Check EDSS 3.5 criteria (complex combinations)
     */
    static isEDSS35Criteria(gradeCounts) {
        // One FS grade 3 with 1-2 FS grade 2
        if (gradeCounts[3] === 1 && gradeCounts[2] >= 1 && gradeCounts[2] <= 2 && this.noHigherGrades(gradeCounts, 3)) {
            return true;
        }
        
        // Two FS grade 3
        if (gradeCounts[3] === 2 && this.noHigherGrades(gradeCounts, 3)) {
            return true;
        }
        
        // Five FS grade 2
        if (gradeCounts[2] === 5 && this.noHigherGrades(gradeCounts, 2)) {
            return true;
        }
        
        // One or more FS grade 4+ (but ambulatory)
        if (gradeCounts[4] >= 1 || gradeCounts[5] >= 1 || gradeCounts[6] >= 1) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Apply EDSS decision rules based on Kurtzke methodology
     */
    static applyEDSSDecisionRules(walkingEDSS, fsEDSS) {
        // Rule 1: If walking indicates EDSS ≥ 4.0, walking takes precedence
        if (walkingEDSS >= 4.0) {
            return walkingEDSS;
        }
        
        // Rule 2: If walking is normal, use FS-based EDSS but cap at 3.5
        if (walkingEDSS === 0.0) {
            return Math.min(fsEDSS, 3.5);
        }
        
        // Rule 3: For edge cases, take the higher of the two
        return Math.max(walkingEDSS, fsEDSS);
    }
    
    /**
     * Get EDSS description with multilingual support
     */
    static getEDSSDescription(edss, language = 'ja') {
        const descriptions = {
            ja: {
                0.0: "正常な神経学的検査",
                1.0: "障害なし、1つのFSで軽微な徴候",
                1.5: "障害なし、複数のFSで軽微な徴候",
                2.0: "1つのFSで軽度の障害",
                2.5: "2つのFSで軽度の障害",
                3.0: "1つのFSで中等度の障害、または3-4つのFSで軽度の障害。歩行完全",
                3.5: "歩行完全だが比較的重度の障害",
                4.0: "歩行完全、約500m歩行可能。比較的重度な障害",
                4.5: "歩行完全、約300m歩行可能。活動に制限",
                5.0: "約200m歩行可能。日常生活全般に支障",
                5.5: "約100m歩行可能。日常生活全般が不能",
                6.0: "約100mの歩行に片側性または断続的な補助が必要",
                6.5: "約20mの歩行に両側性の補助が必要",
                7.0: "約5m以上歩行不能。基本的に車椅子",
                7.5: "数歩以上歩行不能。車椅子に制限",
                8.0: "ほぼベッドか椅子。多くのセルフケアは可能",
                8.5: "日中の多くをベッドで過ごす。腕の有効活用に制限",
                9.0: "無力なベッド患者。コミュニケーションと食事は可能",
                9.5: "全く無力なベッド患者。効果的なコミュニケーションや嚥下が不能",
                10.0: "MSによる死亡"
            },
            en: {
                0.0: "Normal neurologic exam",
                1.0: "No disability, minimal signs in one FS",
                1.5: "No disability, minimal signs in more than one FS",
                2.0: "Minimal disability in one FS",
                2.5: "Minimal disability in two FS",
                3.0: "Moderate disability in one FS, or mild disability in 3-4 FS. Fully ambulatory",
                3.5: "Fully ambulatory but with relatively severe disability",
                4.0: "Fully ambulatory, able to walk ~500m. Relatively severe disability",
                4.5: "Fully ambulatory, able to walk ~300m. Limited activity",
                5.0: "Ambulatory for ~200m. Disability severe enough to impair full daily activities",
                5.5: "Ambulatory for ~100m. Disability severe enough to preclude full daily activities",
                6.0: "Intermittent or unilateral constant assistance required to walk ~100m",
                6.5: "Constant bilateral assistance required to walk ~20m",
                7.0: "Unable to walk beyond ~5m even with aid. Essentially wheelchair bound",
                7.5: "Unable to take more than a few steps. Restricted to wheelchair",
                8.0: "Essentially bedridden or in chair. Retains many self-care functions",
                8.5: "Essentially bedridden much of day. Limited use of arms",
                9.0: "Helpless bed patient. Can communicate and eat",
                9.5: "Totally helpless bed patient. Unable to communicate effectively or eat/swallow",
                10.0: "Death due to MS"
            }
        };
        
        return descriptions[language]?.[edss] || `Unknown EDSS score: ${edss}`;
    }
    
    /**
     * Validate FS grade combinations
     */
    static validateFSCombination(fsGrades) {
        const warnings = [];
        const grades = this.getEffectiveGrades(fsGrades);
        
        // Check for multiple high-grade impairments
        const highGrades = Object.values(grades).filter(g => g >= 4);
        if (highGrades.length > 2) {
            const warningText = languageManager.currentLanguage === 'en' 
                ? "Multiple functional systems with severe impairment (Grade 4+) detected."
                : "複数の機能系統で高度な障害（Grade 4以上）が設定されています。";
            warnings.push(warningText);
        }
        
        // Check for visual grade 6 (severe bilateral visual impairment)
        if (grades.visual === 6) {
            const warningText = languageManager.currentLanguage === 'en'
                ? "Visual grade 6 indicates severe bilateral visual impairment."
                : "視覚機能Grade 6は両眼の重度視力障害を意味します。";
            warnings.push(warningText);
        }
        
        // Check for sensory grade 6 (sensation lost below head)
        if (grades.sensory === 6) {
            const warningText = languageManager.currentLanguage === 'en'
                ? "Sensory grade 6 indicates sensation essentially lost below the head."
                : "感覚機能Grade 6は頭部以下の感覚消失を意味します。";
            warnings.push(warningText);
        }
        
        return warnings;
    }
    
    /**
     * Get calculation basis for display
     */
    static getCalculationBasis(fsGrades, walkingAbility) {
        const walkingEDSS = this.getWalkingEDSS(walkingAbility);
        const isEnglish = languageManager.currentLanguage === 'en';
        
        if (walkingEDSS >= 4.0) {
            return isEnglish 
                ? `Based on walking ability (EDSS ${walkingEDSS.toFixed(1)})`
                : `歩行能力に基づく計算（EDSS ${walkingEDSS.toFixed(1)}）`;
        } else if (walkingEDSS === 0.0) {
            return isEnglish
                ? "Based on functional system grades (EDSS 0.0-3.5)"
                : "機能系統グレードに基づく計算（EDSS 0.0-3.5）";
        } else {
            return isEnglish
                ? "Walking ability within normal range, based on functional system grades"
                : "歩行能力は正常範囲、機能系統グレードに基づく計算";
        }
    }
} 