import {SvelteKitAuth} from "@auth/sveltekit";
import Credentials from "@auth/core/providers/credentials";
import type { Handle } from "@sveltejs/kit";
import { db } from "$lib/server";
import { Auth } from "$lib/server/schema";
import { eq, and } from "drizzle-orm";
export const handle = SvelteKitAuth({
    providers: [
        Credentials({
            credentials: {
                username: {label: "Username"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                const {username, password} = credentials;
                //const query = db.select().from(Account).where(and(eq(Account.username,username as string),eq(Account.password,password as string)));
                //const result = await query.get();
                //console.log(query,result)
                if (username === "admin" && password === "admin") {
                    return {
                        id: "admin",
                        name:username,
                        email: "admin@example.com",
                    };
                }
                return null;
            },
        }),
    ],
    secret: "secret",
    trustHost: true,
}) satisfies Handle;