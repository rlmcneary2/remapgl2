# remapgl project

React components to create mapbox-gl maps declaratively.

Read the [docs at limnous](https://limnous.com/remapgl2/) for API and usage details.

## Publish

Execute the following steps starting in the workspace root directory (same as this file).

- Bump the libs/remapgl/package.json version field.
- Delete the `dist` directory.
- Build the library: `yarn build`
- Delete the comments that are added by Microsoft from the js files in `dist`.
- `cd` into the "dist/libs/remapgl" directory.
- `npm publish` using the same version as in the package.json file.
