// StatAtlas data: 16 countries, figures rounded for display.
// Population: UN World Population Prospects 2024 (medium estimate), 2020-2024.
// GDP and GDP per capita: World Bank World Development Indicators, 2023, current US dollars.
// Life expectancy at birth: World Bank, 2023. Area: World Bank surface area, km2.
// Values are rounded; the country page shows the year and source of each figure.

export const SOURCES = {
  population: { label: 'UN World Population Prospects 2024', year: 2024 },
  gdp: { label: 'World Bank, World Development Indicators', year: 2023 },
  gdpPerCapita: { label: 'World Bank, World Development Indicators', year: 2023 },
  area: { label: 'World Bank, surface area', year: 2023 },
  lifeExpectancy: { label: 'World Bank, life expectancy at birth', year: 2023 },
};

// Population in millions, 2020 to 2024.
export const COUNTRIES = [
  { code: 'IDN', name: 'Indonesia', region: 'Asia', population: 283.5, gdp: 1371, gdpPerCapita: 4811, area: 1904569, lifeExpectancy: 71.8, series: [274.0, 276.4, 278.7, 281.1, 283.5] },
  { code: 'CHN', name: 'China', region: 'Asia', population: 1408.7, gdp: 17794, gdpPerCapita: 12614, area: 9596961, lifeExpectancy: 78.2, series: [1411.8, 1412.4, 1411.8, 1410.7, 1408.7] },
  { code: 'IND', name: 'India', region: 'Asia', population: 1450.9, gdp: 3567, gdpPerCapita: 2481, area: 3287263, lifeExpectancy: 67.7, series: [1396.4, 1408.0, 1417.2, 1431.9, 1450.9] },
  { code: 'USA', name: 'United States', region: 'Americas', population: 340.1, gdp: 27720, gdpPerCapita: 81695, area: 9833517, lifeExpectancy: 78.4, series: [331.5, 333.3, 335.9, 338.0, 340.1] },
  { code: 'JPN', name: 'Japan', region: 'Asia', population: 123.8, gdp: 4213, gdpPerCapita: 33845, area: 377975, lifeExpectancy: 84.0, series: [126.3, 125.7, 125.1, 124.5, 123.8] },
  { code: 'DEU', name: 'Germany', region: 'Europe', population: 84.6, gdp: 4461, gdpPerCapita: 52824, area: 357588, lifeExpectancy: 81.7, series: [83.2, 83.2, 83.8, 84.3, 84.6] },
  { code: 'BRA', name: 'Brazil', region: 'Americas', population: 216.0, gdp: 2174, gdpPerCapita: 10043, area: 8514877, lifeExpectancy: 75.9, series: [213.2, 214.3, 215.3, 216.4, 216.0] },
  { code: 'NGA', name: 'Nigeria', region: 'Africa', population: 232.7, gdp: 363, gdpPerCapita: 1548, area: 923768, lifeExpectancy: 54.6, series: [212.6, 218.5, 223.8, 229.2, 232.7] },
  { code: 'BGD', name: 'Bangladesh', region: 'Asia', population: 173.6, gdp: 437, gdpPerCapita: 2529, area: 147570, lifeExpectancy: 72.4, series: [164.7, 166.3, 168.2, 170.1, 173.6] },
  { code: 'RUS', name: 'Russia', region: 'Europe', population: 144.8, gdp: 2014, gdpPerCapita: 13952, area: 17098246, lifeExpectancy: 73.3, series: [144.1, 143.6, 144.7, 144.3, 144.8] },
  { code: 'MEX', name: 'Mexico', region: 'Americas', population: 130.9, gdp: 1789, gdpPerCapita: 13676, area: 1964375, lifeExpectancy: 74.9, series: [127.8, 129.0, 130.1, 130.9, 130.9] },
  { code: 'ETH', name: 'Ethiopia', region: 'Africa', population: 129.7, gdp: 210, gdpPerCapita: 1619, area: 1104300, lifeExpectancy: 67.2, series: [117.2, 120.3, 123.4, 126.5, 129.7] },
  { code: 'PHL', name: 'Philippines', region: 'Asia', population: 115.8, gdp: 437, gdpPerCapita: 3807, area: 300000, lifeExpectancy: 72.0, series: [109.9, 111.7, 113.5, 115.2, 115.8] },
  { code: 'EGY', name: 'Egypt', region: 'Africa', population: 112.7, gdp: 396, gdpPerCapita: 3547, area: 1001450, lifeExpectancy: 70.2, series: [104.3, 106.4, 108.5, 110.6, 112.7] },
  { code: 'VNM', name: 'Vietnam', region: 'Asia', population: 100.7, gdp: 430, gdpPerCapita: 4282, area: 331212, lifeExpectancy: 74.6, series: [97.3, 98.5, 99.5, 100.0, 100.7] },
  { code: 'TUR', name: 'Turkey', region: 'Asia', population: 85.7, gdp: 1123, gdpPerCapita: 13105, area: 783562, lifeExpectancy: 76.9, series: [84.3, 85.0, 85.3, 85.3, 85.7] },
];

export const YEARS = [2020, 2021, 2022, 2023, 2024];

export const REGIONS = ['All', 'Asia', 'Europe', 'Africa', 'Americas'];

export function byCode(code) {
  return COUNTRIES.find((c) => c.code === code) || null;
}

export function density(country) {
  return Math.round((country.population * 1e6) / country.area);
}

// Number formatting helpers, kept here so every view formats the same way.
export function fmtMillions(value) {
  return value.toLocaleString('en-US', { maximumFractionDigits: 1 }) + ' M';
}

export function fmtBillions(value) {
  return '$' + value.toLocaleString('en-US') + ' B';
}

export function fmtDollars(value) {
  return '$' + value.toLocaleString('en-US');
}

export function fmtKm2(value) {
  return value.toLocaleString('en-US') + ' km2';
}

export function fmtYears(value) {
  return value.toFixed(1) + ' years';
}
