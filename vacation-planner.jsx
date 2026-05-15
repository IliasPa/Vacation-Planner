import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Plane,
  Trash2,
  RotateCcw,
  Plus,
  X,
  Hotel,
  Star,
  DollarSign,
  MapPin,
} from "lucide-react";

const GOLD = "#c9913b";
const NAVY = "#0f172a";

const CITY_STYLE = {
  Athens: {
    dot: "#0d9488",
    bg: "#f0fdfa",
    text: "#0f766e",
    border: "#0d948833",
  },
  Santorini: {
    dot: "#2563eb",
    bg: "#dbeafe",
    text: "#1e40af",
    border: "#2563eb33",
  },
  Rome: { dot: "#d97706", bg: "#fef3c7", text: "#92400e", border: "#d9770633" },
  Paris: {
    dot: "#9333ea",
    bg: "#f3e8ff",
    text: "#6b21a8",
    border: "#9333ea33",
  },
};

const CITIES = ["Athens", "Santorini", "Rome", "Paris"];
const ACT_CATS = [
  "Culture",
  "Food",
  "Adventure",
  "Shopping",
  "Wellness",
  "Nightlife",
];
const MISC_CATS = [
  "Transport",
  "Insurance",
  "Shopping",
  "Dining",
  "Utilities",
  "Other",
];
const MISC_CITIES = ["General", ...CITIES];
const PIE_COLORS = ["#c9913b", "#2563eb", "#059669", "#9333ea"];
const TRAVELERS = ["Ilias", "Diana", "Ilias2", "Diana2"];

const MONTH_NUM = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};
const parseDate = (d) => {
  if (!d) return Infinity;
  const [m, day] = d.split(" ");
  return (MONTH_NUM[m] || 0) * 100 + parseInt(day, 10);
};

let _nextId = 60;
const uid = () => ++_nextId;

const api = {
  post: (r, body) =>
    fetch(`/api/${r}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  patch: (r, id, body) =>
    fetch(`/api/${r}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  del: (r, id) => fetch(`/api/${r}/${id}`, { method: "DELETE" }),
};

const CAT_COLOR = {
  Culture: "#2563eb",
  Food: "#d97706",
  Adventure: "#059669",
  Shopping: "#9333ea",
  Wellness: "#e11d48",
  Nightlife: "#7c3aed",
};

/* --- Shared styles --- */
const card = {
  background: "white",
  borderRadius: 12,
  border: "1px solid #e8e4dc",
  padding: "16px 20px",
  marginBottom: 10,
};
const inp = {
  border: "1px solid #ddd8d0",
  borderRadius: 7,
  padding: "7px 11px",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  background: "#fafaf8",
  width: "100%",
  boxSizing: "border-box",
};

/* --- Shared components (must live outside the page component so React doesn't remount them on every render) --- */
const Btn = ({ variant = "default", onClick, children, style = {} }) => {
  const styles = {
    gold: { background: GOLD, color: "white" },
    danger: { background: "#fee2e2", color: "#b91c1c" },
    restore: { background: "#d1fae5", color: "#065f46" },
    ghost: { background: "transparent", color: "#94a3b8", padding: "4px 6px" },
    default: { background: "#f1f5f9", color: "#475569" },
  };
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: 7,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        padding: "6px 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        ...styles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const Field = ({ label, k, val, set, type = "text", opts = null }) => (
  <div style={{ flex: 1, minWidth: 120 }}>
    <div
      style={{
        fontSize: 10,
        color: "#94a3b8",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    {opts ? (
      <select
        value={val[k]}
        onChange={(e) => set((p) => ({ ...p, [k]: e.target.value }))}
        style={inp}
      >
        {opts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={val[k]}
        onChange={(e) => set((p) => ({ ...p, [k]: e.target.value }))}
        style={inp}
      />
    )}
  </div>
);

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const parseTripDate = (str, year) => {
  if (!str) return null;
  const [mon, day] = str.split(" ");
  const mi = MONTH_NAMES.indexOf(mon);
  return mi === -1 ? null : new Date(year, mi, parseInt(day, 10));
};

const storedToDDMM = (stored) => {
  if (!stored) return "";
  const [mon, day] = stored.split(" ");
  const mi = MONTH_NAMES.indexOf(mon);
  if (mi === -1 || !day) return "";
  return `${String(parseInt(day, 10)).padStart(2, "0")}/${String(mi + 1).padStart(2, "0")}`;
};

const ddmmToStored = (v) => {
  const m = v.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!m) return "";
  const day = parseInt(m[1], 10),
    month = parseInt(m[2], 10);
  if (month < 1 || month > 12 || day < 1 || day > DAYS_IN_MONTH[month - 1])
    return "";
  return `${MONTH_NAMES[month - 1]} ${day}`;
};

const DateField = ({ label, k, val, set }) => {
  const [raw, setRaw] = useState(() => storedToDDMM(val[k]));
  const [touched, setTouched] = useState(false);
  const valid = !touched || !raw || !!ddmmToStored(raw);

  const onChange = (e) => {
    let v = e.target.value;
    if (/^\d{2}$/.test(v) && v.length > raw.length) v += "/";
    setRaw(v);
    const stored = ddmmToStored(v);
    if (stored) set((p) => ({ ...p, [k]: stored }));
  };

  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <div
        style={{
          fontSize: 10,
          color: "#94a3b8",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <input
        type="text"
        value={raw}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        placeholder="dd/mm"
        maxLength={5}
        style={{ ...inp, borderColor: valid ? "#ddd8d0" : "#ef4444" }}
      />
      {!valid && (
        <div style={{ fontSize: 10, color: "#ef4444", marginTop: 3 }}>
          Invalid date
        </div>
      )}
    </div>
  );
};

const CityBadge = ({ city }) => {
  const s = CITY_STYLE[city] || { dot: "#888", bg: "#f5f5f5", text: "#666" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {city}
    </span>
  );
};

const AddForm = ({ open, onCancel, onSave, saveLabel, children }) =>
  !open ? null : (
    <div
      style={{
        background: "#fafaf8",
        border: "1.5px dashed #d8d0c3",
        borderRadius: 12,
        padding: "18px 20px",
        marginBottom: 14,
      }}
    >
      <div
        style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 14 }}
      >
        {saveLabel}
      </div>
      {children}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <Btn variant="gold" onClick={onSave}>
          {saveLabel}
        </Btn>
        <Btn onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  );

const SectionHeader = ({ title, sub, onAdd }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18,
    }}
  >
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: 20,
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
          color: NAVY,
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{sub}</div>
    </div>
    <Btn variant="gold" onClick={onAdd}>
      <Plus size={14} />
      Add
    </Btn>
  </div>
);

