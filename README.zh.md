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

## 品牌切换（原版 ↔ 叙芽岛定制）

本仓库和配套的叙芽岛定制项目**共享同一份构建产物**（`apps/web/dist/`）。**品牌信息（页面标题、图标、产品名称）是在"构建时"写死到 dist 里的**，不是运行时动态读取的。浏览器显示哪个品牌，取决于 dist 最后一次是谁构建的。

### 切回 DSH 原版品牌

在**本仓库根目录**下执行：

```powershell
# 清除品牌配置环境变量（PowerShell）
$env:DSH_BRAND_CONFIG = $null
# 不带品牌地重新构建
pnpm run build:artifacts
pnpm dsh web
```

浏览器 title 会显示 **DSH Local Build**。

### 切到叙芽岛品牌

到配套的叙芽岛定制项目里执行，它的脚本会自动设置 `DSH_BRAND_CONFIG` 并重新构建：

```powershell
pnpm run start:web
```

浏览器 title 会显示 **叙芽岛**。

### 为什么必须重建

两个项目写的是同一个 `apps/web/dist/` 目录。如果你之前跑过 xuya 的 `start:web`，dist 里就已经写死了"叙芽岛"。这时候不管你在哪个目录跑 `pnpm dsh web`，服务的都是那份旧 dist。**必须先清除 `DSH_BRAND_CONFIG` 再重建**，才能恢复原版品牌。整个过程不会删除任何会话数据，只是重新生成一份带不同品牌信息的前端静态资源。

## 许可证

[MIT](LICENSE)。第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
