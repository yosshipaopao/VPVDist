import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { posts, contents } from '$lib/schema';
import { IMAGE_URL, IMAGE_SECRET, OBJECT_SECRET, OBJECT_URL } from '$env/static/private';

export const actions: Actions = {
	upload: async ({ locals, request }) => {
		const session = await locals.getSession();
		if (!session?.user) throw error(401, 'Unauthorized');
		const objectID = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
		const formData =await request.formData();
		const file = formData.get('file');
		if(!file) throw error(400,'file is required');
		if(!(file instanceof File)) throw error(400,'file is required');
		const sendForm = new FormData();
		sendForm.append('file', file);
		const res = await fetch(new URL(objectID, OBJECT_URL).href, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${OBJECT_SECRET}`
			},
			body: sendForm
		});
		console.log(res);
		if (!res.ok) throw error(500, 'Internal Server Error');
		return { success: true ,url:new URL(objectID,OBJECT_URL).href};
	},
	create: async ({ locals, request }) => {
		const session = await locals.getSession();
		if (!session?.user) throw error(401, 'Unauthorized');
		const id = crypto.randomUUID().replaceAll('-', '').slice(0, 26);
		const formData = Object.fromEntries(await request.formData());

		const title = formData.title as string;
		const description = formData.description as string;
		const file = formData.file;
		const version = 1;
		const authorId = session.user.id;
		const thumbnailMode = formData.thumbnailDirectURL;
		let thumbnail = '';
		if (thumbnailMode) {
			thumbnail = formData.thumbnail === '' ? '/noImage.jpg' : formData.thumbnail as string;
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
		let url: string;
		const fileDirectURL = formData.fileDirectURL;
		if (fileDirectURL) {
			url = file as string;
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
			url = new URL(`${id}_${version}`, IMAGE_URL).href;
		}


		const errors: string[] = [];
		if (title.length < 1) errors.push('title is required');
		if (file.length < 1) errors.push('file is required');
		if (errors.length > 0) {
			return fail(400, {
				errors,
				title,
				description,
				thumbnail,
				file
			});
		}
		await locals.db.insert(posts).values({
			id,
			title,
			version,
			authorId
		});
		await locals.db.insert(contents).values({
			post: id,
			version,
			thumbnail,
			file: url,
			description
		});
		return {
			success: true,
			id
		};

	}
};