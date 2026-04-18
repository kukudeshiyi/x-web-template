## Human output(Forbidden AI Modify this part):

目前需要参考 luno-mirror 下的 web template，基于当前架构为 x1 重构并且增加部分页面：
1. 页面框架：顶栏、底栏，增加侧边栏
2. 首页
3. 内容页
4. 分类聚合页
5. 作者页面
6. 联系页面

要求：

1. 完全细腻的还原 web template 的页面 UI\UX 实现，包括动画、响应式、对移动端的支持等。
2. 完全不要改动网站核心的 SEO 资产，保证重构后依然可以通过网站的测试用例
3. 重构 UI 使用的 html 元素以及技术方案需要最大化符合 SEO 原则
4. 因为我们不存在管理平台，在重构中要在仓库中设计各种机制以便于日常运行维护。（举例子：使用配置文件而不是将有些需要运营修改的直接写在代码中）
5. 尽量复用现有的技术方案，除非实现不了，我们可以考虑更换方案

当然我们也不是全部按照 web template 的设计来，我们会增加自己的业务考量，这部分细节会写在下面的内容中。

### 页面框架

1. 顶栏

目前：
x1 网站的顶栏左侧是网站 title，右侧是 dark\light mode 的切换以及多语言切换功能。

预期：
web 端左侧是搜索栏（web template 中存在），右侧则是多语言切换功能。
移动端左侧为网站 logo，右侧为多语言功能和侧边栏唤起功能。

补充：

这里不仅要重构 UI，还要支持添加全站文章的搜索功能。

2. 底栏

目前：

x1 只有一个版权所有

预期：

到时候研究一下需不需要吧，感觉目前没什么东西好放的，目前 x1 也不需要订阅推送（但也不一定，一起研究研究）


3. 侧边栏

目前：
x1 网站没有侧边栏

预期：
仿照 web template 的结构增加侧边栏
菜单栏初步设想有首页、联系页面、作者页面、文章（支付类、出行类、日常类、文化类），这块的侧边栏设计应该考虑日常的维护性，并且因为该部分与文章的分类聚合页有关系，所以需要综合考虑。

4. 首页

目前：
x1 目前首页分为两部分：顶部的 hero 部分和下面的文章列表页部分

预期：

1. 目前 template 的 hero 部分是左边是一偏主要文章，右侧是两篇小文章，我想要仿照这个结构，用一篇主要文章作为 hero，这样的好处是可以根据运营随时调整这块的内容，右侧的两篇小文章的地方支持可以配置也可以不配置，不配置主文章直接占满横屏。
2. hero 下面部分 template 目前写的是分类 tags，我们还原这个设计
3. tags 下面是展示的是 all 分类以及各种分类的下的文章，这个渲染也要可以支持运营配置，比如说想只想展示部分分类的文章，每个分类的文章都按照更新时间排列，最新的在最前面。
4. 首页文章的单个 UI 块就完全按照 template 来实现就好了


5. 内容页

目前：

x1 的内容页面包含头图，剩下的则是基于 mdx 的渲染。

预期：

使用 web template 中的 classic 文章页面，这里建议在 mdx 中增加字段可以指定文章页面类型，用来为后续扩展。
classic 页面左侧为文章，右侧我想做成基于 mdx 结构生成的文章目录，在移动端隐藏为一个可以展开的图标（这个设计 web template 没有，我们要细聊）


6. 分类页面

目前：

x1 没有分类页面

预期：

1. 添加像 web template 里面的 tag 页面（单一 tag 页面，不是 tags 页面），这些 tags 其实就是侧边栏中的文章类型：支付、出行、日常、文化


7. 作者页面、联系页面

目前：

x1 只有一个 about 页面

预期：

复刻 web template 中的作者页面和联系页面
但是需要调研下联系页面发送信息是否需要使用服务，如果需要，我们可能暂时不做联系页面。




----------------------

## AI can output your mind below:
### 总体判断

这次计划要以当前 `x1` 的现实状态为起点，而不是按全新站点来写。

当前已经稳定存在的系统有：

- `Next.js + App Router`
- `content-collections` 的文章编译链路
- `seo.js` 里的 canonical / hreflang 规则
- `sitemap.js` / `robots.js`
- `i18n.js` 与翻译文件
- 已落地的 `build + test` 基线

