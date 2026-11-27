// StatAtlas views: each route renders into #app. Hash routes only, no server needed.
import { COUNTRIES, REGIONS, SOURCES, YEARS, byCode, density, fmtMillions, fmtBillions, fmtDollars, fmtKm2, fmtYears } from './data.js';
import { barChart, lineChart, compareBars } from './charts.js';

const SORTS = [
  { key: 'population', label: 'Population' },
  { key: 'gdp', label: 'GDP' },
  { key: 'gdpPerCapita', label: 'GDP per capita' },
  { key: 'area', label: 'Area' },
  { key: 'lifeExpectancy', label: 'Life expectancy' },
  { key: 'name', label: 'Name A to Z' },
];

let homeState = { query: '', region: 'All', sort: 'population' };
let compareState = { a: 'IDN', b: 'IND' };

function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function statCard(label, value, note) {
  return '<div class="stat-card"><div class="stat-label">' + label + '</div>'
    + '<div class="stat-value">' + value + '</div>'
    + '<div class="stat-note">' + note + '</div></div>';
}

function countryLink(code, name) {
  return '<a href="#/country/' + code + '">' + escapeHtml(name) + '</a>';
}

function homeView() {
  const featured = byCode('IDN');
  const query = homeState.query.trim().toLowerCase();
  let list = COUNTRIES.filter((c) => (homeState.region === 'All' || c.region === homeState.region)
    && (!query || c.name.toLowerCase().includes(query)));
  const sortKey = homeState.sort;
  list = list.slice().sort((a, b) => {
    if (sortKey === 'name') return a.name.localeCompare(b.name);
    return b[sortKey] - a[sortKey];
  });
  const top = COUNTRIES.slice().sort((a, b) => b.population - a.population).slice(0, 8);
  const bars = barChart(top.map((c) => ({ label: c.name, value: c.population, text: fmtMillions(c.population) })));
  let rows = '';
  list.forEach((c, i) => {
    rows += '<tr><td>' + (i + 1) + '</td><td>' + countryLink(c.code, c.name) + '</td><td>' + c.region + '</td>'
      + '<td class="num">' + fmtMillions(c.population) + '</td>'
      + '<td class="num">' + fmtBillions(c.gdp) + '</td>'
      + '<td class="num">' + fmtDollars(c.gdpPerCapita) + '</td>'
      + '<td class="num">' + fmtKm2(c.area) + '</td>'
      + '<td class="num">' + fmtYears(c.lifeExpectancy) + '</td></tr>';
  });
  if (!list.length) rows = '<tr><td colspan="8">No country matches that search.</td></tr>';
  const regionOptions = REGIONS.map((r) => '<option value="' + r + '"' + (homeState.region === r ? ' selected' : '') + '>' + (r === 'All' ? 'All regions' : r) + '</option>').join('');
  const sortOptions = SORTS.map((s) => '<option value="' + s.key + '"' + (homeState.sort === s.key ? ' selected' : '') + '>' + s.label + '</option>').join('');
  return '<section class="hero"><h1>National statistics, explored.</h1>'
    + '<p>Population, GDP, area and life expectancy for 16 countries, with the source and year of every figure. Search, sort and open any country for its full profile.</p></section>'
    + '<section class="featured"><h2>Featured country: Indonesia</h2><div class="stat-grid">'
    + statCard('Population', fmtMillions(featured.population), SOURCES.population.label + ', ' + SOURCES.population.year)
    + statCard('GDP', fmtBillions(featured.gdp), SOURCES.gdp.label + ', ' + SOURCES.gdp.year)
    + statCard('GDP per capita', fmtDollars(featured.gdpPerCapita), SOURCES.gdpPerCapita.label + ', ' + SOURCES.gdpPerCapita.year)
    + statCard('Life expectancy', fmtYears(featured.lifeExpectancy), SOURCES.lifeExpectancy.label + ', ' + SOURCES.lifeExpectancy.year)
    + '</div><p><a href="#/country/IDN">Open the Indonesia profile</a> &middot; <a href="#/compare">Compare two countries</a></p></section>'
    + '<section class="panel"><h2>Largest populations</h2>' + bars
    + '<p class="note">Population in millions, UN World Population Prospects 2024.</p></section>'
    + '<section class="panel"><h2>All countries</h2>'
    + '<div class="controls"><label>Search <input id="q" type="search" value="' + escapeHtml(homeState.query) + '" placeholder="Type a country name"></label>'
    + '<label>Region <select id="region">' + regionOptions + '</select></label>'
    + '<label>Sort by <select id="sort">' + sortOptions + '</select></label></div>'
    + '<p class="count">' + list.length + ' of ' + COUNTRIES.length + ' countries shown.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>#</th><th>Country</th><th>Region</th><th>Population</th><th>GDP</th><th>GDP per capita</th><th>Area</th><th>Life expectancy</th></tr></thead><tbody>'
    + rows + '</tbody></table></div>'
    + '<p class="note">Population 2024 (UN); GDP and GDP per capita 2023 (World Bank); area and life expectancy 2023 (World Bank). Figures rounded.</p></section>';
}

