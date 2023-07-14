import {drizzleDB} from "$lib/server";
import {Auth} from "$lib/server/schema";
import {eq, and} from "drizzle-orm";
/** @type {import('./$types').PageServerLoad} */
// @ts-ignore
export const load = (async({platform})=> {
    const db = drizzleDB(platform.env.DB);
    const query = db.select().from(Auth);
    return{ dt:await query.all()}
})