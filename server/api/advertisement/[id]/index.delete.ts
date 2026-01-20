export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params || {}
        if (!id) {
            return {
                success: false,
                message: 'İlan id bulunamadı.',
            }
        }

        const db = useDrizzle()

        const deleted = await db
            .delete(tables.advertisements)
            .where(eq(tables.advertisements.id, Number(id)))
            .returning()

        if (deleted.length === 0) {
            return {
                success: false,
                message: 'İlan bulunamadı.',
            }
        }

        return {
            success: true,
            message: 'İlan başarıyla silindi.',
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: 'İlan silinemedi.',
        }
    }
})
