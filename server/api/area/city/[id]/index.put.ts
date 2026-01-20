import {cities} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id)
    const body = await readBody(event)

    if (!body?.name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'İl adı zorunludur'
        })
    }

    await useDrizzle()
        .update(tables.cities)
        .set({
            name: body.name
        })
        .where(eq(cities.id, id))

    return { success: true }
})
