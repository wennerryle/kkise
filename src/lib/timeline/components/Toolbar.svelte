<script lang="ts">
	import { DropdownMenu, Separator, Toolbar } from 'bits-ui';
	import * as KKISEDropdownMenu from '../../components/DropdownMenu';
	import Logotype from '$lib/components/Logotype/Logotype.svelte';
	import { toolbarItem } from '$lib/styles';
	import { getTimelineContext } from '../context/timeline-context';
	import KBD from '$lib/components/KBD.svelte';

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
				<DropdownMenu.Content class="z-10 w-max min-w-56 pt-2 pl-1" align="end">
					<div class="rounded-md border border-slate-200 bg-white py-2">
						<DropdownMenu.Group>
							<KKISEDropdownMenu.Item onclick={() => (ctx.dialog.insertIntervalsOpen = true)}>
								Insert Intervals
							</KKISEDropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Group>
							<KKISEDropdownMenu.GroupHeading>History</KKISEDropdownMenu.GroupHeading>
							<KKISEDropdownMenu.Item
								onclick={() => ctx.historyRepository.undo()}
								disabled={!ctx.historyRepository.canUndo}
							>
								Undo
								<KBD keys={['⌘', 'Z']} />
							</KKISEDropdownMenu.Item>
							<KKISEDropdownMenu.Item
								onclick={() => ctx.historyRepository.redo()}
								disabled={!ctx.historyRepository.canRedo}
							>
								Redo
								<KBD keys={['⌘', 'X']} />
							</KKISEDropdownMenu.Item>
						</DropdownMenu.Group>
					</div>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
		<Separator.Root class="mx-1 -my-1 w-px self-stretch bg-gray-300" />
	</Toolbar.Root>
</div>
