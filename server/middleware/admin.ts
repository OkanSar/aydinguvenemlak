export default defineEventHandler((event) => {
    const url = event.node.req.url || ''

    // Sadece admin sayfaları
    if (!url.startsWith('/admin')) return

    const userId = getCookie(event, 'admin_auth')

    if (!userId) {
        // HTML isteklerini login'e yönlendir
        if (event.node.req.headers.accept?.includes('text/html')) {
            return sendRedirect(event, '/login', 302)
        }

        // API çağrıları için
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
    }
})
