# Accountant Portfolio

## Structure
```
portfolio/
├── index.html
├── style.css
├── script.js
└── assets/
    └── profile.jpg   <- add your portrait here (4:5 ratio, ~800x1000px)
```

## Run it
Open `index.html` in a browser. No build step, no dependencies (fonts load from Google Fonts).

## Customize
- **Colors / fonts:** edit the tokens at the top of `style.css` (`:root`).
- **Content:** name, credentials, services, timeline and contact details are all plain HTML in `index.html`.
- **Ledger animation:** change the `data-d` (debit) and `data-c` (credit) values on the `.ledger__row` elements. Totals are calculated automatically, so keep debits and credits equal to show "Balanced".
- **Contact form:** currently validates and shows a confirmation only. Connect the `TODO` in `script.js` to Formspree, Netlify Forms, or your own endpoint to receive messages.
- **LinkedIn / phone:** replace the placeholder `href` values in the Contact section.

## Notes
- If `assets/profile.jpg` is missing, the portrait area falls back to a monogram, so the page never shows a broken image.
- Respects `prefers-reduced-motion`; all animations are skipped and content shows immediately.
