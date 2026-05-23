import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Trash2,
  RotateCcw,
  Plus,
  X,
  Hotel,
  Star,
  DollarSign,
  MapPin,
  Compass,
  Check,
  Pencil,
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

const TRANSPORT_TYPES = ["Flight", "Train", "Ferry", "Bus", "Car", "Other"];
const TRANSPORT_EMOJI = {
  Flight: "✈️",
  Train: "🚂",
  Ferry: "⛴️",
  Bus: "🚌",
  Car: "🚗",
  Other: "🚀",
};
const CURRENCIES = [
  "EUR",
  "THB",
  "USD",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "SEK",
  "NOK",
  "DKK",
  "HKD",
  "SGD",
  "INR",
  "MXN",
  "BRL",
  "TRY",
  "KRW",
  "NZD",
  "ZAR",
];
const CURRENCY_SYMBOL = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  CNY: "¥",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  HKD: "HK$",
  SGD: "S$",
  INR: "₹",
  MXN: "MX$",
  BRL: "R$",
  TRY: "₺",
  KRW: "₩",
  NZD: "NZ$",
  ZAR: "R",
  THB: "฿",
};
const sym = (c) => CURRENCY_SYMBOL[c] || c;

const CONTINENT_MAP = {
  AF:"Africa",AX:"Europe",AL:"Europe",DZ:"Africa",AS:"Oceania",AD:"Europe",
  AO:"Africa",AI:"North America",AQ:"Antarctica",AG:"North America",AR:"South America",
  AM:"Asia",AW:"North America",AU:"Oceania",AT:"Europe",AZ:"Asia",BS:"North America",
  BH:"Asia",BD:"Asia",BB:"North America",BY:"Europe",BE:"Europe",BZ:"North America",
  BJ:"Africa",BM:"North America",BT:"Asia",BO:"South America",BQ:"North America",
  BA:"Europe",BW:"Africa",BR:"South America",IO:"Asia",BN:"Asia",BG:"Europe",
  BF:"Africa",BI:"Africa",CV:"Africa",KH:"Asia",CM:"Africa",CA:"North America",
  KY:"North America",CF:"Africa",TD:"Africa",CL:"South America",CN:"Asia",CX:"Asia",
  CC:"Asia",CO:"South America",KM:"Africa",CG:"Africa",CD:"Africa",CK:"Oceania",
  CR:"North America",CI:"Africa",HR:"Europe",CU:"North America",CW:"North America",
  CY:"Europe",CZ:"Europe",DK:"Europe",DJ:"Africa",DM:"North America",DO:"North America",
  EC:"South America",EG:"Africa",SV:"North America",GQ:"Africa",ER:"Africa",
  EE:"Europe",SZ:"Africa",ET:"Africa",FK:"South America",FO:"Europe",FJ:"Oceania",
  FI:"Europe",FR:"Europe",GF:"South America",PF:"Oceania",TF:"Antarctica",GA:"Africa",
  GM:"Africa",GE:"Asia",DE:"Europe",GH:"Africa",GI:"Europe",GR:"Europe",
  GL:"North America",GD:"North America",GP:"North America",GU:"Oceania",
  GT:"North America",GG:"Europe",GN:"Africa",GW:"Africa",GY:"South America",
  HT:"North America",HM:"Antarctica",VA:"Europe",HN:"North America",HK:"Asia",
  HU:"Europe",IS:"Europe",IN:"Asia",ID:"Asia",IR:"Asia",IQ:"Asia",IE:"Europe",
  IM:"Europe",IL:"Asia",IT:"Europe",JM:"North America",JP:"Asia",JE:"Europe",
  JO:"Asia",KZ:"Asia",KE:"Africa",KI:"Oceania",KP:"Asia",KR:"Asia",KW:"Asia",
  KG:"Asia",LA:"Asia",LV:"Europe",LB:"Asia",LS:"Africa",LR:"Africa",LY:"Africa",
  LI:"Europe",LT:"Europe",LU:"Europe",MO:"Asia",MG:"Africa",MW:"Africa",MY:"Asia",
  MV:"Asia",ML:"Africa",MT:"Europe",MH:"Oceania",MQ:"North America",MR:"Africa",
  MU:"Africa",YT:"Africa",MX:"North America",FM:"Oceania",MD:"Europe",MC:"Europe",
  MN:"Asia",ME:"Europe",MS:"North America",MA:"Africa",MZ:"Africa",MM:"Asia",
  NA:"Africa",NR:"Oceania",NP:"Asia",NL:"Europe",NC:"Oceania",NZ:"Oceania",
  NI:"North America",NE:"Africa",NG:"Africa",NU:"Oceania",NF:"Oceania",MK:"Europe",
  MP:"Oceania",NO:"Europe",OM:"Asia",PK:"Asia",PW:"Oceania",PS:"Asia",
  PA:"North America",PG:"Oceania",PY:"South America",PE:"South America",PH:"Asia",
  PN:"Oceania",PL:"Europe",PT:"Europe",PR:"North America",QA:"Asia",RE:"Africa",
  RO:"Europe",RU:"Europe",RW:"Africa",BL:"North America",SH:"Africa",
  KN:"North America",LC:"North America",MF:"North America",PM:"North America",
  VC:"North America",WS:"Oceania",SM:"Europe",ST:"Africa",SA:"Asia",SN:"Africa",
  RS:"Europe",SC:"Africa",SL:"Africa",SG:"Asia",SX:"North America",SK:"Europe",
  SI:"Europe",SB:"Oceania",SO:"Africa",ZA:"Africa",GS:"Antarctica",SS:"Africa",
  ES:"Europe",LK:"Asia",SD:"Africa",SR:"South America",SJ:"Europe",SE:"Europe",
  CH:"Europe",SY:"Asia",TW:"Asia",TJ:"Asia",TZ:"Africa",TH:"Asia",TL:"Asia",
  TG:"Africa",TK:"Oceania",TO:"Oceania",TT:"North America",TN:"Africa",TR:"Asia",
  TM:"Asia",TC:"North America",TV:"Oceania",UG:"Africa",UA:"Europe",AE:"Asia",
  GB:"Europe",US:"North America",UM:"Oceania",UY:"South America",UZ:"Asia",
  VU:"Oceania",VE:"South America",VN:"Asia",VG:"North America",VI:"North America",
  WF:"Oceania",EH:"Africa",YE:"Asia",ZM:"Africa",ZW:"Africa",
};

const NS_TAGS = [
  "Beach","Mountains","City","Culture","Food","Adventure","History",
  "Nature","Shopping","Wellness","Nightlife","Island","Desert","Architecture","Road Trip",
];

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

const calcNights = (ci, co, year) => {
  const d1 = parseTripDate(ci, year);
  const d2 = parseTripDate(co, year);
  if (!d1 || !d2 || d2 <= d1) return 1;
  return Math.round((d2 - d1) / 86400000);
};

const uid = () => {
  const d = new Date();
  return Number(
    `${d.getFullYear()}` +
      `${String(d.getMonth() + 1).padStart(2, "0")}` +
      `${String(d.getDate()).padStart(2, "0")}` +
      `${String(d.getHours()).padStart(2, "0")}` +
      `${String(d.getMinutes()).padStart(2, "0")}` +
      `${String(d.getSeconds()).padStart(2, "0")}`,
  );
};

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
        {!val[k] && <option value="">— select —</option>}
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

