import type { PageServerLoad, Actions } from './$types';
import { posts, contents } from '$lib/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { IMAGE_SECRET, IMAGE_URL, OBJECT_SECRET, OBJECT_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ params, parent ,locals}) => {
	const id = params.id;
	const { session } = await parent();
	if (!session || !session.user) throw error(401, 'Unauthorized');
	const uid = session.user.id;
	const post = await locals.db.select({
		title: posts.title,
		description: contents.description,
		thumbnail: contents.thumbnail,
		file: contents.file
	}).from(posts).where(and(eq(posts.id, id), eq(posts.authorId, uid))).leftJoin(contents, and(eq(posts.version, contents.version), eq(posts.id, contents.post))).get();
	if (!post) throw error(404, 'Post not found or you are not the author');
	return { post, id };
};

export const actions: Actions = {
	delete: async ({ params, locals }) => {
		const session = await locals.getSession();
		if (!session?.user) throw error(401, 'Unauthorized');
		const post = await locals.db.select({
			authorId: posts.authorId
		}).from(posts).where(eq(posts.id, params.id)).get();
		if (!post) throw error(404, 'Post not found');
		if (post.authorId != session.user.id) throw error(403, 'Forbidden');
		await locals.db.delete(posts).where(eq(posts.id, params.id)).execute();
		await locals.db.delete(contents).where(eq(contents.post, params.id)).execute();
		return {
			success: true,
			delete: true
		};
	},
	edit: async ({ params, locals, request }) => {
		const session = await locals.getSession();
		if (!session?.user) throw error(401, 'Unauthorized');
		const post = await locals.db.select({
			authorId: posts.authorId,
			version: posts.version,
			title: posts.title,
			description: contents.description,
			thumbnail: contents.thumbnail,
			file: contents.file
		}).from(posts).where(eq(posts.id, params.id)).leftJoin(contents, and(eq(posts.version, contents.version), eq(posts.id, contents.post))).get();
		if (!post) throw error(404, 'Post not found');
		if (post.authorId != session.user.id) throw error(403, 'Forbidden');
		const formData = Object.fromEntries(await request.formData());
		const differences:{
			title?:string,
			description?:string,
			file?:string,
			thumbnail?:string
		} = {};
		const id = params.id;
		const title = formData.title as string;
		if (title != post.title) differences.title = title;
		const description = formData.description as string;
		if (description != post.description) differences.description = description;
		const version = post.version + 1;
		const rawfile = formData.file;
		const fileDirectURL = formData.fileDirectURL;
		if (rawfile) {
			if (fileDirectURL) {
				differences.file = rawfile as string;
			} else {
				const sendForm = new FormData();
				const { file: rawFile } = formData as {
					file: File
				};
				sendForm.append('file', rawFile ?? new Blob());
				await fetch(new URL(`${id}_${version}`, OBJECT_URL).href, {
					method: 'PUT',
					headers: {
						'Autorization': `Bearer ${OBJECT_SECRET}`
					},
					body: sendForm
				});
				differences.file = new URL(`${id}_${version}`, IMAGE_URL).href;
			}
		}
		const thumbnailMode = formData.thumbnailDirectURL;
		let thumbnail = '';
		if (thumbnailMode) {
			thumbnail = formData.thumbnail == '' ? '/noImage.jpg' : formData.thumbnail as string;
		} else {
			const sendForm = new FormData();
			const { thumbnail: rawThumbnail } = formData as {
				thumbnail: File
			};
			sendForm.append('file', rawThumbnail ?? new Blob());
			sendForm.append('secret', IMAGE_SECRET);
			await fetch(new URL(`${id}_${version}`, IMAGE_URL).href, {
				method: 'POST',
				body: sendForm
			});
			thumbnail = new URL(`${id}_${version}`, IMAGE_URL).href;
		}
		if (thumbnail != post.thumbnail) differences.thumbnail = thumbnail;

		console.log(differences);
		if (Object.keys(differences).length > 0) {
			await locals.db.insert(contents).values({
				post: id,
				version,
				thumbnail,
				file: differences.file??"undefined",
				description
			});
			await locals.db.update(posts).set({
				version,
				title
			}).where(eq(posts.id, id)).execute();
			return {
				success: true,
				id
			};
		}
		return {
			success: true,
			id
		};
	}
};