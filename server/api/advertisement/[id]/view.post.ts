export default defineEventHandler(async (event) => {
    const { id } = event.context.params || {}
    if (!id) throw createError({ statusCode: 400 })

    const ip =
        event.node.req.headers['x-forwarded-for']?.toString().split(',')[0] ||
        event.node.req.socket.remoteAddress ||
        'unknown'

    const db = useDrizzle()

    // Son 30 dakika kontrolü
    const recentView = await db
        .select()
        .from(tables.advertisementViews)
        .where(
            and(
                eq(tables.advertisementViews.advertId, Number(id)),
                eq(tables.advertisementViews.ip, ip),
                sql`createdAt >= datetime('now', '-30 minutes')`
            )
        )
        .limit(1)

    // Eğer zaten bakmışsa sayma
    if (recentView.length) {
        return { skipped: true }
    }

    // 👁 View count +1
    await db
        .update(tables.advertisements)
        .set({
            viewCount: sql`viewCount + 1`
        })
        .where(eq(tables.advertisements.id, Number(id)))

    // 📝 Log ekle
    await db.insert(tables.advertisementViews).values({
        advertId: Number(id),
        ip,
    })

    return { success: true }
})