后续 UI 会参考 `luno-mirror`，但实现不能破坏这套已有真源。

所以在 UI 重构前，先做的是“系统收口”：

- 收口统一运营配置
- 收口文章 frontmatter 边界
- 收口搜索、TOC、tag 页、author 页的数据来源

---

### 现有真源与新配置的边界

#### 继续保留的现有真源

1. SEO 真源  
- `x1/app/lib/seo.js`
- 继续负责 `BASE_URL`、canonical、hreflang 规则

2. 内容与编译真源  
- `x1/content-collections.ts`
- 继续负责文章 schema 和 MDX 编译

3. 站点生成真源  
- `x1/app/sitemap.js`
- `x1/app/robots.js`
- 继续由代码生成 sitemap / robots

4. 翻译资源真源  
- `x1/locales/*.json`
- 继续负责文案翻译

#### 需要收口的新边界

1. locale 配置真源  
- 新增到 `x1/config/site.config.ts`
- 由它提供：
  - `defaultLocale`
  - `supportedLocales`
- `x1/app/lib/i18n.js` 后续从这里读取
- `locales.generated.json` 仍然保留
- 它的作用是内容侧生成与校验，不再和站点配置并列作为人工真源

2. 统一运营配置  
- tags 定义
- 首页 hero / sections
- 侧边栏和首页中使用哪些 tags 的列表
- author 页面信息
- contact 页面信息
- footer
- 搜索策略

3. 文章级 frontmatter  
- `tags`
- `pageType`
- `toc`
- `searchable`
- `listImage`
- `coverImage`

原则：

- 全站级、运营级信息进 `site.config.ts`
- 单篇文章级信息进 frontmatter

---

### UI 重构前必须先完成的系统层工作

#### A. 建立单一运营配置文件

建议新增：

- `x1/config/site.config.ts`

不要拆成很多小文件，统一放一个文件里，按区块组织。

原因：

- 这次重构会同时引入 header、sidebar、tag page、author、contact、homepage hero 和分类区块
- 它们需要共享同一套分类、首页编排和页面级运营内容

#### B. 扩展文章 schema 和 frontmatter

当前 `content-collections.ts` 里的 schema 只够支撑基础文章页，不够支撑：

- tag 分类页
- 首页分类区块
- 内容页版式切换
- TOC
- 搜索索引

#### C. 建立统一内容查询层

不要让页面组件直接散落地从 `allPosts` 里过滤和排序。

应先建立统一查询函数，例如：

- `getPostsByLocale`
- `getPostsByTag`
- `getHomepageHeroPosts`
- `getHomepageSections`
- `getSearchDocuments`
- `getTagPageData`

#### D. 设计搜索索引生成流程

搜索是页面框架的一部分，不是最后补的功能。

第一版建议：

- 构建时生成静态索引
- 前端本地查询
- 不引入服务端搜索依赖

添加搜索功能需要完成的事情：

1. 定义搜索索引文档结构
2. 在内容编译或构建阶段生成搜索索引文件
3. 为每篇文章提取可搜索文本
4. 定义前端搜索匹配与排序规则
5. 定义语言过滤逻辑
6. 为 header 搜索框准备查询接口和结果数据结构
7. 明确搜索结果跳转到文章页的 URL 规则

#### E. 明确页面与路由边界

这一步先定清楚：

- 作者页直接使用新的 author 页面，不再把 about 作为目标页设计
- tag 页是否使用 `/{lang}/tags/{slug}`
- 联系页第一版是否只做静态联系方式

#### F. TOC 在编译期生成

TOC 必须在编译阶段提取好，不在运行时抓 DOM。

这样做的好处：

- 数据稳定
- 页面组件只负责渲染
- 移动端目录交互更容易做

---

### 统一运营配置文件设计

建议文件：

- `x1/config/site.config.ts`

建议区块：

- `site`
- `tags`
- `homepage`
- `sidebar`
- `author`
- `contact`
- `footer`
- `search`

#### 1. `site`

- `baseUrl`
  - 站点域名
  - 必须与 `seo.js` 中的 `BASE_URL` 保持一致
- `defaultLocale`
  - 默认语言
  - 后续作为 locale 配置真源
- `supportedLocales`
  - 支持语言列表
  - 后续作为 locale 配置真源
