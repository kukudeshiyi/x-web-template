# X1 UI 重构进度

## 说明

这份文件用于记录 `x1` UI 重构阶段的逐步执行进度。

记录规则：

- 每完成一步就更新这份文件
- 每一步都要写清楚实际改动、涉及文件、验证方式
- 未经确认不跨步执行

---

## 步骤

### Step 1. 视觉基础层

状态：completed

实际改动：

- 重构全局视觉 token，建立更接近 `luno` 的颜色、圆角、阴影、排版和页面背景变量
- 保留现有 shadcn/Tailwind token 兼容层，避免后续页面在过渡期直接失效
- 增加全局图片比例、站点宽度、侧边栏宽度等基础变量
- 增加基础动效与 reduced-motion 兼容规则
- 增加可复用的基础表面样式工具类：
  - `surface-card`
  - `surface-hover`
- 扩展 Tailwind theme，补充 `page`、`content`、`stroke`、`card` 半径和基础阴影

涉及文件：

- `x1/app/globals.css`
- `x1/tailwind.config.js`
- `x1/app/layout.jsx`

验证方式：

- `cd x1 && yarn test`
- 人工确认后续框架层可以直接消费新的全局 token 与基础样式

备注：

- 这一步只处理视觉基础层
- 不改页面结构、不改路由、不改数据链路

### Step 2A. 框架骨架层（上半步）

状态：completed

实际改动：

- 新增桌面端 `SiteSidebar`
- 新增桌面/移动端 `SiteHeader`
- 将 `[lang]/layout.jsx` 改为新的全站框架骨架：
  - 桌面端左侧固定 sidebar
  - 内容区独立 header + main + footer
  - 移动端保留简化 header
- 当前只完成框架容器与布局骨架
- 搜索入口当前为占位 UI，不接交互
- 当前不做移动端 drawer / sidebar 展开交互，留到 2B

涉及文件：

- `x1/app/components/SiteSidebar.jsx`
- `x1/app/components/SiteHeader.jsx`
- `x1/app/[lang]/layout.jsx`

验证方式：

- `cd x1 && yarn test`
- 人工验证：
  - 桌面端 sidebar 已出现
  - 桌面端 header 已切换为搜索占位 + 语言切换
  - 移动端 header 已切换为 logo + 语言切换 + 搜索占位

备注：

- 这一步只做框架骨架上半步
- 不改首页内容编排、不改文章页结构、不改搜索交互逻辑

### Step 2B. 框架骨架层（下半步）

状态：completed

实际改动：

- 新增统一品牌组件 `BrandMark`，作为桌面端与移动端框架共用的临时品牌位
- 新增统一导航组件 `SiteNavigation`，桌面 sidebar 与移动端 drawer 复用同一套导航渲染逻辑
- 新增 `MobileNavDrawer`，完成移动端侧栏入口与抽屉结构
- 重构桌面端 `SiteSidebar`：
  - 由悬浮卡片改为贴边栏结构
  - 去掉四角整卡圆角
  - 将 dark mode toggle 调整到 logo 区旁边
  - 增加顶部品牌说明与底部版权位
- 重构 `SiteHeader`：
  - 桌面端保留搜索占位与语言切换
  - 移动端改为 logo + 语言切换 + drawer 入口
- 重构 `ThemeToggle` 与 `LanguageSwitcher` 的外观，使其更贴近模板气质
- 完成 `[lang]/layout.jsx` 的框架层收口，使 header / sidebar / main / footer 进入统一关系

涉及文件：

- `x1/app/components/BrandMark.jsx`
- `x1/app/components/SiteNavigation.jsx`
- `x1/app/components/MobileNavDrawer.jsx`
- `x1/app/components/SiteSidebar.jsx`
- `x1/app/components/SiteHeader.jsx`
- `x1/app/components/ThemeToggle.jsx`
- `x1/app/components/LanguageSwitcher.jsx`
- `x1/app/[lang]/layout.jsx`

验证方式：

- `cd x1 && yarn test`
- 人工验证：
  - 桌面端 sidebar 已改为贴边栏结构
  - dark mode toggle 已移动到 sidebar 顶部
  - 移动端 header 已切换为 logo + 语言切换 + drawer 入口
  - 移动端 drawer 已能承接侧栏导航结构

