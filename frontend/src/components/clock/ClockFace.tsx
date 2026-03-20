"use client";

interface Props {
  hour: number;     // 1–12
  minutes: number;  // 0 or 30
  size?: number;
}

export default function ClockFace({ hour, minutes, size = 200 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 8;

  // Minute hand angle: 0 min = -90°, 30 min = 90°
  const minAngle  = (minutes / 60) * 360 - 90;
  const minRad    = (minAngle * Math.PI) / 180;
  const minLen    = r * 0.75;
  const minX      = cx + Math.cos(minRad) * minLen;
  const minY      = cy + Math.sin(minRad) * minLen;

  // Hour hand: each hour = 30°, plus 15° for half past
  const hourAngle = (hour % 12) * 30 + (minutes === 30 ? 15 : 0) - 90;
  const hourRad   = (hourAngle * Math.PI) / 180;
  const hourLen   = r * 0.5;
  const hourX     = cx + Math.cos(hourRad) * hourLen;
  const hourY     = cy + Math.sin(hourRad) * hourLen;

  // Hour number positions
  const nums = Array.from({ length: 12 }, (_, i) => {
    const n    = i + 1;
    const ang  = (n * 30 - 90) * (Math.PI / 180);
    const nr   = r * 0.78;
    return { n, x: cx + Math.cos(ang) * nr, y: cy + Math.sin(ang) * nr };
  });

  // Minute tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a   = (i * 6 - 90) * (Math.PI / 180);
    const r1  = r * 0.92;
    const r2  = i % 5 === 0 ? r * 0.82 : r * 0.88;
    return {
      x1: cx + Math.cos(a) * r1, y1: cy + Math.sin(a) * r1,
      x2: cx + Math.cos(a) * r2, y2: cy + Math.sin(a) * r2,
      major: i % 5 === 0,
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#e2e8f0" strokeWidth={3} />

      {/* Ticks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.major ? "#64748b" : "#cbd5e1"} strokeWidth={t.major ? 2 : 1} />
      ))}

      {/* Numbers */}
      {nums.map(({ n, x, y }) => (
        <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fontSize={size * 0.09} fontWeight="bold" fill="#1e293b">{n}</text>
      ))}

      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hourX} y2={hourY}
        stroke="#1e293b" strokeWidth={size * 0.04} strokeLinecap="round" />

      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={minX} y2={minY}
        stroke="#6366f1" strokeWidth={size * 0.025} strokeLinecap="round" />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={size * 0.04} fill="#6366f1" />
    </svg>
  );
}
