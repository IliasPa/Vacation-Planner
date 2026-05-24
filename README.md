<p align="center">
  <img src="image.png" alt="Vacation Planner" width="200" />
</p>

# Vacation Planner

A personal trip planning web app. Track transport legs, accommodations, activities, and expenses across multiple destinations — with live currency conversion, expense splitting for groups, smart packing lists, and a travel wishlist with an interactive world map.

---

## How to open it

Open the app in your browser. No installation or local server needed — it runs entirely in the browser and saves all data to **localStorage** automatically.

---

## Tabs

### Overview

A summary of the whole trip: total budget used, trip duration, number of destinations, and planned activities. Each city card shows its hotel, activity count, and estimated cost. At the bottom is a full itinerary timeline built automatically from your transport legs.

### Flights (Transport)

Lists all transport legs. Supported types: **Flight, Train, Ferry, Bus, Car, Other** — each with its own emoji. Click **Add** to log a new leg — From, To, and Price are required. Click the trash icon to remove a leg (it goes to Trash, not deleted permanently).

### Stays

Lists all accommodations. Add a stay with the hotel name, city, check-in/check-out dates, and the total price — the nightly rate and number of nights are calculated automatically from the dates.

### Activities

Activities grouped by city. Add an activity with a name, category (Culture, Food, Adventure, Shopping, Wellness, Nightlife), optional date, and price.

### Expenses

A full budget breakdown:

- Progress bar showing how much of the budget has been used — click the budget number to edit it inline
- Pie chart and category bars (Accommodations, Flights, Activities, Extras)
- **Extra Expenses** section for anything that doesn't fit the other tabs — transport, insurance, shopping, etc. Each expense can have a "Paid by" person and a list of who it involves, and the app will calculate how much each person owes under **Who Pays Who**.

### Packing List

Build and track packing lists for your trip. Four built-in templates are included:

| Template          | Specialty section |
| ----------------- | ----------------- |
| 🏖️ Beach Vacation | Beach Essentials  |
| 🏙️ City Trip      | City Essentials   |
| ⛷️ Winter / Ski   | Ski Gear          |
| 💼 Business Trip  | Office Essentials |

Each template has six sections — Documents, Clothing, Toiletries, Gadgets, the specialty section above, and Health & Meds. Items in the **Clothing** section marked with ★ have their quantity calculated automatically: the app divides the trip duration by a configurable laundry cycle (default every 3 days) so you pack exactly what you need. You can change the laundry interval at any time and all quantities update instantly.

Each section shows a packed/total counter and turns green when complete. The top of the list shows an overall progress bar; it turns green and confirms "All packed and ready to go!" when everything is checked off. Sections can be collapsed to keep the view tidy.

**Custom lists** — click **+ New List** to create your own. Each new list starts with five blank sections (Documents, Clothing, Toiletries, Gadgets, Other). On custom lists you can:

- Add and delete items and sections
- Click any item's quantity to open an inline editor where you can set the base number and choose a calculation mode — the quantity is multiplied by whichever trip metric you pick:

| Mode            | Multiplies by                         |
| --------------- | ------------------------------------- |
| Fixed qty       | The number you enter, no multiplier   |
| per Laundry     | Number of laundry cycles for the trip |
| per Destination | Number of cities in the trip          |
| per Flight      | Number of transport legs              |
| per Stay        | Number of accommodation bookings      |
| per Activity    | Number of planned activities          |
| per Person      | Number of travellers                  |

Calculated quantities appear in gold. Press Enter or click away to close the editor and return to the clean display.

### Trash

Anything you delete lands here first, grouped by category (Flights, Stays, Activities, Expenses). You can **Restore** an item to bring it back, or **Delete** it permanently. Permanently deleted items are gone for good.

### Next Stop

A personal wishlist and travel log for places beyond your current trip, built around an interactive world map.

**World map** — every country is colour-coded at a glance:

| Colour | Meaning |
| --- | --- |
| Gray | Not on your list |
| Purple | On your wishlist |
| Green | Visited |

Click any country on the map to open a sidebar showing all saved places for that country and two quick-action buttons: **Add to Wishlist** and **Mark as Visited**.

**Add Place** — opens a form to save a destination with:

- **Place** — the name of the city, region, or attraction
- **Country / Region** — auto-filled from geocoding as you type (powered by OpenStreetMap Nominatim); you can also fill it manually
- **Notes** — any free-text reminder (best season, things to do, etc.)
- **Tags** — toggle any combination of: Beach, Mountains, City, Culture, Food, Adventure, History, Nature, Shopping, Wellness, Nightlife, Island, Desert, Architecture, Road Trip
- **Already visited** toggle — mark a place as visited and optionally record the year

Click any saved place card to edit all its fields inline. Changes are saved immediately.

At the top of the tab a **stats dashboard** shows:

| Stat | What it counts |
| --- | --- |
| Places | Total saved spots |
| Countries | Unique countries across all spots |
| Continents | Unique continents (derived from geocoding) |
| Visited | Spots marked as visited |

A **Visited By Year** bar chart and a **Top Tags** summary appear automatically once you have the relevant data.

---

## Currency conversion

