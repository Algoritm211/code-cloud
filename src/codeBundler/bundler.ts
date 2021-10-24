import * as esbuild from "esbuild-wasm";
import {unpkgPathPlugin} from "../plugins/unpkg-path-plugin";
import {loadFilePlugin} from "../plugins/load-file-plugin";


let isInitialized = false
export const bundler = async (rawCode: string): Promise<string> => {
  if (!isInitialized) {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.13.4/esbuild.wasm'
    })
    isInitialized = true
  }

  const result = await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [
      unpkgPathPlugin(),
      loadFilePlugin(rawCode)
    ],
    // For loading all packages in production mode
    // and replace global object to window in browser
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window'
    }
  })

  return result.outputFiles[0].text
}
