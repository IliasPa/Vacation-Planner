import express from 'express';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dir = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const pdfsDir = join(__dir, 'data', 'pdfs');
if (!existsSync(pdfsDir)) mkdirSync(pdfsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: pdfsDir,
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  fileFilter: (_, file, cb) => cb(null, file.mimetype === 'application/pdf'),
});

app.post('/api/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });
  res.json({ filename: req.file.filename });
});

app.use('/pdfs', express.static(pdfsDir));

const filePath = name => join(__dir, 'data', `${name}.json`);

const readData = name => {
  const items = JSON.parse(readFileSync(filePath(name), 'utf8'));
  return items.map(x => ({ ...x, deleted: x.deleted ?? false }));
};

const writeData = (name, data) =>
  writeFileSync(filePath(name), JSON.stringify(data, null, 2));

const RESOURCES = ['flights', 'stays', 'activities', 'misc', 'nextspot'];

RESOURCES.forEach(r => {
  app.get(`/api/${r}`, (_, res) => {
    try { res.json(readData(r)); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post(`/api/${r}`, (req, res) => {
    try {
      const items = readData(r);
      items.push(req.body);
      writeData(r, items);
      res.status(201).json(req.body);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.patch(`/api/${r}/:id`, (req, res) => {
    try {
      const items = readData(r);
      const idx = items.findIndex(x => x.id === Number(req.params.id));
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      items[idx] = { ...items[idx], ...req.body };
      writeData(r, items);
      res.json(items[idx]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete(`/api/${r}/:id`, (req, res) => {
    try {
      const items = readData(r).filter(x => x.id !== Number(req.params.id));
      writeData(r, items);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
});

// Trip config — single object, not an array
app.get('/api/trip', (_, res) => {
  try { res.json(JSON.parse(readFileSync(filePath('trip'), 'utf8'))); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/trip', (req, res) => {
  try {
    const current = JSON.parse(readFileSync(filePath('trip'), 'utf8'));
    const updated = { ...current, ...req.body };
    writeFileSync(filePath('trip'), JSON.stringify(updated, null, 2));
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Packing list — complex nested object, saved as whole
app.get('/api/packinglist', (_, res) => {
  try {
    const path = filePath('packinglist');
    if (!existsSync(path)) return res.json({ lists: [], laundryCycle: 3 });
    res.json(JSON.parse(readFileSync(path, 'utf8')));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/packinglist', (req, res) => {
  try {
    writeFileSync(filePath('packinglist'), JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Geocode — proxy to Nominatim (avoids CORS, sets proper User-Agent per ToS)
app.get('/api/geocode', async (req, res) => {
  const { q = '' } = req.query;
  if (!q.trim()) return res.json({});
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=1`;
    const r = await fetch(url, { headers: { 'User-Agent': 'VacationPlanner/3.1 (personal-travel-app)' } });
    const data = await r.json();
    if (!data.length) return res.json({});
    const top = data[0];
    res.json({
      lat: top.lat,
      lon: top.lon,
      country: top.address?.country || '',
      countryCode: top.address?.country_code?.toUpperCase() || '',
      displayName: top.display_name,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Currency exchange — proxy to frankfurter.app (avoids browser CORS issues)
app.get('/api/fx', async (req, res) => {
  const { from = 'USD', to = 'EUR' } = req.query;
  try {
    const r = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('API server → http://localhost:3001'));
