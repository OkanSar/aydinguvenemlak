import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email ve şifre zorunlu',
        })
    }

    const user = await useDrizzle()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get()

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Email veya şifre hatalı',
        })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Email veya şifre hatalı',
        })
    }

    setCookie(event, 'admin_auth', user.id.toString(), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    })

    return {
        id: user.id,
        name: user.name,
        email: user.email,
    }
})
