// ========================================
// 內在小孩療癒系統配置檔（優化版）
// ========================================

const HealingConfig = {
    // === 療癒階段定義 ===
    phases: {
        initial: 'initial',      // 初始探索階段
        exploring: 'exploring',  // 深度感受探索
        childhood: 'childhood',  // 童年創傷探索
        healing: 'healing'       // 療癒整合階段
    },

    // === 關鍵字偵測系統 ===
    keywords: {
        // 情緒體驗關鍵字 - 觸發進入探索階段
        emotions: ['感覺', '體驗', '情緒', '害怕', '難過', '生氣', '孤單', '被忽略', '委屈', '失望', '焦慮', '壓力', '痛苦', '感受', '心情'],
        
        // 童年體驗關鍵字 - 觸發進入童年探索階段
        childhood: ['小時候', '童年', '小孩', '爸爸', '媽媽', '父母', '家人', '學校', '幼稚園', '國小', '小學', '以前', '過去', '記得', '想起'],
        
        // 療癒體驗關鍵字 - 觸發進入療癒階段
        healing: ['療癒', '原諒', '接納', '愛自己', '釋放', '放下', '和解', '理解', '成長', '改變', '感謝', '平靜'],

        // 過度細節關鍵字 - 需要轉向體驗探索
        details: ['然後', '接著', '後來', '結果', '因為', '所以', '具體', '詳細', '過程', '步驟'],
        
        // 迴避體驗關鍵字 - 用戶避免感受探索
        avoidance: ['不知道', '沒什麼', '還好', '普通', '沒感覺', '隨便', '都可以', '無所謂', '算了', '忘了', '沒有', '不記得'],

        // 缺乏自我覺察關鍵字 - 需要引導自我探索
        lackSelfAwareness: ['不懂自己', '不了解自己', '茫然', '迷惘', '不知道自己', '摸不著頭緒', '沒頭緒', '找不到方向', '很混亂', '不清楚', '說不出來', '不會表達', '沒感覺', '空白'],

        // 自動化反應循環關鍵字 - 偵測慣性反應模式
        automaticReactions: ['總是', '每次都', '習慣', '自然反應', '不由自主', '下意識', '反射性', '條件反射', '慣性', '本能', '直覺反應', '想都不想', '脫口而出', '馬上就', '立刻', '一聽到就', '一看到就', '又來了', '老樣子', '一樣的模式'],

        // 情緒觸發循環關鍵字 - 偵測情緒反應模式  
        emotionalTriggers: ['一生氣就', '一難過就', '一害怕就', '一緊張就', '一焦慮就', '每當', '只要', '一旦', '觸動', '引爆', '按鈕被按到', '地雷', '痛點', '敏感', '受不了', '忍不住', '控制不住'],

        // 行為模式循環關鍵字 - 偵測重複行為
        behaviorPatterns: ['重複', '循環', '模式', '套路', '慣例', '固定', '例行', '照舊', '依照慣例', '按照以往', '老方法', '舊習慣', '既定模式', '制式反應', '標準程序']
    },

    // === 專業療癒原則 ===
    principles: {
        // 體驗導向原則
        experienceFocused: {
            focusOnFeeling: true,        // 專注感受
            bodyAwareness: true,         // 身體覺察
            emotionalExploration: true   // 情緒探索
        },

        // 非指導性原則
        nonDirective: {
            noGuidance: true,           // 不引導方向
            noAnswers: true,            // 不給答案
            reflectOnly: true           // 僅反映
        },

        // 避免過度細節
        avoidDetails: {
            skipEventDetails: true,      // 跳過事件細節
            focusOnExperience: true,     // 專注體驗
            redirectToFeeling: true      // 重導至感受
        }
    },

    // === AI 提示詞模板系統 ===
    prompts: {
        // 基礎療癒師角色設定
        baseContext: `你是一位專業的心理療癒師，專精於薩提爾冰山理論和非指導性療法。

🎯 核心原則：
1. 【關注體驗】重點在用戶的內在體驗，而非事件細節
2. 【鏡像反映】像一面鏡子，讓用戶看見自己的感受
3. 【溫和探索】專注當下的身心體驗和感受

🚫 絕對禁止：
- 過度追問事件細節
- 給予建議或答案
- 引導探索方向
- 忽略用戶的感受體驗

✅ 專業技巧：
- 重複用戶的感受用詞
- 詢問身體和情緒的體驗
- 關注「體驗」而非「細節」`,

        // 初始階段提示詞（表層行為→感受體驗）
        initial: function(userInput) {
            return `${this.baseContext}

目前階段：初始探索（表層→感受）
使用者剛剛分享："${userInput}"

薩提爾冰山引導方向：
□ 從外在事件深入到內在感受
□ 從"發生什麼"轉向"感受什麼"
□ 引導注意身體和情緒的體驗

請你：
1. 重複用戶表達的感受（不是事件）
2. 詢問當下的身體或情緒體驗
3. 為進入感受探索階段做準備

回應要求：簡潔（不超過50字），專注體驗層面`;
        },

        // 探索階段提示詞（感受體驗→觀點想法）
        exploring: function(userInput, history) {
            return `${this.baseContext}

目前階段：感受探索（感受→觀點）
最新分享："${userInput}"

薩提爾冰山引導方向：
□ 從當下感受深入到內在觀點
□ 從"現在感覺"探索"過去經驗"
□ 準備連結童年相似體驗

請你：
1. 反映用戶的感受體驗
2. 溫和詢問是否想起過去類似感受
3. 為進入童年探索做鋪陳

回應要求：簡潔（不超過45字），往深層引導`;
        },

        // 童年探索階段提示詞（觀點想法→期待渴望）
        childhood: function(userInput, history) {
            return `${this.baseContext}

目前階段：童年探索（觀點→期待）
最新分享："${userInput}"

薩提爾冰山引導方向：
□ 從過去觀點深入到內在渴望
□ 從"童年經驗"探索"深層需求"
□ 準備進入療癒整合階段

請你：
1. 溫和地探索童年的感受體驗
2. 關注內在小孩的深層渴望
3. 為療癒階段做準備

回應要求：簡潔（不超過40字），溫柔深入`;
        },

        // 療癒階段提示詞（期待渴望→自我價值）
        healing: function(userInput, history) {
            return `${this.baseContext}

目前階段：療癒整合（渴望→自我）
最新分享："${userInput}"

薩提爾冰山引導方向：
□ 從深層渴望觸及核心自我
□ 從"內在需求"轉向"自我價值"
□ 整合所有層面的體驗

請你：
1. 反映用戶的自我覺察體驗
2. 支持內在力量的顯現
3. 深化自我價值的體驗

回應要求：簡潔（不超過45字），深度整合`;
        }
    },

    // === 療癒功能核心邏輯 ===
    functions: {
        // 功能：檢測回應迴圈（使用 Google Gemini API）
        detectResponseLoop: async function(conversationHistory, aiResponse, apiKey) {
            if (conversationHistory.length < 4) return { isLoop: false };
            
            // 取得最近的AI回應
            const recentAiResponses = conversationHistory
                .filter(msg => msg.sender === 'ai')
                .slice(-3)
                .map(msg => msg.message);
            
            if (recentAiResponses.length === 0) return { isLoop: false };
            
            // 首先使用本地相似度檢測作為快速篩選
            const localCheck = this.detectResponseLoopLocal(conversationHistory, aiResponse);
            if (!localCheck.isLoop) return { isLoop: false };
            
            // 如果本地檢測發現可能的迴圈，使用 Google Gemini API 進行語義分析
            try {
                if (!apiKey) {
                    console.warn('⚠️ 無 API Key，使用本地迴圈檢測');
                    return localCheck;
                }
                
                const loopDetectionPrompt = `你是一個專業的對話品質分析師。請分析以下對話是否出現了回應迴圈。

最近的 AI 回應：
${recentAiResponses.map((resp, i) => `${i + 1}. ${resp}`).join('\n')}

新的 AI 回應：
${aiResponse}

請分析：
1. 新回應與最近回應在語義上是否重複？
2. 是否出現了相同的問題模式？
3. 療癒師是否陷入重複的引導方式？

請只回答 "是" 或 "否"，並簡短說明原因（不超過20字）。
格式：是/否 - 原因`;

                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: loopDetectionPrompt }] }]
                    })
                });
                
                if (!response.ok) {
                    throw new Error('API 檢測失敗');
                }
                
                const data = await response.json();
                const analysisResult = data.candidates[0].content.parts[0].text;
                
                const isLoop = analysisResult.includes('是');
                
                console.log('🤖 AI 迴圈檢測結果:', analysisResult);
                
                return {
                    isLoop: isLoop,
                    analysisResult: analysisResult,
                    loopType: 'semantic_analysis',
                    fallbackUsed: false
                };
                
            } catch (error) {
                console.warn('⚠️ API 迴圈檢測失敗，使用本地檢測:', error.message);
                return { ...localCheck, fallbackUsed: true };
            }
        },

        // 功能：本地迴圈檢測（作為 API 檢測的後備方案）
        detectResponseLoopLocal: function(conversationHistory, aiResponse) {
            if (conversationHistory.length < 4) return { isLoop: false };
            
            // 取得最近的AI回應
            const recentAiResponses = conversationHistory
                .filter(msg => msg.sender === 'ai')
                .slice(-3)
                .map(msg => msg.message.toLowerCase().replace(/[。，！？\s]/g, ''));
            
            // 檢查新回應是否與最近回應相似
            const currentResponse = aiResponse.toLowerCase().replace(/[。，！？\s]/g, '');
            
            const similarityThreshold = 0.7; // 70%相似度閾值
            
            for (const prevResponse of recentAiResponses) {
                const similarity = this.calculateSimilarity(currentResponse, prevResponse);
                if (similarity > similarityThreshold) {
                    return {
                        isLoop: true,
                        similarity: similarity,
                        loopType: 'local_similarity'
                    };
                }
            }
            
            return { isLoop: false };
        },

        // 功能：計算文字相似度
        calculateSimilarity: function(str1, str2) {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            
            if (longer.length === 0) return 1.0;
            
            const distance = this.levenshteinDistance(longer, shorter);
            return (longer.length - distance) / longer.length;
        },

        // 功能：計算編輯距離
        levenshteinDistance: function(str1, str2) {
            const matrix = [];
            
            for (let i = 0; i <= str2.length; i++) {
                matrix[i] = [i];
            }
            
            for (let j = 0; j <= str1.length; j++) {
                matrix[0][j] = j;
            }
            
            for (let i = 1; i <= str2.length; i++) {
                for (let j = 1; j <= str1.length; j++) {
                    if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            
            return matrix[str2.length][str1.length];
        },

        // 功能：生成防迴圈的變化回應（引導至下個階段）
        generateAntiLoopResponse: function(originalResponse, phase, userInput) {
            // 首先檢查是否需要自我覺察引導（包含自動化反應檢測）
            const qualityCheck = this.checkResponseQuality(userInput, phase);
            
            if (qualityCheck.needsSelfAwarenessGuidance) {
                // 如果檢測到自動化反應循環，傳遞相關數據
                return this.generateSelfAwarenessResponse(
                    phase, 
                    null, 
                    qualityCheck.automaticReactionDetection
                );
            }
            
            // 根據薩提爾冰山理論，引導用戶深入下一層體驗
            const antiLoopPrompts = {
                initial: [
                    "我感受到您提到的這些，讓我們深入一點...這種感覺在您身體的哪個部位？",
                    "您剛才分享的體驗很重要。現在閉上眼睛，這個感受是什麼樣的？",
                    "讓我們暫停一下，深呼吸...現在注意您內在真正的感受是什麼？"
                ],
                exploring: [
                    "這種身體的感覺...讓您想起什麼時候曾經有過類似的體驗？",
                    "當您感受到這些的時候，有沒有想起過去某個時刻？",
                    "這個感受...彷彿帶您回到了什麼時候？"
                ],
                childhood: [
                    "現在對那個小小孩，您想要給他/她什麼？",
                    "如果您可以擁抱那個小時候的自己，會是什麼感覺？",
                    "您想對那個受傷的小孩說些什麼溫暖的話？"
                ],
                healing: [
                    "感受一下您內在的力量，現在有什麼新的體驗？",
                    "經過這個過程，您對自己有什麼新的發現？",
                    "現在深呼吸，感受這個療癒帶給您的禮物是什麼？"
                ]
            };
            
            const prompts = antiLoopPrompts[phase] || antiLoopPrompts.initial;
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            
            return randomPrompt;
        },

        // 功能：使用 AI 生成更智能的防迴圈回應（引導至下個階段）
        generateAntiLoopResponseWithAI: async function(originalResponse, phase, userInput, apiKey) {
            try {
                // 根據當前階段決定下一個療癒方向
                const nextStageGuidance = this.getNextStageGuidance(phase);
                
                const antiLoopPrompt = `你是專業的心理療癒師，專精薩提爾冰山理論。剛才的回應可能過於重複，請生成一個引導用戶深入下一層體驗的回應。

原始回應：${originalResponse}
用戶輸入：${userInput}
當前階段：${this.getPhaseDisplayName(phase)}

根據薩提爾冰山理論，請：
${nextStageGuidance}

要求：
1. 完全不同於原始回應的措辭
2. 引導用戶進入更深層的體驗
3. 使用溫暖、邀請性的語調
4. 簡潔有力（不超過35字）

請生成一個能引導用戶深入內在探索的回應：`;

                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: antiLoopPrompt }] }]
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const aiAntiLoopResponse = data.candidates[0].content.parts[0].text;
                    console.log('🤖 AI 生成階段深化回應');
                    return aiAntiLoopResponse;
                }
            } catch (error) {
                console.warn('⚠️ AI 階段深化回應生成失敗，使用預設回應');
            }
            
            // 如果 AI 生成失敗，使用預設的階段引導回應
            return this.generateAntiLoopResponse(originalResponse, phase, userInput);
        },

        // 功能：根據當前階段取得下一階段的引導方向
        getNextStageGuidance: function(currentPhase) {
            const stageGuidance = {
                initial: `引導用戶從表面事件深入到身體感受和情緒體驗：
- 詢問身體哪個部位有感覺
- 邀請關注內在的情緒狀態
- 從"發生什麼"轉向"感受什麼"`,

                exploring: `引導用戶從當下感受連結到過去經驗：
- 溫和詢問是否想起過去類似感受
- 邀請探索童年是否有相似體驗
- 從"現在感受"轉向"過去記憶"`,

                childhood: `引導用戶從童年創傷走向療癒整合：
- 邀請給內在小孩愛與關懷
- 詢問想對小時候的自己說什麼
- 從"過去傷痛"轉向"療癒行動"`,

                healing: `深化療癒體驗和自我整合：
- 邀請感受內在力量的成長
- 詢問這個過程帶來的禮物
- 從"個別療癒"轉向"整體覺察"`
            };
            
            return stageGuidance[currentPhase] || stageGuidance.initial;
        },

        // 功能：自我覺察引導技巧庫
        getSelfAwarenessGuidance: function(currentPhase) {
            const awarenessGuidance = {
                initial: {
                    bodyFocus: [
                        "現在讓我們先從身體開始...閉上眼睛，感受一下您的呼吸。",
                        "我們從最簡單的開始...現在您的肩膀是緊繃的還是放鬆的？",
                        "讓我們把注意力放在身體上...哪個部位現在感覺最明顯？"
                    ],
                    emotionBasic: [
                        "沒關係，很多人都不太清楚自己的感受...現在如果用「開心」、「難過」、「生氣」來選，哪個比較接近？",
                        "我們可以從很簡單的開始...現在的心情是重重的還是輕輕的？",
                        "讓我們用顏色來形容...現在內心是什麼顏色的感覺？"
                    ],
                    breathing: [
                        "讓我們先深呼吸三次...注意氣息進出的感覺。",
                        "當您吸氣的時候，有什麼感覺浮現嗎？",
                        "呼吸時，注意胸口或肚子的感覺...有什麼不一樣嗎？"
                    ],
                    // *** 新增：自動化反應循環中斷技巧 ***
                    patternInterruption: [
                        "我注意到您提到了「總是」或「每次都」...當時您有什麼體驗或情緒？",
                        "您說「習慣」這樣反應...能分享一下最近一次是什麼時候、在哪裡發生的嗎？",
                        "您提到「自然反應」...想想看上次發生時，當下您的身體有什麼感覺？"
                    ],
                    automaticAwareness: [
                        "您說「不由自主」...能說說最近一次這樣的情況是什麼時候嗎？當時您的感受是什麼？",
                        "您提到「下意識」的反應...上次發生時，您記得當下的情緒或身體感覺嗎？",
                        "當您說「想都不想」就反應...能分享一下具體是在什麼情況下發生的嗎？"
                    ]
                },
                exploring: {
                    sensation: [
                        "這個感覺如果有形狀，會是什麼樣子？",
                        "如果這個感受有重量，是輕的還是重的？",
                        "這種感覺讓您想到什麼東西？動物、植物或物品？"
                    ],
                    contrast: [
                        "和平常比起來，這種感覺有什麼不同？",
                        "您記得上次有類似感覺是什麼時候嗎？",
                        "如果沒有這個感覺的話，您覺得會是什麼樣子？"
                    ],
                    // *** 新增：自動化模式探索 ***
                    patternExploration: [
                        "這個「每次都」的反應...能說說最近一次發生的具體情況嗎？當時在哪裡、和誰在一起？",
                        "您提到「一...就...」的模式...想想看上次發生時，那個瞬間您的身體和情緒有什麼變化？",
                        "這個習慣性的反應...能分享一下最印象深刻的一次是什麼時候發生的嗎？"
                    ],
                    triggerAwareness: [
                        "您說「一生氣就」...能說說最近一次生氣的情況嗎？當時發生了什麼事？",
                        "「一聽到就」這樣反應...想想看上次是聽到什麼、在什麼情況下？當時您的感受如何？",
                        "這個「觸發」的情況...能分享一下具體的時間、地點和發生的事情嗎？"
                    ]
                },
                childhood: {
                    gentle: [
                        "想像小時候的您...那個小孩現在需要什麼？",
                        "如果您可以抱抱小時候的自己，會想說什麼？",
                        "那個小小孩最害怕什麼？最希望什麼？"
                    ],
                    safe: [
                        "在一個完全安全的地方...小時候的您最想做什麼？",
                        "如果有一個魔法可以保護小時候的您...會是什麼樣的魔法？"
                    ],
                    // *** 新增：童年自動化模式探索 ***
                    earlyPatterns: [
                        "這個「總是」的反應模式...想想看您小時候，在什麼情況下也會有類似的反應？",
                        "您提到的這個習慣...回想一下，小時候您是在什麼樣的環境中學會這樣反應的？",
                        "這個「自動」的模式...想想看小時候，當時這樣反應是為了保護什麼或得到什麼？"
                    ],
                    protectivePatterns: [
                        "想起小時候「馬上就」這樣反應的情況...能說說當時發生了什麼事嗎？那時您多大？",
                        "這個「每次都」的模式...回到童年，您記得第一次這樣反應是在什麼情況下嗎？"
                    ]
                },
                healing: {
                    strength: [
                        "現在感受一下...您內在有什麼力量？",
                        "這個過程中，您發現自己有什麼珍貴的品質？",
                        "如果要給現在的自己一句話...會是什麼？"
                    ],
                    integration: [
                        "現在的您和剛開始有什麼不同？",
                        "這個體驗帶給您什麼禮物？",
                        "您想對一路陪伴的自己說什麼？"
                    ],
                    // *** 新增：自動化模式轉化 ***
                    patternTransformation: [
                        "現在您覺察到這個「總是」的模式...您想給它什麼新的選擇？",
                        "這個曾經保護您的習慣...現在您想對它說什麼感謝的話？",
                        "感受一下...如果這個自動反應可以變得更溫柔，會是什麼樣子？"
                    ],
                    consciousChoice: [
                        "現在您有了覺察...下次遇到類似情況，您想要怎麼呼吸？",
                        "這個新的覺察...讓您對自己有什麼不同的感受？",
                        "如果可以給這個舊模式一個新的、更慈愛的版本...會是什麼？"
                    ]
                }
            };
            
            return awarenessGuidance[currentPhase] || awarenessGuidance.initial;
        },

        // 功能：生成自我覺察引導回應
        generateSelfAwarenessResponse: function(phase, category = null, automaticReactionData = null) {
            const guidance = this.getSelfAwarenessGuidance(phase);
            let selectedPrompts;
            
            // *** 優先處理自動化反應循環 ***
            if (automaticReactionData && automaticReactionData.stuckInLoop) {
                // 根據自動化反應的類型選擇特定引導
                if (automaticReactionData.hasAutomaticReactions) {
                    // 選擇中斷自動化模式的技巧
                    selectedPrompts = guidance.patternInterruption || guidance.automaticAwareness || guidance.bodyFocus;
                } else if (automaticReactionData.hasEmotionalTriggers) {
                    // 選擇情緒觸發覺察技巧
                    selectedPrompts = guidance.triggerAwareness || guidance.patternExploration || guidance.emotionBasic;
                } else if (automaticReactionData.hasBehaviorPatterns) {
                    // 選擇行為模式探索技巧
                    selectedPrompts = guidance.patternExploration || guidance.earlyPatterns || guidance.sensation;
                }
            } 
            // 如果指定了特定類別
            else if (category && guidance[category]) {
                selectedPrompts = guidance[category];
            } 
            // 預設隨機選擇
            else {
                const categories = Object.keys(guidance);
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                selectedPrompts = guidance[randomCategory];
            }
            
            // 確保有可用的提示詞
            if (!selectedPrompts || selectedPrompts.length === 0) {
                selectedPrompts = guidance.bodyFocus || guidance.emotionBasic || ["讓我們深呼吸，慢慢來..."];
            }
            
            return selectedPrompts[Math.floor(Math.random() * selectedPrompts.length)];
        },

        // 功能：檢查用戶回應的內容類型
        checkResponseQuality: function(userInput, currentPhase) {
            const input = userInput.toLowerCase();
            const issues = [];

            // 檢查是否過度陷入事件細節
            if (HealingConfig.keywords.details.some(word => input.includes(word))) {
                issues.push('too_detailed');
            }

            // 檢查迴避體驗探索
            if (HealingConfig.keywords.avoidance.some(word => input.includes(word))) {
                issues.push('avoiding_experience');
            }

            // 檢查回應長度（太短可能是迴避）
            if (userInput.trim().length < 8) {
                issues.push('too_short');
            }

            // 檢查是否缺乏自我覺察（基礎層次）
            const lacksAwareness = HealingConfig.keywords.lackSelfAwareness.some(word => input.includes(word));

            // *** 核心：檢查自動化反應循環 ***
            // 這是導致缺乏自我覺察的主要原因
            const hasAutomaticReactions = HealingConfig.keywords.automaticReactions.some(word => input.includes(word));
            const hasEmotionalTriggers = HealingConfig.keywords.emotionalTriggers.some(word => input.includes(word));
            const hasBehaviorPatterns = HealingConfig.keywords.behaviorPatterns.some(word => input.includes(word));
            
            // 自動化反應是缺乏覺察的核心指標
            const stuckInAutomaticLoop = hasAutomaticReactions || hasEmotionalTriggers || hasBehaviorPatterns;

            return {
                hasIssues: issues.length > 0,
                issues: issues,
                needsExperienceRedirect: issues.includes('too_detailed'),
                isAvoidingExperience: issues.includes('avoiding_experience'),
                needsSelfAwarenessGuidance: lacksAwareness || stuckInAutomaticLoop, // 包含自動化反應
                
                // 新增：自動化反應循環的詳細分析
                automaticReactionDetection: {
                    hasAutomaticReactions: hasAutomaticReactions,
                    hasEmotionalTriggers: hasEmotionalTriggers, 
                    hasBehaviorPatterns: hasBehaviorPatterns,
                    stuckInLoop: stuckInAutomaticLoop,
                    needsPatternInterruption: stuckInAutomaticLoop // 需要中斷自動化模式
                }
            };
        },

        // 功能：檢查回應相關性
        checkRelevance: function(userInput, lastQuestion, currentPhase) {
            // 簡化的相關性檢查
            const input = userInput.toLowerCase();
            
            // 完全無關的回應模式
            const irrelevantPatterns = [
                '今天天氣', '吃什麼', '工作', '明天', '購物', '電影', '新聞'
            ];

            const isIrrelevant = irrelevantPatterns.some(pattern => input.includes(pattern));
            
            return {
                isRelevant: !isIrrelevant,
                needsRedirection: isIrrelevant
            };
        },

        // 功能：根據關鍵字更新療癒階段
        updatePhase: function(currentPhase, userMessage) {
            const message = userMessage.toLowerCase();
            
            if (currentPhase === HealingConfig.phases.initial && 
                HealingConfig.keywords.emotions.some(keyword => message.includes(keyword))) {
                console.log('🔄 階段更新：進入探索階段');
                return HealingConfig.phases.exploring;
            }
            
            if (currentPhase === HealingConfig.phases.exploring && 
                HealingConfig.keywords.childhood.some(keyword => message.includes(keyword))) {
                console.log('🔄 階段更新：進入童年探索階段');
                return HealingConfig.phases.childhood;
            }
            
            if (currentPhase === HealingConfig.phases.childhood && 
                HealingConfig.keywords.healing.some(keyword => message.includes(keyword))) {
                console.log('🔄 階段更新：進入療癒階段');
                return HealingConfig.phases.healing;
            }
            
            return currentPhase; // 沒有變化就回傳原階段
        },

        // 功能：生成適合當前階段的 AI 提示詞
        generatePrompt: function(phase, userInput, conversationHistory = []) {
            // 首先檢查回應品質
            const qualityCheck = this.checkResponseQuality(userInput, phase);
            
            // 檢查相關性（如果有對話歷史）
            let relevanceCheck = { isRelevant: true, needsRedirection: false };
            if (conversationHistory.length > 0) {
                const lastAiMessage = conversationHistory
                    .slice()
                    .reverse()
                    .find(msg => msg.sender === 'ai');
                if (lastAiMessage) {
                    relevanceCheck = this.checkRelevance(userInput, lastAiMessage.message, phase);
                }
            }

            // 檢查是否可能產生迴圈回應
            const shouldAvoidLoop = conversationHistory.length >= 4;
            
            // 如果有問題，修改提示詞
            let modifiedPrompt = '';
            
            if (!relevanceCheck.isRelevant) {
                modifiedPrompt += `\n⚠️ 注意：用戶似乎偏離感受探索，溫和地帶回體驗焦點。`;
            }
            
            if (qualityCheck.needsExperienceRedirect) {
                modifiedPrompt += `\n⚠️ 注意：用戶陷入事件細節，需要重導至感受體驗。`;
            }
            
            if (qualityCheck.isAvoidingExperience) {
                modifiedPrompt += `\n⚠️ 注意：用戶可能迴避感受，溫和地邀請體驗探索。`;
            }

            if (qualityCheck.needsSelfAwarenessGuidance) {
                const awarenessGuidance = this.getSelfAwarenessGuidance(phase);
                modifiedPrompt += `\n🧭 自我覺察引導：用戶缺乏自我覺察，使用以下技巧：
                
可選引導方式：
- 身體覺察：從身體感受開始（呼吸、肌肉緊張、溫度）
- 情緒基礎：用簡單詞彙或顏色、形狀來描述感受
- 對比引導：與平常狀態比較，或想像沒有這感覺的樣子
- 具象化：讓抽象感受變成具體的形狀、重量、顏色

*** 特別注意自動化反應循環 ***`;

                // 如果檢測到自動化反應循環，加入專門的引導
                if (qualityCheck.automaticReactionDetection && qualityCheck.automaticReactionDetection.stuckInLoop) {
                    modifiedPrompt += `
🔄 檢測到自動化反應循環！用戶陷入慣性模式，需要立即中斷：

⚠️ 自動化反應類型：`;
                    
                    if (qualityCheck.automaticReactionDetection.hasAutomaticReactions) {
                        modifiedPrompt += `
- 慣性反應模式：用戶說了「總是」、「每次都」、「習慣」等
- 引導策略：詢問具體的時間、地點、情況，然後探索當時的體驗和情緒
- 技巧：「能分享一下最近一次是什麼時候發生的嗎？當時您有什麼感受？」`;
                    }
                    
                    if (qualityCheck.automaticReactionDetection.hasEmotionalTriggers) {
                        modifiedPrompt += `
- 情緒觸發循環：用戶說了「一...就...」、「每當」、「只要」等
- 引導策略：詢問具體的觸發情況（時間、地點、事件、人物），然後探索當時的體驗
- 技巧：「能說說最近一次這樣的情況嗎？當時發生了什麼事？」`;
                    }
                    
                    if (qualityCheck.automaticReactionDetection.hasBehaviorPatterns) {
                        modifiedPrompt += `
- 行為模式循環：用戶說了「重複」、「循環」、「老方法」等
- 引導策略：詢問具體的情況和背景，探索模式背後的體驗和感受
- 技巧：「能分享一下具體是在什麼情況下發生的嗎？」`;
                    }
                    
                    modifiedPrompt += `

🎯 核心原則：
1. 先了解具體情況：詢問時間、地點、事件、人物等背景資訊
2. 再探索當時體驗：了解情況後，探索當時的感受、情緒、身體感覺
3. 不要假設是「現在」：用戶說的可能是過去發生的事情
4. 避免跳躍式提問：從具體情況開始，逐步深入到內在體驗`;
                } else {
                    modifiedPrompt += `

請選擇一種最適合的方式，溫和地引導用戶開始覺察。`;
                }
            }

            // 防迴圈機制（薩提爾冰山理論階段推進）
            if (shouldAvoidLoop) {
                const nextStageHint = this.getNextStageGuidance(phase);
                modifiedPrompt += `\n⚠️ 防迴圈指引：避免重複，引導用戶深入下一層體驗：
${nextStageHint}

請使用完全不同的措辭，引導對話向更深層的內在探索。`;
            }

            // 取得最近的對話歷史
            const recentHistory = conversationHistory.slice(-4)
                .map(msg => `${msg.sender}: ${msg.message.substring(0, 80)}`)
                .join('\n');

            // 根據階段選擇對應的提示詞模板
            let basePrompt = '';
            switch (phase) {
                case HealingConfig.phases.initial:
                    basePrompt = HealingConfig.prompts.initial(userInput);
                    break;
                    
                case HealingConfig.phases.exploring:
                    basePrompt = HealingConfig.prompts.exploring(userInput, recentHistory);
                    break;
                    
                case HealingConfig.phases.childhood:
                    basePrompt = HealingConfig.prompts.childhood(userInput, recentHistory);
                    break;
                    
                case HealingConfig.phases.healing:
                    basePrompt = HealingConfig.prompts.healing(userInput, recentHistory);
                    break;
                    
                default:
                    basePrompt = HealingConfig.prompts.initial(userInput);
            }

            return basePrompt + modifiedPrompt;
        },

        // 功能：後處理AI回應，檢查並防止迴圈（異步版本）
        postProcessResponse: async function(aiResponse, phase, userInput, conversationHistory = [], apiKey = null) {
            // 使用 Google Gemini API 檢測迴圈
            const loopCheck = await this.detectResponseLoop(conversationHistory, aiResponse, apiKey);
            
            if (loopCheck.isLoop) {
                console.warn('🔄 檢測到迴圈回應');
                if (loopCheck.analysisResult) {
                    console.log('🤖 AI 分析:', loopCheck.analysisResult);
                }
                if (loopCheck.similarity) {
                    console.log('📊 相似度:', loopCheck.similarity.toFixed(2));
                }
                
                // 生成防迴圈的替代回應
                let antiLoopResponse;
                
                // 如果有 API Key，嘗試使用 AI 生成更好的防迴圈回應
                if (apiKey && !loopCheck.fallbackUsed) {
                    antiLoopResponse = await this.generateAntiLoopResponseWithAI(aiResponse, phase, userInput, apiKey);
                } else {
                    antiLoopResponse = this.generateAntiLoopResponse(aiResponse, phase, userInput);
                }
                
                return {
                    response: antiLoopResponse,
                    wasLoop: true,
                    originalResponse: aiResponse,
                    loopType: loopCheck.loopType,
                    analysisResult: loopCheck.analysisResult || null
                };
            }
            
            return {
                response: aiResponse,
                wasLoop: false
            };
        },

        // 功能：取得階段的中文顯示名稱（薩提爾冰山層次）
        getPhaseDisplayName: function(phase) {
            const phaseNames = {
                'initial': '表層探索 (行為→感受)',
                'exploring': '感受深化 (感受→觀點)', 
                'childhood': '童年回溯 (觀點→渴望)',
                'healing': '療癒整合 (渴望→自我)'
            };
            return phaseNames[phase] || '未知階段';
        },

        // 功能：檢查是否啟用療癒模式
        isHealingEnabled: function() {
            // 可以從 localStorage 或其他地方讀取設定
            return localStorage.getItem('healing_mode_enabled') !== 'false';
        },

        // 功能：啟用/停用療癒模式
        toggleHealingMode: function(enabled) {
            localStorage.setItem('healing_mode_enabled', enabled.toString());
            console.log(`🧠 療癒模式：${enabled ? '已啟用' : '已停用'}`);
        }
    },

    // === 初始化設定 ===
    init: function() {
        console.log('🌟 內在小孩療癒系統已初始化');
        console.log('📚 已載入專業療癒原則：嚴謹聆聽、鏡像反映、維持焦點');
    }
};

// === 自動初始化 ===
if (typeof window !== 'undefined') {
    HealingConfig.init();
}

// 導出配置供其他檔案使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HealingConfig; // Node.js 環境
} else if (typeof window !== 'undefined') {
    window.HealingConfig = HealingConfig; // 瀏覽器環境
}
