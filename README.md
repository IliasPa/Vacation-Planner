<p align="center">
  <img src="image.png" alt="Vacation Planner" width="200" />
</p>

# Vacation Planner

A personal trip planning app that runs locally in your browser. Track transport legs, accommodations, activities, and expenses across multiple destinations — with live currency conversion, PDF attachments, expense splitting for groups, and smart packing lists.

---

## How to open it

**Mac** — double-click `start.command`
If macOS blocks it, right-click → Open → Open anyway. You only need to do this once.

**Windows** — double-click `start.bat`

Either way, a terminal window will open (leave it running) and the app will appear in your browser at `http://localhost:5173` after a few seconds.

**Requirement:** [Node.js](https://nodejs.org) must be installed on the computer. Dependencies install automatically on first launch.

To close the app, close the terminal window.

---

## Tabs

### Overview

A summary of the whole trip: total budget used, trip duration, number of destinations, and planned activities. Each city card shows its hotel, activity count, and estimated cost. At the bottom is a full itinerary timeline built automatically from your transport legs — click the emoji circle on any leg that has a PDF attached to preview the document in-app.

### Flights (Transport)

Lists all transport legs. Supported types: **Flight, Train, Ferry, Bus, Car, Other** — each with its own emoji. Click **Add** to log a new leg — From, To, and Price are required. You can attach a PDF (ticket, booking confirmation) to any leg — after uploading it appears in a side panel next to the form so you can read it while filling in the details; the emoji circle turns gold when a PDF is attached and opens a preview when clicked. Click the trash icon to remove a leg (it goes to Trash, not deleted permanently).

### Stays

Lists all accommodations. Add a stay with the hotel name, city, check-in/check-out dates, and the total price — the nightly rate and number of nights are calculated automatically from the dates. You can attach a PDF (booking confirmation) to each stay — it appears in a side panel next to the form while you fill in the details. Click the trash icon to remove.

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

### Next Spot

A personal wishlist and travel log for places beyond your current trip. Click **Add Place** to save a destination with:

- **Place** — the name of the city, region, or attraction
- **Country / Region** — auto-filled from geocoding as you type (powered by OpenStreetMap Nominatim); you can also fill it manually
- **Notes** — any free-text reminder (best season, things to do, etc.)
- **Tags** — toggle any combination of: Beach, Mountains, City, Culture, Food, Adventure, History, Nature, Shopping, Wellness, Nightlife, Island, Desert, Architecture, Road Trip
- **Already visited** toggle — mark a place as visited and optionally record the year

At the top of the tab a **stats dashboard** shows:

| Stat | What it counts |
| --- | --- |
| Places | Total saved spots |
| Countries | Unique countries across all spots |
| Continents | Unique continents (derived from geocoding) |
| Visited | Spots marked as visited |

A **Visited By Year** bar chart and a **Top Tags** summary appear automatically once you have the relevant data. All spots are saved locally to `nextspot.json` — they are independent of the current trip and persist across trips.

---

## Currency conversion

The header shows two currency dropdowns (primary → secondary) with a live exchange rate fetched from [frankfurter.app](https://www.frankfurter.app). Every price in the app is displayed in the primary currency, with the converted secondary amount shown in smaller grey text below it. If both currencies are the same, only one figure is shown.

Your last-used currency pair is saved automatically and restored on next launch.

---

## PDF attachments

Flights and Stays each have a PDF upload field in their Add forms. The file is saved locally in `data/pdfs/`. When a PDF is uploaded in the Add form, it appears immediately in a side panel next to the form so you can refer to the document while entering details.

Once saved, the PDF stays attached to the item:

- The transport emoji circle gets a **gold border** — click it to preview the PDF inside the app.
- The 📄 button appears on Stay cards — click it to preview.

PDFs open in a full-screen in-app overlay. Click anywhere outside the document or the × button to close.

---

## Editing the trip details

Click the pencil icon (✏️) next to the trip dates in the header to edit:

- Trip name
- Start and end dates (format: dd/mm)
- Year
- Cities — rename, remove, or add new ones (in order)
- People — the group travelling; used to assign "Paid by" and "Involves" in expenses

Click **Save** to apply changes. All edits are saved to `trip.json`.

---

## Data

All data is saved locally in the `data/` folder as JSON files. Nothing is sent anywhere. If you want to reset everything, you can edit those files directly.

| File               | Contents                                                      |
| ------------------ | ------------------------------------------------------------- |
| `trip.json`        | Trip name, dates, cities, people, budget, saved currency pair |
| `flights.json`     | Transport legs                                                |
| `stays.json`       | Accommodations                                                |
| `activities.json`  | Activities                                                    |
| `misc.json`        | Extra expenses                                                |
| `packinglist.json` | Packing lists (built-in checked state + all custom lists)     |
| `nextspot.json`    | Saved places wishlist and travel log                          |
| `pdfs/`            | Uploaded PDF files                                            |

---

## Changelog

### v3.1

- **Next Spot tab** — a persistent wishlist and travel log for places beyond the current trip; add destinations with name, country, notes, tags, and a visited toggle with optional year
- **Auto-geocoding** — typing a place name triggers a live lookup via OpenStreetMap Nominatim; country is auto-filled and the continent is resolved automatically from the result
- **Stats dashboard** — live counts for Places, Countries, Continents, and Visited; a Visited By Year bar chart and a Top Tags summary appear as data is added

### v3.0

- **Packing List tab** — new tab between Expenses and Trash with four built-in templates (Beach Vacation, City Trip, Winter/Ski, Business Trip), each covering Documents, Clothing, Toiletries, Gadgets, a specialty section, and Health & Meds
- **Smart clothing calculation** — items marked ★ auto-calculate quantity based on trip length divided by a configurable laundry cycle; updates live as you change the interval
- **Packing progress** — per-section counters and an overall progress bar that turns green when everything is checked; sections are collapsible
- **Custom packing lists** — create blank lists with editable sections and items; each item has an inline qty editor with seven calculation modes (Fixed, per Laundry, per Destination, per Flight, per Stay, per Activity, per Person); calculated totals appear in gold

### v2.2

- **People management** — add/rename/remove travellers in the header edit form (pencil icon); the list drives "Paid by" and "Involves" in the Expenses tab
- **Editable budget** — click the budget number in the Expenses progress bar to edit it inline; saved immediately to `trip.json`

### v2.1

- **PDF side-panel preview** — when adding a Flight or Stay, the uploaded PDF appears in a side panel next to the form so you can read it while filling in details
- **Grouped Trash** — deleted items are now grouped by category (Flights, Stays, Activities, Expenses) for easier navigation
- **Timestamp-based IDs** — new items get stable, unique IDs derived from the current timestamp

### v2.0

- **Transport types** — Flights tab expanded to support Train, Ferry, Bus, Car, and Other legs, each with its own emoji
- **Live currency conversion** — two-currency header selector with real-time rates from frankfurter.app; converted amounts shown throughout the app
- **PDF attachments** — attach PDFs to transport legs and stays; stored in `data/pdfs/`
- **In-app PDF preview** — full-screen PDF overlay opened by clicking the gold-bordered emoji circle (transport) or the 📄 button (stays)

### v1.1

- Added README with setup instructions
- Added Windows launcher (`start.bat`)
- Miscellaneous data updates

### v1.0

- Initial release: trip overview, transport legs, accommodations, activities, and expense tracking with budget breakdown and expense splitting
