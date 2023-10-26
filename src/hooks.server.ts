import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import { createBridge } from 'cfw-bindings-wrangler-bridge';
import { drizzle } from 'drizzle-orm/d1';
import { initializeLucia } from '$lib/server/lucia';

const theme = (async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') ?? '';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace(`data-theme=""`, `data-theme='${theme}'`)
	});
}) satisfies Handle;

const Wrangler: Handle = async ({ event, resolve }) => {
	if (dev) {
		const bridge = createBridge();
		event.locals.DB = bridge.D1Database('DB');
		event.locals.db = drizzle(event.locals.DB);
		event.locals.KV = bridge.KVNamespace('KV');
		event.locals.R2 = bridge.R2Bucket('R2');
	} else {
		event.locals.DB = <D1Database>event.platform?.env.DB;
		event.locals.db = drizzle(event.locals.DB);
		event.locals.KV = <KVNamespace>event.platform?.env.KV;
		event.locals.R2 = <R2Bucket>event.platform?.env.R2;
	}
	event.locals.lucia = initializeLucia(event.locals.DB);
	event.locals.auth = event.locals.lucia.handleRequest(event);
	return resolve(event);
};

export const handle = sequence(theme, Wrangler);
