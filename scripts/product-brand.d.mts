/** Validated local presentation consumed by the Web and desktop build tools. */
export interface ProductBrand {
  name: string
  shortName: string
  artifactName: string
  lightBackground: string
  darkBackground: string
  manualUpdates: boolean
  favicon: string
  windowsIcon: string
  windowsTrayIcon?: string
  installerAssets?: string
  installerTheme?: string
  assetsDirectory: string
  welcomeLogo?: string
  desktopStyles?: string
  runtimeUiPackage?: string
  runtimePatch?: string
}
/** Read an optional brand document; reject incomplete configuration before building.
 * @param env Build environment.
 * @returns Validated brand or undefined for an ordinary DSH build.
 */
export function readProductBrand(env?: NodeJS.ProcessEnv): ProductBrand | undefined
/** Copy the built extension and compose its YAML before runtime sealing.
 * @param root Prepared runtime directory.
 * @param env Brand build environment.
 * @returns Nothing.
 */
export function stageProductBrandRuntime(root: string, env?: NodeJS.ProcessEnv): void
