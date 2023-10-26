<script lang='ts'>
	import { enhance } from '$app/forms';

	export let title: string | undefined = undefined,
		method: string = 'POST',
		action: string = '',
		footers: { text: string, href: string }[] = [],
		footerJustify: 'start' | 'end' | 'between' = 'end',
		submitText: string = 'Submit',
		keepFocus: boolean = false,
		submitButton: boolean = true;
</script>
{#if title}
	<h1 class='text-4xl font-bold text-center my-8'>{title}</h1>
{/if}
{#if method === 'POST'}
	<form class='w-full flex flex-col gap-4' method='post' {action} use:enhance
				data-sveltekit-keepfocus={keepFocus?true:undefined}>
		<slot />
		{#if submitButton}
			<button type='submit' class='btn btn-primary'>{submitText}</button>
		{/if}
		{#if footers.length >= 1}
			<div class='flex justify-{footerJustify} gap-4'>
				{#each footers as { href, text }}
					<a {href} class='btn btn-secondary'>{text}</a>
				{/each}
			</div>
		{/if}
	</form>
{:else}
	<form class='w-full flex flex-col gap-4' method='get' {action}
				data-sveltekit-keepfocus={keepFocus?true:undefined}>
		<slot />
		{#if submitButton}
			<button type='submit' class='btn btn-primary'>{submitText}</button>
		{/if}
		{#if footers.length >= 1}
			<div class='flex justify-{footerJustify} gap-4'>
				{#each footers as { href, text }}
					<a {href} class='btn btn-secondary'>{text}</a>
				{/each}
			</div>
		{/if}
	</form>
{/if}