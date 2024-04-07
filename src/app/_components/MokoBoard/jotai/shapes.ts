import { atom, useAtom, useStore } from "jotai";
import { useCallback, useMemo } from "react";
import { atomFamily, selectAtom } from "jotai/utils";
import { focusAtom } from "jotai-optics";

export type Shape = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  isSelected: boolean;
};

export const jtShapeMap = atom<{ [id: string]: Shape }>({});
export const jtShapeIds = selectAtom(
  jtShapeMap,
  (shapeMap) => Object.keys(shapeMap),
  // うーん、deepEquals を使わないと、各 shape のデータを更新したときに、
  // id の配列は変化ないのに、全体のレンダリングが走ってしまう
  // もちょっといい感じの jotai の設計があるのかな？
  (a, b) => a.toString() === b.toString()
);
export const jtAddShape = atom(null, (get, set, shape: Shape) => {
  set(jtShapeMap, { ...get(jtShapeMap), [shape.id]: shape });
});
// export const jtShape = atomFamily((id: string) =>
//   atom(
//     (get) => get(jtShapeMap)[id],
//     (get, set, arg: Partial<Shape>) => {
//       const prev = get(jtShapeMap);
//       set(jtShapeMap, { ...prev, [id]: { ...prev[id], ...arg } });
//     }
//   )
// );
export const jtShape = atomFamily((id: string) =>
  focusAtom(jtShapeMap, (optic) => optic.prop(id))
);

export function useShapes() {
  const [shapeMap, setShapeMap] = useAtom(jtShapeMap);
  const shapes = useMemo(() => Object.values(shapeMap), [shapeMap]);
  const addShape = useCallback(
    (shape: Shape) => {
      setShapeMap((prev) => {
        return { ...prev, [shape.id]: shape };
      });
    },
    [setShapeMap]
  );
  return [shapes, addShape] as const;
}

export function useShape(id: string) {
  return useAtom(jtShape(id));
}
