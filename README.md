# StatAtlas: National Statistics Explorer

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/naikkarier/makefun-stats-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/naikkarier/makefun-stats-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A national statistics site for the [make.fun](https://make.fun/bounty/best-national-statistics-site-20261126-0539) bounty "Make the best national statistics site". It runs offline in a desktop or phone browser from static files, with no network request.

## What it is

StatAtlas covers 16 countries with population, GDP, GDP per capita, area and life expectancy, each figure carrying its source and year:

- **Countries** (`#/`): a featured country, a largest-populations bar chart, and a table of all 16 countries with live search, a region filter and sorting by any indicator.
- **Country profile** (`#/country/IDN`): five headline figures, a 2020-2024 population trend chart, and an indicator table with the year and source of every value.
- **Compare** (`#/compare`): any two countries side by side, with a scaled bar chart and a table.
- **Sources** (`#/sources`): where every figure comes from and how it is rounded.

Population comes from the UN World Population Prospects 2024; GDP, GDP per capita, area and life expectancy come from the World Bank World Development Indicators, 2023. Figures are rounded for display.

## How it is built

- `app/index.html` is the shell; `app/main.js` boots the hash router.
- `app/data.js` holds the 16-country dataset and the number formatting.
- `app/charts.js` draws the SVG bar, line and comparison charts, no library.
- `app/views.js` renders the four pages and wires up every control.
- `app/style.css` is the whole design, responsive down to a phone.
- `main.ts` hands the site in: it copies `app/` and `screenshots/` to the output and writes `dossier.json` with the vendored make.fun library.
- `serve.ts` serves `app/` locally for testing (`node serve.ts`, then http://localhost:8080).

## Screenshots

Four real renders of the site's own code: the home page, the Indonesia profile, the compare page, and the home page at a phone's size.
