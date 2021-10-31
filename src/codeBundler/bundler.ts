import * as esbuild from "esbuild-wasm";
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {loadFilePlugin} from "./plugins/load-file-plugin";

type BundlerResponseType = {
  code: string,
  error: string
}

let isInitialized = false
export const bundler = async (rawCode: string): Promise<BundlerResponseType> => {
  if (!isInitialized) {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.13.4/esbuild.wasm'
    })
    isInitialized = true
  }

  try {
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
    return {
      code: result.outputFiles[0].text,
      error: ''
    }
  } catch (error: any) {
    return {
      code: '',
      error: error.message
    }
  }




}
