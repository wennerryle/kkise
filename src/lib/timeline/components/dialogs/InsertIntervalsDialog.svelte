<script lang="ts">
	import { schema, keys } from '$lib/schemas/InsertIntervalsSchema';
	import { Dialog, Select, Separator } from 'bits-ui';
	import * as KKISEDialog from '$lib/components/Dialog';
	import * as KKISESelect from '$lib/components/Select';
	import { numericId } from '$lib/core/id';
	import { getTimelineContext } from '$lib/timeline/context/timeline-context';
	import ValibotForm from '$lib/components/ValibotForm/components/ValibotForm.svelte';
	import ValibotField from '$lib/components/ValibotForm/components/ValibotField.svelte';
	import { buttonVariants, separator } from '$lib/styles';
	import type { InsertManyOptions } from '$lib/timeline/services/InsertIntervalService';
	import { capitalize } from 'es-toolkit';
	import { InsertIntervalCommand } from '$lib/timeline/commands/InsertIntervalsCommand';

	const prefix = `insert-interval-dialog-${numericId()}-`;
	const prefixed = (suffix: string) => prefix + suffix;

	const checked: Partial<InsertManyOptions> = $state({
		trackId: ''
	});

	const ctx = getTimelineContext();

	const inputParams = (key: string) =>
		({
			id: prefixed(key),
			name: key,
			label: capitalize(key),
			tag: 'input',
			type: 'number',
			value: 0
		}) as const;
</script>

<Dialog.Root bind:open={ctx.dialog.insertIntervalsOpen}>
	<Dialog.Portal>
		<KKISEDialog.Overlay />
		<KKISEDialog.Content>
			<KKISEDialog.Title class="mb-2">Insert Intervals</KKISEDialog.Title>
			<Separator.Root class={separator} />
			<ValibotForm
				{schema}
				{prefix}
				onSuccessSubmit={(it) => {
					const command = new InsertIntervalCommand(ctx, it);

					command.execute();
				}}
				test={checked}
				class="flex flex-col gap-2"
			>
				<Select.Root type="single" onValueChange={(id) => (checked.trackId = id)}>
					<KKISESelect.Trigger>
						{#if checked.trackId}
							{checked.trackId}
						{:else}
							Select Track
						{/if}
					</KKISESelect.Trigger>
					<Select.Portal>
						<KKISESelect.Content>
							{#each ctx.trackRepository.tracks.keys() as trackId (trackId)}
								<KKISESelect.Item value={trackId}>
									{trackId}
								</KKISESelect.Item>
							{/each}
						</KKISESelect.Content>
					</Select.Portal>
				</Select.Root>

				<ValibotField {...inputParams(keys.offset)} />
				<ValibotField {...inputParams(keys.amount)} />
				<ValibotField {...inputParams(keys.gap)} />

				<ValibotField id={prefixed('end')} name="end" label="End" tag="input" type="number" />

				<ValibotField
					id={prefixed(keys.duration)}
					name={keys.duration}
					label="Duration"
					tag="input"
					type="number"
				/>

				<button class={buttonVariants()}>Apply</button>
			</ValibotForm>
		</KKISEDialog.Content>
	</Dialog.Portal>
</Dialog.Root>
