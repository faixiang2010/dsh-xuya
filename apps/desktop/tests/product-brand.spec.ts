/** Custom branding preserves the original dictionaries and third-party service names. */
import { expect, it } from 'vitest'
import { desktopProductBrand, productMessages } from '../src/product-brand.ts'
it('keeps the ordinary source build unbranded', () => {
  expect(desktopProductBrand()).toBeUndefined()
})
it('replaces application names without changing service names or the input dictionary', () => {
  const original = { app: 'About DeepSeek Harness', service: 'DeepSeek API', command: 'dsh' }
  expect(productMessages(original, '叙芽岛')).toEqual({ app: 'About 叙芽岛', service: 'DeepSeek API', command: 'dsh' })
  expect(original.app).toBe('About DeepSeek Harness')
})
