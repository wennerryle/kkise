type PlaybackStatus = 'playing' | 'paused' | 'stopped';

export class Player {
	/** Total duration in ms */
	totalDurationMs = $state(900 * 1000);

	status: PlaybackStatus = $state('stopped');
}
