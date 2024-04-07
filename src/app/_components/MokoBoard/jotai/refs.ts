import { atom, useAtom } from "jotai";
import Konva from "konva";
import React from "react";

export const jtRefs = atom<{
  stage: React.MutableRefObject<Konva.Stage | null>;
  transformer: React.MutableRefObject<Konva.Transformer | null>;
}>({
  stage: React.createRef<Konva.Stage>(),
  transformer: React.createRef<Konva.Transformer>(),
});

export function useKonvaRefs() {
  return useAtom(jtRefs)[0];
}
