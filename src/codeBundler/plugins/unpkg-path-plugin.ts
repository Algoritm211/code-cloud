import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

      // Handling the main index.js file (main entry file)
      build.onResolve({filter: /^index\.js$/}, () => {
        return {path: 'index.js', namespace: 'a'};
      })

      // Handling nesting modules (relative paths in modules)
      build.onResolve({filter: /^\.+\//}, (args) => {
        const path = new URL(
          args.path,
          `https://unpkg.com${args.resolveDir}/`).href
        return {
          path: path,
          namespace: 'a'
        }
      })

      // Handling main file of module
      build.onResolve({filter: /.*/}, async (args) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`
        }
      });
    },
  };
};
