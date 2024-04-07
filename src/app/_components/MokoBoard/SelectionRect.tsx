import { IRect } from "konva/lib/types";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Rect } from "react-konva";

export type SelectionRectRef = {
  startSelection: (x: number, y: number) => void;
  captureSelection: (x: number, y: number) => void;
  endSelection: () => void;
};

type Props = {
  onSelectionEnd(rect: IRect): void;
};

const SelectionRect = forwardRef<SelectionRectRef, Props>(
  function SelectionRect({ onSelectionEnd }, ref) {
    const [pos, setPos] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
    const [isSelecting, setIsSelecting] = useState(false);
    const { x, y, width, height } = useMemo(() => {
      const x = Math.min(pos.x1, pos.x2);
      const y = Math.min(pos.y1, pos.y2);
      const width = Math.abs(pos.x2 - pos.x1);
      const height = Math.abs(pos.y2 - pos.y1);
      return { x, y, width, height };
    }, [pos]);

    useImperativeHandle(ref, () => ({
      startSelection(x: number, y: number) {
        setIsSelecting(true);
        setPos({ x1: x, y1: y, x2: x, y2: y });
      },
      captureSelection(x: number, y: number) {
        if (!isSelecting) {
          return;
        }
        setPos((p) => ({ ...p, x2: x, y2: y }));
      },
      endSelection() {
        if (!isSelecting) {
          return;
        }
        setIsSelecting(false);
        onSelectionEnd({ x, y, width, height });
      },
    }));

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        visible={isSelecting}
        fill="#edd422"
      />
    );
  }
);

export default SelectionRect;
