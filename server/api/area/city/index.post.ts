import {cities} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body?.name || !body.name.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'İl adı zorunludur'
        })
    }

    const name = body.name.trim()

    const exists = await useDrizzle()
        .select()
        .from(tables.cities)
        .where(eq(cities.name, name))
        .limit(1)

    if (exists.length) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Bu il zaten mevcut'
        })
    }

    const [city] = await useDrizzle()
        .insert(tables.cities)
        .values({
            name
        })
        .returning()

    return city
})
