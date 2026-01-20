export default defineEventHandler(async (event) => {
    const ads = await useDrizzle()
        .select()
        .from(tables.advertisements)
        .all()

    const formattedAds = ads.map(ad => ({
        ...ad,
        images: ad.image
            ? ad.image.split('##').filter(Boolean)
            : []
    }))

    return formattedAds
})
