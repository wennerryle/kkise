<script lang="ts">
	import { DropdownMenu, Separator, Toolbar } from 'bits-ui';
	import Logotype from '$lib/components/Logotype/Logotype.svelte';
</script>

<div class="p-1">
	<Toolbar.Root
		class="flex h-10 w-full items-center rounded-[10px] border border-slate-200 bg-white px-1 py-1 shadow-2xs"
	>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="flex size-8 items-center justify-center rounded-[10px] transition-colors hover:bg-slate-200"
			>
				<Logotype class="size-6" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item>hello</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
		<Separator.Root class="mx-1 -my-1 w-px self-stretch bg-gray-300" />
	</Toolbar.Root>
</div>
