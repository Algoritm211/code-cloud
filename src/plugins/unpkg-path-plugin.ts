import * as esbuild from 'esbuild-wasm';
import axios from "axios";
import localforage from "localforage";

const fileCacher = localforage.createInstance({
  name: 'modulesCacher'
})

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({filter: /.*/}, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return {path: args.path, namespace: 'a'};
        }

        if (args.path.includes('./') || args.path.includes('../')){
          const path = new URL(
            args.path,
            `https://unpkg.com${args.resolveDir}/`).href
          return {
            path: path,
            namespace: 'a'
          }
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`
        }
      });

      build.onLoad({filter: /.*/}, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'react';
              console.log(message);
            `,
          };
        }

        const cachedData = await fileCacher.getItem<esbuild.OnLoadResult>(args.path)

        if (cachedData) {
          return cachedData
        }

        const {data, request} = await axios.get(args.path)

        const result: esbuild.OnLoadResult =  {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname
        }

        await fileCacher.setItem(args.path, result)

        return result
      });
    },
  };
};
