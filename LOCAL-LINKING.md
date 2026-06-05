# Local linking

Use this when another local app needs to consume `@maxter-dev/ngx-components` without publishing to npm.

## Build the library

From this repository root:

```bash
npm install
npm run build
```

The package is built to:

```text
dist/ngx-components
```

## Fast local iteration

Terminal 1, from this repository root:

```bash
npm run build:themes
npx ng build ngx-components --watch --configuration development
```

Terminal 2, from the built package folder:

```bash
cd dist/ngx-components
npm link
```

Terminal 3, from the consuming Angular app:

```bash
npm link @maxter-dev/ngx-components
```

The consuming app still needs the library peer dependencies installed, for example Angular CDK and PrimeIcons.

## Reproducible local file dependency

For a less global setup, the consuming app can use a local file dependency that points at the built package:

```json
"@maxter-dev/ngx-components": "file:../../../maxterdev/dist/ngx-components"
```

This is useful for local development but should be used carefully in committed app manifests because the relative path assumes a sibling checkout layout.

## Theme CSS

Generated theme assets are emitted under:

```text
dist/ngx-components/assets/themes
```

StudiesPoint can use:

```scss
@import '@maxter-dev/ngx-components/assets/themes/studiespoint-theme.css';
```
