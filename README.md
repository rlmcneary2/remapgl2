# remapgl project

React components to create mapbox-gl maps declaratively.

Details here: [libs/remapgl/README.md](libs/remapgl/README.md)

## Publish

Execute the following steps starting in the workspace root directory (same as this file).

- Bump the libs/remapgl/package.json version field.
- Delete the `dist` directory.
- Build the library: `yarn build`
- Delete the comments that are added by Microsoft from the js files in `dist`.
- `cd` into the "dist/libs/remapgl" directory.
- `npm publish` using the same version as in the package.json file.
