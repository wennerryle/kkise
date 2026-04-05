<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import logotype from './logotype.png';

	const props: SvelteHTMLElements['img'] = $props();
</script>

<img src={logotype} {...props} />
