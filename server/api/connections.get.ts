import {connections} from "#server/data/connections";

export default defineEventHandler((event) => {
    const query = getQuery(event);

    const from = String(query.from || "").toLowerCase()
    const to = String(query.to || "").toLowerCase()

    if(!from && !to) {
        return connections;
    }

    return connections.filter((connection) => {
        const matchesFrom =
            connection.from.city.toLowerCase().includes(from) ||
            connection.from.name.toLowerCase().includes(from)

        const matchesTo =
            connection.to.city.toLowerCase().includes(to) ||
            connection.to.name.toLowerCase().includes(to)

        return matchesFrom && matchesTo;
    })
})