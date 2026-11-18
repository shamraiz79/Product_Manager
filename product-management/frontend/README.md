# ProductManager frontend

React dashboard styled with Tailwind CSS, using Vite and Lucide icons.

## Run

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

## Build

```sh
npm run build
```

The dashboard uses the supplied reference's sample metrics and five demo products. Product changes and profile settings persist in browser localStorage. Summary totals adjust relative to the sample baseline; trend percentages and the 30-day period are illustrative. Product thumbnails use remote Unsplash images with an icon fallback. No backend connection is configured.
