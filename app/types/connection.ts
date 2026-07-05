export type Station = {
    id: string;
    name: string;
    city: string;
}

export type Carrier = {
    id: string;
    name: string;
}

export type Connection = {
    id: string;
    from: Station;
    to: Station;
    departureTime: string;
    arrivalTime: string;
    durationMinutes: number;
    price: number | null;
    currency: "PLN" | null;
    carrier: Carrier;
    changes: number;
    trainNumber?: string;
}
