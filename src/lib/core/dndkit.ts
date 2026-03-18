/* eslint-disable no-restricted-imports */

import {
    createDraggable as externalCreateDraggable,
    createDroppable as externalCreateDroppable,
    type CreateDroppableInput,
    type DragDropEventHandlers,
} from "@dnd-kit/svelte";
import { createSortable as externalCreateSortable } from "@dnd-kit/svelte/sortable";

export interface IntervalDroppableData {
    tag: "interval";
    trackId: string;
}

export interface TrackDroppableData {
    tag: "track";
    trackId: string;
}

export type DnDData = IntervalDroppableData | TrackDroppableData;

export type DnDEvents = Required<DragDropEventHandlers<DnDData>>;

type DnDType = DnDData["tag"];

interface DraggableOptions<T extends DnDType> {
    id: string;
    data: Extract<DnDData, { tag: T }>;
}

interface SortableOptions<T extends DnDType> {
    id: string;
    data: Extract<DnDData, { tag: T }>;
    index: number;
}

export const createDraggable = <T extends DnDType>(
    options: DraggableOptions<T>,
) => externalCreateDraggable(options);

export const createSortable = <T extends DnDType>(
    options: SortableOptions<T>,
) => externalCreateSortable(options);

interface DroppableOptions<T extends DnDType> extends CreateDroppableInput {
    data: Extract<DnDData, { tag: T }>;
}

export const createDroppable = <T extends DnDType>(
    options: DroppableOptions<T>,
) => externalCreateDroppable(options);
