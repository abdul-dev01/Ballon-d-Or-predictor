# Ballon d'Or 2026 — Countdown & Win Probability

Static site: countdown to the ceremony (26 Oct 2026, London) + a leaderboard
of nominees ranked by estimated win probability.

## Files
- `index.html` — page structure
- `style.css` — all styling, colors, the 3D flip-clock effect
- `script.js` — countdown logic + builds the leaderboard from `nominees.json`
- `nominees.json` — nominee data. **Replace this with your scraper/model output.**
  Same shape: `{ "name": "...", "club": "...", "probability": 0-100 }`

## Run it locally
Opening `index.html` directly by double-clicking will NOT load the nominee
list — browsers block `fetch()` on local files for security. Run a tiny local
server instead (you already have Python, so this needs no install):

```
cd ballon-dor-site
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Stop the server with `Ctrl+C`.

Messi's stats approximate the eligibility window using full MLS 2025 season data due to calendar misalignment with European leagues.

## Note on the probability numbers
These are estimates from stats, not the real jury result — the Ballon d'Or is
decided by journalist votes, not a formula. Say this on the page (already in
the footer) so nobody mistakes it for the actual outcome.
