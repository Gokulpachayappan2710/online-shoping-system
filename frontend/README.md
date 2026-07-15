# Frontend: Search & Navigation

This folder contains a simple static frontend that demonstrates a search and navigation module for the online shopping system.

Files:
- index.html — main UI (search input, category navigation, results)
- styles.css — minimal styles
- app.js — plain JavaScript implementation with in-memory sample products

How to open:
- Open frontend/index.html in a browser (no build step required).

Notes:
- Currently uses in-memory sample data (sampleProducts in app.js). Replace with fetch() calls to your backend API (e.g., /api/products?q=...) to integrate with the server.
- Keyboard navigation: Up/Down to move between results, Enter to open.
