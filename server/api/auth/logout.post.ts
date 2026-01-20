export default defineEventHandler((event) => {
    deleteCookie(event, 'admin_auth')
    return { success: true }
})
