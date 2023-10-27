<script lang="ts">
	export let userId: string,
		icon: string,
		name: string,
		info = 'info',
		big = false;
</script>

<a
	class="card shadow-xl hover:shadow-none bg-base-200 hover:bg-primary-content hover:border max-w-sm {big
		? ''
		: 'h-20 mt-4'}"
	href="/user/{userId}"
>
	<div class="card-body flex flex-row p-2 {big ? 'h-30' : ''}">
		<figure class="avatar rounded-full {big ? 'h-24' : 'h-16'}">
			<img src={icon} alt="icon" />
		</figure>
		<div>
			<h2 class="card-title">{name}</h2>
			<p>{info}</p>
		</div>
	</div>
</a>
