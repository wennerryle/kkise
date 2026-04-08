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
	import { capitalize } from 'es-toolkit';
	import { InsertIntervalCommand } from '$lib/timeline/commands/InsertIntervalsCommand';

	const ctx = getTimelineContext();
	const prefix = `insert-interval-dialog-${numericId()}-`;
	const prefixed = (suffix: string) => prefix + suffix;

	let formData = $state({
		[keys.offset]: 0,
		[keys.amount]: 1,
		[keys.gap]: 0,
		[keys.duration]: 0,
		trackId: '',
		end: 0
	});

	const inputParams = (key: keyof typeof formData) =>
		({
			id: prefixed(key),
			name: key,
			label: capitalize(key),
			tag: 'input',
			type: 'number'
		}) as const;

	$effect(() => {
		formData.end = Math.min(
			ctx.player.totalDurationMs,
			formData[keys.offset] + formData[keys.duration]
		);
	});

	$effect(() => {
		const potentialDuration = formData.end - formData[keys.offset];
		formData[keys.duration] = Math.max(0, potentialDuration);
	});
</script>

<Dialog.Root bind:open={ctx.dialog.insertIntervalsOpen}>
	<Dialog.Portal>
		<KKISEDialog.Overlay />
		<KKISEDialog.Content>
			<KKISEDialog.Title class="mb-2">Insert Intervals</KKISEDialog.Title>
			<Separator.Root class={separator} />

			<ValibotForm
				test={formData}
				{schema}
				{prefix}
				onSuccessSubmit={(it) => {
					const command = new InsertIntervalCommand(ctx, { ...it, trackId: formData.trackId });
					ctx.historyRepository.execute(command);
				}}
				class="flex flex-col gap-2"
			>
				<Select.Root type="single" bind:value={formData.trackId}>
					<KKISESelect.Trigger>
						{formData.trackId || 'Select Track'}
					</KKISESelect.Trigger>
					<Select.Portal>
						<KKISESelect.Content>
							{#each ctx.trackRepository.tracks.keys() as trackId (trackId)}
								<KKISESelect.Item value={trackId}>{trackId}</KKISESelect.Item>
							{/each}
						</KKISESelect.Content>
					</Select.Portal>
				</Select.Root>

				<ValibotField {...inputParams(keys.offset)} bind:value={formData[keys.offset]} />
				<ValibotField {...inputParams(keys.amount)} bind:value={formData[keys.amount]} />
				<ValibotField {...inputParams(keys.gap)} bind:value={formData[keys.gap]} />

				<ValibotField
					id={prefixed('end')}
					name="end"
					label="End"
					tag="input"
					type="number"
					bind:value={formData.end}
				/>

				<ValibotField
					id={prefixed(keys.duration)}
					name={keys.duration}
					label="Duration"
					tag="input"
					type="number"
					bind:value={formData[keys.duration]}
				/>

				<button class={buttonVariants()}>Apply</button>
			</ValibotForm>
		</KKISEDialog.Content>
	</Dialog.Portal>
</Dialog.Root>
