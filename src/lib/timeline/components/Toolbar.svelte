<script lang="ts">
	import { DropdownMenu, Separator, Toolbar } from 'bits-ui';
	import * as KKISEDropdownMenu from '../../components/DropdownMenu';
	import Logotype from '$lib/components/Logotype/Logotype.svelte';
	import { toolbarItem } from '$lib/styles';
	import { getTimelineContext } from '../context/timeline-context';

	const ctx = getTimelineContext();
</script>

<div class="p-1">
	<Toolbar.Root
		class="flex h-10 w-full items-center rounded-[10px] border border-slate-200 bg-white px-1 py-1 shadow-2xs"
	>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={toolbarItem}>
				<Logotype class="size-6" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content class="pl- w-max pt-2 pl-1" align="end">
					<div class="rounded-md border border-slate-200 bg-white py-2.5">
						<DropdownMenu.Group>
							<KKISEDropdownMenu.Item onclick={() => (ctx.dialog.insertIntervalsOpen = true)}
								>Insert Intervals</KKISEDropdownMenu.Item
							>
						</DropdownMenu.Group>
					</div>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
		<Separator.Root class="mx-1 -my-1 w-px self-stretch bg-gray-300" />
	</Toolbar.Root>
</div>
