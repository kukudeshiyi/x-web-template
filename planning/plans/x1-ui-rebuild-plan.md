# X1 UI 重构计划

## 说明

这份文件用于承接 `x1` 在基础层准备完成之后的 UI 重构实施计划。

约束：

- 不修改 `x1` 的核心 SEO 资产设计原则
- 所有改动必须持续通过 `cd x1 && yarn test`
- UI 参考 `luno-mirror`，但实现要基于当前 `x1` 架构
- 尽量复用现有技术方案，除非当前方案无法满足实现目标，再考虑替换
- 优先保持语义化 HTML 与 Server Component 主导的页面结构，客户端交互只放在必要区域
- 首页、文章页、tag 页、author 页这类 SEO 关键页面主体应保持 Server Component，搜索、语言切换、移动端侧栏、TOC 折叠等局部交互再使用 Client Component
- 这份文件只讨论 UI 重构，不重复记录已经完成的前置基础层工作

## 目标

1. 重构页面框架
2. 重构首页
3. 重构文章详情页
4. 落地 tag 页面最终 UI
5. 落地 author 页面最终 UI
6. 视需要评估并落地 contact 页面

## 技术说明

### 当前技术方案

- 框架：`Next.js 16` + `React 18` + `App Router`
- 构建输出：`output: "export"`，当前以静态导出为目标
- 国际化：`next-intl`
- 内容系统：`content-collections` + `MDX`
- 样式方案：`Tailwind CSS 3` + `globals.css` 中的 CSS variables
- 深色模式：`next-themes`
- 组件辅助：`Radix UI`、`lucide-react`、`clsx`、`tailwind-merge`、`class-variance-authority`
- SEO 与站点生成：现有 `seo.js`、`sitemap.js`、`robots.js`
- 测试：`Playwright`
- 运营配置：`config/site.config.mjs`
- 查询层：`app/lib/content.mjs` + `app/lib/content-query.mjs`
- 搜索基础：构建后生成 `out/search-index.json`

### 重构时是否复用

- `Next.js App Router`：复用  
  - 当前路由、SEO、静态导出和页面组织都已经建立在这套方案上，没有必要更换

- `Tailwind CSS + globals.css + CSS variables`：复用  
  - 这套方案适合承接 `luno` 风格的 token、布局和响应式实现
  - 后续应在这套基础上重构视觉变量，而不是引入新的样式框架

- `next-intl`：复用  
  - 当前双语路由和翻译体系已经稳定，UI 重构不应改动这一层技术方案

- `content-collections + MDX`：复用  
  - 当前文章编译、frontmatter 契约、TOC 提取都已经稳定，重构时只消费已有数据

- `next-themes`：复用  
  - dark mode 已经是明确保留项，不需要替换

- `Playwright` 测试体系：复用  
  - 当前回归边界已经建立，UI 重构必须继续依赖这套测试做保护

- 统一配置层与查询层：复用  
  - `site.config.mjs`、内容查询层、搜索索引都是这次 UI 重构的基础输入，不应绕过

- `Radix UI` 与现有轻量组件能力：按需复用  
  - 有现成能力的交互组件可以继续用
  - 但不要为了复用而强行套不合适的旧组件
  - 视觉骨架、页面布局、内容展示组件不以复用现有 `shadcn/Radix` 封装为目标
  - `Radix/shadcn` 只作为交互原语层使用，例如 `select`、`dialog`、`drawer`、`collapsible`
  - 如果某个现有封装会让模板还原变形或导致样式层混乱，应直接重写该视觉组件

- `nextra` / `nextra-theme-blog` 依赖：不继续扩展  
  - 当前业务链路已经不再依赖这条主题层
  - 本次 UI 重构不应基于它继续实现新能力

## 实施边界

已完成的基础层能力：

- 统一配置真源
- locale 配置收口
- 文章 frontmatter 契约
- 编译期 TOC 提取
- 统一内容查询层
- 静态搜索索引
- tag / author 路由基础层

本文件后续重点规划：

- 页面信息架构
- UI 组件拆分
- 页面分阶段改造顺序
- 响应式与动效要求
- 每个阶段的验证方式

## 本地环境说明

### `.content-collections` 本地隐藏恢复方案

当前为了在保留 `next dev` 的情况下减少 `git status` 噪音，`x1` 本地对 `.content-collections` 做了两层本地隐藏：

