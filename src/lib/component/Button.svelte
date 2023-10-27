<script lang="ts">
	export let href: string | undefined = undefined,
		join = false,
		color = 'primary';
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	{...$$restProps}
	class="{join ? 'join-item' : ''} btn btn-{color}"
>
	<slot />
</svelte:element>
