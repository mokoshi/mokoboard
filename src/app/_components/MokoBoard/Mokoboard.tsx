"use client";

import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Stage, Layer, Text, Transformer, Rect } from "react-konva";
import SelectionRect, { SelectionRectRef } from "./SelectionRect";
import Konva from "konva";
import Toolbar from "./Toolbar";
import { Provider, useAtom, useAtomValue, useSetAtom } from "jotai";
import { jtAddShape, jtShapeIds, jtShapeMap, useShapes } from "./jotai/shapes";
import { useKonvaRefs } from "./jotai/refs";
import { Shape } from "./Shape";
import { useTransformer } from "./jotai/transformer";

function generateShape() {
  return {
    id: (Math.random() * 10000).toFixed(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    width: 100,
    height: 100,
    isSelected: false,
  };
}

export default function MokoBoard() {
  const konvaRefs = useKonvaRefs();
  const { ref: transformerRef, setSelectedNodes } = useTransformer();
  const selectionRectRef = useRef<SelectionRectRef>(null);
  const shapeIds = useAtomValue(jtShapeIds);
  const addShape = useSetAtom(jtAddShape);
  const [renderCount, setRenderCount] = useState(0);

  const handleStageMouseDown: ComponentProps<typeof Stage>["onMouseDown"] = (
    e
  ) => {
    e.evt.preventDefault();
    if (e.target === konvaRefs.stage.current) {
      selectionRectRef.current?.startSelection(e.evt.x, e.evt.y);
    }
  };
  const handleStageMouseMove: ComponentProps<typeof Stage>["onMouseDown"] = (
    e
  ) => {
    e.evt.preventDefault();
    selectionRectRef.current?.captureSelection(e.evt.x, e.evt.y);
  };
  const handleStageMouseUp: ComponentProps<typeof Stage>["onMouseDown"] = (
    e
  ) => {
    e.evt.preventDefault();
    selectionRectRef.current?.endSelection();
  };
  const handleStageClick: ComponentProps<typeof Stage>["onClick"] = (e) => {
    e.evt.preventDefault();
  };

  const handleAddShape = useCallback(() => {
    addShape(generateShape());
  }, [addShape]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRenderCount((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Stage
        ref={konvaRefs.stage}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onClick={handleStageClick}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer>
          <Text text="Try to drag a star" />
          <SelectionRect
            ref={selectionRectRef}
            onSelectionEnd={(rect) => {
              const intersectedShapes = shapeIds
                .map((id) => konvaRefs.stage.current?.findOne(`#${id}`))
                .filter(
                  (s): s is Konva.Rect =>
                    !!s && Konva.Util.haveIntersection(s.getClientRect(), rect)
                );
              setSelectedNodes(intersectedShapes);
            }}
          />
          <Transformer
            ref={transformerRef}
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          {shapeIds.map((id) => (
            <Shape key={id} id={id} />
          ))}
        </Layer>
      </Stage>
      <Toolbar onAddShape={handleAddShape} />
      <div style={{ position: "fixed", top: 0, right: 0 }}>{renderCount}</div>
    </>
  );
}
