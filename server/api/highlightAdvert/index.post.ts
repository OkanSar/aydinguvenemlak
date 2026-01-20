import {highlightAdvert} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ advertId: number }>(event)

    if (!body?.advertId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'advertId zorunlu'
        })
    }

    const maxOrder = await useDrizzle()
        .select({ max: sql<number>`max(${highlightAdvert.order})` })
        .from(highlightAdvert)

    const nextOrder = (maxOrder[0]?.max ?? 0) + 1

    await useDrizzle().insert(highlightAdvert).values({
        advertId: body.advertId,
        order: nextOrder
    })

    return { success: true }
})