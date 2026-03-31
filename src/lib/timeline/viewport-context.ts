import { type Viewport } from "./state/Viewport.svelte.ts";
import { createContext } from "svelte";

export const [getViewportContext, setViewportContext] = createContext<
    Viewport
>();
