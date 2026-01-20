import {highlightAdvert} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id)

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Geçersiz id'
        })
    }

    await useDrizzle()
        .delete(highlightAdvert)
        .where(eq(highlightAdvert.id, id))

    return { success: true }
})
