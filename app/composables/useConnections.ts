import type { Connection } from "~/types/connection"

type SearchParams = {
    from: string
    to: string
    date: string
    departureAfter: string
    arriveBefore: string
}

export const useConnections = () => {
    const searchConnections = async (params: SearchParams) => {
        return await $fetch<Connection[]>("/api/connections", {
            query: params,
        })
    }

    const getConnectionById = async (id: string) => {
        return await $fetch<Connection>(`/api/connections/${id}`)
    }

    return {
        searchConnections,
        getConnectionById,
    }
}
