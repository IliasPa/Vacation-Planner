# Vacation Planner

A personal trip planning app that runs locally in your browser. Track transport legs, accommodations, activities, and expenses across multiple destinations — with live currency conversion, PDF attachments, and expense splitting for groups.

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
Lists all transport legs. Supported types: **Flight, Train, Ferry, Bus, Car, Other** — each with its own emoji. Click **Add** to log a new leg — From, To, and Price are required. You can also attach a PDF (ticket, booking confirmation) to any leg; the emoji circle turns gold when a PDF is attached and opens a preview when clicked. Click the trash icon to remove a leg (it goes to Trash, not deleted permanently).

### Stays
Lists all accommodations. Add a stay with the hotel name, city, check-in/check-out dates, and the total price — the nightly rate and number of nights are calculated automatically from the dates. You can attach a PDF (booking confirmation) to each stay. Click the trash icon to remove.

### Activities
Activities grouped by city. Add an activity with a name, category (Culture, Food, Adventure, Shopping, Wellness, Nightlife), optional date, and price.

### Expenses
A full budget breakdown:
- Progress bar showing how much of the budget has been used
- Pie chart and category bars (Accommodations, Flights, Activities, Extras)
- **Extra Expenses** section for anything that doesn't fit the other tabs — transport, insurance, shopping, etc. Each expense can have a "Paid by" person and a list of who it involves, and the app will calculate how much each person owes under **Who Pays Who**.

### Trash
Anything you delete lands here first. You can **Restore** an item to bring it back, or **Delete** it permanently. Permanently deleted items are gone for good.

---

## Currency conversion

The header shows two currency dropdowns (primary → secondary) with a live exchange rate fetched from [frankfurter.app](https://www.frankfurter.app). Every price in the app is displayed in the primary currency, with the converted secondary amount shown in smaller grey text below it. If both currencies are the same, only one figure is shown.

Your last-used currency pair is saved automatically and restored on next launch.

---

## PDF attachments

Flights and Stays each have a PDF upload field in their Add forms. The file is saved locally in `data/pdfs/`. When a PDF is attached:
- The transport emoji circle gets a **gold border** — click it to preview the PDF inside the app.
- The 📄 button appears on Stay cards — click it to preview.

PDFs open in a full-screen in-app overlay. Click anywhere outside the document or the × button to close.

---

## Editing the trip details

Click the pencil icon (✏️) next to the trip dates in the header to edit:
- Trip name
- Start and end dates (format: dd/mm)
- Year
- Cities — you can rename them, remove them, or add new ones

Click **Save** to apply changes.

---

## Data

All data is saved locally in the `data/` folder as JSON files. Nothing is sent anywhere. If you want to reset everything, you can edit those files directly.

| File | Contents |
|---|---|
| `trip.json` | Trip name, dates, cities, saved currency pair |
| `flights.json` | Transport legs |
| `stays.json` | Accommodations |
| `activities.json` | Activities |
| `misc.json` | Extra expenses |
| `pdfs/` | Uploaded PDF files |
