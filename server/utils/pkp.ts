import { readFile, readdir } from "node:fs/promises"
import { resolve } from "node:path"
import type { Connection } from "~/types/connection"

type PkpStation = {
    id: number
    name: string
}

type PkpScheduleStop = {
    stationId: number
    orderNumber: number
    arrivalTime?: string
    departureTime?: string
}

type PkpScheduleRoute = {
    scheduleId: number
    orderId: number
    carrierCode: string
    nationalNumber?: string
    operatingDates: string[]
    stations: PkpScheduleStop[]
}

type StationDictionaryResponse = {
    stations: PkpStation[]
}

type ScheduleResponse = {
    routes: PkpScheduleRoute[]
    dictionaries: {
        stations: Record<string, PkpStation>
        carriers: Record<string, string>
    }
}

type ConnectionIdentity = {
    scheduleId: number
    orderId: number
    date: string
    fromId: number
    toId: number
}

const stationCache = new Map<string, PkpStation>()
let apiKeyPromise: Promise<string> | undefined

const normalizeStationName = (name: string) =>
    name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/ł/gi, "l")
        .trim()
        .toLocaleLowerCase("pl")

const extractKey = (contents: string) => {
    const labelledKey = contents.match(/^API Key:\s*(.+)$/im)?.[1]
    return (labelledKey || contents).trim()
}

const readApiKey = async () => {
    const config = useRuntimeConfig()

    if (config.pkpApiKey) {
        return String(config.pkpApiKey).trim()
    }

    const configuredFile = String(config.pkpApiKeyFile || "").trim()
    let keyFile = configuredFile ? resolve(configuredFile) : ""

    if (!keyFile) {
        const localKeyFile = (await readdir(process.cwd()))
            .find((file) => /^api-key-.*\.txt$/i.test(file))

        if (localKeyFile) {
            keyFile = resolve(process.cwd(), localKeyFile)
        }
    }

    if (!keyFile) {
        throw createError({
            statusCode: 503,
            statusMessage: "PKP API key is not configured",
        })
    }

    return extractKey(await readFile(keyFile, "utf8"))
}

const getApiKey = () => {
    apiKeyPromise ||= readApiKey()
    return apiKeyPromise
}

const pkpFetch = async <T>(path: string, query?: Record<string, string | number>) => {
    const config = useRuntimeConfig()
    const apiKey = await getApiKey()

    try {
        return await $fetch<T>(`${config.pkpApiBaseUrl}${path}`, {
            query,
            headers: {
                "X-API-Key": apiKey,
            },
            timeout: 15_000,
        })
    } catch (error: any) {
        const upstreamStatus = Number(error?.response?.status || error?.statusCode)

        throw createError({
            statusCode: upstreamStatus === 429 ? 429 : 502,
            statusMessage: upstreamStatus === 429
                ? "PKP API request limit exceeded"
                : "PKP API request failed",
        })
    }
}

export const resolvePkpStation = async (name: string) => {
    const normalizedName = normalizeStationName(name)
    const cached = stationCache.get(normalizedName)

    if (cached) {
        return cached
    }

    const response = await pkpFetch<StationDictionaryResponse>(
        "/dictionaries/stations",
        { search: name, pageSize: 50 },
    )

    const exactStation = response.stations.find(
        (candidate) => normalizeStationName(candidate.name) === normalizedName,
    )
    const mainStation = response.stations.find((candidate) => {
        const candidateName = normalizeStationName(candidate.name)
        return candidateName.startsWith(`${normalizedName} `)
            && (candidateName.endsWith(" glowny")
                || candidateName.endsWith(" centralna"))
    })
    const firstRealStation = response.stations.find(
        (candidate) => !candidate.name.trim().endsWith("-"),
    )
    const station = exactStation || mainStation || firstRealStation

    if (!station) {
        throw createError({
            statusCode: 404,
            statusMessage: `Station "${name}" was not found`,
        })
    }

    stationCache.set(normalizedName, station)
    return station
}

const minutesSinceMidnight = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
}

const durationBetween = (departure: string, arrival: string) => {
    const departureMinutes = minutesSinceMidnight(departure)
    let arrivalMinutes = minutesSinceMidnight(arrival)

    if (arrivalMinutes < departureMinutes) {
        arrivalMinutes += 24 * 60
    }

    return arrivalMinutes - departureMinutes
}

const shortTime = (time: string) => time.slice(0, 5)

export const encodeConnectionId = (identity: ConnectionIdentity) =>
    [
        identity.scheduleId,
        identity.orderId,
        identity.date,
        identity.fromId,
        identity.toId,
    ].join("~")

export const decodeConnectionId = (id: string): ConnectionIdentity | null => {
    const match = id.match(/^(\d+)~(\d+)~(\d{4}-\d{2}-\d{2})~(\d+)~(\d+)$/)

    if (!match) {
        return null
    }

    return {
        scheduleId: Number(match[1]),
        orderId: Number(match[2]),
        date: match[3],
        fromId: Number(match[4]),
        toId: Number(match[5]),
    }
}

export const fetchDirectConnections = async (
    fromId: number,
    toId: number,
    date: string,
) => {
    const response = await pkpFetch<ScheduleResponse>("/schedules", {
        dateFrom: date,
        dateTo: date,
        stations: `${fromId},${toId}`,
    })

    return (response.routes || []).flatMap<Connection>((route) => {
        const departure = route.stations.find((stop) => stop.stationId === fromId)
        const arrival = route.stations.find((stop) => stop.stationId === toId)

        if (
            !departure?.departureTime
            || !arrival?.arrivalTime
            || departure.orderNumber >= arrival.orderNumber
        ) {
            return []
        }

        const from = response.dictionaries.stations[String(fromId)]
        const to = response.dictionaries.stations[String(toId)]

        if (!from || !to) {
            return []
        }

        return [{
            id: encodeConnectionId({
                scheduleId: route.scheduleId,
                orderId: route.orderId,
                date,
                fromId,
                toId,
            }),
            from: {
                id: String(from.id),
                name: from.name,
                city: from.name,
            },
            to: {
                id: String(to.id),
                name: to.name,
                city: to.name,
            },
            departureTime: shortTime(departure.departureTime),
            arrivalTime: shortTime(arrival.arrivalTime),
            durationMinutes: durationBetween(
                departure.departureTime,
                arrival.arrivalTime,
            ),
            price: null,
            currency: null,
            carrier: {
                id: route.carrierCode,
                name: response.dictionaries.carriers[route.carrierCode]
                    || route.carrierCode,
            },
            changes: 0,
            trainNumber: route.nationalNumber,
        }]
    }).sort((a, b) => a.departureTime.localeCompare(b.departureTime))
}