备注：

- 这一步完成的是全站框架骨架层
- 首页主体、文章页主体、tag/author 页面主体仍保持旧内容结构，后续步骤再重构

### Step 3. 通用 UI 组件层

状态：completed

实际改动：

- 重写 `ArticleCard`，支持：
  - 首页主文章大卡
  - 首页副文章叠卡
  - 通用列表卡片
- 重写 `Hero`，使其直接消费主文章与副文章数据
- 新增 `TagChip`，用于首页 tag strip、文章 tag、后续 tag 页面入口
- 新增 `SectionHeader`，统一首页分区标题样式
- 新增 `ArticleToc`，统一桌面端 sticky 目录与移动端折叠目录
- 将这些组件设计为可复用基础层，首页和文章页直接消费

涉及文件：

- `x1/app/components/ArticleCard.jsx`
- `x1/app/components/Hero.jsx`
- `x1/app/components/TagChip.jsx`
- `x1/app/components/SectionHeader.jsx`
- `x1/app/components/ArticleToc.jsx`

验证方式：

- `cd x1 && yarn test`
- 人工验证：
  - 首页主卡 / 副卡 / 普通卡三种样式可正常渲染
  - 文章页目录在移动端和桌面端都有正确承载结构

备注：

- 搜索交互仍保留占位，未进入这一阶段

### Step 4. 首页组装层

状态：completed

实际改动：

- 首页改为模板导向的结构：
  - 顶部主 hero + 右侧副文章
  - hero 下方 tag strip
  - `all` 文章流
  - 分类区块文章流
- hero 数据支持配置优先，当前配置为空时回退到最新文章
- 首页各文章区块统一复用新的 `ArticleCard` / `Hero` / `TagChip` / `SectionHeader`
- 首页补充 `h1`，保证首页语义与现有测试契约继续成立

涉及文件：

- `x1/app/[lang]/page.jsx`

验证方式：

- `cd x1 && yarn test`
- 人工验证：
  - 首页已进入新结构
  - 主 hero、tag strip、文章流比例正确
  - 首页仍保持可访问与 SEO 基线

备注：

- 搜索框当前仍是占位 UI
- 首页细节还可继续微调，但主体结构已进入新方案

### Step 5. 文章页组装层

状态：completed

实际改动：

- 文章页改为 classic 方向布局：
  - breadcrumb
  - tag chips
  - 标题与描述区
  - 作者与日期元信息
  - 头图
  - 正文容器
  - 桌面端 TOC
  - 移动端 TOC 折叠
- 作者链接由旧 `about` 路由改为 `author`
- 正文区域统一接入新的阅读宽度、间距和 prose 样式

涉及文件：

- `x1/app/[lang]/posts/[id]/page.jsx`

验证方式：

- `cd x1 && yarn test`
- 人工验证：
  - 文章头部结构、头图、正文、目录都已进入新布局
  - 桌面端 TOC 为侧边 sticky 结构
  - 移动端 TOC 为折叠结构

备注：

- 文章页正文样式已整体切到新视觉体系
- 后续只做细节校正，不再回到旧结构

### Step 6. Tag / Author 页面组装层

状态：completed

实际改动：

- 重构 tag 页面：
  - 接入顶部 tag strip
  - 重构页头区
  - 重构文章列表区
  - 与首页保持统一卡片与分区标题体系
- 重构 author 页面：
  - 重构作者信息头部
  - 接入作者文章列表
  - 与首页 / 文章页共享统一组件体系
- 补充 `h1` 语义，保持可访问性契约和现有测试边界继续成立

涉及文件：

- `x1/app/[lang]/tags/[slug]/page.jsx`
- `x1/app/[lang]/author/page.jsx`

验证方式：

- `cd x1 && yarn test`
- 人工验证：
  - tag 页面进入新 UI 体系
  - author 页面进入新 UI 体系
  - 这两类页面与首页、文章页的组件语言一致

备注：

- 当前 tag / author 页面主体结构已经收口完成
- 后续以视觉微调和细节校正为主
