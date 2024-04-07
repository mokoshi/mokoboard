"use client";

import dynamic from "next/dynamic";

const _MokoBoard = dynamic(() => import("./Mokoboard"), { ssr: false });

export default function MokoBoard() {
  return <_MokoBoard />;
}