const AddForm = ({ open, onCancel, onSave, saveLabel, children, pdfSide }) =>
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
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn variant="gold" onClick={onSave}>
              {saveLabel}
            </Btn>
            <Btn onClick={onCancel}>Cancel</Btn>
          </div>
        </div>
        {pdfSide && (
          <div
            style={{
              width: 300,
              flexShrink: 0,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <iframe
              src={`/pdfs/${pdfSide}`}
              style={{
                width: "100%",
                height: 440,
                border: "none",
                display: "block",
              }}
              title="PDF Preview"
            />
          </div>
        )}
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

const PdfInput = ({ value, onChange }) => (
  <div style={{ flex: 1, minWidth: 200 }}>
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
      PDF Attachment
    </div>
    <label style={{ cursor: "pointer" }}>
      <input
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      <div
        style={{
          ...inp,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: value ? "#059669" : "#94a3b8",
        }}
      >
        <span style={{ fontSize: 14 }}>📄</span>
        <span
          style={{
            fontSize: 12,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value ? value.replace(/^\d+-/, "") : "Choose PDF…"}
        </span>
      </div>
    </label>
  </div>
);

const PdfBtn = ({ pdf, onOpen }) =>
  pdf ? (
    <button
      onClick={() => onOpen(pdf)}
      title={pdf.replace(/^\d+-/, "")}
      style={{
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: 7,
        cursor: "pointer",
        padding: "4px 8px",
        fontSize: 14,
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      📄
    </button>
  ) : null;

const DeleteBtn = ({ onClick }) => (
  <Btn variant="ghost" onClick={onClick} style={{ flexShrink: 0 }}>
    <Trash2 size={14} />
  </Btn>
);

const WorldMap = ({ nextSpots, onCountryClick }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const geoLayerRef = useRef(null);
  const nextSpotsRef = useRef(nextSpots);
  const onClickRef = useRef(onCountryClick);

  useEffect(() => { nextSpotsRef.current = nextSpots; }, [nextSpots]);
  useEffect(() => { onClickRef.current = onCountryClick; }, [onCountryClick]);

  const countryStyle = (feature) => {
    const spots = nextSpotsRef.current.filter((s) => !s.deleted);
    const iso2 = feature.properties["ISO3166-1-Alpha-2"] || "";
    const name = (feature.properties["name"] || "").toLowerCase();
    const matches = spots.filter((s) => {
      const sc = (s.countryCode || "").toUpperCase();
      const sn = (s.country || "").toLowerCase();
      if (iso2 && sc && iso2.toUpperCase() === sc) return true;
      return sn && sn === name;
    });
    const status = matches.length === 0 ? "none" : matches.some((s) => s.visited) ? "visited" : "wishlist";
    return {
      fillColor: status === "visited" ? "#059669" : status === "wishlist" ? "#7c3aed" : "#cbd5e1",
      fillOpacity: status === "none" ? 0.55 : 0.8,
      color: "#fff",
      weight: 0.5,
      opacity: 0.7,
    };
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
      minZoom: 1,
      maxZoom: 8,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 8,
    }).addTo(map);
    mapRef.current = map;

    fetch("/countries.geojson")
      .then((r) => r.json())
      .then((data) => {
        const layer = L.geoJSON(data, {
          style: countryStyle,
          onEachFeature: (feature, lyr) => {
            lyr.on({
              click: () => onClickRef.current(feature),
              mouseover: (e) => {
                e.target.setStyle({ weight: 2, color: "#c9913b", fillOpacity: 0.9 });
                e.target.bringToFront();
              },
              mouseout: (e) => {
                layer.resetStyle(e.target);
              },
            });
          },
        }).addTo(map);
        geoLayerRef.current = layer;
      })
      .catch(() => {});
    return () => {
      map.remove();
      mapRef.current = null;
      geoLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!geoLayerRef.current) return;
    geoLayerRef.current.setStyle(countryStyle);
  }, [nextSpots]);

  return (
    <div style={{ position: "relative", marginBottom: 22 }}>
      <div ref={containerRef} style={{ height: 380, borderRadius: 12, overflow: "hidden", border: "1px solid #e8e4dc" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "flex-end" }}>
        {[{ color: "#059669", label: "Visited" }, { color: "#7c3aed", label: "Wishlist" }, { color: "#cbd5e1", label: "Not saved" }].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: "inline-block", flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function VacationPlanner() {
  const [tab, setTab] = useState("overview");
  const [flights, setFlights] = useState([]);
  const [stays, setStays] = useState([]);
  const [acts, setActs] = useState([]);
  const [misc, setMisc] = useState([]);
  const [trip, setTrip] = useState({
    name: "Summer Escape 2025",
    cities: ["Athens", "Santorini", "Rome", "Paris"],
    people: ["Ilias", "Diana", "Ilias2", "Diana2"],
    budget: 12000,
    start: "Jun 15",
    end: "Jul 5",
    year: 2025,
  });
  const [editTrip, setEditTrip] = useState(false);
  const [tripForm, setTripForm] = useState({
    name: "Summer Escape 2025",
    cities: ["Athens", "Santorini", "Rome", "Paris"],
    people: ["Ilias", "Diana", "Ilias2", "Diana2"],
    budget: 12000,
    start: "Jun 15",
    end: "Jul 5",
    year: 2025,
  });

  const [fxC1, setFxC1] = useState("EUR");
  const [fxC2, setFxC2] = useState("THB");
  const [fxRate, setFxRate] = useState(null);
  const [fxLoading, setFxLoading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const fxSaveReady = useRef(false);

  const fxAmt = (amount) => {
    if (!fxRate || fxC1 === fxC2 || !amount) return null;
    return `${sym(fxC2)} ${Math.round(amount * fxRate).toLocaleString()}`;
  };
  const pc = (amount) => `${sym(fxC1)}${Number(amount).toLocaleString()}`;

  const [addF, setAddF] = useState(false);
  const [addS, setAddS] = useState(false);
  const [addA, setAddA] = useState(false);
  const [addM, setAddM] = useState(false);
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [flightPdfSide, setFlightPdfSide] = useState(null);
  const [stayPdfSide, setStayPdfSide] = useState(null);

  const [packingData, setPackingData] = useState({
    lists: [],
    laundryCycle: 3,
  });
  const [activeListId, setActiveListId] = useState(null);
  const [addingItem, setAddingItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [editingQty, setEditingQty] = useState(null);

  const [nextSpots, setNextSpots] = useState([]);
  const [addNS, setAddNS] = useState(false);
  const [nns, setNns] = useState({ name: "", country: "", countryCode: "", continent: "", notes: "", visited: false, yearVisited: "", tags: [], lat: null, lon: null });
  const [nnsGeoStatus, setNnsGeoStatus] = useState(null);
  const [mapSidebar, setMapSidebar] = useState(null);
  const [editingSpotId, setEditingSpotId] = useState(null);
  const [editSpotData, setEditSpotData] = useState(null);
  const geoTimerRef = useRef(null);

  const [nf, setNf] = useState({
    type: "Flight",
    from: "",
    to: "",
    airline: "",
    no: "",
    date: "",
    time: "",
    price: "",
    pdf: "",
  });
  const [ns, setNs] = useState({
    city: CITIES[0],
    name: "",
    type: "",
    ci: "",
    co: "",
    n: "",
    ppn: "",
    totalPrice: "",
    pdf: "",
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
    fetch("/api/trip")
      .then((r) => r.json())
      .then((d) => {
        setTrip(d);
        setTripForm(d);
        if (d.fxC1) setFxC1(d.fxC1);
        if (d.fxC2) setFxC2(d.fxC2);
        fxSaveReady.current = true;
      });
    fetch("/api/packinglist")
      .then((r) => r.json())
      .then((d) => {
        setPackingData(d);
        if (d.lists?.length) setActiveListId(d.lists[0].id);
      });
    fetch("/api/nextspot")
      .then((r) => r.json())
      .then(setNextSpots);
  }, []);

  useEffect(() => {
    setFxLoading(true);
    setFxRate(null);
    fetch(`/api/fx?from=${fxC1}&to=${fxC2}`)
      .then((r) => r.json())
      .then((d) => {
        setFxRate(d.rates?.[fxC2] ?? null);
        setFxLoading(false);
      })
      .catch(() => setFxLoading(false));
  }, [fxC1, fxC2]);

  useEffect(() => {
    if (!fxSaveReady.current) return;
    fetch("/api/trip", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fxC1, fxC2 }),
    });
  }, [fxC1, fxC2]);

  useEffect(() => {
    if (!addNS || !nns.name.trim()) {
      setNnsGeoStatus(null);
      return;
    }
    clearTimeout(geoTimerRef.current);
    geoTimerRef.current = setTimeout(async () => {
      setNnsGeoStatus("loading");
      try {
        const q = [nns.name.trim(), nns.country.trim()].filter(Boolean).join(", ");
        const r = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        const d = await r.json();
        if (d.lat) {
          const cc = d.countryCode?.toUpperCase() || "";
          const continent = CONTINENT_MAP[cc] || null;
          setNnsGeoStatus({ country: d.country, continent, countryCode: cc, lat: parseFloat(d.lat), lon: parseFloat(d.lon) });
          setNns((p) => ({
            ...p,
            country: p.country.trim() ? p.country : (d.country || ""),
            countryCode: cc || p.countryCode || "",
            continent: continent || p.continent || "",
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon),
          }));
        } else {
          setNnsGeoStatus("error");
        }
      } catch {
        setNnsGeoStatus("error");
      }
    }, 600);
    return () => clearTimeout(geoTimerRef.current);
  }, [nns.name, addNS]);

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
  const BUDGET = trip.budget ?? 12000;

  const saveTrip = () => {
    setTrip(tripForm);
    fetch("/api/trip", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tripForm),
    });
    setEditTrip(false);
  };
  const saveBudget = () => {
    const val = +budgetInput;
    if (!val || val <= 0) {
      setEditBudget(false);
      return;
    }
    setTrip((p) => ({ ...p, budget: val }));
    setTripForm((p) => ({ ...p, budget: val }));
    fetch("/api/trip", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget: val }),
    });
    setEditBudget(false);
  };
  const tripStartD = parseTripDate(trip.start, trip.year);
  const tripEndD = parseTripDate(trip.end, trip.year);
  const tripDays =
    tripStartD && tripEndD
      ? Math.round((tripEndD - tripStartD) / 86400000)
      : "?";
  const tripLabel = `${trip.start} – ${trip.end}, ${trip.year}`;
  const cities = trip.cities?.length ? trip.cities : CITIES;
  const travelers = trip.people?.length ? trip.people : TRAVELERS;
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

  const uploadPdf = async (file, set) => {
    if (!file) return;
    const form = new FormData();
    form.append("pdf", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.filename) set((p) => ({ ...p, pdf: data.filename }));
  };

  const uploadFlightPdf = async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append("pdf", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const { filename } = await res.json();
    if (!filename) return;
    setNf((p) => ({ ...p, pdf: filename }));
    setFlightPdfSide(filename);
  };

  const uploadStayPdf = async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append("pdf", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const { filename } = await res.json();
    if (!filename) return;
    setNs((p) => ({ ...p, pdf: filename }));
    setStayPdfSide(filename);
  };

  const doAddFlight = () => {
    if (!nf.from || !nf.to || !nf.price) return;
    const item = { ...nf, id: uid(), price: +nf.price, deleted: false };
    setFlights((p) => [...p, item]);
    api.post("flights", item);
    setNf({
      type: "Flight",
      from: "",
      to: "",
      airline: "",
      no: "",
      date: "",
      time: "",
      price: "",
      pdf: "",
    });
    setFlightPdfSide(null);
    setAddF(false);
  };
  const doAddStay = () => {
    if (!ns.name || !ns.totalPrice) return;
    const computedN = calcNights(ns.ci, ns.co, trip.year);
    const computedPpn = +ns.totalPrice / computedN;
    const item = {
      ...ns,
      id: uid(),
      n: computedN,
      ppn: computedPpn,
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
      totalPrice: "",
      pdf: "",
    });
    setStayPdfSide(null);
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
      paidBy: travelers[0],
      involves: [...travelers],
    });
    setAddM(false);
  };

  /* ===== TABS ===== */

  const renderOverview = () => {
    const matchCity = (dest) => cities.find((c) => dest.includes(c)) || null;
    const activeFlights = flights
      .filter((f) => !f.deleted)
      .sort((a, b) => parseDate(a.date) - parseDate(b.date));
    const computedItinerary = [];
    if (cities.length > 0 && trip.start) {
      computedItinerary.push({
        emoji: "🌍",
        city: cities[0],
        date: trip.start,
        desc: "Trip begins",
      });
    }
    activeFlights.forEach((f) => {
      computedItinerary.push({
        emoji: TRANSPORT_EMOJI[f.type] || "✈️",
        city: matchCity(f.to) || f.to,
        date: f.date,
        desc: `${f.from} → ${f.to}${f.airline ? ` · ${f.airline}` : ""}`,
        pdf: f.pdf || null,
      });
    });

    return (
      <div>
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
            const cs = CITY_STYLE[city] || {
              dot: "#888",
              bg: "#f5f5f5",
              text: "#555",
              border: "#88888833",
            };
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
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{ fontSize: 14, fontWeight: 700, color: cs.text }}
                    >
                      {pc(total)}
                    </div>
                    {fxAmt(total) && (
                      <div
                        style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}
                      >
                        {fxAmt(total)}
                      </div>
                    )}
                  </div>
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
          {computedItinerary.map((ev, i) => {
            const cs = CITY_STYLE[ev.city] || {
              dot: "#888",
              bg: "#f5f5f5",
              text: "#555",
              border: "#88888833",
            };
            const isLast = i === computedItinerary.length - 1;
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
                    onClick={ev.pdf ? () => setPdfPreview(ev.pdf) : undefined}
                    title={ev.pdf ? ev.pdf.replace(/^\d+-/, "") : undefined}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: cs ? cs.bg : "#f1f5f9",
                      border: `1.5px solid ${ev.pdf ? GOLD : cs ? cs.border : "#e8e4dc"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                      cursor: ev.pdf ? "pointer" : "default",
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
          title="Transport"
          sub={`${active.length} legs · ${sym(fxC1)}${fTotal.toLocaleString()} total`}
          onAdd={() => setAddF((f) => !f)}
        />

        <AddForm
          open={addF}
          onCancel={() => {
            setAddF(false);
            setFlightPdfSide(null);
          }}
          onSave={doAddFlight}
          saveLabel="Add Flight"
          pdfSide={flightPdfSide}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Field
              label="Type"
              k="type"
              val={nf}
              set={setNf}
              opts={TRANSPORT_TYPES}
            />
            <Field label="From" k="from" val={nf} set={setNf} opts={cities} />
            <Field label="To" k="to" val={nf} set={setNf} opts={cities} />
            <Field label="Operator" k="airline" val={nf} set={setNf} />
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Field label="No. / Ref" k="no" val={nf} set={setNf} />
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
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PdfInput value={nf.pdf} onChange={uploadFlightPdf} />
          </div>
        </AddForm>

        {active.map((f) => (
          <div
            key={f.id}
            style={{ ...card, display: "flex", alignItems: "center", gap: 14 }}
          >
            <div
              onClick={f.pdf ? () => setPdfPreview(f.pdf) : undefined}
              title={f.pdf ? f.pdf.replace(/^\d+-/, "") : undefined}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#dbeafe",
                border: `1.5px solid ${f.pdf ? GOLD : "#dbeafe"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 18,
                cursor: f.pdf ? "pointer" : "default",
              }}
            >
              {TRANSPORT_EMOJI[f.type] || "✈️"}
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
                {f.type && f.type !== "Flight" && (
                  <span
                    style={{
                      background: "#f1f5f9",
                      color: "#475569",
                      borderRadius: 5,
                      padding: "1px 6px",
                      fontSize: 10,
                      fontWeight: 700,
                      marginRight: 6,
                    }}
                  >
                    {f.type}
                  </span>
                )}
                {f.airline} · {f.no}
                {f.date ? ` · ${f.date}` : ""}
                {f.time ? ` · ${f.time}` : ""}
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
                {pc(f.price)}
              </div>
              {fxAmt(f.price) && (
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>
                  {fxAmt(f.price)}
                </div>
              )}
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
            Total Transport
          </span>
          <span
            style={{ fontFamily: "Georgia, serif", fontSize: 20, color: GOLD }}
          >
            {pc(fTotal)}
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
          sub={`${active.length} stays · ${sym(fxC1)}${sTotal.toLocaleString()} total`}
          onAdd={() => setAddS((s) => !s)}
        />

        <AddForm
          open={addS}
          onCancel={() => {
            setAddS(false);
            setStayPdfSide(null);
          }}
          onSave={doAddStay}
          saveLabel="Add Stay"
          pdfSide={stayPdfSide}
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
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <DateField label="Check-in" k="ci" val={ns} set={setNs} />
            <DateField label="Check-out" k="co" val={ns} set={setNs} />
            <Field
              label="Total Price ($)"
              k="totalPrice"
              val={ns}
              set={setNs}
              type="number"
            />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PdfInput value={ns.pdf} onChange={uploadStayPdf} />
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
                  {pc(s.ppn)}/night
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 18,
                      color: NAVY,
                    }}
                  >
                    {pc(s.n * s.ppn)}
                  </div>
                  {fxAmt(s.n * s.ppn) && (
                    <div
                      style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}
                    >
                      {fxAmt(s.n * s.ppn)}
                    </div>
                  )}
                </div>
                <PdfBtn pdf={s.pdf} onOpen={setPdfPreview} />
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
            {pc(sTotal)}
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
          sub={`${active.length} experiences · ${sym(fxC1)}${aTotal.toLocaleString()} total`}
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
                  {cityActs.length} activities · {pc(cityTotal)}
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
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 16,
                        color: NAVY,
                      }}
                    >
                      {pc(a.price)}
                    </div>
                    {fxAmt(a.price) && (
                      <div
                        style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}
                      >
                        {fxAmt(a.price)}
                      </div>
                    )}
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
            {pc(aTotal)}
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
              Total: {pc(grand)} of {pc(BUDGET)} budget ·{" "}
              {Math.round((grand / BUDGET) * 100)}% used
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
              {pc(grand)} /{" "}
              {editBudget ? (
                <input
                  autoFocus
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  onBlur={saveBudget}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveBudget();
                    if (e.key === "Escape") setEditBudget(false);
                  }}
                  style={{
                    width: 90,
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    color: "#64748b",
                    background: "#f8fafc",
                    border: "1px solid #c9913b",
                    borderRadius: 5,
                    padding: "1px 6px",
                    outline: "none",
                  }}
                />
              ) : (
                <span
                  onClick={() => {
                    setBudgetInput(BUDGET);
                    setEditBudget(true);
                  }}
                  title="Click to edit budget"
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px dotted #94a3b8",
                  }}
                >
                  {pc(BUDGET)}
                </span>
              )}
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
            {pc(BUDGET - grand)} remaining
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
                    formatter={(v) => [`${pc(Number(v))}`, ""]}
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
                    {pc(row.value)}
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
              opts={travelers}
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
              {travelers.map((t) => (
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
                              · {sym(fxC1)}
                              {(m.price / m.involves.length).toFixed(0)}
                              /person
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {m.date && (
                  <div
                    style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}
                  >
                    {m.date}
                  </div>
                )}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 16,
                      color: NAVY,
                    }}
                  >
                    {pc(m.price)}
                  </div>
                  {fxAmt(m.price) && (
                    <div
                      style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}
                    >
                      {fxAmt(m.price)}
                    </div>
                  )}
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
                    {pc(t.amt)}
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
            {pc(grand)}
          </span>
        </div>
      </div>
    );
  };

  const renderPackingList = () => {
    const allLists = packingData.lists || [];
    const laundryCycle = packingData.laundryCycle || 3;
    const tripDaysNum = typeof tripDays === "number" ? tripDays : 7;
    const activeList = allLists.find((l) => l.id === activeListId);

    const savePacking = (newData) => {
      setPackingData(newData);
      fetch("/api/packinglist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
    };

    const CALC_OPTIONS = [
      { value: "fixed", label: "Fixed qty" },
      { value: "laundry", label: "per Laundry" },
      { value: "destinations", label: "per Destination" },
      { value: "flights", label: "per Flight" },
      { value: "hotels", label: "per Stay" },
      { value: "activities", label: "per Activity" },
      { value: "people", label: "per Person" },
    ];

    const calcMultiplier = (calc) => {
      switch (calc) {
        case "laundry":
          return Math.max(1, Math.ceil(tripDaysNum / laundryCycle));
        case "destinations":
          return cities.length;
        case "flights":
          return flights.filter((f) => !f.deleted).length;
        case "hotels":
          return stays.filter((s) => !s.deleted).length;
        case "activities":
          return acts.filter((a) => !a.deleted).length;
        case "people":
          return travelers.length;
        default:
          return 1;
      }
    };

    const getQty = (item) => {
      if (item.perDay)
        return Math.max(1, Math.ceil(tripDaysNum / laundryCycle));
      const base = item.qty || 1;
      const calc = item.calc || "fixed";
      return calc === "fixed" ? base : base * calcMultiplier(calc);
    };

    const updateItem = (listId, sectionId, itemId, changes) => {
      savePacking({
        ...packingData,
        lists: allLists.map((list) =>
          list.id !== listId
            ? list
            : {
                ...list,
                sections: list.sections.map((sec) =>
                  sec.id !== sectionId
                    ? sec
                    : {
                        ...sec,
                        items: sec.items.map((item) =>
                          item.id !== itemId ? item : { ...item, ...changes },
                        ),
                      },
                ),
              },
        ),
      });
    };

    const toggleItem = (listId, sectionId, itemId) => {
      savePacking({
        ...packingData,
        lists: allLists.map((list) =>
          list.id !== listId
            ? list
            : {
                ...list,
                sections: list.sections.map((sec) =>
                  sec.id !== sectionId
                    ? sec
                    : {
                        ...sec,
                        items: sec.items.map((item) =>
                          item.id !== itemId
                            ? item
                            : { ...item, checked: !item.checked },
                        ),
                      },
                ),
              },
        ),
      });
    };

    const resetList = (listId) => {
      savePacking({
        ...packingData,
        lists: allLists.map((list) =>
          list.id !== listId
            ? list
            : {
                ...list,
                sections: list.sections.map((sec) => ({
                  ...sec,
                  items: sec.items.map((item) => ({ ...item, checked: false })),
                })),
              },
        ),
      });
    };

    const addItem = (listId, sectionId) => {
      if (!newItemName.trim()) return;
      const newItem = {
        id: `custom-${Date.now()}`,
        name: newItemName.trim(),
        qty: 1,
        perDay: false,
        checked: false,
      };
      savePacking({
        ...packingData,
        lists: allLists.map((list) =>
          list.id !== listId
            ? list
            : {
                ...list,
                sections: list.sections.map((sec) =>
                  sec.id !== sectionId
                    ? sec
                    : { ...sec, items: [...sec.items, newItem] },
                ),
              },
        ),
      });
      setNewItemName("");
      setAddingItem(null);
    };

    const deleteItem = (listId, sectionId, itemId) => {
      savePacking({
        ...packingData,
        lists: allLists.map((list) =>
          list.id !== listId
            ? list
            : {
                ...list,
                sections: list.sections.map((sec) =>
                  sec.id !== sectionId
                    ? sec
                    : {
                        ...sec,
                        items: sec.items.filter((item) => item.id !== itemId),
                      },
                ),
              },
        ),
      });
    };

    const addSection = (listId) => {
      if (!newSectionName.trim()) return;
      const ts = Date.now();
      const newSec = {
        id: `sec-${ts}`,
        name: newSectionName.trim(),
        icon: "📦",
        items: [],
      };
      savePacking({
        ...packingData,
        lists: allLists.map((list) =>
          list.id !== listId
            ? list
            : { ...list, sections: [...list.sections, newSec] },
        ),
      });
      setNewSectionName("");
      setAddingSection(false);
    };

    const deleteSection = (listId, sectionId) => {
      savePacking({
        ...packingData,
        lists: allLists.map((list) =>
          list.id !== listId
            ? list
            : {
                ...list,
                sections: list.sections.filter((sec) => sec.id !== sectionId),
              },
        ),
      });
    };

    const createList = () => {
      if (!newListName.trim()) return;
      const ts = Date.now();
      const newList = {
        id: `list-${ts}`,
        name: newListName.trim(),
        builtIn: false,
        icon: "📋",
        sections: [
          { id: `sec-docs-${ts}`, name: "Documents", icon: "📄", items: [] },
          { id: `sec-cloth-${ts}`, name: "Clothing", icon: "👕", items: [] },
          { id: `sec-toilet-${ts}`, name: "Toiletries", icon: "🧴", items: [] },
          { id: `sec-gadgets-${ts}`, name: "Gadgets", icon: "📱", items: [] },
          { id: `sec-other-${ts}`, name: "Other", icon: "📦", items: [] },
        ],
      };
      const newData = { ...packingData, lists: [...allLists, newList] };
      setActiveListId(newList.id);
      savePacking(newData);
      setNewListName("");
      setShowNewList(false);
    };

    const deleteList = (listId) => {
      const newLists = allLists.filter((l) => l.id !== listId);
      if (activeListId === listId)
        setActiveListId(newLists.length ? newLists[0].id : null);
      savePacking({ ...packingData, lists: newLists });
    };

    const totalItems = activeList
      ? activeList.sections.reduce((s, sec) => s + sec.items.length, 0)
      : 0;
    const checkedItems = activeList
      ? activeList.sections.reduce(
          (s, sec) => s + sec.items.filter((i) => i.checked).length,
          0,
        )
      : 0;
    const progressPct =
      totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    const hasClothing = activeList?.sections.some((s) => s.name === "Clothing");

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
            Packing List
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Keep track of what to pack for your trip
          </p>
        </div>

        {/* List selector pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          {allLists.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1.5px solid ${activeListId === list.id ? GOLD : "#e2e8f0"}`,
                background: activeListId === list.id ? "#fef9ef" : "white",
                color: activeListId === list.id ? GOLD : "#475569",
                fontWeight: activeListId === list.id ? 700 : 400,
                cursor: "pointer",
                fontSize: 13,
                transition: "all 0.15s",
              }}
            >
              {list.icon} {list.name}
              {list.builtIn && (
                <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 4 }}>
                  ★
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => setShowNewList((v) => !v)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1.5px dashed #e2e8f0",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            + New List
          </button>
        </div>

        {/* New list form */}
        {showNewList && (
          <div
            style={{
              background: "white",
              border: "1.5px dashed #c9913b",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 18,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              placeholder="List name…"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createList();
                if (e.key === "Escape") {
                  setShowNewList(false);
                  setNewListName("");
                }
              }}
              autoFocus
              style={{
                flex: 1,
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 14,
                outline: "none",
              }}
            />
            <Btn variant="gold" onClick={createList}>
              Create
            </Btn>
            <Btn
              variant="ghost"
              onClick={() => {
                setShowNewList(false);
                setNewListName("");
              }}
            >
              Cancel
            </Btn>
          </div>
        )}

        {/* Active list */}
        {activeList && (
          <div>
            {/* List header card */}
            <div
              style={{
                background: "white",
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 14,
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 17, fontWeight: 600, color: NAVY }}>
                  {activeList.icon} {activeList.name}
                  {activeList.builtIn && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        marginLeft: 8,
                        fontWeight: 400,
                      }}
                    >
                      Built-in template
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>
                  {checkedItems} of {totalItems} items packed
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {checkedItems > 0 && (
                  <Btn variant="ghost" onClick={() => resetList(activeList.id)}>
                    Reset All
                  </Btn>
                )}
                {!activeList.builtIn && (
                  <Btn
                    variant="danger"
                    onClick={() => deleteList(activeList.id)}
                  >
                    <Trash2 size={14} />
                  </Btn>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {totalItems > 0 && (
              <div
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "12px 20px",
                  marginBottom: 14,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 7,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    Packing progress
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: progressPct === 100 ? "#059669" : GOLD,
                    }}
                  >
                    {progressPct}%
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
                      width: `${progressPct}%`,
                      background: progressPct === 100 ? "#059669" : GOLD,
                      borderRadius: 4,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                {progressPct === 100 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#059669",
                      marginTop: 8,
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    ✓ All packed and ready to go!
                  </div>
                )}
              </div>
            )}

            {/* Clothing calculation note */}
            {hasClothing && typeof tripDays === "number" && (
              <div
                style={{
                  background: "#fffbf0",
                  border: "1px solid #f5e4c3",
                  borderRadius: 10,
                  padding: "10px 16px",
                  marginBottom: 14,
                  fontSize: 13,
                  color: "#92400e",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span>
                  👕 Clothing amounts calculated for{" "}
                  <strong>{tripDays}-day trip</strong>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  · Laundry every
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={laundryCycle}
                    onChange={(e) => {
                      const val = Math.max(
                        1,
                        Math.min(30, +e.target.value || 1),
                      );
                      savePacking({ ...packingData, laundryCycle: val });
                    }}
                    style={{
                      width: 40,
                      textAlign: "center",
                      border: "1px solid #f5e4c3",
                      borderRadius: 6,
                      padding: "2px 4px",
                      fontSize: 13,
                      background: "white",
                      color: "#92400e",
                      outline: "none",
                    }}
                  />
                  days ·{" "}
                  <span style={{ color: GOLD, fontWeight: 600 }}>
                    ★ = calculated per cycle
                  </span>
                </span>
              </div>
            )}

            {/* Sections */}
            {activeList.sections.map((section) => {
              const totalSec = section.items.length;
              const checkedSec = section.items.filter((i) => i.checked).length;
              const isCollapsed = collapsedSections.has(section.id);
              const isAddingHere = addingItem === section.id;

              return (
                <div
                  key={section.id}
                  style={{
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    marginBottom: 12,
                    overflow: "hidden",
                  }}
                >
                  {/* Section header */}
                  <div
                    onClick={() => {
                      const next = new Set(collapsedSections);
                      if (isCollapsed) next.delete(section.id);
                      else next.add(section.id);
                      setCollapsedSections(next);
                    }}
                    style={{
                      padding: "12px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      borderBottom: isCollapsed ? "none" : "1px solid #f1f5f9",
                      userSelect: "none",
                      background:
                        checkedSec === totalSec && totalSec > 0
                          ? "#f0fdf4"
                          : "white",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span style={{ fontSize: 16 }}>{section.icon}</span>
                      <span
                        style={{ fontWeight: 600, color: NAVY, fontSize: 14 }}
                      >
                        {section.name}
                      </span>
                      {totalSec > 0 && (
                        <span
                          style={{
                            background:
                              checkedSec === totalSec ? "#dcfce7" : "#f1f5f9",
                            color:
                              checkedSec === totalSec ? "#16a34a" : "#64748b",
                            borderRadius: 10,
                            padding: "1px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {checkedSec}/{totalSec}
                        </span>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {!activeList.builtIn && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSection(activeList.id, section.id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#cbd5e1",
                            padding: "2px 4px",
                            borderRadius: 4,
                            lineHeight: 1,
                          }}
                          title="Delete section"
                        >
                          <X size={13} />
                        </button>
                      )}
                      <span style={{ color: "#94a3b8", fontSize: 11 }}>
                        {isCollapsed ? "▶" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* Section items */}
                  {!isCollapsed && (
                    <div>
                      {section.items.length === 0 && !isAddingHere && (
                        <div
                          style={{
                            padding: "12px 18px",
                            fontSize: 13,
                            color: "#94a3b8",
                            fontStyle: "italic",
                          }}
                        >
                          No items yet
                        </div>
                      )}
                      {section.items.map((item) => {
                        const qty = getQty(item);
                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: "9px 18px",
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              borderBottom: "1px solid #f8fafc",
                              background: item.checked ? "#f8fafc" : "white",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() =>
                                toggleItem(activeList.id, section.id, item.id)
                              }
                              style={{
                                width: 16,
                                height: 16,
                                cursor: "pointer",
                                accentColor: GOLD,
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                flex: 1,
                                fontSize: 14,
                                color: item.checked ? "#94a3b8" : NAVY,
                                textDecoration: item.checked
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {item.name}
                            </span>
                            {activeList.builtIn ? (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: item.perDay ? GOLD : "#94a3b8",
                                  fontWeight: item.perDay ? 700 : 400,
                                  minWidth: 32,
                                  textAlign: "right",
                                }}
                              >
                                ×{qty}
                                {item.perDay ? "★" : ""}
                              </span>
                            ) : editingQty === item.id ? (
                              <div
                                onBlur={(e) => {
                                  if (
                                    !e.currentTarget.contains(e.relatedTarget)
                                  )
                                    setEditingQty(null);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  flexShrink: 0,
                                }}
                              >
                                <input
                                  type="number"
                                  min={1}
                                  value={item.qty || 1}
                                  autoFocus
                                  onChange={(e) =>
                                    updateItem(
                                      activeList.id,
                                      section.id,
                                      item.id,
                                      {
                                        qty: Math.max(1, +e.target.value || 1),
                                      },
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === "Escape")
                                      setEditingQty(null);
                                  }}
                                  style={{
                                    width: 36,
                                    textAlign: "center",
                                    border: `1px solid ${GOLD}`,
                                    borderRadius: 6,
                                    padding: "2px",
                                    fontSize: 12,
                                    outline: "none",
                                    color: NAVY,
                                  }}
                                />
                                <select
                                  value={item.calc || "fixed"}
                                  onChange={(e) =>
                                    updateItem(
                                      activeList.id,
                                      section.id,
                                      item.id,
                                      { calc: e.target.value },
                                    )
                                  }
                                  style={{
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 6,
                                    padding: "2px 4px",
                                    fontSize: 11,
                                    outline: "none",
                                    background: "white",
                                    color: "#475569",
                                    cursor: "pointer",
                                  }}
                                >
                                  {CALC_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div
                                onClick={() => setEditingQty(item.id)}
                                title="Click to edit"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  flexShrink: 0,
                                  cursor: "pointer",
                                }}
                              >
                                {item.calc && item.calc !== "fixed" ? (
                                  <span
                                    style={{
                                      fontSize: 12,
                                      color: GOLD,
                                      fontWeight: 700,
                                    }}
                                  >
                                    ×{qty}
                                  </span>
                                ) : (
                                  <span
                                    style={{ fontSize: 12, color: "#94a3b8" }}
                                  >
                                    ×{qty}
                                  </span>
                                )}
                              </div>
                            )}
                            {!activeList.builtIn && (
                              <button
                                onClick={() =>
                                  deleteItem(activeList.id, section.id, item.id)
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#e2e8f0",
                                  padding: "2px",
                                  borderRadius: 4,
                                  lineHeight: 1,
                                }}
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Add item (custom lists only) */}
                      {!activeList.builtIn && (
                        <div style={{ padding: "8px 18px" }}>
                          {isAddingHere ? (
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                              }}
                            >
                              <input
                                placeholder="Item name…"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    addItem(activeList.id, section.id);
                                  if (e.key === "Escape") {
                                    setAddingItem(null);
                                    setNewItemName("");
                                  }
                                }}
                                autoFocus
                                style={{
                                  flex: 1,
                                  border: "1px solid #e2e8f0",
                                  borderRadius: 8,
                                  padding: "5px 10px",
                                  fontSize: 13,
                                  outline: "none",
                                }}
                              />
                              <Btn
                                variant="gold"
                                onClick={() =>
                                  addItem(activeList.id, section.id)
                                }
                              >
                                Add
                              </Btn>
                              <Btn
                                variant="ghost"
                                onClick={() => {
                                  setAddingItem(null);
                                  setNewItemName("");
                                }}
                              >
                                <X size={12} />
                              </Btn>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setAddingItem(section.id);
                                setNewItemName("");
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#94a3b8",
                                cursor: "pointer",
                                fontSize: 12,
                                padding: "2px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Plus size={12} /> Add item
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add section (custom lists only) */}
            {!activeList.builtIn && (
              <div style={{ marginTop: 8 }}>
                {addingSection ? (
                  <div
                    style={{
                      background: "white",
                      border: "1.5px dashed #c9913b",
                      borderRadius: 12,
                      padding: "12px 18px",
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <input
                      placeholder="Section name…"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addSection(activeList.id);
                        if (e.key === "Escape") {
                          setAddingSection(false);
                          setNewSectionName("");
                        }
                      }}
                      autoFocus
                      style={{
                        flex: 1,
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <Btn
                      variant="gold"
                      onClick={() => addSection(activeList.id)}
                    >
                      Add Section
                    </Btn>
                    <Btn
                      variant="ghost"
                      onClick={() => {
                        setAddingSection(false);
                        setNewSectionName("");
                      }}
                    >
                      Cancel
                    </Btn>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingSection(true);
                      setNewSectionName("");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1.5px dashed #e2e8f0",
                      borderRadius: 12,
                      background: "transparent",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Plus size={14} /> Add Section
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!activeList && !showNewList && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎒</div>
            <div style={{ fontSize: 16, marginBottom: 8, color: "#64748b" }}>
              No list selected
            </div>
            <div style={{ fontSize: 13, marginBottom: 20 }}>
              Choose a template above or create a custom list
            </div>
            <Btn variant="gold" onClick={() => setShowNewList(true)}>
              Create a List
            </Btn>
          </div>
        )}
      </div>
    );
  };

  const renderTrash = () => {
    const GROUPS = [
      { key: "f", emoji: "✈️", label: "Flights" },
      { key: "s", emoji: "🏨", label: "Stays" },
      { key: "a", emoji: "🎭", label: "Activities" },
      { key: "m", emoji: "📦", label: "Expenses" },
    ];
    const groups = GROUPS.map((g) => ({
      ...g,
      items: trash.filter((x) => x.type === g.key),
    })).filter((g) => g.items.length > 0);

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
            {groups.map((group, gi) => (
              <div
                key={group.key}
                style={{ marginBottom: gi < groups.length - 1 ? 24 : 0 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{group.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>
                    {group.label}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    {group.items.length}
                  </span>
                </div>
                {group.items.map((item) => (
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#64748b",
                        }}
                      >
                        {item.label}
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
                        {pc(item.amt)}
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

  const renderNextSpot = () => {
    const resetNns = () => {
      setNns({ name: "", country: "", countryCode: "", continent: "", notes: "", visited: false, yearVisited: "", tags: [], lat: null, lon: null });
      setNnsGeoStatus(null);
    };
    const addSpot = () => {
      if (!nns.name.trim()) return;
      const item = {
        id: Date.now(),
        name: nns.name.trim(),
        country: nns.country.trim(),
        countryCode: nns.countryCode || "",
        continent: nns.continent.trim(),
        notes: nns.notes.trim(),
        visited: nns.visited,
        yearVisited: nns.visited && nns.yearVisited ? parseInt(nns.yearVisited) : null,
        tags: nns.tags,
        lat: nns.lat,
        lon: nns.lon,
      };
      setNextSpots((p) => [...p, item]);
      api.post("nextspot", item);
      resetNns();
      setAddNS(false);
    };
    const delSpot = (id) => {
      setNextSpots((p) => p.filter((x) => x.id !== id));
      api.del("nextspot", id);
    };

    // Stats
    const countries = [...new Set(nextSpots.map((s) => s.country).filter(Boolean))];
    const continents = [...new Set(nextSpots.map((s) => s.continent).filter(Boolean))];
    const visitedSpots = nextSpots.filter((s) => s.visited);
    const yearMap = {};
    visitedSpots.forEach((s) => { if (s.yearVisited) yearMap[s.yearVisited] = (yearMap[s.yearVisited] || 0) + 1; });
    const years = Object.entries(yearMap).sort(([a], [b]) => Number(a) - Number(b));
    const maxYearCount = years.length ? Math.max(...years.map(([, c]) => c)) : 1;
    const tagMap = {};
    nextSpots.forEach((s) => (s.tags || []).forEach((t) => { tagMap[t] = (tagMap[t] || 0) + 1; }));
    const topTags = Object.entries(tagMap).sort(([, a], [, b]) => b - a);

    return (
      <div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontFamily: "Georgia, serif", fontWeight: "normal", color: NAVY }}>
              Next Stop
            </h2>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
              Places you want to visit someday
            </div>
          </div>
          <Btn variant="gold" onClick={() => setAddNS((v) => !v)}>
            <Plus size={15} />
            Add Place
          </Btn>
        </div>

        {/* World Map */}
        {(() => {
          const handleCountryClick = (feature) => {
            const iso2 = feature.properties["ISO3166-1-Alpha-2"] || "";
            const countryName = feature.properties["name"] || "";
            const activeSpots = nextSpots.filter((s) => !s.deleted);
            const spots = activeSpots.filter((s) => {
              const sc = (s.countryCode || "").toUpperCase();
              const sn = (s.country || "").toLowerCase();
              if (iso2 && sc && iso2.toUpperCase() === sc) return true;
              return sn && sn === countryName.toLowerCase();
            });
            const status = spots.length === 0 ? "none" : spots.some((s) => s.visited) ? "visited" : "wishlist";
            setMapSidebar({ countryName, iso2, status, spots });
          };

          const quickAdd = (visited) => {
            if (!mapSidebar) return;
            const { countryName, iso2 } = mapSidebar;
            const continent = CONTINENT_MAP[iso2] || "";
            const item = {
              id: Date.now(),
              name: countryName,
              country: countryName,
              countryCode: iso2,
              continent,
              notes: "",
              visited,
              yearVisited: null,
              tags: [],
              lat: null,
              lon: null,
            };
            setNextSpots((p) => [...p, item]);
            api.post("nextspot", item);
            setMapSidebar((prev) => {
              const newSpots = [...(prev?.spots || []), item];
              const newStatus = newSpots.some((s) => s.visited) ? "visited" : "wishlist";
              return { ...prev, spots: newSpots, status: newStatus };
            });
          };

          const statusColor = mapSidebar?.status === "visited" ? "#059669" : mapSidebar?.status === "wishlist" ? "#7c3aed" : "#94a3b8";
          const statusLabel = mapSidebar?.status === "visited" ? "Visited" : mapSidebar?.status === "wishlist" ? "On Wishlist" : "Not saved";

          return (
            <div style={{ position: "relative", marginBottom: 22 }}>
              <WorldMap nextSpots={nextSpots.filter((s) => !s.deleted)} onCountryClick={handleCountryClick} />
              {mapSidebar && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 270,
                    maxHeight: 380,
                    background: "white",
                    borderRadius: "0 12px 12px 0",
                    boxShadow: "-4px 0 20px rgba(0,0,0,0.18)",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{mapSidebar.countryName}</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4, background: mapSidebar.status === "visited" ? "#d1fae5" : mapSidebar.status === "wishlist" ? "#ede9fe" : "#f1f5f9", borderRadius: 20, padding: "2px 10px" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: statusColor }}>{statusLabel}</span>
                        </div>
                      </div>
                      <button onClick={() => setMapSidebar(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20, lineHeight: 1, padding: "0 2px", flexShrink: 0 }}>×</button>
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", padding: "10px 16px" }}>
                    {mapSidebar.spots.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Saved Places</div>
                        {mapSidebar.spots.map((s) => (
                          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #f8fafc" }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.visited ? "#059669" : "#7c3aed", flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: NAVY, flex: 1 }}>{s.name}</span>
                            {s.visited && <span style={{ fontSize: 10, color: "#059669", fontWeight: 700 }}>✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Quick Add</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <button onClick={() => quickAdd(false)} style={{ border: "1.5px solid #7c3aed", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, padding: "7px 12px", background: "#f5f3ff", color: "#7c3aed", fontWeight: 600, textAlign: "left" }}>
                        + Add to Wishlist
                      </button>
                      <button onClick={() => quickAdd(true)} style={{ border: "1.5px solid #059669", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, padding: "7px 12px", background: "#f0fdf4", color: "#059669", fontWeight: 600, textAlign: "left" }}>
                        ✓ Mark as Visited
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Stats Dashboard */}
        {nextSpots.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
              {[
                { value: nextSpots.length, label: "Places" },
                { value: countries.length, label: "Countries" },
                { value: continents.length, label: "Continents" },
                { value: visitedSpots.length, label: "Visited" },
              ].map(({ value, label }) => (
                <div key={label} style={{ background: "white", borderRadius: 12, border: "1px solid #e8e4dc", padding: "14px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontFamily: "Georgia, serif", color: NAVY, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            {years.length > 0 && (
              <div style={{ ...card, marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Visited By Year</div>
                {years.map(([year, count]) => (
                  <div key={year} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                    <div style={{ width: 38, fontSize: 12, color: "#64748b", flexShrink: 0, fontFamily: "Georgia, serif" }}>{year}</div>
                    <div style={{ flex: 1, height: 14, background: "#f1f5f9", borderRadius: 7, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(count / maxYearCount) * 100}%`, background: GOLD, borderRadius: 7, transition: "width 0.4s ease" }} />
                    </div>
                    <div style={{ width: 18, fontSize: 12, color: "#94a3b8", textAlign: "right", flexShrink: 0 }}>{count}</div>
                  </div>
                ))}
              </div>
            )}

            {topTags.length > 0 && (
              <div style={{ ...card }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Top Tags</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {topTags.map(([tag, count]) => (
                    <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "#475569" }}>
                      {tag}
                      <span style={{ background: GOLD, color: "white", borderRadius: 10, padding: "0 5px", fontSize: 10, fontWeight: 700 }}>{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Form */}
        {addNS && (
          <div style={{ ...card, marginBottom: 18, background: "#fafaf8" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <div style={{ flex: 2, minWidth: 150 }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Place *</div>
                <input style={inp} placeholder="e.g. Kyoto" value={nns.name} onChange={(e) => setNns((p) => ({ ...p, name: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addSpot()} autoFocus />
                {nnsGeoStatus === "loading" && (
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>📍 Locating…</div>
                )}
                {nnsGeoStatus && nnsGeoStatus !== "loading" && nnsGeoStatus !== "error" && (
                  <div style={{ fontSize: 11, color: "#059669", marginTop: 4 }}>
                    ✓ {nnsGeoStatus.country}{nnsGeoStatus.continent ? ` · ${nnsGeoStatus.continent}` : ""}
                  </div>
                )}
                {nnsGeoStatus === "error" && (
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Location not found — fill manually</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Country / Region</div>
                <input style={inp} placeholder="e.g. Japan" value={nns.country} onChange={(e) => setNns((p) => ({ ...p, country: e.target.value }))} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
              <input style={inp} placeholder="e.g. Cherry blossom season in April" value={nns.notes} onChange={(e) => setNns((p) => ({ ...p, notes: e.target.value }))} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Tags</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {NS_TAGS.map((tag) => (
                  <button key={tag} type="button"
                    onClick={() => setNns((p) => ({ ...p, tags: p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : [...p.tags, tag] }))}
                    style={{ border: "none", borderRadius: 20, cursor: "pointer", fontSize: 12, padding: "4px 12px", fontFamily: "inherit", background: nns.tags.includes(tag) ? GOLD : "#f1f5f9", color: nns.tags.includes(tag) ? "white" : "#475569" }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <button type="button" onClick={() => setNns((p) => ({ ...p, visited: !p.visited }))}
                style={{ width: 38, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: nns.visited ? GOLD : "#e2e8f0", position: "relative", transition: "background 0.15s", padding: 0, flexShrink: 0 }}>
                <span style={{ position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.15s", left: nns.visited ? 19 : 3 }} />
              </button>
              <span style={{ fontSize: 13, color: "#475569" }}>Already visited</span>
              {nns.visited && (
                <input style={{ ...inp, width: 90 }} type="number" placeholder="Year" value={nns.yearVisited}
                  onChange={(e) => setNns((p) => ({ ...p, yearVisited: e.target.value }))} min="1900" max="2099" />
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="gold" onClick={addSpot}>Save</Btn>
              <Btn variant="default" onClick={() => { setAddNS(false); resetNns(); }}>Cancel</Btn>
            </div>
          </div>
        )}

        {/* Empty state */}
        {nextSpots.length === 0 && !addNS ? (
          <div style={{ textAlign: "center", padding: "70px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.3 }}>🌍</div>
            <div style={{ fontSize: 16, fontFamily: "Georgia, serif" }}>No places saved yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Add places you dream of visiting</div>
          </div>
        ) : (
          <div>
            {nextSpots.map((spot) => {
              if (editingSpotId === spot.id && editSpotData) {
                const ed = editSpotData;
                const setEd = (fn) => setEditSpotData((p) => fn(p));
                const saveSpot = () => {
                  const updated = {
                    ...ed,
                    name: ed.name.trim(),
                    country: (ed.country || "").trim(),
                    notes: (ed.notes || "").trim(),
                    yearVisited: ed.visited && ed.yearVisited ? parseInt(ed.yearVisited) : null,
                  };
                  setNextSpots((p) => p.map((s) => s.id === updated.id ? updated : s));
                  api.patch("nextspot", updated.id, updated);
                  setEditingSpotId(null);
                  setEditSpotData(null);
                };
                return (
                  <div key={spot.id} style={{ ...card, background: "#fafaf8", border: "1.5px solid #c9913b44", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                      <div style={{ flex: 2, minWidth: 150 }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Place</div>
                        <input style={inp} value={ed.name} onChange={(e) => setEd((p) => ({ ...p, name: e.target.value }))} autoFocus />
                      </div>
                      <div style={{ flex: 1, minWidth: 120 }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Country / Region</div>
                        <input style={inp} value={ed.country || ""} onChange={(e) => setEd((p) => ({ ...p, country: e.target.value }))} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
                      <input style={inp} value={ed.notes || ""} onChange={(e) => setEd((p) => ({ ...p, notes: e.target.value }))} placeholder="Any reminder…" />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Tags</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {NS_TAGS.map((tag) => (
                          <button key={tag} type="button"
                            onClick={() => setEd((p) => ({ ...p, tags: (p.tags || []).includes(tag) ? p.tags.filter((t) => t !== tag) : [...(p.tags || []), tag] }))}
                            style={{ border: "none", borderRadius: 20, cursor: "pointer", fontSize: 12, padding: "4px 12px", fontFamily: "inherit", background: (ed.tags || []).includes(tag) ? GOLD : "#f1f5f9", color: (ed.tags || []).includes(tag) ? "white" : "#475569" }}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <button type="button" onClick={() => setEd((p) => ({ ...p, visited: !p.visited }))}
                        style={{ width: 38, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: ed.visited ? GOLD : "#e2e8f0", position: "relative", transition: "background 0.15s", padding: 0, flexShrink: 0 }}>
                        <span style={{ position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.15s", left: ed.visited ? 19 : 3 }} />
                      </button>
                      <span style={{ fontSize: 13, color: "#475569" }}>Already visited</span>
                      {ed.visited && (
                        <input style={{ ...inp, width: 90 }} type="number" placeholder="Year" value={ed.yearVisited || ""}
                          onChange={(e) => setEd((p) => ({ ...p, yearVisited: e.target.value }))} min="1900" max="2099" />
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn variant="gold" onClick={saveSpot}>Save</Btn>
                      <Btn variant="default" onClick={() => { setEditingSpotId(null); setEditSpotData(null); }}>Cancel</Btn>
                    </div>
                  </div>
                );
              }

              return (
                <div key={spot.id} style={{ ...card, display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: spot.visited ? "#d1fae5" : "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {spot.visited ? <Check size={18} color="#059669" /> : <Compass size={18} color="#2563eb" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 7, flexWrap: "wrap", marginBottom: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>{spot.name}</span>
                      {spot.country && <span style={{ fontSize: 12, color: "#94a3b8" }}>{spot.country}</span>}
                      {spot.continent && (
                        <span style={{ fontSize: 11, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1px 7px" }}>{spot.continent}</span>
                      )}
                      {spot.visited && spot.yearVisited && (
                        <span style={{ fontSize: 11, color: "#065f46", background: "#d1fae5", borderRadius: 10, padding: "1px 7px" }}>{spot.yearVisited}</span>
                      )}
                      {spot.visited && !spot.yearVisited && (
                        <span style={{ fontSize: 11, color: "#065f46", background: "#d1fae5", borderRadius: 10, padding: "1px 7px" }}>Visited</span>
                      )}
                    </div>
                    {spot.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{spot.notes}</div>}
                    {spot.tags?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {spot.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: 11, background: "#f1f5f9", color: "#475569", borderRadius: 20, padding: "2px 9px", border: "1px solid #e2e8f0" }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 2, flexShrink: 0, marginTop: -2 }}>
                    <Btn variant="ghost" onClick={() => { setEditingSpotId(spot.id); setEditSpotData({ ...spot }); }}>
                      <Pencil size={13} />
                    </Btn>
                    <Btn variant="ghost" onClick={() => delSpot(spot.id)}>
                      <Trash2 size={14} />
                    </Btn>
                  </div>
                </div>
              );
            })}
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
    { id: "packing", label: "Packing List" },
    { id: "trash", label: `Trash${trash.length ? ` (${trash.length})` : ""}` },
    { id: "nextspot", label: "Next Stop" },
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
              <span>
                🌍 {tripDays} days · {cities.length} destinations
              </span>
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
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <select
                  value={fxC1}
                  onChange={(e) => setFxC1(e.target.value)}
                  style={{
                    fontSize: 11,
                    background: "#1e293b",
                    color: "#94a3b8",
                    border: "1px solid #334155",
                    borderRadius: 5,
                    padding: "2px 4px",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span style={{ color: "#475569" }}>→</span>
                <select
                  value={fxC2}
                  onChange={(e) => setFxC2(e.target.value)}
                  style={{
                    fontSize: 11,
                    background: "#1e293b",
                    color: "#94a3b8",
                    border: "1px solid #334155",
                    borderRadius: 5,
                    padding: "2px 4px",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span style={{ color: GOLD, fontSize: 11, minWidth: 80 }}>
                  {fxLoading
                    ? "…"
                    : fxRate !== null
                      ? `1 ${sym(fxC1)} = ${fxRate.toFixed(4)} ${sym(fxC2)}`
                      : "—"}
                </span>
              </span>
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
                    Cities (in order)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      alignItems: "center",
                    }}
                  >
                    {tripForm.cities.map((city, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <input
                          value={city}
                          onChange={(e) =>
                            setTripForm((p) => ({
                              ...p,
                              cities: p.cities.map((c, j) =>
                                j === i ? e.target.value : c,
                              ),
                            }))
                          }
                          style={{ ...inp, width: 110 }}
                        />
                        <button
                          onClick={() =>
                            setTripForm((p) => ({
                              ...p,
                              cities: p.cities.filter((_, j) => j !== i),
                            }))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#64748b",
                            fontSize: 18,
                            padding: "0 2px",
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setTripForm((p) => ({
                          ...p,
                          cities: [...p.cities, ""],
                        }))
                      }
                      style={{
                        background: "#334155",
                        border: "none",
                        borderRadius: 7,
                        cursor: "pointer",
                        color: "#94a3b8",
                        fontSize: 12,
                        padding: "6px 12px",
                        fontFamily: "inherit",
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
                <div style={{ width: "100%", marginTop: 4 }}>
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
                    People
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      alignItems: "center",
                    }}
                  >
                    {(tripForm.people ?? []).map((person, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <input
                          value={person}
                          onChange={(e) =>
                            setTripForm((p) => ({
                              ...p,
                              people: p.people.map((c, j) =>
                                j === i ? e.target.value : c,
                              ),
                            }))
                          }
                          style={{ ...inp, width: 110 }}
                        />
                        <button
                          onClick={() =>
                            setTripForm((p) => ({
                              ...p,
                              people: p.people.filter((_, j) => j !== i),
                            }))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#64748b",
                            fontSize: 18,
                            padding: "0 2px",
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setTripForm((p) => ({
                          ...p,
                          people: [...(p.people ?? []), ""],
                        }))
                      }
                      style={{
                        background: "#334155",
                        border: "none",
                        borderRadius: 7,
                        cursor: "pointer",
                        color: "#94a3b8",
                        fontSize: 12,
                        padding: "6px 12px",
                        fontFamily: "inherit",
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    width: "100%",
                    marginTop: 4,
                  }}
                >
                  <Btn variant="gold" onClick={saveTrip}>
                    Save
                  </Btn>
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
              {pc(grand)}
            </div>
            <div style={{ fontSize: 11, color: "#475569" }}>
              of {pc(BUDGET)} budget · {Math.round((grand / BUDGET) * 100)}%
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
        {tab === "packing" && renderPackingList()}
        {tab === "trash" && renderTrash()}
        {tab === "nextspot" && renderNextSpot()}
      </div>

      {/* ─── PDF Preview Modal ─── */}
      {pdfPreview && (
        <div
          onClick={() => setPdfPreview(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 12,
              overflow: "hidden",
              width: "min(90vw, 900px)",
              height: "min(90vh, 1100px)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                background: NAVY,
                color: "white",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 13, color: "#94a3b8" }}>
                {pdfPreview.replace(/^\d+-/, "")}
              </span>
              <button
                onClick={() => setPdfPreview(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontSize: 20,
                  lineHeight: 1,
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            </div>
            <iframe
              src={`/pdfs/${pdfPreview}`}
              style={{ flex: 1, border: "none", width: "100%" }}
              title={pdfPreview.replace(/^\d+-/, "")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
