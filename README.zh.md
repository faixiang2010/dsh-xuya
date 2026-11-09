# DeepSeek Harness（xuya 二次开发版）

[English](README.md) | 中文

> **本项目说明**
>
> 本仓库是基于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）的**二次开发版本**，**并非官方仓库**。
>
> - 本仓库地址：<https://github.com/faixiang2010/dsh-xuya>
> - 需配合配套插件使用：[dsh-plugin / deepseek-harness-xuya](https://github.com/faixiang2010/dsh-plugin/tree/main/deepseek-harness-xuya)
>
> 原项目说明请参见官方文档：<https://deepseek-harness.github.io/deepseek-harness/>

## 本次二次开发内容

本 fork 在官方代码基础上主要做了产品品牌与展示层定制：

- **产品品牌定制**——新增 `product-brand` 模块（[apps/desktop/src/product-brand.ts](apps/desktop/src/product-brand.ts)、[scripts/product-brand.mjs](scripts/product-brand.mjs)）：在构建时注入产品名称、窗口背景色、Windows 图标/托盘图标，并附带对应测试。
- **桌面端**——安装包主题与多语言、欢迎页/欢迎窗口、启动流程、更新协调器等按定制品牌调整（[apps/desktop](apps/desktop)）。
- **Web UI**——启动页、主题与多语言文案改用定制产品名称（[packages/client](packages/client)）。
- **构建脚本**——构建与打包脚本透传品牌配置（[scripts/build.ts](scripts/build.ts)、[scripts/client-build-environment.ts](scripts/client-build-environment.ts)、[apps/web/vite.config.ts](apps/web/vite.config.ts)）。

## 运行

```sh
pnpm install
pnpm run build
pnpm dsh web
```

完整的运行与开发说明请参见官方文档：<https://deepseek-harness.github.io/deepseek-harness/>

## 许可证

[MIT](LICENSE)。第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