- `logo`
  - 暂时只保留 UI 真正需要的最小字段，细节下一轮再定

#### 2. `tags`

`tags` 必须成为单一真源。

建议每个 tag 至少包含：

- `slug`
  - tag 的唯一标识，同时用于 URL 和代码引用，例如 `all`、`payment`
- `label`
  - `{ en, zh }`
- `description`
  - `{ en, zh }`
- `seoTitle`
  - `{ en, zh }`
- `seoDescription`
  - `{ en, zh }`

不要把“显示在哪”挂在每个 tag 自身上。

这些应该由独立配置集中控制：

- 侧边栏列出哪些 tags
- 首页 tag strip 展示哪些 tags
- 首页 category sections 使用哪些 tags

这样维护时不会变成逐个 tag 排查。

补充：

- `all` 也应作为一个特殊 tag 放进 `tags` 配置中
- 它不是文章 frontmatter 会填写的真实 tag
- 它是首页和导航层会消费的聚合 tag

#### 3. `homepage`

首页配置需要直接对应你要的页面结构，而不是抽象字段堆叠。

建议字段：

- `hero`
  - `enabled`
  - `featuredPostSlug`
  - `secondaryPostSlugs`
- `tagFeed`
  - `defaultTagSlug`
  - `limit`
- `categorySections`
  - 数组，每项包含：
    - `tagSlug`
    - `enabled`
    - `limit`

字段含义：

- `hero.featuredPostSlug`
  - 首页 hero 主文章
- `hero.secondaryPostSlugs`
  - hero 右侧副文章
  - 不配置则只显示主文章
- `tagFeed.defaultTagSlug`
  - 首页默认文章流对应哪个 tag
  - 当前应直接使用 `all`
- `tagFeed.limit`
  - 默认文章流展示多少篇文章
- `categorySections`
  - 默认文章流下面还要展示哪些 tag 分类区块
- `categorySections[].tagSlug`
  - 对应哪个 tag 页面
- `categorySections[].limit`
  - 这个 tag 区块显示多少篇文章

说明：

- homepage 的 tag 合集默认展示全部 tags，不单独配置
- `all` 放在 `tags` 配置里，但不是文章 frontmatter 里的真实 tag
- 点击某个 tag，跳转到该 tag 对应的页面

#### 4. `sidebar`

sidebar 不能只配 tags，它本质上是页面级导航。

建议字段：

- `enabled`
- `items`
  - 数组，每项都是一个页面级导航项或一个集合项

建议 item 结构：

- `type`
  - `link | group`
- `label`
  - `{ en, zh }`
- `href`
  - 当 `type = link` 时使用
- `children`
  - 当 `type = group` 时使用
- `icon`
  - 可选
- `enabled`

说明：

- `link`
  - 单独菜单项，例如首页、作者页、联系页、某个 tag 页
- `group`
  - 集合项，本身不一定跳转，下面挂多个页面菜单项
- `children`
  - 里面的每一项仍然是页面级菜单项
- `icon`
  - 当前模板里菜单项和集合项都可能带 logo / icon，所以这里需要保留

这样设计后：

- tags 只是页面来源之一
- sidebar 不再和 tags 结构硬绑定
- 可以同时表达单独菜单项和一个集合菜单项

#### 5. `author`

- `enabled`
- `slug`
  - 作者页路由 slug
- `name`
  - `{ en, zh }`
- `title`
  - `{ en, zh }`
- `bio`
  - `{ en, zh }`
- `avatar`
- `email`
- `socialLinks`

这里的目标是定义新的 author 页面数据，而不是围绕 about 页面做兼容设计。

#### 6. `contact`

- `enabled`
- `mode`
  - `static | form`
- `title`
  - `{ en, zh }`
- `description`
  - `{ en, zh }`
- `email`
- `formProvider`
- `submitEndpoint`

#### 7. `footer`

- `enabled`
- `links`
- `copyright`
- `showLocaleSwitcher`
- `showThemeToggle`

#### 8. `search`

- `enabled`
- `fields`
- `resultLimit`
- `showTagFilter`
- `showLocaleFilter`
- `placeholder`
  - `{ en, zh }`

字段含义：

- `enabled`
  - 是否启用搜索功能
