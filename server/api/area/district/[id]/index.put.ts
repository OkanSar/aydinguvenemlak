import {districts} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id)
    const body = await readBody(event)

    if (!body?.name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'İlçe adı zorunludur'
        })
    }

    await useDrizzle()
        .update(tables.districts)
        .set({ name: body.name })
        .where(eq(districts.id, id))

    return { success: true }
})
