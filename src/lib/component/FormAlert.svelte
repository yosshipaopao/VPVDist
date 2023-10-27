<script lang="ts">
	import Icon from '@iconify/svelte';

	export let form: {
		success?: boolean;
		message?: string;
	} | null = null;
	export let successMessage = 'Succeed';
</script>

{#if form?.success}
	<div class="alert alert-info max-w-sm mx-auto mt-4">
		<p class="text-center">
			<Icon icon="ic:outline-check-circle" class="inline-block mr-2" />
			{successMessage}
		</p>
	</div>
{/if}
{#if form?.message}
	<div class="alert alert-error max-w-sm mx-auto mt-4">
		<p class="text-center">{form.message}</p>
	</div>
{/if}
