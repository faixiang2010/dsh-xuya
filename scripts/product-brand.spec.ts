/** Brand configuration and self-contained runtime staging. */
import { afterEach, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { readProductBrand, stageProductBrandRuntime } from './product-brand.mjs'

const roots: string[] = []
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }) })
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'dsh-brand-'))
  roots.push(root)
  mkdirSync(join(root, 'assets'), { recursive: true })
  writeFileSync(join(root, 'assets/icon.png'), 'icon')
  writeFileSync(join(root, 'assets/favicon.svg'), '<svg/>')
  const config = {
    name: '叙芽岛', shortName: '叙芽岛', artifactName: 'xuya-island', manualUpdates: true,
    lightBackground: '#f4f2ec', darkBackground: '#19231f', favicon: 'assets/favicon.svg',
    windowsIcon: 'assets/icon.png', assetsDirectory: 'assets',
  }
  const file = join(root, 'brand.json')
  const save = (value: object): void => { writeFileSync(file, JSON.stringify(value)) }
  save(config)
  return { root, config, save, env: { DSH_BRAND_CONFIG: file } }
}
it('keeps ordinary builds independent of any customization files', () => {
  expect(readProductBrand({})).toBeUndefined()
})
it('resolves artwork relative to the brand document', () => {
  const f = fixture()
  expect(readProductBrand(f.env)?.windowsIcon).toBe(resolve(f.root, 'assets/icon.png'))
})
it.each([
  { name: '' }, { artifactName: '../escape' }, { lightBackground: 'red;}</style>' },
  { manualUpdates: 'yes' }, { windowsIcon: 'absent.png' }, { welcomeLogo: 'absent.svg' },
  { windowsTrayIcon: 42 }, { installerAssets: 'assets' }, { installerTheme: 'absent.nsh' },
])('rejects incomplete or unsafe brand configuration: %j', (invalid) => {
  const f = fixture()
  f.save({ ...f.config, ...invalid })
  expect(() => readProductBrand(f.env)).toThrow()
})
it('stages extension bytes and config before sealing without retaining a development link', () => {
  const f = fixture()
  const ui = join(f.root, 'ui')
  mkdirSync(join(ui, 'lib'), { recursive: true })
  writeFileSync(join(ui, 'lib/index.js'), 'export function apply() {}')
  writeFileSync(join(ui, 'package.json'), JSON.stringify({ name: '@example/brand-ui', version: '1.0.0', exports: { '.': './lib/index.js' }, devDependencies: { local: 'link:../source' } }))
  writeFileSync(join(f.root, 'patch.yml'), '- id: brand-ui\n  name: "@example/brand-ui"\n')
  f.save({ ...f.config, runtimeUiPackage: 'ui', runtimePatch: 'patch.yml' })
  const runtime = join(f.root, 'runtime')
  const web = join(runtime, 'node_modules/@deepseek-ai/dsh-web-app')
  mkdirSync(web, { recursive: true })
  writeFileSync(join(web, 'package.json'), JSON.stringify({ dependencies: {} }))
  writeFileSync(join(web, 'cordis.patch.yml'), '- id: web\n')
  stageProductBrandRuntime(runtime, f.env)
  const installed = join(runtime, 'node_modules/@example/brand-ui')
  expect(existsSync(join(installed, 'lib/index.js'))).toBe(true)
  expect(JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'))).not.toHaveProperty('devDependencies')
  expect(readFileSync(join(web, 'cordis.patch.yml'), 'utf8')).toContain('@example/brand-ui')
  expect(JSON.parse(readFileSync(join(web, 'package.json'), 'utf8'))).toMatchObject({ dependencies: { '@example/brand-ui': '1.0.0' } })
})
it('rejects a runtime package without its configuration patch', () => {
  const f = fixture()
  f.save({ ...f.config, runtimeUiPackage: 'ui' })
  expect(() => { stageProductBrandRuntime(join(f.root, 'runtime'), f.env) }).toThrow('supplied together')
})
