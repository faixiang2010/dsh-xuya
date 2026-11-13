/** Read optional product artwork for a source build; omitted configuration preserves DSH. */
import { readFileSync, existsSync, cpSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/** Resolve and validate a local JSON brand document.
 * @param {NodeJS.ProcessEnv} [env] Build environment.
 * @returns {import('./product-brand.d.mts').ProductBrand | undefined} Validated paths and presentation.
 */
export function readProductBrand(env = process.env) {
  if (env.DSH_BRAND_CONFIG === undefined) return undefined
  const file = resolve(env.DSH_BRAND_CONFIG)
  const value = JSON.parse(readFileSync(file, 'utf8'))
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('product brand: expected a JSON object')
  for (const key of ['name', 'shortName', 'artifactName', 'favicon', 'windowsIcon', 'assetsDirectory']) {
    if (typeof value[key] !== 'string' || value[key].trim() === '') throw new Error('product brand: missing '+key)
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(value.artifactName)) throw new Error('product brand: artifactName must be a lowercase filename stem')
  for (const key of ['lightBackground','darkBackground']) {
    if (typeof value[key] !== 'string' || !/^#[0-9a-f]{6}$/i.test(value[key])) throw new Error('product brand: invalid '+key)
  }
  if (typeof value.manualUpdates !== 'boolean') throw new Error('product brand: manualUpdates must be boolean')
  const paths = Object.fromEntries(['favicon','windowsIcon','assetsDirectory'].map(key => {
    const path=resolve(dirname(file),value[key])
    if (!existsSync(path)) throw new Error('product brand: missing '+path)
    return [key,path]
  }))
  if ((value.runtimeUiPackage === undefined) !== (value.runtimePatch === undefined)) throw new Error('product brand: runtimeUiPackage and runtimePatch must be supplied together')
  const optionalPaths = Object.fromEntries(['welcomeLogo', 'desktopStyles', 'runtimeUiPackage', 'runtimePatch', 'windowsTrayIcon', 'installerAssets', 'installerTheme'].map(key => {
    if (value[key] === undefined) return [key, undefined]
    if (typeof value[key] !== 'string' || value[key].trim() === '') throw new Error('product brand: invalid '+key)
    const path = resolve(dirname(file), value[key])
    if (!existsSync(path)) throw new Error('product brand: missing '+path)
    return [key, path]
  }))
  if (optionalPaths.installerAssets !== undefined) {
    for (const name of ['brand', 'brand-2x', 'brand-dark', 'brand-dark-2x', 'uninstaller-sidebar']) {
      if (!existsSync(resolve(optionalPaths.installerAssets, name+'.png'))) throw new Error('product brand: missing installer artwork '+name)
    }
  }
  return { name:value.name, shortName:value.shortName, artifactName:value.artifactName,
    lightBackground:value.lightBackground,darkBackground:value.darkBackground,
    manualUpdates:value.manualUpdates,favicon:paths.favicon,windowsIcon:paths.windowsIcon,assetsDirectory:paths.assetsDirectory,
    ...optionalPaths }
}

/** Copy built extension bytes before the runtime inventory is sealed.
 * @param {string} root Prepared runtime with its own node_modules.
 * @param {NodeJS.ProcessEnv} [env] Brand build environment.
 * @returns {void}
 */
export function stageProductBrandRuntime(root, env = process.env) {
  const brand = readProductBrand(env)
  if (brand?.runtimeUiPackage === undefined && brand?.runtimePatch === undefined) return
  if (brand?.runtimeUiPackage === undefined || brand.runtimePatch === undefined) throw new Error('product brand: runtimeUiPackage and runtimePatch must be supplied together')
  const manifest = JSON.parse(readFileSync(resolve(brand.runtimeUiPackage, 'package.json'), 'utf8'))
  if (typeof manifest.name !== 'string' || !/^@[a-z0-9-]+\/[a-z0-9-]+$/.test(manifest.name)) throw new Error('product brand: invalid UI package name')
  const destination=resolve(root, 'node_modules', manifest.name)
  mkdirSync(destination,{recursive:true})
  cpSync(resolve(brand.runtimeUiPackage,'lib'),resolve(destination,'lib'),{recursive:true})
  const { devDependencies, ...runtimeManifest } = manifest
  writeFileSync(resolve(destination,'package.json'),JSON.stringify(runtimeManifest,null,2)+'\n')
  const webRoot=resolve(root,'node_modules/@deepseek-ai/dsh-web-app')
  const webManifestPath=resolve(webRoot,'package.json')
  const webManifest=JSON.parse(readFileSync(webManifestPath,'utf8'))
  webManifest.dependencies[manifest.name]=manifest.version
  writeFileSync(webManifestPath,JSON.stringify(webManifest,null,2)+'\n')
  const patchFile=resolve(webRoot,'cordis.patch.yml')
  writeFileSync(patchFile,readFileSync(patchFile,'utf8').trimEnd()+'\n'+readFileSync(brand.runtimePatch,'utf8').trim()+'\n')
}