- 已跟踪文件：使用 `git update-index --skip-worktree`
- 未跟踪文件：写入本地 `info/exclude`

这不是仓库正式规则，只是当前本地开发辅助措施。

如果后续需要恢复正常跟踪状态，执行：

```bash
cd x1
git ls-files .content-collections | xargs git update-index --no-skip-worktree
EXCLUDE_FILE=$(git rev-parse --git-path info/exclude)
grep -vx '.content-collections/' "$EXCLUDE_FILE" > /tmp/x1-exclude.tmp && mv /tmp/x1-exclude.tmp "$EXCLUDE_FILE"
```

恢复后：

- `.content-collections` 会重新出现在 `git status`
- 适用于需要检查或提交这类生成物的场景

## 规划章节

### 1. 视觉基础层

- [x] 提炼 `luno` 的全局视觉 token：颜色、圆角、阴影、边框、间距、排版
- [x] 将视觉 token 落到 `x1` 的全局样式与 CSS variables
- [x] 校准 light / dark mode 的颜色映射，避免后续组件重复改样式
- [x] 确定全站图片比例规则：hero、列表卡片、文章头图
- [x] 明确全站动效边界，只保留必要的进入、hover、展开动画

### 2. 框架骨架层

- [x] 重构桌面端 header：左侧搜索，右侧语言切换
- [x] 重构移动端 header：左侧 logo，右侧语言切换与侧栏入口
- [x] 重构 sidebar 骨架，映射现有 `site.config` 导航数据
- [x] 重构 mobile nav / drawer 结构
- [ ] 确定搜索入口在 header 中的交互形态：展开式、弹层式或内嵌式
- [x] 重构全站主布局骨架：header / sidebar / main / footer
- [x] 确定 footer 第一版是否只保留极简实现

### 3. 通用 UI 组件层

- [x] 重构 article card 组件，作为首页与 tag 页复用基础
- [x] 重构 hero 组件，支持主文章和副文章组合
- [x] 重构 tag chip / section header / list header 组件
- [ ] 重构搜索面板 UI 外壳，并接入静态搜索索引
- [ ] 完成搜索结果列表、空状态、键盘导航和跳转交互
- [x] 重构 TOC 组件，支持桌面端固定展示与移动端折叠
- [x] 清理现有页面组件，保留能复用的最小部分

### 4. 首页组装层

- [x] 用新 hero 组件组装首页 hero 区域
- [x] 接入 hero 主文章与副文章配置
- [x] 组装首页 tag 导航区块
- [x] 组装 `all` 分类文章流
- [x] 组装分类区块文章列表
- [x] 校准首页桌面端与移动端布局切换

### 5. 文章页组装层

- [x] 按 classic 模板重构文章详情页整体布局
- [x] 重构文章头图、标题区、meta 信息区
- [x] 接入编译期 TOC 数据并完成桌面端目录展示
- [x] 完成移动端 TOC 展开/折叠交互
- [x] 校正文内 MDX 样式与全站视觉 token 一致
- [x] 校准文章页阅读宽度、间距和 sticky 区块行为

### 6. Tag / Author 页面组装层

- [x] 重构 tag 页头部与文章列表布局
- [x] 统一 `all` 与普通 tag 页的展示逻辑
- [x] 重构 author 页面头部与作者信息模块
- [x] 评估 author 页面是否补充文章列表或其它内容模块
- [x] 校验这两类页面与首页/文章页的组件复用边界

### 7. Contact 页面决策层

- [ ] 判断第一版是否需要 contact 页面
- [ ] 如果需要，确定只做静态联系方式还是接入表单服务
- [ ] 如果暂不做，明确 sidebar / footer 中是否隐藏入口
- [ ] 如果要做，补单独的数据结构与实现计划

### 8. 实施顺序与验证

- [x] Step 1：完成视觉基础层
- [x] Step 2：完成框架骨架层
- [x] Step 3：完成通用 UI 组件层
- [x] Step 4：完成首页组装层
- [x] Step 5：完成文章页组装层
- [x] Step 6：完成 Tag / Author 页面组装层
- [ ] Step 7：完成 Contact 页面决策层
- [ ] 每完成一步都执行 `cd x1 && yarn test`
- [ ] 每完成一步都补充人工回归，按当前步骤覆盖桌面端、移动端、dark mode、语言切换、搜索入口、tag 页、author 页
- [ ] 每完成一步都先更新计划或进度记录，再进入下一步
