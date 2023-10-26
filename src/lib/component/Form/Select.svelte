<script lang="ts">
	export let
		name: string,
		value: string,
		options:{value:string, label:string}[],
		join:boolean=false;
</script>
<select class='{join?"join-item":""} select select-bordered w-30' bind:value {name}>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
	<slot/>
</select>