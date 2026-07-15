export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/scss/main.scss"],
    runtimeConfig: {
        pkpApiKey: "",
        pkpApiKeyFile: "",
        pkpApiBaseUrl: "https://pdp-api.plk-sa.pl/api/v1",
    },
})
