import { createStore } from "jotai";
import { jtShapeMap } from "./shapes";

export const store = createStore();

store.set(jtShapeMap, {});
