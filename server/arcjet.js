import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";

const ARCJET_MODE = process.env.ARCJET_MODE === "DRY_RUN" ? "DRY_RUN" : "LIVE"
const ARCJET_KEY=process.env.ARCJET_KEY
if(!ARCJET_KEY) throw new Error("ARCJET_KEY environment variable is missing");

export const httpArcjet = arcjet({
    key: ARCJET_KEY,
    rules: [
        //protects against sql injection and XSS attacks
        shield({mode: ARCJET_MODE}),
        //protects from automated clients and such (scraping bots, curl)
        detectBot({
            mode: ARCJET_MODE,
            allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"]
        }),
        //rate limiting
        slidingWindow({
            mode: ARCJET_MODE,
            interval: "10s",
            max: 25
        })
    ]
});

export const wsArcjet = arcjet({
    key: ARCJET_KEY,
    rules: [
        //protects against sql injection and XSS attacks
        shield({mode: ARCJET_MODE}),
        //protects from automated clients and such (scraping bots, curl)
        detectBot({
            mode: ARCJET_MODE,
            allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"]
        }),
        //rate limiting
        slidingWindow({
            mode: ARCJET_MODE,
            interval: "5s",
            max: 5
        })
    ]
});

