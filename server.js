import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const filePath = name => join(__dir, 'data', `${name}.json`);

const readData = name => {
  const items = JSON.parse(readFileSync(filePath(name), 'utf8'));
  if (name === 'itinerary') return items;
  return items.map(x => ({ ...x, deleted: x.deleted ?? false }));
};

const writeData = (name, data) =>
  writeFileSync(filePath(name), JSON.stringify(data, null, 2));

const RESOURCES = ['flights', 'stays', 'activities', 'misc', 'itinerary'];

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

app.listen(3001, () => console.log('API server → http://localhost:3001'));
