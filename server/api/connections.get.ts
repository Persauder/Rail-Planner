import {
    createError,
    defineEventHandler,
    getQuery,
} from "h3"
import {
    fetchDirectConnections,
    resolvePkpStation,
} from "#server/utils/pkp"

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/
const maximumStationNameLength = 100

const getSingleQueryValue = (value: unknown) => {
    if (Array.isArray(value)) {
        return String(value[0] ?? "").trim()
    }

    return String(value ?? "").trim()
}

const todayInPoland = () => {
    const parts = new Intl.DateTimeFormat("en", {
        timeZone: "Europe/Warsaw",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date())
    const valueByType = Object.fromEntries(
        parts.map((part) => [part.type, part.value]),
    )

    return `${valueByType.year}-${valueByType.month}-${valueByType.day}`
}

const isValidDate = (date: string) => {
    if (!datePattern.test(date)) {
        return false
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`)
    return !Number.isNaN(parsedDate.getTime())
        && parsedDate.toISOString().slice(0, 10) === date
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const from = getSingleQueryValue(query.from)
    const to = getSingleQueryValue(query.to)
    const date = getSingleQueryValue(query.date) || todayInPoland()
    const departureAfter = getSingleQueryValue(
        query.departureAfter || query.time,
    )
    const arriveBefore = getSingleQueryValue(query.arriveBefore)

    if (!from || !to) {
        throw createError({
            statusCode: 400,
            statusMessage: "Both departure and destination stations are required",
        })
    }

    if (
        from.length > maximumStationNameLength
        || to.length > maximumStationNameLength
    ) {
        throw createError({
            statusCode: 400,
            statusMessage: "Station names must not exceed 100 characters",
        })
    }

    if (!isValidDate(date)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Date must be valid and use the YYYY-MM-DD format",
        })
    }

    if (departureAfter && !timePattern.test(departureAfter)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Departure time must be valid and use the HH:mm format",
        })
    }

    if (arriveBefore && !timePattern.test(arriveBefore)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Arrival time must be valid and use the HH:mm format",
        })
    }

    const [fromStation, toStation] = await Promise.all([
        resolvePkpStation(from),
        resolvePkpStation(to),
    ])

    if (fromStation.id === toStation.id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Departure and destination stations must be different",
        })
    }

    return fetchDirectConnections(
        fromStation.id,
        toStation.id,
        date,
        departureAfter || "00:00",
        arriveBefore || "23:59",
    )
})
