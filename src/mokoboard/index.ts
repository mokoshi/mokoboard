import * as Y from "yjs";

export type MokoObjectType = "rect" | "circle";
export type MokoObject =
  | {
      _type: "rect";
      id: string;
      rect: {
        x: number;
        y: number;
        w: number;
        h: number;
      };
    }
  | {
      _type: "circle";
      id: string;
      rect: {
        x: number;
        y: number;
        w: number;
        h: number;
      };
    };

export class MokoBoard {
  private objects;

  constructor(yDoc: Y.Doc) {
    this.objects = yDoc.getArray<MokoObject>("objects");
  }

  add(obj: MokoObject) {
    this.objects.push(obj);
  }
}
