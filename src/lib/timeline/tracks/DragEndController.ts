import {
    type DnDData,
    type DnDEvents,
    type IntervalDroppableData,
    type TrackDroppableData,
} from "$lib/core/dndkit";
import { move } from "@dnd-kit/helpers";
import type {
    IntervalRepository,
    TrackRepository,
} from "../repos/Repositories.svelte";

import { detectIntervalToTracksMovingCollision } from "./CollisionManager";

export class DragEndController {
    trackRepo: TrackRepository;
    intervalRepo: IntervalRepository;

    constructor(trackRepo: TrackRepository, intervalRepo: IntervalRepository) {
        this.trackRepo = trackRepo;
        this.intervalRepo = intervalRepo;
    }

    onDragEnd: DnDEvents["onDragEnd"] = (event, manager) => {
        const sourceId = event.operation.source?.id as string;
        const targetId = event.operation.target?.id as string;

        if (sourceId === targetId) return;

        const sourceData = event.operation.source?.data as DnDData | undefined;
        const targetData = event.operation.target?.data as DnDData | undefined;

        if (!sourceData || !targetData) return;

        if (sourceData.tag === "track" && targetData.tag === "track") {
            this.handleTracksMove(event, manager);
            return;
        }

        if (sourceData.tag === "interval" && targetData.tag === "track") {
            this.handleIntervalsMoveAcrossTracks(
                sourceData,
                targetData,
                sourceId,
            );
            return;
        }
    };

    handleTracksMove: DnDEvents["onDragEnd"] = (event) => {
        this.trackRepo.tracksIds = move(this.trackRepo.tracksIds, event);
    };

    handleIntervalsMoveAcrossTracks = (
        sourceDataTrack: IntervalDroppableData,
        targetDataTrack: TrackDroppableData,
        intervalId: string,
    ) => {
        if (sourceDataTrack.trackId === targetDataTrack.trackId) return;

        const sourceTrack = this.trackRepo.tracks.get(sourceDataTrack.trackId)!;
        const targetTrack = this.trackRepo.tracks.get(targetDataTrack.trackId)!;

        if (
            detectIntervalToTracksMovingCollision(
                this.intervalRepo,
                targetTrack,
                intervalId,
            )
        ) {
            return;
        }

        sourceTrack.intervals = sourceTrack.intervals.filter((it) =>
            it !== intervalId
        );

        targetTrack.intervals.push(intervalId);
    };
}
