const KINDS = ['events', 'programs', 'posts', 'media', 'messages'];

/* The rows come back from getAdminActivity() as month × kind counts; every chart
   on the dashboard reads the same shape, so the pivot lives here once. */
export function shapeActivity(rows) {
  const months = [...new Set(rows.map((row) => row.month))].sort();
  const byKind = Object.fromEntries(
    KINDS.map((kind) => [
      kind,
      months.map((month) => rows.find((row) => row.month === month && row.kind === kind)?.n ?? 0),
    ]),
  );
  return { months, byKind };
}

export function monthLabel(month) {
  return new Date(`${month}-01T12:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    timeZone: 'UTC',
  });
}

/* This month against the one before it — the only comparison the data supports. */
export function monthDelta(values) {
  const current = values.at(-1) ?? 0;
  const previous = values.at(-2) ?? 0;
  return { current, previous, diff: current - previous };
}

const niceMax = (max) => (max <= 4 ? 4 : Math.ceil(max / 4) * 4);

export function ActivityChart({ months, byKind, series }) {
  const width = 660;
  const height = 236;
  const axis = { left: 30, right: 6, top: 12, bottom: 26 };
  const plotW = width - axis.left - axis.right;
  const plotH = height - axis.top - axis.bottom;
  const max = niceMax(Math.max(...series.flatMap((item) => byKind[item.key]), 1));
  const group = plotW / months.length;
  const barWidth = Math.min(14, (group - 14) / series.length);
  const ticks = [0, 0.5, 1].map((ratio) => ({ value: Math.round(max * ratio), y: axis.top + plotH * (1 - ratio) }));

  return (
    <svg className="admin-chart" viewBox={`0 0 ${width} ${height}`} role="img">
      <title>Items added per month over the last six months</title>

      {ticks.map((tick) => (
        <g key={tick.value}>
          <line className="admin-chart-grid" x1={axis.left} x2={width - axis.right} y1={tick.y} y2={tick.y} />
          <text className="admin-chart-tick" x={axis.left - 8} y={tick.y + 4} textAnchor="end">
            {tick.value}
          </text>
        </g>
      ))}

      {months.map((month, monthIndex) => (
        <g key={month} transform={`translate(${axis.left + group * monthIndex}, 0)`}>
          {series.map((item, seriesIndex) => {
            const value = byKind[item.key][monthIndex];
            const barHeight = value ? Math.max(3, (value / max) * plotH) : 0;
            const x = group / 2 - (series.length * barWidth - (series.length - 1) * 4) / 2 + seriesIndex * (barWidth + 4);
            return (
              <rect
                key={item.key}
                className={`admin-chart-bar series-${item.key}`}
                x={x}
                y={axis.top + plotH - barHeight}
                width={barWidth}
                height={barHeight}
                rx={3}
              />
            );
          })}
          <text className="admin-chart-tick" x={group / 2} y={height - 8} textAnchor="middle">
            {monthLabel(month)}
          </text>
        </g>
      ))}
    </svg>
  );
}
