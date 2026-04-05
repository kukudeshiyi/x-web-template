# X1 重构前置进度

## 说明

这份文件用于记录 `x1` 在 UI 重构开始之前的前置工作执行进度。

记录规则：

- 这里只记录 UI 重构之前的准备工作。
- 每完成一步，必须立即更新这份文件。
- 每一步都必须写清楚：
  - 改了什么
  - 修改了哪些文件
  - 如何验证
  - 当前状态
- 在你明确要求之前，不继续执行下一步。

---

## 步骤

### Step 1. 落地 `site.config.ts`

状态：completed

实际改动：

- 新增 `x1/config/site.config.ts`
- 落地首版配置基线，包含：
  - `site`
  - `tags`
  - `homepage`
  - `sidebar`
  - `author`
  - `contact`
  - `footer`
  - `search`
- 当前配置只落最小必要字段，没有把它接入现有运行链路
- `tags` 中已纳入特殊聚合 tag `all`
- `homepage` 中已按当前对齐结果落地：
  - hero 主文章与副文章配置
  - 默认文章流 `tagFeed`
  - 分类区块 `categorySections`
- `sidebar` 已按页面级导航结构落地：
  - `link`
  - `group`

修改文件：

- `x1/config/site.config.ts`

验证方式：

- `cd x1 && yarn build`
- `cd x1 && yarn test`
- 构建和测试都通过
- 验证后已清理 `.content-collections/generated/index.js` 的纯生成物时间戳变更，只保留有效改动

备注：

- 这一步只建立配置基线
- 没有改变现有页面行为

### Step 2. 让 `i18n.js` 读取配置

状态：completed

实际改动：

- 让 `x1/app/lib/i18n.js` 从配置文件读取 `defaultLocale` 和 `supportedLocales`
- 将配置真源调整为：
  - `x1/config/site.config.mjs`
- 增加：
  - `x1/config/site.config.d.ts`
  作为类型声明文件
- 调整 `x1/scripts/sync-locales.mjs`
  - 不再自己决定 locale 真源
  - 改为校验内容目录中的 locales 是否与配置一致
  - 继续生成 `app/lib/locales.generated.json`
- 在 `x1/app/lib/i18n.js` 中增加一致性校验：
  - 若配置中的 locales 与生成数据不一致，直接抛错，避免静默漂移

修改文件：

- `x1/app/lib/i18n.js`
- `x1/scripts/sync-locales.mjs`
- `x1/config/site.config.mjs`
- `x1/config/site.config.d.ts`

验证方式：

- `cd x1 && yarn build` 通过
- `cd x1 && yarn test` 通过
- 中途发现 `scripts/sync-locales.mjs` 不能直接 import `.ts` 文件
- 已修正为：
  - 使用 `site.config.mjs` 作为 Node 可直接消费的配置真源
  - 使用 `.d.ts` 补足类型定义
- 验证后已清理 `.content-collections/generated/index.js` 和 `app/lib/locales.generated.json` 的纯生成物变更

### Step 3. 扩展 `content-collections.ts` schema

状态：completed

实际改动：

- 为文章 schema 增加：
  - `tags`
  - `pageType`
  - `toc`
  - `searchable`
  - `listImage`
  - `coverImage`
- 这些新增字段当前都先按兼容模式接入：
  - `tags` 允许字符串或数组，并统一转换为数组
  - `pageType` 默认回落为 `classic`
  - `toc` 默认回落为 `true`
  - `searchable` 默认回落为 `true`
  - `listImage` 默认回落为现有 `image`
  - `coverImage` 默认回落为现有 `image`
- 这样做的目的是：
  - 不阻塞现有内容构建
  - 为 Step 4 单独补齐 frontmatter 留出空间

修改文件：

- `x1/content-collections.ts`

验证方式：

- `cd x1 && yarn build` 通过
- `cd x1 && yarn test` 通过
- 中途产生了 `.content-collections` 下的大量生成物缓存变更
- 这些变更已全部还原，只保留 `content-collections.ts` 的有效改动

### Step 4. 补齐现有文章 frontmatter

状态：completed

实际改动：

- 为当前全部 24 篇文章补齐新增字段：
  - `tags`
  - `pageType`
  - `toc`
  - `searchable`
  - `listImage`
  - `coverImage`
- `listImage` 和 `coverImage` 当前都先复用原有 `image`
- 所有文章当前统一补为：
  - `pageType: classic`
  - `toc: true`
  - `searchable: true`
- 按文章主题补齐分类：
  - 支付类：`payment`
  - 出行类：`travel`
  - 日常类：`daily`
  - 文化类：`culture`
- 在 `content-collections.ts` 中同步把这些字段从“兼容默认值”改为“schema 必填”

