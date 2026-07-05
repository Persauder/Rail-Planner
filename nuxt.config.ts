export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/scss/main.scss"],
    runtimeConfig: {
        pkpApiKey: process.env.PKP_API_KEY || "",
        pkpApiKeyFile: process.env.PKP_API_KEY_FILE || "",
        pkpApiBaseUrl: "https://pdp-api.plk-sa.pl/api/v1",
    },
})
