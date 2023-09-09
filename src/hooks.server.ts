import { SvelteKitAuth } from '@auth/sveltekit';
import type { Handle } from '@sveltejs/kit';
import Google from '@auth/core/providers/google';
import { AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { DBAdapter } from '$lib/server/DBAdapter';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import { createBridge } from "cfw-bindings-wrangler-bridge";
import { drizzle } from 'drizzle-orm/d1';

const theme = (async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') ?? '';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=\'\'', `data-theme='${theme}'`)
	});
}) satisfies Handle;

const Wrangler: Handle = async ({ event, resolve }) => {
	if (dev) {
		const bridge = createBridge();
		event.locals.db = drizzle(bridge.D1Database("DB"));
		event.locals.KV=bridge.KVNamespace("KV");
		event.locals.R2=bridge.R2Bucket("R2")
	}else {
		event.locals.db = drizzle(<D1Database>event.platform?.env.DB);
		event.locals.KV=<KVNamespace>event.platform?.env.KV;
		event.locals.R2=<R2Bucket>event.platform?.env.R2;
	}
	return resolve(event);
};

const auth = SvelteKitAuth(async ({ locals }) => {
	return {
		adapter: DBAdapter(locals.db),
		pages: {
			signIn: '/signin',
			newUser: '/user/setup'
		},
		providers: [Google({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		})],
		callbacks: {
			async session({ session, user }) {
				if (user.id && session.user) session.user.id = user.id;
				return session;
			}
		},
		trustHost: true,
		secret: AUTH_SECRET
	};
}) satisfies Handle;
export const handle = sequence(theme, Wrangler,auth);