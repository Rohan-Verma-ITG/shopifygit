# Shopify Framer Theme

## Theme structure
This repository provides an OS 2.0-ready theme scaffold in `shopify-framer-theme/` with reusable Liquid sections, JSON templates, modular CSS, and lightweight JavaScript.

## How to install
1. Zip the `shopify-framer-theme` folder.
2. In Shopify admin, go to **Online Store → Themes → Add theme → Upload zip file**.
3. Publish the uploaded theme.

## Customize sections
1. Open **Customize** in the Shopify theme editor.
2. Add/remove sections from templates (`index`, `page`, `product`).
3. Use section controls for spacing, colors, alignment, content, and blocks.

## Deploy to Shopify
Use Shopify CLI:
```bash
shopify theme push --path shopify-framer-theme
```
For development preview:
```bash
shopify theme dev --path shopify-framer-theme
```
