export default defineEventHandler(async (event) => {
    const { id } = event.context.params || {}
    if (!id) throw createError({ statusCode: 404 })

    const contentType = event.node.req.headers['content-type'] || ''

    // =====================================================
    // 🖼️ IMAGE UPDATE (multipart/form-data)
    // =====================================================
    if (contentType.includes('multipart/form-data')) {
        const form = await readFormData(event)

        const keepImages = form.getAll('keepImages[]') as string[]
        const files = form.getAll('images') as File[]

        const uploadedUrls: string[] = []

        for (const file of files) {
            if (!(file instanceof File) || file.size === 0) continue

            ensureBlob(file, { types: ['image'] })

            const safeName = file.name
                .toLowerCase()
                .replaceAll(' ', '-')
                .replace(/[^a-z0-9.\-_]/g, '')

            const blob = await hubBlob().put(safeName, file, {
                prefix: 'advertisements',
                addRandomSuffix: true
            })

            uploadedUrls.push(blob.pathname)
        }

        const finalImages = [...keepImages, ...uploadedUrls]

        const oldAd = await useDrizzle()
            .select()
            .from(tables.advertisements)
            .where(eq(tables.advertisements.id, Number(id)))
            .limit(1)

        if (oldAd.length) {
            const oldImages = oldAd[0].image?.split('##') ?? []
            const deleted = oldImages.filter(
                (img: string) => !finalImages.includes(img)
            )

            for (const path of deleted) {
                await hubBlob().del(path)
            }
        }

        await useDrizzle()
            .update(tables.advertisements)
            .set({ image: finalImages.join('##') })
            .where(eq(tables.advertisements.id, Number(id)))

        return { success: true, type: 'images' }
    }

    // =====================================================
    // 📝 NORMAL UPDATE (application/json)
    // =====================================================
    if (contentType.includes('application/json')) {
        const body = await readBody(event)

        if (!body || !Object.keys(body).length) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Empty update payload'
            })
        }

        await useDrizzle()
            .update(tables.advertisements)
            .set(body)
            .where(eq(tables.advertisements.id, Number(id)))

        return { success: true, type: 'fields' }
    }

    throw createError({
        statusCode: 415,
        statusMessage: 'Unsupported Content-Type'
    })
})
