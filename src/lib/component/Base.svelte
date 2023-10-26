<script lang='ts'>
	import Breadcrumbs from '$lib/component/Breadcrumbs.svelte';
	export let breadcrumbs: string[] | undefined = undefined,
		mini: boolean = false;
</script>

<div class='{mini?"max-w-2xl":"max-w-4xl"} mx-auto md:px-4 px-2'>
	{#if breadcrumbs}
		<Breadcrumbs {breadcrumbs} />
	{/if}
	<slot />
</div>