The header shows two currency dropdowns (primary → secondary) with a live exchange rate fetched from [open.er-api.com](https://open.er-api.com). Every price in the app is displayed in the primary currency, with the converted secondary amount shown in smaller grey text below it. If both currencies are the same, only one figure is shown.

Your last-used currency pair is saved automatically and restored on next open.

---

## GitHub sync

The **GitHub icon** at the far right of the tab bar lets you back up your data to a private GitHub repository.

- **Gray** — no token configured; click to set up
- **Yellow** — unsaved changes; click to push only the files that changed
- **Green** — everything is in sync

**Setup** — click the gray icon and enter:

| Field | Example |
| --- | --- |
| Personal Access Token | `ghp_...` (needs `repo` scope) |
| Repository Owner | your GitHub username |
| Repository Name | `VacationPlanner_private` |
| Branch | `main` |
| Data Folder Path | `data/` |

The token is stored only in your browser's localStorage and is never sent anywhere except directly to the GitHub API.

---

## Editing the trip details

Click the pencil icon (✏️) next to the trip dates in the header to edit:

- Trip name
- Start and end dates (format: dd/mm)
- Year
- Cities — rename, remove, or add new ones (in order)
- People — the group travelling; used to assign "Paid by" and "Involves" in expenses

Click **Save** to apply changes.

---

## Data

All data is saved in **browser localStorage**. Nothing is sent to any server. To reset everything, open browser DevTools → Application → Local Storage and clear the `vp_*` keys.

| Key | Contents |
| --- | --- |
| `vp_trip` | Trip name, dates, cities, people, budget, saved currency pair |
| `vp_flights` | Transport legs |
| `vp_stays` | Accommodations |
| `vp_activities` | Activities |
| `vp_misc` | Extra expenses |
| `vp_packinglist` | Packing lists (checked state + all custom lists) |
| `vp_nextspot` | Saved places wishlist and travel log |
| `vp_github` | GitHub sync configuration (token, repo, branch) |

---

## Changelog

### v4.1

- **GitHub as source of truth** — on every launch the app fetches your data directly from GitHub (if a token is configured); localStorage is used only as a temporary cache between syncs
- **Cross-device continuity** — configure the same GitHub token on any device and always start from the latest synced state
- **Startup loading screen** — a brief loading spinner is shown while data is being fetched from GitHub before the app renders
- **Clean reload on config change** — saving or removing a GitHub token triggers a full page reload so the app immediately re-fetches from the correct source
- **No bundled data** — personal trip data is no longer embedded in the app bundle; a fresh install starts with empty defaults until GitHub data is loaded

### v4.0

- **Static web app** — removed local server; the app now runs entirely in the browser with no installation required
- **localStorage persistence** — all data stored in browser localStorage; seeded from bundled defaults on first visit
- **GitHub sync** — a button at the far right of the tab bar pushes only changed data files to a GitHub repository; token stored locally, push goes directly from browser to GitHub API; yellow when changes are pending, green when synced
- **Clickable Next Stop cards** — click anywhere on a place card to edit it inline; no longer requires the pencil icon
- **Direct API calls** — currency rates fetched directly from open.er-api.com; geocoding directly from Nominatim; no proxy server needed

### v3.2

- **World map** — interactive Leaflet map on the Next Stop tab colours every country gray (not saved), purple (wishlist), or green (visited); click any country to open a sidebar with quick-add actions
- **Inline editing** — click the pencil icon on any saved place to edit name, country, notes, tags, and visited status in-place; changes save immediately
- **Renamed to Next Stop** — tab previously called "Next Spot"

### v3.1

- **Next Stop tab** — a persistent wishlist and travel log for places beyond the current trip; add destinations with name, country, notes, tags, and a visited toggle with optional year
- **Auto-geocoding** — typing a place name triggers a live lookup via OpenStreetMap Nominatim; country is auto-filled and the continent is resolved automatically from the result
- **Stats dashboard** — live counts for Places, Countries, Continents, and Visited; a Visited By Year bar chart and a Top Tags summary appear as data is added

### v3.0

- **Packing List tab** — new tab with four built-in templates (Beach Vacation, City Trip, Winter/Ski, Business Trip), each covering Documents, Clothing, Toiletries, Gadgets, a specialty section, and Health & Meds
- **Smart clothing calculation** — items marked ★ auto-calculate quantity based on trip length divided by a configurable laundry cycle; updates live as you change the interval
- **Packing progress** — per-section counters and an overall progress bar that turns green when everything is checked; sections are collapsible
- **Custom packing lists** — create blank lists with editable sections and items; each item has an inline qty editor with seven calculation modes

### v2.2

- **People management** — add/rename/remove travellers in the header edit form; the list drives "Paid by" and "Involves" in the Expenses tab
- **Editable budget** — click the budget number in the Expenses progress bar to edit it inline

### v2.1

- **PDF side-panel preview** — when adding a Flight or Stay, the uploaded PDF appears in a side panel next to the form
- **Grouped Trash** — deleted items are now grouped by category
- **Timestamp-based IDs** — new items get stable, unique IDs derived from the current timestamp

### v2.0

- **Transport types** — Flights tab expanded to support Train, Ferry, Bus, Car, and Other legs, each with its own emoji
- **Live currency conversion** — two-currency header selector with real-time rates; converted amounts shown throughout the app
- **PDF attachments** — attach PDFs to transport legs and stays
- **In-app PDF preview** — full-screen PDF overlay

### v1.1

- Added README with setup instructions
- Added Windows launcher (`start.bat`)
- Miscellaneous data updates

### v1.0

- Initial release: trip overview, transport legs, accommodations, activities, and expense tracking with budget breakdown and expense splitting
