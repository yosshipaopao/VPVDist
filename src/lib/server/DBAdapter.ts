import {and, eq} from "drizzle-orm";
import {accounts, sessions, users, verificationTokens} from "$lib/schema";
import type { Adapter, AdapterAccount } from '@auth/core/adapters';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
export const DBAdapter=(client:DrizzleD1Database):Adapter =>{

    return {
        createUser(data) {
            const id= crypto.randomUUID()
            return client
              .insert(users)
              .values({ ...data, id, uid: id })
              .returning()
              .get()
        },
        async getUser(data) {
            return await client.select().from(users).where(eq(users.id, data)).get() ?? null
        },
        async getUserByEmail(data) {
            return (
              await client.select().from(users).where(eq(users.email, data)).get() ?? null
            )
        },
        createSession(data) {
            return client.insert(sessions).values(data).returning().get()
        },
        async getSessionAndUser(data) {
            return (
              await client
                .select({
                    session: sessions,
                    user: users,
                })
                .from(sessions)
                .where(eq(sessions.sessionToken, data))
                .innerJoin(users, eq(users.id, sessions.userId))
                .get() ?? null
            )
        },
        async updateUser(data) {
            if (!data.id) {
                throw new Error("No user id.")
            }

            return client
                .update(users)
                .set(data)
                .where(eq(users.id, data.id))
                .returning()
                .get();
        },
        async updateSession(data) {
            return client
                .update(sessions)
                .set(data)
                .where(eq(sessions.sessionToken, data.sessionToken))
                .returning()
                .get();
        },
        async linkAccount(rawAccount) {
            const updatedAccount = await client
              .insert(accounts)
              .values(rawAccount)
              .returning().get()

            const account: AdapterAccount = {
                ...updatedAccount,
                type: updatedAccount.type,
                access_token: updatedAccount.access_token ?? undefined,
                token_type: updatedAccount.token_type ?? undefined,
                id_token: updatedAccount.id_token ?? undefined,
                refresh_token: updatedAccount.refresh_token ?? undefined,
                scope: updatedAccount.scope ?? undefined,
                expires_at: updatedAccount.expires_at ?? undefined,
                session_state: updatedAccount.session_state ?? undefined,
            }

            return account
        },
        async getUserByAccount(account) {
            const results = await client
              .select()
              .from(accounts)
              .leftJoin(users, eq(users.id, accounts.userId))
              .where(
                and(
                  eq(accounts.provider, account.provider),
                  eq(accounts.providerAccountId, account.providerAccountId)
                )
              )
              .get()
            if (!results) {
                return null
            }
            return Promise.resolve(results).then((results) => results.user)
        },
        async deleteSession(sessionToken) {
            return await (
              client
                .delete(sessions)
                .where(eq(sessions.sessionToken, sessionToken))
                .returning()
                .get() ?? null
            )
        },
        createVerificationToken(token) {
            return client.insert(verificationTokens).values(token).returning().get()
        },
        async useVerificationToken(token) {
            try {
                return (
                  await client
                    .delete(verificationTokens)
                    .where(
                      and(
                        eq(verificationTokens.identifier, token.identifier),
                        eq(verificationTokens.token, token.token)
                      )
                    )
                    .returning()
                    .get() ?? null
                )
            } catch (err) {
                throw new Error("No verification token found.")
            }
        },
        async deleteUser(id) {
            return client.delete(users).where(eq(users.id, id)).returning().get();
        },
        async unlinkAccount(account) {
            await client
              .delete(accounts)
              .where(
                and(
                  eq(accounts.providerAccountId, account.providerAccountId),
                  eq(accounts.provider, account.provider)
                )
              )
              .run()
            return undefined
        },
    }
}