import {
    decodeConnectionId,
    fetchDirectConnections,
} from "#server/utils/pkp"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id")
    const identity = decodeConnectionId(String(id || ""))

    if (!identity) {
        throw createError({
            statusCode: 404,
            statusMessage: "Connection not found",
        })
    }

    const connections = await fetchDirectConnections(
        identity.fromId,
        identity.toId,
        identity.date,
    )
    const connection = connections.find((item) => item.id === id)

    if (!connection) {
        throw createError({
            statusCode: 404,
            statusText: "Connection not found",
        })
    }

    return connection
})
