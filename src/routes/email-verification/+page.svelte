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
			<li>
				<a href="/">
					<Icon icon="ic:outline-home" class="inline" />
					Home</a
				>
			</li>
			<li class="text-gray-500">Sign In</li>
		</ul>
	</div>
	{#if form?.success}
		<div class="alert alert-info max-w-sm mx-auto mt-4">
			<p class="text-center">
				<Icon icon="ic:outline-check-circle" class="inline-block mr-2" />
				Your verification link was resent
			</p>
		</div>
	{/if}
	{#if form?.message}
		<div class="alert alert-error max-w-sm mx-auto mt-4">
			<p class="text-center">{form.message}</p>
		</div>
	{/if}

	<div class="mx-auto md:px-4 max-w-2xl">
		<h1 class="text-4xl font-bold text-center my-8">Email verification</h1>
		<p class="text-xl font-bold text-center my-8">
			Your email verification link was sent to your inbox.
		</p>
		<br />
		<h2 class="text-4xl font-bold text-center my-8">Resend verification link.</h2>
		<form method="post" class="w-full flex flex-col gap-4" use:enhance>
			<button type="submit" class="btn btn-primary">ReSend</button>
		</form>
	</div>
</div>
