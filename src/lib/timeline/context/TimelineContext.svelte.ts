import { HistoryRepository } from '../state/HistoryRepository.svelte';
import { InsertIntervalService } from '../services/InsertIntervalService';
import { TimelineLayoutService } from '../services/TimelineLayoutService';
import { Dialog } from '../state/Dialog.svelte';
import { IntervalRepository } from '../state/IntervalRepository.svelte';
import { Player } from '../state/Player.svelte';
import { TrackRepository } from '../state/TrackRepository.svelte';
import { Viewport } from '../state/Viewport.svelte';

export class TimelineContext {
	readonly dialog = new Dialog();

	readonly player = new Player();
	readonly viewport = new Viewport();

	readonly historyRepository = new HistoryRepository();
	readonly trackRepository = new TrackRepository();
	readonly intervalRepository = new IntervalRepository();

	readonly timelineLayoutService: TimelineLayoutService;
	readonly insertIntervalService: InsertIntervalService;

	constructor() {
		this.timelineLayoutService = new TimelineLayoutService(
			this.trackRepository,
			this.intervalRepository
		);

		this.insertIntervalService = new InsertIntervalService(this);

		// @ts-expect-error for debug
		window.ctx = this;
	}
}
