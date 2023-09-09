import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {  images } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const GET = (async ({ params, locals }) => {
	const id = params.id;
	const { value, metadata } = await locals.KV.getWithMetadata(id, { type: 'arrayBuffer' });
	if (!value) throw error(404, 'Image not found');
	const headers = new Headers();
	headers.set('content-type', metadata?.type ?? 'image/png');
	headers.set('cache-control', 'public, max-age=31536000, immutable');
	return new Response(value, { headers });
}) satisfies RequestHandler;

export const PUT = (async ({ params, locals, request, url }) => {
	const id = params.id;
	const session = await locals.getSession();
	if (!session?.user) throw error(401, 'Unauthorized');
	const alreadyExists = await locals.db.select({
		authorId: images.authorId
	}).from(images).where(eq(images.url, url.href)).get().then(x => !!x?.authorId);
	if (alreadyExists) throw error(409, 'File already exists');
	const file = await request.arrayBuffer();
	const type = request.headers.get('content-type') ?? 'image/png';
	await locals.KV.put(id, file, { metadata: { type } });
	await locals.db.insert(images).values({ url: url.href, authorId: session.user.id });
	return new Response(null, { status: 204 });
})satisfies RequestHandler;