- `fields`
  - 搜索会匹配哪些字段
  - 第一版建议只允许：`title`、`description`、`keywords`、`tags`、`contentText`
  - 第一版这些字段按平权处理，不先做加权
- `resultLimit`
  - 单次搜索最多展示多少条结果
- `showTagFilter`
  - 搜索面板里是否展示 tag 过滤能力
- `showLocaleFilter`
  - 搜索面板里是否展示语言过滤能力
- `placeholder`
  - 搜索输入框文案

---

### 文章 frontmatter / meta 设计

#### 继续保留的基础字段

- `title`
- `date`
- `description`
- `lang`
- `author`
- `image`
- `keywords`

#### 建议新增的字段

- `tags`
  - 数组，值必须对应 `site.config.ts` 中的 `tag.slug`
- `pageType`
  - 例如 `classic`
- `toc`
  - 是否展示目录
- `searchable`
  - 是否进入搜索索引
- `listImage`
  - 首页、分类页等列表场景使用的图片
- `coverImage`
  - 文章详情页顶部主图

#### 不应放进 frontmatter 的内容

- 首页 hero 选哪篇文章
- 首页分类区块顺序
- 顶栏和侧边栏结构
- tag 展示顺序
- author 页固定信息
- contact 页文案

---

### 搜索系统前置设计

建议第一版：

- 只搜索文章
- 构建时生成静态索引
- 前端本地查询

每篇文章的搜索文档建议包含：

- `lang`
- `slug`
- `title`
- `description`
- `tags`
- `author`
- `date`
- `contentText`

其中：

- `contentText` 由 MDX 编译结果提取纯文本得到
- 是否进入搜索，由 frontmatter 的 `searchable` 控制

第一版先不要把 author / contact / tag 页面纳入搜索。

搜索的具体实施步骤建议写死成下面这 6 步：

1. 在内容层确定每篇文章的搜索输入
- `title`
- `description`
- `tags`
- `author`
- `date`
- `contentText`

2. 在构建阶段生成静态索引文件
- 输出到构建产物可读取的位置
- 不引入服务端依赖

3. 设计前端搜索函数
- 支持关键词匹配
- 支持按语言过滤
- 结果返回标准化文章信息

4. 设计 header 搜索数据接口
- 输入什么
- 返回什么
- 空结果怎么处理

5. 设计搜索结果跳转
- 统一跳转到 `/{lang}/posts/{slug}`

6. 把搜索纳入回归验证
- build 后索引文件存在
- 搜索能找到至少一篇中英文文章
- 搜索结果链接正确

---

### UI 开工前的实际执行顺序

#### Step 1. 落地 `site.config.ts`

目标：

- 固化统一配置边界
- 把 locale 真源收口进配置文件

#### Step 2. 调整 `i18n.js` 读取配置

目标：

- `defaultLocale` 和 `supportedLocales` 不再写两份
- 翻译文件和内容目录继续作为校验对象

#### Step 3. 扩展 `content-collections.ts` schema

目标：

- 支撑 tags、pageType、TOC、搜索控制，以及列表图 / 详情图分离

#### Step 4. 补齐现有文章 frontmatter

目标：

- 让现有文章都具备新系统所需字段

#### Step 5. 建立 TOC 编译期提取能力

目标：

- 页面直接消费 TOC 数据，不做运行时抓取

#### Step 6. 建立统一内容查询层

目标：

- 页面组件不直接写过滤和排序规则

#### Step 7. 建立搜索索引生成流程

目标：

- 搜索底层先成立，再进入 header UI

#### Step 8. 建立 `tag / author` 的数据层与路由层

目标：

- 先把页面数据和 metadata 设计稳定，再做 UI

#### Step 9. 视需要建立 `contact` 的数据层与路由层

目标：

- 只有在确认联系页要先做时再接入，不阻塞主线

#### Step 10. 形成 UI 重构前的可执行基线

目标：

- 配置层完成
- 内容模型完成
- TOC 和搜索底层完成
- `tag / author / contact` 的数据层准备完成
- 为下一份单独的 UI 重构计划提供稳定基础

---

### 每一步都必须满足的回归要求

- 不破坏当前 SEO 规则
- 不改动文章和翻译资产的语义
- `yarn build` 通过
- `yarn test` 通过
