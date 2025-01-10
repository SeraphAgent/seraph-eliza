import {
    ActionExample,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    type Action,
} from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";

export const detectMatrix: Action = {
    name: "DETECT_MATRIX",
    similes: ["ANALYZE_URL", "CHECK_AI_SCORE", "MATRIX_SCAN", "TRINITY_CHECK"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("🔍 Trinity Matrix: Validating URL input...");

        const urlMatch = message?.content?.text?.match(/https?:\/\/[^\s]+/);
        if (!urlMatch) {
            elizaLogger.error("❌ Trinity Matrix: No URL found in message");
            return false;
        }

        if (!runtime?.character?.settings?.secrets?.bitmind) {
            elizaLogger.error("❌ Trinity Matrix: API token not configured");
            return false;
        }

        elizaLogger.log("✅ Trinity Matrix: URL and token found");
        return true;
    },
    description: "Analyze URL for AI influence using BitMind's Trinity Matrix",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ): Promise<void> => {
        if (state['isMatrixAnalyzing']) {
            return;
        }
        state['isMatrixAnalyzing'] = true;
        
        elizaLogger.log("🤖 Trinity Matrix: Starting analysis...");
        
        if (!runtime.character?.settings?.secrets?.bitmind) {
            throw new Error("BitMind API token not configured");
        }
        const matrix_token = runtime.character.settings.secrets.matrix;

        const urlMatch = message.content.text.match(/https?:\/\/[^\s]+/);
        if (!urlMatch) {
            throw new Error("No URL found in message");
        }
        const url = urlMatch[0];

        elizaLogger.log(`📊 Trinity Matrix: Analyzing URL: ${url}`);

        try {
            const response = await fetch("https://trinity-api.bitmindlabs.ai/ai-score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${matrix_token}`,
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                elizaLogger.error("❌ Trinity Matrix: API request failed:", response.statusText);
                throw new Error(`Trinity Matrix API request failed: ${response.statusText}`);
            }

            const result = await response.json();
            elizaLogger.log("✅ Trinity Matrix: Analysis complete", {
                score: result.score,
            });

            const percentage = Math.round(result.score * 100);
            const responseText = `🔍 Trinity Matrix Analysis
Powered by BitMind Trinity Matrix

${percentage}% AI Influence Rating
${percentage > 75 
    ? "⚠️ High synthetic probability detected. Approach with caution." 
    : percentage > 40 
        ? "⚡ Moderate AI patterns present. Verification recommended." 
        : "✅ Low synthetic markers. Likely authentic content."}

—————————————————`;

            callback({
                text: responseText,
                score: result.score
            });
        } catch (error) {
            elizaLogger.error("❌ Trinity Matrix: Analysis error:", error);
            throw new Error(`Failed to analyze URL: ${error.message}`);
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "check this site: https://example.com" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Calling BitMind's Trinity Matrix...",
                    action: "DETECT_MATRIX",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "what's the AI score for this URL? https://example.com" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Calling BitMind's Trinity Matrix...",
                    action: "DETECT_MATRIX",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;