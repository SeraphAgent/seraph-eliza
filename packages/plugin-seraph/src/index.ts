import { Plugin } from "@elizaos/core";
import { TwitterClientInterface } from "@elizaos/client-twitter";

import { detectMatrix } from "./actions/matrix.ts";
import { detectImage } from "./actions/bitmind.ts";
import { factEvaluator } from "./evaluators/fact.ts";
import { timeProvider } from "./providers/time.ts";

export * as actions from "./actions/index.ts";
export * as evaluators from "./evaluators/index.ts";
export * as providers from "./providers/index.ts";


export const seraphPlugin: Plugin = {
    name: "seraph",
    description: "Analyze the presence of AI in media using BitMind's Trinity Matrix API.",
    actions: [
        detectImage,
    ],
    evaluators: [factEvaluator],
    providers: [timeProvider],
    clients: [TwitterClientInterface]
};
