type Props = {
  onAddShape: (type: "star" | "rect" | "circle") => void;
};

export default function Toolbar({ onAddShape }: Props) {
  return (
    <div style={{ position: "absolute", top: 10, left: 10 }}>
      <button onClick={() => onAddShape("star")}>Star</button>
      <button onClick={() => onAddShape("rect")}>Rect</button>
      <button onClick={() => onAddShape("circle")}>Circle</button>
    </div>
  );
}
