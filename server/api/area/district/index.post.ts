export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body?.name || !body?.areaId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'name ve areaId zorunlu'
        })
    }

    const [district] = await useDrizzle()
        .insert(tables.districts)
        .values({
            name: body.name,
            cityId: body.areaId
        })
        .returning()

    return district
})
