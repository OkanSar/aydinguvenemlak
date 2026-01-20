import {districts, neighborhoods} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params!.id)

    await useDrizzle()
        .delete(tables.neighborhoods)
        .where(eq(neighborhoods.districtId, id))

    // 2️⃣ İlçeyi sil
    await useDrizzle()
        .delete(tables.districts)
        .where(eq(districts.id, id))

    return { success: true }
})
