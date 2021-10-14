import * as esbuild from 'esbuild-wasm';
import axios from "axios";
import localforage from 'localforage';

const fileCacher = localforage.createInstance({
  name: 'modulesCacher'
})

export const loadFilePlugin = (inputCode: string) => {
  return {
    name: 'load-file-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({filter: /.*/}, async (args) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
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
      })
    }
  }
}
