<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let
		name:string,
		id:string=name,
		label:string=name,
		placeholder:string="Type here",
		value:string="",
		required:boolean=false,
		type:HTMLInputTypeAttribute="text";
</script>
<div class='form-control w-full'>
	<label class='label' for={id}>
		<span class='label-text'>{label}</span>
	</label>
	<input {...{ type }} {id} {placeholder} {name} {required}
		class='input input-bordered w-full max-w-full'
		bind:value
	/>
</div>