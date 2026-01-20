import {inArray} from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params!.id)

    // 1️⃣ İlçeleri bul
    const districtIds = await useDrizzle()
        .select({ id: tables.districts.id })
        .from(tables.districts)
        .where(eq(tables.districts.cityId, id))

    // 2️⃣ Mahalleleri sil
    if (districtIds.length) {
        await useDrizzle()
            .delete(tables.neighborhoods)
            .where(
                inArray(
                    tables.neighborhoods.districtId,
                    districtIds.map(d => d.id)
                )
            )

        // 3️⃣ İlçeleri sil
        await useDrizzle()
            .delete(tables.districts)
            .where(eq(tables.districts.cityId, id))
    }

    // 4️⃣ İl’i sil
    await useDrizzle()
        .delete(tables.cities)
        .where(eq(tables.cities.id, id))

    return { success: true }
})
