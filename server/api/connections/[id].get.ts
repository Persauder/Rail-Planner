import { connections } from "../../data/connections"

export default defineEventHandler((event) => {
    const id = getRouterParam(event, "id")

    const connection = connections.find((item) => item.id === id)

    if (!connection) {
        throw createError({
            status: 404,
            statusText: "Connection not found",
        })
    }

    return connection
})