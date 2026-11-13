# DeepSeek Harness (xuya 二次开发版)

English | [中文](README.zh.md)

> **About this repository**
>
> This repository is a **secondary development fork** based on [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`). It is **not the official repository**.
>
> - This repository: <https://github.com/faixiang2010/dsh-xuya>
> - Must be used together with the companion plugin: [dsh-plugin / deepseek-harness-xuya](https://github.com/faixiang2010/dsh-plugin/tree/main/deepseek-harness-xuya)
>
> For the original project description, please refer to the official documentation: <https://deepseek-harness.github.io/deepseek-harness/>

## Modifications in this fork

This fork mainly customizes product branding and presentation on top of the official codebase:

- **Product brand customization** — new `product-brand` module ([apps/desktop/src/product-brand.ts](apps/desktop/src/product-brand.ts), [scripts/product-brand.mjs](scripts/product-brand.mjs)): injects product name, window background colors, and Windows icons/tray icons at build time, with corresponding test specs.
- **Desktop app** — installer theme and locales, welcome page/window, launch flow, and update coordinator adjusted for the custom brand ([apps/desktop](apps/desktop)).
- **Web UI** — boot page, theme, and locale copy adjusted to use the custom product name ([packages/client](packages/client)).
- **Build scripts** — build and packaging scripts pass through the brand configuration ([scripts/build.ts](scripts/build.ts), [scripts/client-build-environment.ts](scripts/client-build-environment.ts), [apps/web/vite.config.ts](apps/web/vite.config.ts)).

## Run

```sh
pnpm install
pnpm run build
pnpm dsh web
```

For full run/development instructions, see the official documentation: <https://deepseek-harness.github.io/deepseek-harness/>

## License

[MIT](LICENSE). Third-party dependencies and their licenses are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
