<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';
	export let form: ActionData;
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
				Succeed
			</p>
		</div>
	{/if}
	{#if form?.error}
		<div class="alert alert-error max-w-sm mx-auto mt-4">
			<p class="text-center">{form.message}</p>
		</div>
	{/if}

	<div class="mx-auto md:px-4 max-w-2xl">
		<h1 class="text-4xl font-bold text-center my-8">Sign In</h1>
		<form method="post" class="w-full flex flex-col gap-4" use:enhance>
			<div class="form-control w-full">
				<label class="label" for="password">
					<span class="label-text">Password</span>
				</label>
				<input
					type="password"
					id="password"
					placeholder="Type here"
					class="input input-bordered w-full max-w-full"
					name="password"
				/>
			</div>
			<button type="submit" class="btn btn-primary">Submit</button>
			<div class="flex justify-between gap-4">
				<a href="/signup" class="btn btn-secondary">Create an account</a>
				<a href="/password-reset" class="btn btn-secondary">Reset Password</a>
			</div>
		</form>
	</div>
</div>
