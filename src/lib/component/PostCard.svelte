<script lang="ts">
	export let id: string, title: string, thumbnail: string;
</script>

<a
	class="card h-48 w-36 bg-base-200 inline-block mr-2 hover:shadow-none hover:bg-primary-content/20 transition-all hover:border"
	href="/post/{id}"
>
	<figure class="h-20 object-cover"><img src={thumbnail} alt={title} /></figure>
	<div class="card-body p-4">
		<h3 class="card-title text-xl font-bold">{title}</h3>
	</div>
</a>
