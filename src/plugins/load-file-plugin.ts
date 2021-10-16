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
      //Loading main file
      build.onLoad({filter: /^index\.js$/}, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      })

      // Loading caching result, if exists - going to next onLoad
      build.onLoad({filter: /.*/}, async (args) => {
        const cachedData = await fileCacher.getItem<esbuild.OnLoadResult>(args.path)

        if (cachedData) {
          return cachedData
        }
      })

      // Loading css files
      build.onLoad({filter: /.css$/}, async (args) => {
        const {data, request} = await axios.get<string>(args.path)

        const escapedCSS = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")

        const contents = `
           const style = document.createElement('style')
           style.innerText = '${escapedCSS}'
           document.head.appendChild(style)
          `
        const result: esbuild.OnLoadResult =  {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname
        }

        await fileCacher.setItem(args.path, result)
        return result
      })

      // Loading js and jsx files
      build.onLoad({filter: /.*/}, async (args) => {
        const {data, request} = await axios.get<string>(args.path)

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
