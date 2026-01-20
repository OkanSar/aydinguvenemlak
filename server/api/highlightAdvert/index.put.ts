import {highlightAdvert} from "~~/server/database/schema";

type ReorderItem = {
    id: number
    order: number
}

export default defineEventHandler(async (event) => {
    const body = await readBody<{ items: ReorderItem[] }>(event)

    if (!body?.items?.length) {
        throw createError({
            statusCode: 400,
            statusMessage: 'items boş olamaz'
        })
    }

    for (const item of body.items) {
        await useDrizzle()
            .update(highlightAdvert)
            .set({ order: item.order })
            .where(eq(highlightAdvert.id, item.id))
    }

    return { success: true }
})
