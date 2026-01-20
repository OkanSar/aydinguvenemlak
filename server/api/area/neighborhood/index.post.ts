export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body?.name || !body?.districtId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'name ve districtId zorunlu'
        })
    }

    const [newNeighborhood] = await useDrizzle()
        .insert(tables.neighborhoods)
        .values({
            name: body.name,
            districtId: body.districtId
        })
        .returning()

    return newNeighborhood
})
