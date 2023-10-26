<script lang="ts">

	export let href: string|undefined=undefined;
</script>

<svelte:element this={href ? 'a' : 'button'} {...$$restProps}>
	<slot />
</svelte:element>