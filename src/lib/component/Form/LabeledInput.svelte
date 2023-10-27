<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let el: 'input' | 'textarea' = 'input',
		name: string,
		id: string = name,
		label: string = name,
		placeholder = 'Type here',
		value: string | null = null,
		required = false,
		type: HTMLInputTypeAttribute = 'text';
</script>

<div class="form-control w-full">
	<label class="label" for={id}>
		<span class="label-text">{label}</span>
	</label>
	{#if el === 'input'}
		<input
			{...{ type }}
			{id}
			{placeholder}
			{name}
			{required}
			class="input input-bordered w-full max-w-full"
			bind:value
		/>
	{:else if el === 'textarea'}
		<textarea
			{id}
			{placeholder}
			{name}
			{required}
			class="textarea textarea-bordered w-full max-w-full">{value}</textarea
		>
	{/if}
</div>
