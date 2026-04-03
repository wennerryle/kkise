import { MIN_INTERVAL_DURATION } from '$lib/timeline/services/TimelineLayoutService';
import type { InsertManyOptions } from '$lib/timeline/services/InsertIntervalService';
import * as v from 'valibot';

export const keys = Object.freeze({
	trackId: 'trackId',
	offset: 'offset',
	gap: 'gap',
	amount: 'amount',
	duration: 'duration'
}) satisfies Record<keyof InsertManyOptions, keyof InsertManyOptions>;

export const schema = v.object({
	[keys.trackId]: v.pipe(v.string(), v.nonEmpty()),
	[keys.offset]: v.pipe(v.number(), v.minValue(0)),
	[keys.gap]: v.pipe(v.number(), v.minValue(0)),
	[keys.amount]: v.pipe(v.number(), v.minValue(1)),
	[keys.duration]: v.pipe(v.number(), v.minValue(MIN_INTERVAL_DURATION))
});