const DeleteBtn = ({ onClick }) => (
  <Btn variant="ghost" onClick={onClick} style={{ flexShrink: 0 }}>
    <Trash2 size={14} />
  </Btn>
);

export default function VacationPlanner() {
  const [tab, setTab] = useState("overview");
  const [flights, setFlights] = useState([]);
  const [stays, setStays] = useState([]);
  const [acts, setActs] = useState([]);
  const [misc, setMisc] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [trip, setTrip] = useState({
    name: "Summer Escape 2025",
    cities: ["Athens", "Santorini", "Rome", "Paris"],
    start: "Jun 15",
    end: "Jul 5",
    year: 2025,
  });
  const [editTrip, setEditTrip] = useState(false);
  const [tripForm, setTripForm] = useState({
    name: "Summer Escape 2025",
    cities: ["Athens", "Santorini", "Rome", "Paris"],
    start: "Jun 15",
    end: "Jul 5",
    year: 2025,
  });

  const [addF, setAddF] = useState(false);
  const [addS, setAddS] = useState(false);
  const [addA, setAddA] = useState(false);
  const [addM, setAddM] = useState(false);

  const [nf, setNf] = useState({
    from: "",
    to: "",
    airline: "",
    no: "",
    date: "",
    time: "",
    price: "",
  });
  const [ns, setNs] = useState({
    city: CITIES[0],
    name: "",
    type: "",
    ci: "",
    co: "",
    n: "",
    ppn: "",
  });
  const [na, setNa] = useState({
    city: CITIES[0],
    name: "",
    cat: "Culture",
    date: "",
    price: "",
  });
  const [nm, setNm] = useState({
    name: "",
    cat: "Transport",
    date: "",
    price: "",
    city: MISC_CITIES[0],
    paidBy: TRAVELERS[0],
    involves: [...TRAVELERS],
  });

  useEffect(() => {
    fetch("/api/flights")
      .then((r) => r.json())
      .then(setFlights);
    fetch("/api/stays")
      .then((r) => r.json())
      .then(setStays);
    fetch("/api/activities")
      .then((r) => r.json())
      .then(setActs);
    fetch("/api/misc")
      .then((r) => r.json())
      .then(setMisc);
    fetch("/api/itinerary")
      .then((r) => r.json())
      .then(setItinerary);
    fetch("/api/trip")
      .then((r) => r.json())
      .then((d) => {
        setTrip(d);
        setTripForm(d);
      });
  }, []);

  const softDel = (resource, set, id) => {
    set((p) => p.map((x) => (x.id === id ? { ...x, deleted: true } : x)));
    api.patch(resource, id, { deleted: true });
  };
  const restore = (resource, set, id) => {
    set((p) => p.map((x) => (x.id === id ? { ...x, deleted: false } : x)));
    api.patch(resource, id, { deleted: false });
  };
  const permDel = (resource, set, id) => {
    set((p) => p.filter((x) => x.id !== id));
    api.del(resource, id);
  };

  const restoreItem = ({ type, id }) => {
    const map = {
      f: ["flights", setFlights],
      s: ["stays", setStays],
      a: ["activities", setActs],
      m: ["misc", setMisc],
    };
    const [resource, setter] = map[type];
    restore(resource, setter, id);
  };
  const permDelItem = ({ type, id }) => {
    const map = {
      f: ["flights", setFlights],
      s: ["stays", setStays],
      a: ["activities", setActs],
      m: ["misc", setMisc],
    };
    const [resource, setter] = map[type];
    permDel(resource, setter, id);
  };

  const fTotal = flights
    .filter((x) => !x.deleted)
    .reduce((s, x) => s + x.price, 0);
  const sTotal = stays
    .filter((x) => !x.deleted)
    .reduce((s, x) => s + x.n * x.ppn, 0);
  const aTotal = acts
    .filter((x) => !x.deleted)
    .reduce((s, x) => s + x.price, 0);
  const mTotal = misc
    .filter((x) => !x.deleted)
    .reduce((s, x) => s + x.price, 0);
  const grand = fTotal + sTotal + aTotal + mTotal;
  const BUDGET = 12000;

  const saveTrip = () => {
    setTrip(tripForm);
    fetch("/api/trip", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tripForm),
    });
    setEditTrip(false);
  };
  const tripStartD = parseTripDate(trip.start, trip.year);
  const tripEndD = parseTripDate(trip.end, trip.year);
  const tripDays =
    tripStartD && tripEndD
      ? Math.round((tripEndD - tripStartD) / 86400000)
      : "?";
  const tripLabel  = `${trip.start} – ${trip.end}, ${trip.year}`;
  const cities     = trip.cities?.length ? trip.cities : CITIES;
  const miscCities = ["General", ...cities];

  const trash = [
    ...flights
      .filter((x) => x.deleted)
      .map((x) => ({
        ...x,
        type: "f",
        label: `${x.from} → ${x.to}`,
        amt: x.price,
        tag: "Flight",
      })),
    ...stays
      .filter((x) => x.deleted)
      .map((x) => ({
        ...x,
        type: "s",
        label: x.name,
        amt: x.n * x.ppn,
        tag: "Stay",
      })),
    ...acts
      .filter((x) => x.deleted)
      .map((x) => ({
        ...x,
        type: "a",
        label: x.name,
        amt: x.price,
        tag: "Activity",
      })),
    ...misc
      .filter((x) => x.deleted)
      .map((x) => ({
        ...x,
        type: "m",
        label: x.name,
        amt: x.price,
        tag: "Expense",
      })),
  ];

  const pieData = [
    { name: "Accommodations", value: sTotal },
    { name: "Flights", value: fTotal },
    { name: "Activities", value: aTotal },
    { name: "Extras", value: mTotal },
  ].filter((d) => d.value > 0);

  const doAddFlight = () => {
    if (!nf.from || !nf.to || !nf.price) return;
    const item = { ...nf, id: uid(), price: +nf.price, deleted: false };
    setFlights((p) => [...p, item]);
    api.post("flights", item);
    setNf({
      from: "",
      to: "",
      airline: "",
      no: "",
      date: "",
      time: "",
      price: "",
    });
    setAddF(false);
  };
  const doAddStay = () => {
    if (!ns.name || !ns.ppn) return;
    const item = {
      ...ns,
      id: uid(),
      n: +ns.n || 1,
      ppn: +ns.ppn,
      deleted: false,
    };
    setStays((p) => [...p, item]);
    api.post("stays", item);
    setNs({
      city: CITIES[0],
      name: "",
      type: "",
      ci: "",
      co: "",
      n: "",
      ppn: "",
    });
    setAddS(false);
  };
  const doAddAct = () => {
    if (!na.name || !na.price) return;
    const item = { ...na, id: uid(), price: +na.price, deleted: false };
    setActs((p) => [...p, item]);
    api.post("activities", item);
    setNa({ city: CITIES[0], name: "", cat: "Culture", date: "", price: "" });
    setAddA(false);
  };
  const doAddMisc = () => {
    if (!nm.name || !nm.price) return;
    const item = { ...nm, id: uid(), price: +nm.price, deleted: false };
    setMisc((p) => [...p, item]);
    api.post("misc", item);
    setNm({
      name: "",
      cat: "Transport",
      date: "",
      price: "",
      city: "General",
      paidBy: TRAVELERS[0],
      involves: [...TRAVELERS],
    });
    setAddM(false);
  };

  /* ===== TABS ===== */

  const renderOverview = () => {
    const statCard = (label, value, sub, color = NAVY) => (
      <div style={{ ...card, flex: 1, minWidth: 140, padding: "18px 18px" }}>
        <div
          style={{
            fontSize: 10,
            color: "#94a3b8",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: "Georgia, serif",
            color,
            fontWeight: "normal",
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
            {sub}
          </div>
        )}
      </div>
    );
    return (
      <div>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {statCard(
            "Total Budget Used",
            `$${grand.toLocaleString()}`,
            `${Math.round((grand / BUDGET) * 100)}% of $${BUDGET.toLocaleString()}`,
            GOLD,
          )}
          {statCard("Trip Duration", `${tripDays} days`, tripLabel)}
          {statCard(
            "Destinations",
            `${cities.length} ${cities.length === 1 ? "city" : "cities"}`,
            cities.join(" · "),
          )}
          {statCard(
            "Activities",
            `${acts.filter((a) => !a.deleted).length}`,
            "experiences planned",
          )}
        </div>

        <h3
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#94a3b8",
            textTransform: "uppercase",
            marginBottom: 14,
            margin: "0 0 14px",
          }}
        >
          Destinations
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 10,
            marginBottom: 28,
          }}
        >
          {cities.map((city) => {
            const cs = CITY_STYLE[city] || { dot: "#888", bg: "#f5f5f5", text: "#555", border: "#88888833" };
            const cityStay = stays.find((s) => s.city === city && !s.deleted);
            const cityActs = acts.filter((a) => a.city === city && !a.deleted);
            const cityFlight = flights.find(
              (f) =>
                !f.deleted &&
                (f.to.includes(city.slice(0, 3)) ||
                  f.from.includes(city.slice(0, 3))),
            );
            const total =
              (cityStay ? cityStay.n * cityStay.ppn : 0) +
              cityActs.reduce((s, a) => s + a.price, 0);
            return (
              <div
                key={city}
                style={{
                  background: cs.bg,
                  border: `1.5px solid ${cs.border}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: cs.dot,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 17,
                      color: NAVY,
                    }}
                  >
                    {city}
                  </span>
                </div>
                {cityStay && (
                  <div
                    style={{ fontSize: 12, color: cs.text, marginBottom: 5 }}
                  >
                    🏨 {cityStay.name} · {cityStay.n}n
                  </div>
                )}
                <div style={{ fontSize: 12, color: cs.text, marginBottom: 10 }}>
                  ✦ {cityActs.length} activit
                  {cityActs.length !== 1 ? "ies" : "y"}
                </div>
                <div
                  style={{
                    borderTop: `1px solid ${cs.border}`,
                    paddingTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 11, color: cs.text }}>
                    Est. total
                  </span>
                  <span
                    style={{ fontSize: 14, fontWeight: 700, color: cs.text }}
                  >
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <h3
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#94a3b8",
            textTransform: "uppercase",
            margin: "0 0 14px",
          }}
        >
          Itinerary
        </h3>
        <div style={{ ...card, padding: "20px 22px" }}>
          {itinerary.map((ev, i) => {
            const cs = CITY_STYLE[ev.city] || { dot: "#888", bg: "#f5f5f5", text: "#555", border: "#88888833" };
            const isLast = i === itinerary.length - 1;
            return (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: cs ? cs.bg : "#f1f5f9",
                      border: `1.5px solid ${cs ? cs.border : "#e8e4dc"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {ev.emoji}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: 1,
                        height: 28,
                        background: "#e8e4dc",
                        margin: "4px 0",
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    flex: 1,
                    paddingTop: 6,
                    paddingBottom: isLast ? 0 : 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{ fontSize: 11, color: "#94a3b8", minWidth: 72 }}
                    >
                      {ev.date}
                    </span>
                    <span
                      style={{ fontSize: 14, fontWeight: 600, color: NAVY }}
                    >
                      {ev.city}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginTop: 2,
                      marginBottom: isLast ? 0 : 8,
                    }}
                  >
                    {ev.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFlights = () => {
    const active = flights.filter((f) => !f.deleted);
    return (
      <div>
        <SectionHeader
          title="Flights"
          sub={`${active.length} flights · $${fTotal.toLocaleString()} total`}
          onAdd={() => setAddF((f) => !f)}
        />

        <AddForm
          open={addF}
          onCancel={() => setAddF(false)}
          onSave={doAddFlight}
          saveLabel="Add Flight"
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Field label="From" k="from" val={nf} set={setNf} />
            <Field label="To" k="to" val={nf} set={setNf} />
            <Field label="Airline" k="airline" val={nf} set={setNf} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Field label="Flight No." k="no" val={nf} set={setNf} />
            <DateField label="Date" k="date" val={nf} set={setNf} />
            <Field label="Time" k="time" val={nf} set={setNf} />
            <Field
              label="Price ($)"
              k="price"
              val={nf}
              set={setNf}
              type="number"
            />
          </div>
        </AddForm>

        {active.map((f) => (
          <div
            key={f.id}
            style={{ ...card, display: "flex", alignItems: "center", gap: 14 }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Plane size={17} color="#2563eb" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>
                {f.from}{" "}
                <span
                  style={{ color: "#94a3b8", fontWeight: 400, margin: "0 2px" }}
                >
                  →
                </span>{" "}
                {f.to}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {f.airline} · {f.no}
                {f.date ? ` · ${f.date}` : ""}
                {f.time ? ` · ${f.time}` : ""}
              </div>
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 18,
                color: NAVY,
                flexShrink: 0,
              }}
            >
              ${f.price}
            </div>
            <DeleteBtn onClick={() => softDel("flights", setFlights, f.id)} />
          </div>
        ))}

        <div
          style={{
            ...card,
            background: "#f8f6f1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
            Total Flights
          </span>
          <span
            style={{ fontFamily: "Georgia, serif", fontSize: 20, color: GOLD }}
          >
            ${fTotal.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  const renderStays = () => {
    const active = stays.filter((s) => !s.deleted);
    return (
      <div>
        <SectionHeader
          title="Accommodations"
          sub={`${active.length} stays · $${sTotal.toLocaleString()} total`}
          onAdd={() => setAddS((s) => !s)}
        />

        <AddForm
          open={addS}
          onCancel={() => setAddS(false)}
          onSave={doAddStay}
          saveLabel="Add Stay"
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Field label="City" k="city" val={ns} set={setNs} opts={cities} />
            <Field label="Property Name" k="name" val={ns} set={setNs} />
            <Field label="Type" k="type" val={ns} set={setNs} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <DateField label="Check-in" k="ci" val={ns} set={setNs} />
            <DateField label="Check-out" k="co" val={ns} set={setNs} />
            <Field label="Nights" k="n" val={ns} set={setNs} type="number" />
            <Field
              label="Price/Night ($)"
              k="ppn"
              val={ns}
              set={setNs}
              type="number"
            />
          </div>
        </AddForm>

        {active.map((s) => {
          const cs = CITY_STYLE[s.city] || {
            dot: "#888",
            bg: "#f5f5f5",
            text: "#666",
          };
          return (
            <div
              key={s.id}
              style={{
                ...card,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: cs.bg,
                  border: `1.5px solid ${cs.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Hotel size={17} color={cs.dot} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>
                    {s.name}
                  </span>
                  <CityBadge city={s.city} />
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {s.type} · {s.ci} – {s.co} · {s.n} nights
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  ${s.ppn.toLocaleString()}/night
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 18,
                    color: NAVY,
                  }}
                >
                  ${(s.n * s.ppn).toLocaleString()}
                </div>
                <DeleteBtn onClick={() => softDel("stays", setStays, s.id)} />
              </div>
            </div>
          );
        })}

        <div
          style={{
            ...card,
            background: "#f8f6f1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
            Total Accommodations
          </span>
          <span
            style={{ fontFamily: "Georgia, serif", fontSize: 20, color: GOLD }}
          >
            ${sTotal.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  const renderActivities = () => {
    const active = acts.filter((a) => !a.deleted);
    return (
      <div>
        <SectionHeader
          title="Activities"
          sub={`${active.length} experiences · $${aTotal.toLocaleString()} total`}
          onAdd={() => setAddA((a) => !a)}
        />

        <AddForm
          open={addA}
          onCancel={() => setAddA(false)}
          onSave={doAddAct}
          saveLabel="Add Activity"
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Field label="City" k="city" val={na} set={setNa} opts={cities} />
            <Field label="Activity Name" k="name" val={na} set={setNa} />
            <Field
              label="Category"
              k="cat"
              val={na}
              set={setNa}
              opts={ACT_CATS}
            />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <DateField label="Date" k="date" val={na} set={setNa} />
            <Field
              label="Price ($)"
              k="price"
              val={na}
              set={setNa}
              type="number"
            />
          </div>
        </AddForm>

        {cities.map((city) => {
          const cityActs = active.filter((a) => a.city === city);
          if (!cityActs.length) return null;
          const cityTotal = cityActs.reduce((s, a) => s + a.price, 0);
          return (
            <div key={city} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <CityBadge city={city} />
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  {cityActs.length} activities · ${cityTotal.toLocaleString()}
                </span>
              </div>
              {cityActs.map((a) => (
                <div
                  key={a.id}
                  style={{
                    ...card,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginLeft: 6,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: CAT_COLOR[a.cat] || "#888",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{ fontSize: 14, fontWeight: 500, color: NAVY }}
                    >
                      {a.name}
                    </span>
                    <div
                      style={{
                        marginTop: 3,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          background: "#f1f5f9",
                          color: CAT_COLOR[a.cat] || "#888",
                          borderRadius: 5,
                          padding: "1px 7px",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {a.cat}
                      </span>
                      {a.date && (
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                          {a.date}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 16,
                      color: NAVY,
                      flexShrink: 0,
                    }}
                  >
                    ${a.price}
                  </div>
                  <DeleteBtn
                    onClick={() => softDel("activities", setActs, a.id)}
                  />
                </div>
              ))}
            </div>
          );
        })}

        <div
          style={{
            ...card,
            background: "#f8f6f1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
            Total Activities
          </span>
          <span
            style={{ fontFamily: "Georgia, serif", fontSize: 20, color: GOLD }}
          >
            ${aTotal.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  const renderExpenses = () => {
    const pct = (v) => (grand > 0 ? Math.round((v / grand) * 100) : 0);
    const RADIAN = Math.PI / 180;
    const PieLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
    }) => {
      if (percent < 0.06) return null;
      const r = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + r * Math.cos(-midAngle * RADIAN);
      const y = cy + r * Math.sin(-midAngle * RADIAN);
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fontWeight={700}
        >{`${Math.round(percent * 100)}%`}</text>
      );
    };
    const activeM = misc.filter((m) => !m.deleted);
    const breakdown = [
      {
        label: "Accommodations",
        value: sTotal,
        color: PIE_COLORS[0],
        icon: "🏨",
      },
      { label: "Flights", value: fTotal, color: PIE_COLORS[1], icon: "✈️" },
      { label: "Activities", value: aTotal, color: PIE_COLORS[2], icon: "🎭" },
      {
        label: "Extras & Misc",
        value: mTotal,
        color: PIE_COLORS[3],
        icon: "📦",
      },
    ];

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 22,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                color: NAVY,
              }}
            >
              Spending Breakdown
            </h2>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
              Total: ${grand.toLocaleString()} of ${BUDGET.toLocaleString()}{" "}
              budget · {Math.round((grand / BUDGET) * 100)}% used
            </div>
          </div>
        </div>

        {/* Budget bar */}
        <div style={{ ...card, padding: "16px 20px", marginBottom: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#64748b",
              marginBottom: 8,
            }}
          >
            <span>Budget progress</span>
            <span style={{ fontWeight: 700 }}>
              ${grand.toLocaleString()} / ${BUDGET.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: "#f1f5f9",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min((grand / BUDGET) * 100, 100).toFixed(1)}%`,
                background: grand > BUDGET * 0.9 ? "#ef4444" : GOLD,
                borderRadius: 4,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
            ${(BUDGET - grand).toLocaleString()} remaining
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            marginBottom: 26,
          }}
        >
          {/* Pie */}
          <div style={{ ...card, flex: "1 1 260px", padding: "18px 20px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#94a3b8",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              By Category
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]}
                    contentStyle={{
                      fontSize: 13,
                      borderRadius: 8,
                      border: "1px solid #e8e4dc",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px 14px",
                marginTop: 10,
              }}
            >
              {pieData.map((d, i) => (
                <div
                  key={d.name}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 2,
                      background: PIE_COLORS[i],
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#64748b" }}>
                    {d.name}{" "}
                    <span style={{ color: "#94a3b8" }}>{pct(d.value)}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div
            style={{
              flex: "1 1 220px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {breakdown.map((row) => (
              <div
                key={row.label}
                style={{
                  ...card,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{row.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>
                    {row.label}
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "#f1f5f9",
                      borderRadius: 2,
                      marginTop: 7,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct(row.value)}%`,
                        background: row.color,
                        borderRadius: 2,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 16,
                      color: NAVY,
                    }}
                  >
                    ${row.value.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    {pct(row.value)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misc expenses */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
              color: NAVY,
            }}
          >
            Extra Expenses
          </h3>
          <Btn variant="gold" onClick={() => setAddM((m) => !m)}>
            <Plus size={14} />
            Add
          </Btn>
        </div>

        <AddForm
          open={addM}
          onCancel={() => setAddM(false)}
          onSave={doAddMisc}
          saveLabel="Add Expense"
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Field label="Name" k="name" val={nm} set={setNm} />
            <Field
              label="Category"
              k="cat"
              val={nm}
              set={setNm}
              opts={MISC_CATS}
            />
            <Field
              label="City"
              k="city"
              val={nm}
              set={setNm}
              opts={miscCities}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <DateField label="Date" k="date" val={nm} set={setNm} />
            <Field
              label="Amount ($)"
              k="price"
              val={nm}
              set={setNm}
              type="number"
            />
            <Field
              label="Paid By"
              k="paidBy"
              val={nm}
              set={setNm}
              opts={TRAVELERS}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#94a3b8",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Involves
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TRAVELERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    setNm((p) => ({
                      ...p,
                      involves: p.involves.includes(t)
                        ? p.involves.filter((x) => x !== t)
                        : [...p.involves, t],
                    }))
                  }
                  style={{
                    border: "none",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    padding: "6px 14px",
                    background: nm.involves.includes(t) ? GOLD : "#f1f5f9",
                    color: nm.involves.includes(t) ? "white" : "#475569",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </AddForm>

        {[...activeM]
          .sort((a, b) => parseDate(a.date) - parseDate(b.date))
          .map((m) => (
            <div key={m.id} style={{ ...card, gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{ fontSize: 14, fontWeight: 500, color: NAVY }}
                    >
                      {m.name}
                    </span>
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        borderRadius: 5,
                        padding: "1px 7px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {m.cat}
                    </span>
                    {m.city && m.city !== "General" && (
                      <CityBadge city={m.city} />
                    )}
                  </div>
                  {(m.paidBy || m.involves?.length) && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        marginTop: 5,
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      {m.paidBy && (
                        <span>
                          Paid by{" "}
                          <span style={{ fontWeight: 600, color: "#64748b" }}>
                            {m.paidBy}
                          </span>
                        </span>
                      )}
                      {m.involves?.length > 0 && (
                        <span>
                          Involves{" "}
                          <span style={{ color: "#64748b" }}>
                            {m.involves.join(", ")}
                          </span>
                          {m.involves.length > 1 && (
                            <span style={{ color: GOLD, fontWeight: 600 }}>
                              {" "}
                              · ${(m.price / m.involves.length).toFixed(0)}
                              /person
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {m.date && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        marginBottom: 2,
                      }}
                    >
                      {m.date}
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 16,
                      color: NAVY,
                    }}
                  >
                    ${m.price.toLocaleString()}
                  </div>
                </div>
                <DeleteBtn onClick={() => softDel("misc", setMisc, m.id)} />
              </div>
            </div>
          ))}

        {/* Settlement */}
        {(() => {
          const balance = Object.fromEntries(TRAVELERS.map((t) => [t, 0]));
          activeM.forEach((m) => {
            if (!m.paidBy || !m.involves?.length) return;
            const share = m.price / m.involves.length;
            balance[m.paidBy] = (balance[m.paidBy] || 0) + m.price;
            m.involves.forEach((p) => {
              balance[p] = (balance[p] || 0) - share;
            });
          });
          const creds = Object.entries(balance)
            .filter(([, v]) => v > 0.01)
            .map(([n, v]) => ({ n, v }));
          const debts = Object.entries(balance)
            .filter(([, v]) => v < -0.01)
            .map(([n, v]) => ({ n, v: -v }));
          if (!creds.length || !debts.length) return null;
          const txns = [];
          let ci = 0,
            di = 0;
          while (ci < creds.length && di < debts.length) {
            const amt = Math.min(creds[ci].v, debts[di].v);
            if (amt > 0.01)
              txns.push({
                from: debts[di].n,
                to: creds[ci].n,
                amt: Math.round(amt),
              });
            creds[ci].v -= amt;
            debts[di].v -= amt;
            if (creds[ci].v < 0.01) ci++;
            if (debts[di].v < 0.01) di++;
          }
          if (!txns.length) return null;
          return (
            <div
              style={{
                ...card,
                background: "#fafaf8",
                border: "1.5px solid #e8e4dc",
                marginTop: 6,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Who Pays Who
              </div>
              {txns.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    marginBottom: i < txns.length - 1 ? 10 : 0,
                  }}
                >
                  <span style={{ fontWeight: 700, color: NAVY }}>{t.from}</span>
                  <span style={{ color: "#94a3b8" }}>→</span>
                  <span style={{ fontWeight: 700, color: NAVY }}>{t.to}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: "Georgia, serif",
                      fontSize: 17,
                      color: GOLD,
                    }}
                  >
                    ${t.amt}
                  </span>
                </div>
              ))}
            </div>
          );
        })()}

        <div
          style={{
            ...card,
            background: "#f8f6f1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>
            Grand Total
          </span>
          <span
            style={{ fontFamily: "Georgia, serif", fontSize: 22, color: GOLD }}
          >
            ${grand.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  const renderTrash = () => {
    const typeEmoji = { f: "✈️", s: "🏨", a: "🎭", m: "📦" };
    return (
      <div>
        <div style={{ marginBottom: 22 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
              color: NAVY,
            }}
          >
            Deleted Items
          </h2>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
            Restore items or permanently remove them from your plan
          </div>
        </div>

        {trash.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "70px 0", color: "#94a3b8" }}
          >
            <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.3 }}>
              🗑️
            </div>
            <div style={{ fontSize: 16, fontFamily: "Georgia, serif" }}>
              Trash is empty
            </div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              Items you delete will appear here for recovery
            </div>
          </div>
        ) : (
          <div>
            {trash.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                style={{
                  ...card,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: 0.85,
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>
                  {typeEmoji[item.type]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 500, color: "#64748b" }}
                  >
                    {item.label}
                  </div>
                  <div style={{ marginTop: 3 }}>
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#94a3b8",
                        borderRadius: 5,
                        padding: "1px 7px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
                {item.amt > 0 && (
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 15,
                      color: "#94a3b8",
                      flexShrink: 0,
                    }}
                  >
                    ${item.amt.toLocaleString()}
                  </span>
                )}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Btn variant="restore" onClick={() => restoreItem(item)}>
                    <RotateCcw size={13} />
                    Restore
                  </Btn>
                  <Btn variant="danger" onClick={() => permDelItem(item)}>
                    <X size={13} />
                    Delete
                  </Btn>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 8,
                padding: "12px 16px",
                background: "#fef9f0",
                border: "1px solid #f5e4c3",
                borderRadius: 10,
                fontSize: 12,
                color: "#92400e",
              }}
            >
              ⚠️ Permanently deleted items cannot be recovered.
            </div>
          </div>
        )}
      </div>
    );
  };

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "flights", label: "Flights" },
    { id: "stays", label: "Stays" },
    { id: "activities", label: "Activities" },
    { id: "expenses", label: "Expenses" },
    { id: "trash", label: `Trash${trash.length ? ` (${trash.length})` : ""}` },
  ];

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#f5f2ec",
        minHeight: "700px",
      }}
    >
      {/* ─── Header ─── */}
      <div style={{ background: NAVY, color: "white", padding: "22px 26px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#475569",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 5,
                fontWeight: 700,
              }}
            >
              {trip.name}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 21,
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                lineHeight: 1.3,
                color: "white",
              }}
            >
              {cities.join(" → ")}
            </h1>
            <div
              style={{
                color: "#475569",
                fontSize: 12,
                marginTop: 6,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <span>📅 {tripLabel}</span>
              <span>🌍 {tripDays} days · {cities.length} destinations</span>
              <span>✦ {acts.filter((a) => !a.deleted).length} activities</span>
              <button
                onClick={() => {
                  setTripForm(trip);
                  setEditTrip((e) => !e);
                }}
                title="Edit trip dates"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: 13,
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ✏️
              </button>
            </div>
            {editTrip && (
              <div
                style={{
                  background: "#1e293b",
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginTop: 12,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ flex: "1 1 180px" }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#94a3b8",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Trip Name
                  </div>
                  <input
                    type="text"
                    value={tripForm.name}
                    onChange={(e) =>
                      setTripForm((p) => ({ ...p, name: e.target.value }))
                    }
                    style={{ ...inp, width: "100%" }}
                  />
                </div>
                <DateField
                  label="Start"
                  k="start"
                  val={tripForm}
                  set={setTripForm}
                />
                <DateField
                  label="End"
                  k="end"
                  val={tripForm}
                  set={setTripForm}
                />
                <div style={{ flex: "0 0 80px" }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#94a3b8",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Year
                  </div>
                  <input
                    type="number"
                    value={tripForm.year}
                    onChange={(e) =>
                      setTripForm((p) => ({ ...p, year: +e.target.value }))
                    }
                    style={{ ...inp, width: "100%" }}
                  />
                </div>
                <div style={{ width: "100%", marginTop: 4 }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Cities (in order)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    {tripForm.cities.map((city, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <input
                          value={city}
                          onChange={e => setTripForm(p => ({ ...p, cities: p.cities.map((c, j) => j === i ? e.target.value : c) }))}
                          style={{ ...inp, width: 110 }}
                        />
                        <button
                          onClick={() => setTripForm(p => ({ ...p, cities: p.cities.filter((_, j) => j !== i) }))}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 18, padding: "0 2px", lineHeight: 1 }}
                        >×</button>
                      </div>
                    ))}
                    <button
                      onClick={() => setTripForm(p => ({ ...p, cities: [...p.cities, ""] }))}
                      style={{ background: "#334155", border: "none", borderRadius: 7, cursor: "pointer", color: "#94a3b8", fontSize: 12, padding: "6px 12px", fontFamily: "inherit" }}
                    >+ Add</button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, width: "100%", marginTop: 4 }}>
                  <Btn variant="gold" onClick={saveTrip}>Save</Btn>
                  <Btn onClick={() => setEditTrip(false)}>Cancel</Btn>
                </div>
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                color: "#475569",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Total Spent
            </div>
            <div
              style={{
                fontSize: 28,
                fontFamily: "Georgia, serif",
                color: GOLD,
                lineHeight: 1.1,
              }}
            >
              ${grand.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: "#475569" }}>
              of ${BUDGET.toLocaleString()} budget ·{" "}
              {Math.round((grand / BUDGET) * 100)}%
            </div>
          </div>
        </div>

        {/* Budget progress bar */}
        <div
          style={{
            height: 3,
            background: "#1e293b",
            marginBottom: 0,
            borderRadius: 2,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min((grand / BUDGET) * 100, 100).toFixed(1)}%`,
              background: grand > BUDGET * 0.9 ? "#ef4444" : GOLD,
              borderRadius: 2,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", overflowX: "auto", marginTop: 2 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                padding: "10px 18px",
                whiteSpace: "nowrap",
                color: tab === t.id ? GOLD : "#475569",
                borderBottom: `2.5px solid ${tab === t.id ? GOLD : "transparent"}`,
                transition: "color 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content ─── */}
      <div style={{ padding: "24px 22px", maxWidth: 860, margin: "0 auto" }}>
        {tab === "overview" && renderOverview()}
        {tab === "flights" && renderFlights()}
        {tab === "stays" && renderStays()}
        {tab === "activities" && renderActivities()}
        {tab === "expenses" && renderExpenses()}
        {tab === "trash" && renderTrash()}
      </div>
    </div>
  );
}
