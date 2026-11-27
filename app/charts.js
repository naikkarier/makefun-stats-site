// StatAtlas charts: small SVG charts drawn from data, no library.
// Every chart is a string of SVG markup so views can drop it into the page.

// Horizontal bars, one row per item: label on the left, bar, value on the right.
export function barChart(items, options) {
  const opts = options || {};
  const width = opts.width || 640;
  const rowHeight = opts.rowHeight || 34;
  const labelWidth = opts.labelWidth || 110;
  const max = Math.max.apply(null, items.map((item) => item.value));
  const height = items.length * rowHeight + 8;
  const barMax = width - labelWidth - 90;
  let rows = '';
  items.forEach((item, i) => {
    const y = 8 + i * rowHeight;
    const barWidth = Math.max(2, Math.round((item.value / max) * barMax));
    rows += '<g>'
      + '<text x="0" y="' + (y + 15) + '" class="chart-label">' + item.label + '</text>'
      + '<rect x="' + labelWidth + '" y="' + y + '" width="' + barWidth + '" height="20" rx="4" fill="' + (item.color || '#2563eb') + '"></rect>'
      + '<text x="' + (labelWidth + barWidth + 8) + '" y="' + (y + 15) + '" class="chart-value">' + item.text + '</text>'
      + '</g>';
  });
  return '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" role="img" aria-label="Bar chart">'
    + rows + '</svg>';
}

// Line chart for a yearly series: points joined, dots on each year, year labels below.
export function lineChart(years, values, options) {
  const opts = options || {};
  const width = opts.width || 640;
  const height = opts.height || 220;
  const padLeft = 52;
  const padRight = 16;
  const padTop = 14;
  const padBottom = 30;
  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);
  const span = (max - min) || 1;
  const low = min - span * 0.15;
  const high = max + span * 0.15;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;
  function x(i) { return padLeft + (i / (values.length - 1)) * innerW; }
  function y(v) { return padTop + (1 - (v - low) / (high - low)) * innerH; }
  let points = '';
  values.forEach((v, i) => {
    points += (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(v).toFixed(1);
  });
  let dots = '';
  let labels = '';
  values.forEach((v, i) => {
    dots += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4" fill="#2563eb"></circle>';
    labels += '<text x="' + x(i).toFixed(1) + '" y="' + (height - 8) + '" class="chart-label chart-center">' + years[i] + '</text>';
    if (i === 0 || i === values.length - 1) {
      labels += '<text x="' + x(i).toFixed(1) + '" y="' + (y(v) - 10).toFixed(1) + '" class="chart-value chart-center">' + v.toFixed(1) + '</text>';
    }
  });
  const mid = (low + high) / 2;
  return '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" role="img" aria-label="Line chart">'
    + '<line x1="' + padLeft + '" y1="' + y(mid).toFixed(1) + '" x2="' + (width - padRight) + '" y2="' + y(mid).toFixed(1) + '" class="chart-grid"></line>'
    + '<path d="' + points + '" fill="none" stroke="#2563eb" stroke-width="2.5"></path>'
    + dots + labels + '</svg>';
}

// Grouped bars for comparing two countries on the same indicators, values normalised to 0-100.
export function compareBars(rows) {
  const width = 640;
  const rowHeight = 44;
  const labelWidth = 150;
  const height = rows.length * rowHeight + 8;
  const barMax = width - labelWidth - 140;
  let out = '';
  rows.forEach((row, i) => {
    const y = 8 + i * rowHeight;
    const wA = Math.max(2, Math.round((row.a / 100) * barMax));
    const wB = Math.max(2, Math.round((row.b / 100) * barMax));
    out += '<g>'
      + '<text x="0" y="' + (y + 10) + '" class="chart-label">' + row.label + '</text>'
      + '<rect x="' + labelWidth + '" y="' + y + '" width="' + wA + '" height="12" rx="3" fill="#2563eb"></rect>'
      + '<text x="' + (labelWidth + wA + 6) + '" y="' + (y + 11) + '" class="chart-value">' + row.aText + '</text>'
      + '<rect x="' + labelWidth + '" y="' + (y + 16) + '" width="' + wB + '" height="12" rx="3" fill="#f59e0b"></rect>'
      + '<text x="' + (labelWidth + wB + 6) + '" y="' + (y + 27) + '" class="chart-value">' + row.bText + '</text>'
      + '</g>';
  });
  return '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" role="img" aria-label="Comparison chart">'
    + out + '</svg>';
}
