# AIVELA Shopify Front 对话整理（2026-04-27）

## 1. 目标背景

- 你提供了 `frontCode`（Figma 生成的前端页面代码），希望与当前 `aivela-shopify-front`（Hydrogen 项目）结合。
- 你的核心目标是：
  - 保留自定义页面视觉（不使用 Shopify 默认模板风格）。
  - 使用 Shopify/Hydrogen 提供的标准电商后端能力（商品、购物车、结账、账号等）。
  - 逐步实现“设计主导 + 电商能力接入”的架构。

---

## 2. 代码与架构判断结论

- `frontCode` 是 Vite + React + shadcn/ui 风格页面壳子，偏静态展示层。
- `aivela-shopify-front` 是 Hydrogen + React Router + Storefront API 的标准电商骨架。
- 推荐方式：
  - 展示层：迁移/还原 Figma 页面。
  - 数据层：通过 `loader` 调 Shopify Storefront API。
  - 交易层：通过 Hydrogen 的 `CartForm` / Cart API 做加购与结账链路。

---

## 3. 已完成的主要改动

### 3.1 新增适配路由与页面

- 新增：`app/routes/design-adapt.jsx`
- 作用：
  - 承载 Figma 页面适配版。
  - 接入 Shopify 商品查询。
  - 接入加购能力（打开购物车侧栏）。
  - 提供静态视觉 fallback 内容（方式A）。

### 3.2 新增/调整样式

- 修改：`app/styles/app.css`
- 增加了 `design-adapt` 相关样式区块：
  - Hero、配色区、功能卡片、规格区、场景区、CTA 区。
  - 多轮布局与比例细调，优化与截图一致度。

### 3.3 路由页布局隔离

- 修改：`app/components/PageLayout.jsx`
- 在 `/design-adapt` 路由下临时隐藏全局 `Header/Footer`，减少 Hydrogen 默认布局对页面还原的干扰。

---

## 4. 关键问题与排查记录

### 4.1 启动后 500 报错

- 现象：页面显示 `An unexpected error occurred`
- 根因：`SESSION_SECRET` 缺失
  - 报错位置：`app/lib/context.js`
  - 错误信息：`SESSION_SECRET environment variable is not set`
- 处理：
  - 新建/完善 `.env`
  - 加入 `SESSION_SECRET`
  - 补齐 Hydrogen 常见环境变量占位项
  - 重启 dev 服务后恢复

### 4.2 “看不到 frontCode 图文内容”

- 原因：第一版是“最小可运行接入”，不是整页 1:1 视觉迁移。
- 处理：
  - 升级为方式A（静态图文优先）版本。
  - 商品能力保留、视觉统一增强。

### 4.3 排版与图片大小不一致

- 原因：
  - 原 Figma/Vite 运行环境与 Hydrogen 页面容器不同。
  - 全局样式（reset/app.css）干扰。
  - 图片比例、字体、断点不同造成偏差。
- 处理：
  - 做了多轮样式微调（间距、字号、比例、区块节奏）。

---

## 5. 关于图片资产与方式A/方式B的结论

- 检查 `frontCode` 结果：
  - 未发现本地图片文件（png/jpg/webp/svg 等）。
  - 主要使用外链图（Unsplash URL）。
- 因此：
  - 可以先走 **方式A**：静态 URL 映射（已执行）。
  - 后续可升级到 **方式B**：把图片上传 Shopify（Files/Metaobject）后，改成后台可配置读取。

---

## 6. 对能力边界的最终共识

你确认并接受的架构认知：

- Hydrogen 前端仓：
  - 页面展示、交互、路由、标准电商能力编排。
- Shopify 后端能力：
  - 商品、购物车、结账、账号、订单等核心能力。
- 超出标准电商能力：
  - 会员积分、复杂促销、个性化推荐、ERP/WMS/OMS 深度集成、裂变返佣等。
  - 通常建议独立后端服务仓实现，不建议全部堆在前端仓。

---

## 7. 模块归属表（对话中产出的结论）

- 前端仓（`aivela-shopify-front`）：
  - UI 页面、按钮交互、Hydrogen 路由、Storefront/Cart/Account 接入编排。
- Shopify：
  - 商品/库存/价格配置、标准购物车与结账能力、账号与订单基础能力。
- 自建后端（建议新仓）：
  - 复杂会员、复杂促销引擎、推荐策略、系统集成、风控合规、售后工单等。

---

## 8. 多端展示结论（Web/小程序/App）

- 是否能“不用模板”做多端：可以。
- 是否能“一套页面代码零改动跑所有端”：通常不现实。
- 是否能“一个代码库管理多端”：可以，推荐 Monorepo。

### 8.1 当前技术栈定位

- 当前仓库 `aivela-shopify-front` 使用的是 React + Hydrogen（Web 优先）。
- 该仓适合承载 Web/H5 电商前端，不直接等价于小程序/App 运行时。

### 8.2 多端实现的可行方案

- 推荐架构：一个仓库，多应用 + 共享包
  - `apps/web`：Hydrogen（现有）
  - `apps/miniapp`：Taro/uni-app
  - `apps/app`：React Native/Flutter（或 H5 WebView 过渡）
  - `packages/*`：共享 API SDK、业务规则、设计 tokens

### 8.3 框架选型讨论结论

- React 技术栈下，如果目标是尽量多端复用，Taro 是现实方案之一。
- 不是“必须 Taro”，但在你当前 React 基础上迁移成本相对更低。
- 可追求“高复用”，不应追求“完全无分支”。

### 8.4 复用比例预期（经验值）

- 接口层共享：80%+
- 业务逻辑共享：60%-80%
- UI 组件共享：30%-60%
- 页面层共享：20%-40%

---

## 9. 当前状态

- 项目可启动。
- `/design-adapt` 已可查看“Figma 风格 + Shopify 能力接入”页面。
- 页面已做多轮对齐，但仍可继续根据最新截图做最后一轮像素级校准。

---

## 10. 当前后端能力接入清单（frontCode 适配现状）

### 10.1 页面级（`/design-adapt`）已接入

- 商品读取能力：
  - 通过 `storefront.query(DESIGN_ADAPT_PRODUCTS_QUERY)` 拉取商品数据。
- 购物车写能力：
  - 页面内多个“立即加入购物车/加购/CTA购买”按钮已接入 `AddToCartButton`。
  - 底层通过 `/cart` action 触发 `cart.addLines` 完成加购。

### 10.2 全局级（Hydrogen root）已接入

- 公共数据读取：
  - 根加载器会拉取 header/footer 等公共内容（Storefront 查询）。
- 购物车状态读取：
  - 根加载器会读取 `cart.get()`，用于全局购物车展示与状态同步。

### 10.3 结论

- 当前接入并非只有“添加购物车”一个能力。
- 在 frontCode 适配范围内，已至少包含：
  - 商品查询（读）
  - 购物车写入（加购）
  - 根级公共数据与购物车状态读取（全局）
- 但交易行为层面目前主要仍集中在“加购”，尚未在该适配页扩展到登录、订单查询、复杂促销等能力。

---

## 11. 后续建议

1. 确认最终视觉稿与图片资产（决定是否升级方式B）。
2. 决定是否将 `design-adapt` 作为默认首页（替换 `_index`）。
3. 输出“按钮行为映射表”（页面按钮 -> Shopify能力/自建API）。
4. 拆分自建后端能力需求，建立独立服务仓与接口契约。

---

## 12. 本次涉及改动文件（代码层）

- `app/routes/design-adapt.jsx`
- `app/styles/app.css`
- `app/components/PageLayout.jsx`
- `.env`（环境变量模板与占位）

