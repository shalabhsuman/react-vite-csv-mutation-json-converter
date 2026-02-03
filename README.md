# CSV to JSON React App

Simple React + Vite frontend that reads a CSV file in the browser and converts it to JSON.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Features

- Upload a `.csv` file from your machine
- Parses quoted values and escaped quotes
- Displays pretty-printed JSON in the UI
- Download converted output as `.json`
- Includes sample mutation CSV data (`public/dummy_mutation_data.csv`)
- One-click "Use sample data" for quick demos

## Publish to GitHub

```bash
git add .
git commit -m "Add sample data flow and UI improvements"
git remote add origin <your-github-repo-url>
git push -u origin main
```
