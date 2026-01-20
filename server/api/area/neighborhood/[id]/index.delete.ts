import {neighborhoods} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params!.id)

    await useDrizzle()
        .delete(tables.neighborhoods)
        .where(eq(neighborhoods.id, id))

    return { success: true }
})
