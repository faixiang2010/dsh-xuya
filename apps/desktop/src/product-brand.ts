/** Compile-time desktop presentation; internal application identity and data locations remain independent. */
declare const __DSH_PRODUCT_BRAND__: DesktopProductBrand | undefined

/** Desktop presentation embedded by the validated build configuration. */
export interface DesktopProductBrand {
  name: string
  manualUpdates: boolean
  lightBackground: string
  darkBackground: string
  windowsIcon: string
  windowsTrayIcon?: string
}

/** Read the presentation selected when this artifact was built.
 * @returns Custom presentation, or undefined for an ordinary build.
 */
export function desktopProductBrand(): DesktopProductBrand | undefined {
  return typeof __DSH_PRODUCT_BRAND__ === 'undefined' ? undefined : __DSH_PRODUCT_BRAND__
}

/** Apply product-name copy while retaining the source dictionary and service identities.
 * @param messages Source dictionary.
 * @param name Product display name.
 * @returns A new dictionary with application-owned name placeholders replaced.
 */
export function productMessages<T extends Record<string, string>>(messages: T, name: string): T {
  const result = { ...messages }
  for (const [key, value] of Object.entries(messages)) {
    Object.assign(result, { [key]: value.replaceAll('DeepSeek Harness', name) })
  }
  return result
}
