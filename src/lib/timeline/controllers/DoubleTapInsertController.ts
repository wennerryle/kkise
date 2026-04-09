import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { lookupAttribute, magicAttributes } from '$lib/core/magic-attributes';
import { DoubleTapInsertCommand } from '../commands/DoubleTapInsertCommand';

export class DoubleTapInsertController {
	#ctx: TimelineContext;

	constructor(context: TimelineContext) {
		this.#ctx = context;
	}

	#command: DoubleTapInsertCommand | null = null;

	readonly handlers: HTMLAttributes<HTMLElement> = {
		ondblclick: (event) => {
			if (event.target !== event.currentTarget) return;

			const trackId = lookupAttribute(event.currentTarget, magicAttributes.trackId);

			if (trackId === null) {
				throw new Error(`Failed attribute lookup ${magicAttributes.trackId}`);
			}

			const mouseX = event.clientX - event.currentTarget.getBoundingClientRect().left;
			const timeMs = (this.#ctx.viewport.scrollLeft + mouseX) / this.#ctx.viewport.pixelsPerMs;

			this.#command = new DoubleTapInsertCommand(this.#ctx, { timeMs, trackId });

			this.#ctx.historyRepository.execute(this.#command);
		}
	};
}
