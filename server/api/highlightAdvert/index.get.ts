import {advertisements, highlightAdvert} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const result = await useDrizzle()
        .select({
            id: highlightAdvert.id,
            order: highlightAdvert.order,
            advertId: highlightAdvert.advertId,
            title: advertisements.title,
            description: advertisements.description,
            price: advertisements.price,
            city: advertisements.city,
            district: advertisements.district,
            neighborhood: advertisements.neighborhood,
            image: advertisements.image,
        })
        .from(highlightAdvert)
        .leftJoin(advertisements, eq(advertisements.id, highlightAdvert.advertId))
        .orderBy(highlightAdvert.order)

    return { result }
})
