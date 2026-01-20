import {neighborhoods} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id)
    const body = await readBody(event)

    if (!body?.name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Mahalle adı zorunludur'
        })
    }

    await useDrizzle()
        .update(tables.neighborhoods)
        .set({ name: body.name })
        .where(eq(neighborhoods.id, id))

    return { success: true }
})