function countryView(code) {
  const c = byCode(code);
  if (!c) return '<section class="panel"><h1>Country not found</h1><p><a href="#/">Back to all countries</a></p></section>';
  const peers = COUNTRIES.filter((x) => x.region === c.region && x.code !== c.code).slice(0, 3);
  const rows = [
    ['Population', fmtMillions(c.population), SOURCES.population.year, SOURCES.population.label],
    ['GDP', fmtBillions(c.gdp), SOURCES.gdp.year, SOURCES.gdp.label],
    ['GDP per capita', fmtDollars(c.gdpPerCapita), SOURCES.gdpPerCapita.year, SOURCES.gdpPerCapita.label],
    ['Area', fmtKm2(c.area), SOURCES.area.year, SOURCES.area.label],
    ['Population density', density(c).toLocaleString('en-US') + ' per km2', SOURCES.population.year, 'Derived from UN population and World Bank area'],
    ['Life expectancy', fmtYears(c.lifeExpectancy), SOURCES.lifeExpectancy.year, SOURCES.lifeExpectancy.label],
  ].map((r) => '<tr><td>' + r[0] + '</td><td class="num">' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>').join('');
  const trend = lineChart(YEARS, c.series, {});
  const peerLinks = peers.map((p) => countryLink(p.code, p.name)).join(' &middot; ');
  return '<section class="panel"><p><a href="#/">&larr; All countries</a></p>'
    + '<h1>' + escapeHtml(c.name) + '</h1><p class="subtitle">' + c.region + ' &middot; ISO code ' + c.code + '</p>'
    + '<div class="stat-grid">'
    + statCard('Population', fmtMillions(c.population), SOURCES.population.label + ', ' + SOURCES.population.year)
    + statCard('GDP', fmtBillions(c.gdp), SOURCES.gdp.label + ', ' + SOURCES.gdp.year)
    + statCard('GDP per capita', fmtDollars(c.gdpPerCapita), SOURCES.gdpPerCapita.label + ', ' + SOURCES.gdpPerCapita.year)
    + statCard('Area', (c.area / 1e6).toFixed(2) + ' M km2', SOURCES.area.label + ', ' + SOURCES.area.year)
    + statCard('Life expectancy', fmtYears(c.lifeExpectancy), SOURCES.lifeExpectancy.label + ', ' + SOURCES.lifeExpectancy.year)
    + '</div></section>'
    + '<section class="panel"><h2>Population trend, 2020 to 2024</h2>' + trend
    + '<p class="note">Population in millions, UN World Population Prospects 2024.</p></section>'
    + '<section class="panel"><h2>Indicators</h2><div class="table-wrap"><table><thead><tr><th>Indicator</th><th>Value</th><th>Year</th><th>Source</th></tr></thead><tbody>'
    + rows + '</tbody></table></div>'
    + '<p class="note">Figures rounded. See <a href="#/sources">Sources and notes</a> for the full methodology.</p>'
    + '<p>More from ' + c.region + ': ' + peerLinks + '</p></section>';
}

function compareView() {
  const a = byCode(compareState.a);
  const b = byCode(compareState.b);
  const options = (selected) => COUNTRIES.map((c) => '<option value="' + c.code + '"' + (c.code === selected ? ' selected' : '') + '>' + escapeHtml(c.name) + '</option>').join('');
  const indicators = [
    { label: 'Population (millions)', a: a.population, b: b.population, aText: fmtMillions(a.population), bText: fmtMillions(b.population) },
    { label: 'GDP (US$ billions)', a: a.gdp, b: b.gdp, aText: fmtBillions(a.gdp), bText: fmtBillions(b.gdp) },
    { label: 'GDP per capita (US$)', a: a.gdpPerCapita, b: b.gdpPerCapita, aText: fmtDollars(a.gdpPerCapita), bText: fmtDollars(b.gdpPerCapita) },
    { label: 'Area (km2)', a: a.area, b: b.area, aText: fmtKm2(a.area), bText: fmtKm2(b.area) },
    { label: 'Life expectancy (years)', a: a.lifeExpectancy, b: b.lifeExpectancy, aText: fmtYears(a.lifeExpectancy), bText: fmtYears(b.lifeExpectancy) },
  ];
  const maxes = {};
  indicators.forEach((row) => { maxes[row.label] = Math.max(row.a, row.b); });
  const chartRows = indicators.map((row) => ({
    label: row.label,
    a: (row.a / maxes[row.label]) * 100,
    b: (row.b / maxes[row.label]) * 100,
    aText: row.aText,
    bText: row.bText,
  }));
  const tableRows = indicators.map((row) => '<tr><td>' + row.label + '</td><td class="num">' + row.aText + '</td><td class="num">' + row.bText + '</td></tr>').join('');
  return '<section class="panel"><h1>Compare two countries</h1>'
    + '<p class="subtitle">Pick any two of the 16 countries. Bars are scaled to the larger of the two for each indicator.</p>'
    + '<div class="controls"><label>Country A <select id="cmp-a">' + options(compareState.a) + '</select></label>'
    + '<label>Country B <select id="cmp-b">' + options(compareState.b) + '</select></label></div>'
    + '<div class="legend"><span class="swatch swatch-a"></span> ' + escapeHtml(a.name) + ' &nbsp; <span class="swatch swatch-b"></span> ' + escapeHtml(b.name) + '</div>'
    + compareBars(chartRows) + '</section>'
    + '<section class="panel"><h2>Side by side</h2><div class="table-wrap"><table><thead><tr><th>Indicator</th><th>' + escapeHtml(a.name) + '</th><th>' + escapeHtml(b.name) + '</th></tr></thead><tbody>'
    + tableRows + '</tbody></table></div>'
    + '<p class="note">Population 2024 (UN); GDP, GDP per capita, area and life expectancy 2023 (World Bank). Figures rounded.</p>'
    + '<p><a href="#/country/' + a.code + '">' + escapeHtml(a.name) + ' profile</a> &middot; <a href="#/country/' + b.code + '">' + escapeHtml(b.name) + ' profile</a></p></section>';
}

function sourcesView() {
  return '<section class="panel"><h1>Sources and notes</h1>'
    + '<p>StatAtlas is a small, original statistics explorer. Every figure on this site comes from one of the sources below, and each country page shows the year and source of every indicator.</p>'
    + '<h2>Sources</h2><ul>'
    + '<li>Population, 2020 to 2024: UN World Population Prospects 2024, medium estimate.</li>'
    + '<li>GDP and GDP per capita, 2023: World Bank, World Development Indicators, current US dollars.</li>'
    + '<li>Life expectancy at birth, 2023: World Bank, World Development Indicators.</li>'
    + '<li>Surface area: World Bank, square kilometres.</li>'
    + '<li>Population density: derived here from UN population and World Bank area.</li>'
    + '</ul><h2>Notes</h2><ul>'
    + '<li>Figures are rounded for display; GDP is shown in billions of US dollars and population in millions.</li>'
    + '<li>Country names and ISO codes follow the World Bank list. Regions are the site\u2019s own grouping: Asia, Europe, Africa and the Americas.</li>'
    + '<li>The site works fully offline: all data, styles and scripts are files inside this site, and nothing is fetched from another origin.</li>'
    + '</ul><p><a href="#/">Back to all countries</a></p></section>';
}

export function render() {
  const app = document.getElementById('app');
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/');
  let html = '';
  if (parts[0] === 'country' && parts[1]) html = countryView(parts[1].toUpperCase());
  else if (parts[0] === 'compare') html = compareView();
  else if (parts[0] === 'sources') html = sourcesView();
  else html = homeView();
  app.innerHTML = html;
  bindControls();
}

function bindControls() {
  const q = document.getElementById('q');
  if (q) q.addEventListener('input', () => { homeState.query = q.value; rerenderKeepFocus(); });
  const region = document.getElementById('region');
  if (region) region.addEventListener('change', () => { homeState.region = region.value; render(); });
  const sort = document.getElementById('sort');
  if (sort) sort.addEventListener('change', () => { homeState.sort = sort.value; render(); });
  const cmpA = document.getElementById('cmp-a');
  if (cmpA) cmpA.addEventListener('change', () => { compareState.a = cmpA.value; render(); });
  const cmpB = document.getElementById('cmp-b');
  if (cmpB) cmpB.addEventListener('change', () => { compareState.b = cmpB.value; render(); });
}

function rerenderKeepFocus() {
  const pos = document.getElementById('q').selectionStart;
  render();
  const q = document.getElementById('q');
  q.focus();
  q.setSelectionRange(pos, pos);
}
