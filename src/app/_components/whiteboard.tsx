"use client";

import { useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

type Item =
  | {
      id: string;
      type: "shape";
      position: { x: number; y: number; w: number; h: number };
    }
  | {
      id: string;
      type: "code";
      position: { x: number; y: number; w: number; h: number };
    };

const yDoc = new Y.Doc();
const yRoot = yDoc.getMap<Item>("root");
const yCode = yDoc.getMap<Y.Text>("code");

function renderAll() {
  const jsx: React.ReactNode[] = [];
  yRoot.forEach((item) => {
    switch (item.type) {
      case "shape": {
        jsx.push(
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: item.position.x,
              top: item.position.y,
              width: item.position.w,
              height: item.position.h,
              border: "1px solid #aef",
              overflow: "hidden",
            }}
          >
            {item.id}
          </div>
        );
        break;
      }
      case "code": {
        const text = yCode.get(item.id);
        if (text) {
          jsx.push(
            <div
              key={item.id}
              style={{
                position: "absolute",
                left: item.position.x,
                top: item.position.y,
                width: item.position.w,
                height: item.position.h,
                border: "1px solid #cfa",
                overflow: "hidden",
              }}
            >
              <textarea
                style={{ width: "100%", height: "100%", color: "black" }}
                onChange={(_) => {
                  text.insert(0, "1");
                }}
                value={text.toString()}
              />
            </div>
          );
        }
      }
    }
  });
  return jsx;
}

export function Whiteboard() {
  const [renderCount, setRenderCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    setCtx(ctx ?? null);

    const websocketProvider = new WebsocketProvider(
      "ws://localhost:1234",
      "whiteboard",
      yDoc
    );
    yRoot.observe((e) => {
      console.log("keysChanged", e.keysChanged);
      console.log("keysChanged", e.changes.keys);
      setRenderCount((prev) => prev + 1);
    });
  }, []);

  function addShape() {
    const id = `child-${Math.random()}`;
    yRoot.set(id, {
      id,
      type: "shape",
      position: {
        x: Math.floor(Math.random() * 200),
        y: Math.floor(Math.random() * 200),
        w: 50,
        h: 50,
      },
    });
  }
  function addCode() {
    const id = `child-${Math.random()}`;
    yCode.set(id, yDoc.getText());
    yRoot.set(id, {
      id,
      type: "code",
      position: {
        x: Math.floor(Math.random() * 200),
        y: Math.floor(Math.random() * 200),
        w: 50,
        h: 50,
      },
    });
  }

  return (
    <div>
      <button onClick={addShape}>shape追加</button>
      <button onClick={addCode}>code追加</button>
      <button onClick={() => yRoot.clear()}>clear</button>
      {/* <code>{JSON.stringify(yRoot.toJSON(), null, 2)}</code> */}
      {/* <canvas ref={canvasRef} width={400} height={400}></canvas> */}
      <div style={{ position: "relative", width: 400, height: 400 }}>
        {renderAll()}
      </div>
    </div>
  );
}
