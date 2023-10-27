<script lang="ts">
	import { enhance } from '$app/forms';
	import Title from '$lib/component/Title.svelte';

	export let title: string | undefined = undefined,
		method = 'POST',
		action = '',
		footers: { text: string; href: string }[] = [],
		footerJustify: 'start' | 'end' | 'between' = 'end',
		submitText = 'Submit',
		keepFocus = false,
		submitButton = true,
		disabled = false,
		useEnhance = true;
</script>

{#if title}
	<Title center>{title}</Title>
{/if}
{#if (method === 'POST' || method === 'post') && useEnhance}
	<form
		class="w-full flex flex-col gap-4"
		{method}
		{action}
		use:enhance
		data-sveltekit-keepfocus={keepFocus ? true : undefined}
	>
		<slot />
		{#if submitButton}
			<button type="submit" class="btn btn-primary">{submitText}</button>
		{/if}
		{#if footers.length >= 1}
			<div class="flex justify-{footerJustify} gap-4">
				{#each footers as { href, text }}
					<a {href} class="btn btn-secondary">{text}</a>
				{/each}
			</div>
		{/if}
	</form>
{:else}
	<form
		class="w-full flex flex-col gap-4"
		{method}
		{action}
		data-sveltekit-keepfocus={keepFocus ? true : undefined}
	>
		<slot />
		{#if submitButton}
			<button type="submit" class="btn btn-primary" {disabled}>{submitText}</button>
		{/if}
		{#if footers.length >= 1}
			<div class="flex justify-{footerJustify} gap-4">
				{#each footers as { href, text }}
					<a {href} class="btn btn-secondary">{text}</a>
				{/each}
			</div>
		{/if}
	</form>
{/if}
