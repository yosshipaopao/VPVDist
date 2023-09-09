import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { files } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const GET = (async ({ params, locals }) => {
	const id = params.id;
	const R2Object = await locals.R2.get(id);
	if (!R2Object) throw error(404, 'File not found');
	const headers = new Headers();
	R2Object.writeHttpMetadata(headers);
	headers.set('etag', R2Object.httpEtag);
	return new Response(R2Object.body, { headers});
}) satisfies RequestHandler;

export const PUT = (async ({ params, locals, request, url }) => {
	const id = params.id;
	const session = await locals.getSession();
	if (!session?.user) throw error(401, 'Unauthorized');
	const alreadyExists = await locals.db.select({
		authorId: files.authorId
	}).from(files).where(eq(files.url, url.href)).get().then(x => !!x?.authorId);
	if(alreadyExists) throw error(409, 'File already exists');
	await locals.R2.put(id,request.body,{ httpMetadata:request.headers});
	await locals.db.insert(files).values({ url: url.href, authorId: session.user.id });
	return new Response(null, { status: 204 });
}) satisfies RequestHandler;