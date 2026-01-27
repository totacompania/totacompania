"use client";

interface ZigzagSeparatorProps {
  topColor?: string;
  bottomColor?: string;
  flip?: boolean;
  className?: string;
  teeth?: number;
  height?: number;
}

export default function ZigzagSeparator({
  topColor = "var(--brand-violet)",
  bottomColor = "var(--brand-violet-light)",
  flip = false,
  className = "",
  teeth = 12,
  height = 40
}: ZigzagSeparatorProps) {
  const generateZigzagPath = (width: number, h: number, numTeeth: number) => {
    const toothWidth = width / numTeeth;
    let path = `M0,0`;
    path += ` L${width},0`;
    path += ` L${width},${h}`;
    for (let i = numTeeth; i > 0; i--) {
      const x1 = i * toothWidth - toothWidth / 2;
      const x2 = (i - 1) * toothWidth;
      path += ` L${x1},${h * 2} L${x2},${h}`;
    }
    path += ` Z`;
    return path;
  };

  const viewBoxHeight = height * 2 + 10;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        background: bottomColor,
        marginTop: flip ? "-1px" : "0",
        marginBottom: "-1px"
      }}
    >
      <svg
        viewBox={`0 0 1200 ${viewBoxHeight}`}
        fill="none"
        preserveAspectRatio="none"
        className={`w-full block ${flip ? "rotate-180" : ""}`}
        style={{ height: "clamp(30px, 5vw, 50px)" }}
      >
        <path
          d={generateZigzagPath(1200, height, teeth)}
          fill={topColor}
        />
      </svg>
    </div>
  );
}
