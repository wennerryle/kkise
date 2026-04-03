<script lang="ts">
	interface Props {
		errors: string[];
	}

	const props: Props = $props();
</script>

{#each props.errors as error, i (i)}
	{error}
	<br />
{/each}
