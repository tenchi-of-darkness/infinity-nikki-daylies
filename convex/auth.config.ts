import { AuthConfig } from "convex/server";

export default {
    providers: [
        {
            domain: "http://192.168.178.12:5556/dex",
            applicationID: "daylies",
        },
    ],
} satisfies AuthConfig;
