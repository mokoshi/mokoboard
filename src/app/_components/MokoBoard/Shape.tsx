import { Rect } from "react-konva";
import { useShape } from "./jotai/shapes";
import { useCallback } from "react";
import Konva from "konva";
import debounce from "debounce";
import { useMemo } from "react";
import { useTransformer } from "./jotai/transformer";

type Props = {
  id: string;
};

export function Shape({ id }: Props) {
  const {
    isSelected,
    setSelectedNodes,
    removeSelectedNodes,
    addSelectedNodes,
  } = useTransformer();
  const [shape, setShape] = useShape(id);
  console.log("shape rendered", id);

  const handleDrag = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      setShape((p) => ({ ...p, x: e.target.x(), y: e.target.y() }));
    },
    [setShape]
  );
  const handleTransform = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      setShape((p) => ({
        ...p,
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      }));
    },
    [setShape]
  );
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const selected = isSelected(e.target);
      if (metaPressed || selected) {
        return;
      }
      setSelectedNodes([e.target]);
    },
    [isSelected, setSelectedNodes]
  );
  const handleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const selected = isSelected(e.target);
      if (!metaPressed && !selected) {
        setSelectedNodes([e.target]);
      } else if (metaPressed && selected) {
        removeSelectedNodes([e.target]);
      } else if (metaPressed && !selected) {
        addSelectedNodes([e.target]);
      }
    },
    [addSelectedNodes, isSelected, removeSelectedNodes, setSelectedNodes]
  );

  const handleDragDebounced = useMemo(
    () => debounce(handleDrag, 10),
    [handleDrag]
  );
  const handleTransformDebounced = useMemo(
    () => debounce(handleTransform, 10),
    [handleTransform]
  );

  return (
    <Rect
      {...shape}
      fill="#89b717"
      opacity={0.8}
      draggable
      shadowColor="black"
      shadowBlur={10}
      shadowOpacity={0.6}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDragEnd={handleDrag}
      onDragMove={handleDragDebounced}
      onTransform={handleTransformDebounced}
      onTransformEnd={handleTransform}
      _useStrictMode
    />
  );
}
