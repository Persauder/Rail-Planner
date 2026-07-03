import type {Connection} from "~/types/connection";

export const connections: Connection[] = [
    {
        id: "krk-waw-1",
        from: { id: "krakow-glowny",
            name: "Kraków Główny",
            city: "Kraków" },
        to: { id: "warszawa-centralna",
            name: "Warszawa Centralna",
            city: "Warszawa" },
        departureTime: "08:12",
        arrivalTime: "10:45",
        durationMinutes: 153,
        price: 79.99,
        currency: "PLN",
        carrier: {
            id: "pkp-intercity",
            name: "PKP Intercity",
        },
        changes: 0,
    },
    {
        id: "krk-waw-2",
        from: {
            id: "krakow-glowny",
            name: "Kraków Główny",
            city: "Kraków",
        },
        to: {
            id: "warszawa-centralna",
            name: "Warszawa Centralna",
            city: "Warszawa",
        },
        departureTime: "11:05",
        arrivalTime: "13:58",
        durationMinutes: 173,
        price: 59.99,
        currency: "PLN",
        carrier: {
            id: "polregio",
            name: "POLREGIO",
        },
        changes: 1,
    },
    {
        id: "krk-gdn-1",
        from: {
            id: "krakow-glowny",
            name: "Kraków Główny",
            city: "Kraków",
        },
        to: {
            id: "gdansk-glowny",
            name: "Gdańsk Główny",
            city: "Gdańsk",
        },
        departureTime: "09:30",
        arrivalTime: "15:20",
        durationMinutes: 350,
        price: 119.99,
        currency: "PLN",
        carrier: {
            id: "pkp-intercity",
            name: "PKP Intercity",
        },
        changes: 0,
    },
]