import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const start = query.start as string
    const end = query.end as string

    if (!start || !end) {
        throw createError({
            statusCode: 400,
            statusMessage: 'start ve end zorunlu'
        })
    }

    const result = await useDrizzle().all(sql`
        SELECT
            DATE(createdAt) as date,
            COUNT(*) as count
        FROM advertisement_views
        WHERE DATE(createdAt) BETWEEN ${start} AND ${end}
        GROUP BY DATE(createdAt)
        ORDER BY DATE(createdAt)
    `)

    return {
        labels: result.map(r => r.date),
        data: result.map(r => Number(r.count))
    }
})