修改文件：

- `x1/content-collections.ts`
- `x1/content/en/posts/*.mdx`
- `x1/content/zh/posts/*.mdx`

验证方式：

- `cd x1 && yarn build` 通过
- `cd x1 && yarn test` 通过
- 构建通过说明：
  - 现有文章 frontmatter 已经满足 schema 必填要求
- 全量测试通过说明：
  - 这一步没有破坏现有页面、SEO 和语言切换逻辑
- 补充 `CFG-005A`：直接扫描 `.content-collections/generated/allPosts.js` 的编译产物，校验文章所有非可选字段契约，避免 `content-collections` 仅丢弃无效文章却不让 build 失败的问题
- 验证后已清理 `.content-collections` 生成物，只保留有效改动

### Step 5. 增加编译期 TOC 提取能力

状态：completed

实际改动：

- 在 `x1/content-collections.ts` 中将 `content` 显式加入 schema
- 在内容编译阶段直接从 MDX 正文提取标题结构，生成 `tocItems`
- `tocItems` 当前结构为：
  - `id`
  - `title`
  - `depth`
- 提取范围为正文中的 `##` 到 `######`
- 当文章 frontmatter 中 `toc: true` 时，编译产物必须包含 `tocItems`
- 对当前没有正文标题结构的两篇 `pay-in-china` 总览文章，将 `toc` 调整为 `false`
- 在现有配置测试中扩展 `CFG-005A`
  - 不只校验 frontmatter 契约
  - 还校验编译后的 `content` 与 `tocItems` 契约
- 将 TOC 提取逻辑抽到独立纯函数模块，便于后续 UI 层复用与单独测试
- 新增 `CFG-004B`
  - 用固定输入样例直接测试 TOC 提取纯函数
  - 覆盖重复标题去重、锚点清洗和中文标题 slug 生成

涉及文件：

- `x1/content-collections.ts`
- `x1/tests/config/config.spec.cjs`

验证方式：

- `cd x1 && yarn build` 通过
- `cd x1 && yarn test` 通过
- 构建日志中原有的 `implicit content property` deprecation warning 已消失
- `CFG-005A` 已覆盖：
  - `content`
  - `tocItems`
  - `tocItems[].id`
  - `tocItems[].title`
  - `tocItems[].depth`

### Step 6. 建立统一内容查询层

状态：completed

实际改动：

- 新增统一查询层：
  - `x1/app/lib/content.mjs`
- 落地的查询函数包括：
  - `getAllPosts`
  - `getPostsByLocale`
  - `getPostByLocaleAndSlug`
  - `getAllPostParams`
  - `getTagDefinition`
  - `getPostsByTag`
  - `getHomepageHeroPosts`
  - `getHomepageSections`
  - `getTagPageData`
  - `getSearchDocuments`
- 将现有入口切到查询层：
  - 首页
  - 文章页
  - sitemap
- 首页文章卡片优先使用 `listImage`
- 文章页头图改为使用 `coverImage`
- 当前 `hero` 配置为空，因此查询层返回：
  - `featuredPost: null`
  - `secondaryPosts: []`
  这是当前配置下的预期行为，不做隐式补位

涉及文件：

- `x1/app/lib/content.mjs`
- `x1/app/[lang]/page.jsx`
- `x1/app/[lang]/posts/[id]/page.jsx`
- `x1/app/sitemap.js`
- `x1/tests/config/config.spec.cjs`

验证方式：

- `cd x1 && yarn build` 通过
- `cd x1 && yarn test` 通过
- 新增 `CFG-004C`
  - 校验查询层的 locale 过滤、tag 过滤、首页区块、tag 页面数据、搜索文档与配置一致

### Step 7. 建立静态搜索索引流程

状态：pending

计划改动：

- 在构建时生成静态搜索索引
- 定义未来 header 搜索使用的数据格式

涉及文件：

- 暂无

验证方式：

- 尚未开始

### Step 8. 准备 tag / author 的数据层与路由层

状态：pending

计划改动：

- 准备 tag 页的数据和 metadata 层
- 准备 author 页的数据和 metadata 层

涉及文件：

- 暂无

验证方式：

- 尚未开始

### Step 9. 视情况准备 contact 的数据层与路由层

状态：pending

计划改动：

- 只有在确认 contact 页要进第一阶段时才执行

涉及文件：

- 暂无

验证方式：

- 尚未开始

### Step 10. 确认 UI 前置执行基线完成

状态：pending

计划改动：

- 确认所有 UI 前准备工作已经完成
- 确认仓库已具备进入单独 UI 重构计划的条件

涉及文件：

- 暂无

验证方式：

- 尚未开始
