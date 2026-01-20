export default defineEventHandler((event) => {
    const userId = getCookie(event, 'admin_auth')

    if (!userId) {
        throw createError({ statusCode: 401 })
    }

    return { ok: true }
})
