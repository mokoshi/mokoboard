import { SetStateAction } from "jotai";
import { atom, useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import React from "react";
import { useCallback } from "react";

const atomTransformerRef = atom<
  React.MutableRefObject<Konva.Transformer | null>
>(React.createRef<Konva.Transformer>());

type _Nodes = { [id: string]: Konva.Node };
const _atomTransformerNodes = atom<_Nodes>({});
const atomTransformerNodes = atom(
  (get) => get(_atomTransformerNodes),
  (get, set, update: _Nodes | SetStateAction<_Nodes>) => {
    const trRef = get(atomTransformerRef).current;
    if (trRef) {
      trRef.nodes(Object.values(update));
    }
    set(_atomTransformerNodes, update);
  }
);

function toMap(nodes: Konva.Node[]) {
  return nodes.reduce((acc, node) => ({ ...acc, [node.id()]: node }), {});
}

export function useTransformer() {
  const ref = useAtomValue(atomTransformerRef);
  const [nodes, setNodes] = useAtom(atomTransformerNodes);

  const isSelected = useCallback(
    (node: Konva.Node) => !!nodes[node.id()],
    [nodes]
  );
  const addSelectedNodes = useCallback(
    (nodes: Konva.Node[]) => {
      setNodes((prev) => ({ ...prev, ...toMap(nodes) }));
    },
    [setNodes]
  );
  const removeSelectedNodes = useCallback(
    (nodes: Konva.Node[]) => {
      setNodes((prev) => {
        const next = { ...prev };
        nodes.forEach((node) => {
          delete next[node.id()];
        });
        return next;
      });
    },
    [setNodes]
  );
  const setSelectedNodes = useCallback(
    (nodes: Konva.Node[]) => {
      setNodes(toMap(nodes));
    },
    [setNodes]
  );

  return {
    ref,
    isSelected,
    addSelectedNodes,
    removeSelectedNodes,
    setSelectedNodes,
  };
}
