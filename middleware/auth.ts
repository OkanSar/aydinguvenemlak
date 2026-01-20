export default defineNuxtRouteMiddleware(async (to) => {
    // Sadece admin alanı
    if (!to.path.startsWith('/admin')) return

    try {
        await $fetch('/api/auth/me', {
            // ⬅️ CLIENT tarafı için ŞART
            credentials: 'include',

            // ⬅️ SSR tarafı için ŞART
            headers: process.server
                ? useRequestHeaders(['cookie'])
                : undefined,
        })
    } catch {
        return navigateTo('/login')
    }
})
