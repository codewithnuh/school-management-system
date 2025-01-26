import { ExpressAuth } from '@auth/express'
import express from 'express'
import Credentials from '@auth/express/providers/credentials'
import { User as AuthUser } from '@auth/express/index'
import { User } from '@/models/User'
function mapUserToAuthUser(user: User): AuthUser {
    return {
        ...user,
        id: user.id.toString(), // Convert id to string
    }
}
import bcrypt from 'bcrypt'

const app = express()

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set('trust proxy', true)

app.use(
    '/auth/*',
    ExpressAuth({
        providers: [
            Credentials({
                credentials: {
                    email: { label: 'Email', type: 'text' },
                    password: { label: 'Password', type: 'password' },
                },
                authorize: async (credentials, request) => {
                    if (!credentials) {
                        return null
                    }

                    const hashedPassword = await bcrypt.hash(
                        credentials.password as string,
                        10,
                    )
                    const user = await User.findOne({
                        where: {
                            email: credentials.email as string,
                            password: hashedPassword as unknown as string,
                        },
                    })

                    return user ? mapUserToAuthUser(user) : null
                },
            }),
        ],
        callbacks: {
            async jwt({ token, user }) {
                if (user) {
                    ;(token.name = user.name), (token.id = user.id)
                }
                return token
            },
            async session({ session, token }) {
                if (session.user) {
                    ;(session.user.id = token.id as string),
                        (session.user.name = token.name as string)
                }
                return session
            },
        },
    }),
)

export default app
