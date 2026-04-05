type PlaybackStatus = 'playing' | 'paused' | 'stopped';

export class Player {
	/** Total duration in ms */
	totalDuration = $state(60 * 1000);

	status: PlaybackStatus = $state('stopped');
}
