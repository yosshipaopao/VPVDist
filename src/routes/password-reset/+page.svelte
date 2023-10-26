<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { Turnstile } from 'svelte-turnstile';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';

	export let form: ActionData;

	$: if (browser && form) reset?.();

	let reset: () => void | undefined;
</script>

<div class="mx-auto md:px-4 max-w-4xl">
	<div class="breadcrumbs">
		<ul>
			<li><a href="/"> <Icon icon="ic:outline-home" class="inline" />Home</a></li>
			<li class="text-gray-500">Reset password</li>
		</ul>
	</div>
	{#if form?.success}
		<div class="alert alert-info max-w-sm mx-auto mt-4">
			<p class="text-center">
				<Icon icon="ic:outline-check-circle" class="inline-block mr-2" />
				Your password reset link was sent to your inbox
			</p>
		</div>
	{/if}
	{#if form?.message}
		<div class="alert alert-error max-w-sm mx-auto mt-4">
			<p class="text-center">{form.message}</p>
		</div>
	{/if}

	<div class="mx-auto md:px-4 max-w-2xl">
		<h1 class="text-4xl font-bold text-center my-8">Reset password</h1>
		<form method="post" class="w-full flex flex-col gap-4" use:enhance>
			<div class="form-control w-full">
				<label class="label" for="email">
					<span class="label-text">email</span>
				</label>
				<input
					type="email"
					id="email"
					placeholder="Type here"
					class="input input-bordered w-full max-w-full"
					name="email"
					required
				/>
			</div>
			<button type="submit" class="btn btn-primary">Submit</button>
			<div class="flex justify-end gap-4">
				<a href="/signin" class="btn btn-secondary">SignIn</a>
			</div>
		</form>
	</div>
</div>
