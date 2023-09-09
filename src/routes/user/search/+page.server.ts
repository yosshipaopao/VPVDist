import type {PageServerLoad} from "./$types";
import {users} from "$lib/schema";
import { like, or } from 'drizzle-orm';
export const load = (async ({url,locals}) => {
	const q=url.searchParams.get("q");
	if(!q) return {result:[],q};
	const result=await locals.db.select({
		uid:users.uid,
		name:users.name,
		image:users.image,
	}).from(users).where(or(like(users.name, `%${q}%`),like(users.uid,`%${q}%`))).limit(20);
	return {result,q};
}) satisfies PageServerLoad;