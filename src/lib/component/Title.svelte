<script lang="ts">
	export let center = false;
</script>

<h1 class="text-4xl font-bold my-8 {center ? 'text-center' : ''}"><slot /></h1>
