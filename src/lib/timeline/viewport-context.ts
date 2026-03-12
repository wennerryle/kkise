import { type Viewport } from "./core/Viewport.svelte.ts";
import { createContext } from "svelte";

export const [getViewportContext, setViewportContext] = createContext<
    Viewport
>();
