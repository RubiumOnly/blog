# RubiumOnly 博客私有化交接提示词清单

> 写给后续接手的大模型：这是 `D:\work\blog` 项目的私有化交接文档。接手后先读本文件，再读根目录 `README.md`、`UpdateLog.md`、`my-blog-manager/siteConfig.ts`、`XHBlogs/siteConfig.ts` 和 `my-blog-manager/data/deploy_config.json`。目标是在保留全部功能的前提下，把博客彻底变成 RubiumOnly 自己的可长期使用版本。

## 1. 接手总提示词

可以直接把下面这段作为后续会话的起始提示词：

```text
你接手的是 Windows 本地目录 D:\work\blog 的 RubiumOnly 个人博客私有化项目。这个项目来源于开源博客 XHBlogs，但当前目标不是继续保留原作者演示信息，而是在不阉割任何功能的前提下，把前台博客 XHBlogs 和后台 my-blog-manager 全部改成 RubiumOnly 自己可长期使用、可部署、可写作、可评论、可同步的版本。

开始前请先阅读 PRIVATEIZATION_HANDOFF.md、README.md、UpdateLog.md、my-blog-manager/siteConfig.ts、XHBlogs/siteConfig.ts 和 my-blog-manager/data/deploy_config.json。不要恢复原作者 heiehiehi / XingHuiSama 的账号、域名、联系方式、备案、文章世界观、示例项目或旧路径。不要伪造邮箱、OAuth、Token、API Key、域名、备案号或评论仓库。密钥只能使用用户提供的真实值，或提醒用户后续在 Vercel / 后台设置中填写。

优先遵守现有项目结构：my-blog-manager 是本地后台控制台，XHBlogs 是前台博客。后台的“同步 Blog”会把文章、说说、杂谈、友链、相册、项目和公开 siteConfig 同步到前台。图床 Token 等后台密钥不要进入 XHBlogs。每次改动后用构建、配置检查、关键词扫描和浏览器验证确认功能完整。
```

## 2. 当前已完成状态

- 项目已初始化为 RubiumOnly 自己的 GitHub 仓库基线，远程仓库目标为 `https://github.com/RubiumOnly/blog.git`。
- `my-blog-manager/siteConfig.ts` 已改为后台主配置源，站点名、作者名、GitHub、建站日期、页脚技术徽章、AI 人设等已换成 RubiumOnly 基线。
- `XHBlogs/siteConfig.ts` 已同步为前台公开配置，并且不包含 `picBedToken`、`picBedUrl`、`picBedName`。
- `my-blog-manager/data/deploy_config.json` 已设置：
  - `blogPath`: `D:\work\blog\XHBlogs`
  - `sourceRepoUrl`: `git@github-source:RubiumOnly/blog.git`
  - `sourceBranch`: `main`
- 关于页、文章、说说、杂谈、友链、项目、相册已替换为 RubiumOnly 初始化内容，不再是原作者演示内容。
- Gitalk/comment 为空配置时已有保护逻辑，避免未配置 OAuth 和评论仓库时前台直接报错。
- `scripts/checkConfig.mjs` 和 `update.py` 已改为 RubiumOnly 基线，避免检查或更新脚本把原作者配置补回来。
- `XHBlogs/public/CNAME` 已删除，等待用户有真实自定义域名后再重新配置。
- 两端最近一次记录的验证结果：`XHBlogs` 和 `my-blog-manager` 的 `npm run build` 均通过；`node scripts\checkConfig.mjs` 通过；业务文件旧作者关键词扫描无命中；前台和后台设置页可本地打开。

## 3. 距离完全私有化还差什么

### 3.1 真实身份与视觉素材

还需要用户提供或确认真实素材：

- 真实头像：填入 `avatarUrl`，可放到两端 `public` 后使用 `/avatar.png`，也可用图床 URL。
- favicon：填入 `faviconUrl`，建议使用正方形 PNG/ICO。
- 背景图数组：填入 `bgImages`，如果使用图片背景，需要确认 `useGradient` 是否改为 `false`。
- 默认文章封面：填入 `defaultPostCover`。
- 照片墙预览图：填入 `photoWallImage`。
- 社交账号：补齐 `social.email`、`social.qq`、`social.wechat`、`social.gitee`、`social.google` 中用户愿意公开的项。
- 备案：如果有备案，填写 `icpConfig.name` 和 `icpConfig.link`；没有备案就继续留空，并确认前台空状态显示正常。

参数获取方式：用户自己的图片、本地静态资源、GitHub raw、Vercel public 静态资源、图床外链、域名备案后台。

### 3.2 图床功能

要完整使用后台 Markdown 写作和图片上传，还需要真实图床配置：

- `my-blog-manager/siteConfig.ts` 或后台图床设置页填写 `picBedName`、`picBedUrl`、`picBedToken`。
- 推荐 Lsky Pro / 7bu 一类兼容接口，`picBedUrl` 通常是上传 API 地址，`picBedToken` 从图床后台 Token 页面获取。
- 必须验证后台“发送探针测试 Token”和编辑器上传图片。
- 同步到前台后再次确认 `XHBlogs` 不包含图床 Token。

注意：图床 Token 属于密钥，不要写进前台仓库，不要提交真实 Token 到 GitHub。

### 3.3 AI 助手

当前只有 `geminiConfig` 的公开模型和人设配置，还缺真实 API Key：

- 本地开发可在对应项目 `.env.local` 中配置 `GEMINI_API_KEY`。
- 线上部署要在 Vercel Project Settings -> Environment Variables 中配置 `GEMINI_API_KEY`。
- API Key 从 Google AI Studio 获取。
- 接入后验证前台 AI 助手对话接口能返回内容，并检查无密钥泄露到浏览器控制台或前端 bundle。

可继续调优 `geminiConfig.modelId`、`systemPrompt`、`temperature`、`maxOutputTokens`，但不要为了演示效果编造用户身份信息。

### 3.4 天气功能

如果保留天气组件，需要接入和风天气：

- Vercel 环境变量填写 `QWEATHER_KEY`。
- 如果后台管理端组件读取公开变量，则本地或前端环境可能还需要 `NEXT_PUBLIC_QWEATHER_KEY`。
- Token 从和风天气控制台获取。
- 验证天气 API、前台展示、失败降级状态。

### 3.5 评论系统

评论系统要完整可用，还需要 GitHub OAuth 和评论仓库：

- 新建一个 Public GitHub 仓库作为评论 Issues 仓库，例如 `blog-comments`。
- GitHub Developer settings -> OAuth Apps 新建 OAuth App。
- `Homepage URL` 填真实博客首页。
- `Authorization callback URL` 填真实博客域名；本地调试可另外建一个 OAuth App 填 `http://localhost:3000`。
- 将 Client ID、Client Secret、评论仓库名、owner、admin 配到 `gitalkConfig`。
- 验证文章评论、说说评论、灵境/实验室评论都能登录、创建 issue、刷新后显示。

安全提醒：Gitalk 方案会把 `clientSecret` 放到前端配置里，这是方案本身的设计风险。建议只用专门的公开评论仓库和专门 OAuth App，不要复用重要应用的密钥。

### 3.6 音乐挂件

音乐功能还需要真实网易云歌曲 ID：

- 在后台音乐设置或 `cloudMusicIds` 中填入歌曲 ID 数组。
- 歌曲 ID 从网易云音乐网页歌曲 URL 的 `id` 参数获取。
- 验证前台播放器能加载，遇到无版权或下架歌曲时有可接受的表现。

### 3.7 GitHub 双轨同步与部署

当前配置已经指向 RubiumOnly 仓库，但还要完成真实推送链路：

- 确认本机 SSH alias `github-source` 可用，能访问 `git@github-source:RubiumOnly/blog.git`。
- 后台“获取 B 线专属密钥”生成的 deploy key 已添加到 GitHub 仓库，并勾选 `Allow write access`。
- 后台“智能初始化双轨环境”和“仅同步源码”能成功推送。
- 任何同步失败都先检查 SSH config、deploy key 权限、分支名、远程仓库地址。

### 3.8 Vercel 线上部署

要线上完全可用，还需要 Vercel 项目配置：

- 从 GitHub 导入 `RubiumOnly/blog`。
- Root Directory 选择 `XHBlogs`。
- Framework Preset 选择 Next.js。
- 环境变量至少配置 `GEMINI_API_KEY`；需要天气则加 `QWEATHER_KEY`；如本项目实际读取公开天气 key，再加 `NEXT_PUBLIC_QWEATHER_KEY`。
- 自定义域名在 Vercel Domains 中添加，再到域名服务商配置 DNS。
- 有真实域名后，如项目需要 CNAME 文件，再重新创建 `XHBlogs/public/CNAME`，内容写真实域名。

### 3.9 内容私有化

当前内容只是 RubiumOnly 初始化内容，距离“完全是自己的博客”还需要真实内容：

- `my-blog-manager/app/about/about.md` 和 `XHBlogs/app/about/about.md`：改成真实自我介绍、经历、技能、联系信息。
- `posts/*.md`：删除或替换初始化文章，写入真实文章。
- `moments/*.md`：替换为真实说说。
- `chatters/*.md`：替换为真实杂谈。
- `data/friends.ts`：通过后台友链管理维护真实友链。
- `data/projects.ts`：通过后台项目管理维护真实项目。
- `data/albums.ts`：通过后台相册管理维护真实相册。

推荐走后台流程：暂存队列 -> 更新本地 -> 同步 Blog -> 构建验证 -> 推送。

### 3.10 README、截图与许可证说明

根目录 `README.md` 和 `README_en.md` 仍保留 XHBlogs 项目说明和大量原项目截图路径。后续需要决定：

- 如果这是私人二次开发仓库，README 可以改成 RubiumOnly 自己的项目说明、部署说明和使用记录。
- `picture/*` 多为说明截图，可后续替换为 RubiumOnly 自己的截图，或保留为上游使用说明材料。
- 原项目许可证是 CC BY-NC 4.0，后续公开仓库时应保留合理署名和非商业限制说明，不要误写成完全原创且无来源。

### 3.11 更新器策略

`update.py` 已改成 RubiumOnly 基线，但是否继续保留“从上游无损更新”的能力还没有最终设计。

后续要明确：

- 如果不再跟随上游更新，可以把更新器文档改成“暂不使用”或隐藏入口。
- 如果继续跟随上游，需要设计合并策略，防止上游内容覆盖 RubiumOnly 的配置、文章和私有素材。
- 运行任何更新脚本前，必须先提交当前稳定版本，并做好 diff 审查。

## 4. 后续验收命令

建议每一轮较大私有化改动后执行：

```powershell
cd D:\work\blog\XHBlogs
npm run build
```

```powershell
cd D:\work\blog\my-blog-manager
npm run build
```

```powershell
cd D:\work\blog
node scripts\checkConfig.mjs
```

```powershell
cd D:\work\blog
rg "XingHuiSama|xinghuisama|heiehiehi|1124533793|bilibiliwuwuwu|20260240|www\.xinghuisama\.top|D:\\DEVC\+\+\\XinghuisamaBlogs|萌ICP备|源石|泰拉|提瓦特|罗德岛|普瑞赛斯|干员|PRTS"
```

如果仓库中保留了 `PRIVATEIZATION_HANDOFF.md`，旧作者关键词扫描需要排除本交接文档，因为这里会主动记录“不要恢复”的禁用词：

```powershell
cd D:\work\blog
rg "XingHuiSama|xinghuisama|heiehiehi|1124533793|bilibiliwuwuwu|20260240|www\.xinghuisama\.top|D:\\DEVC\+\+\\XinghuisamaBlogs|萌ICP备|源石|泰拉|提瓦特|罗德岛|普瑞赛斯|干员|PRTS" -g "!PRIVATEIZATION_HANDOFF.md"
```

```powershell
cd D:\work\blog
rg "picBedToken|picBedUrl|picBedName" -n XHBlogs
```

```powershell
cd D:\work\blog
git diff --check
```

浏览器验收：

- 前台：`http://127.0.0.1:3000/`
- 后台设置页：`http://127.0.0.1:3001/settings`
- 重点检查标题、头像、背景、社交链接、关于页、文章页、说说页、杂谈页、友链、项目、相册、评论入口、AI 助手、音乐挂件、移动端布局。

## 5. 完整可用的最终验收标准

只有全部满足时，才算“完全私有化并且功能完整可用”：

- 前后台所有公开展示信息都属于 RubiumOnly，不再出现原作者身份信息、旧域名、旧备案、旧联系方式和旧演示内容。
- 后台能正常编辑文章、草稿、说说、杂谈、关于页、友链、项目、相册和站点配置。
- 后台能上传图片到真实图床，且前台仓库不包含图床 Token。
- 点击后台“同步 Blog”后，前台内容和公开配置正确更新。
- GitHub B 线“仅同步源码”能推送到 `RubiumOnly/blog`。
- Vercel 能从 `XHBlogs` 根目录部署成功。
- 线上环境变量配置完整，AI、天气等服务按用户选择正常工作。
- 评论系统能用 GitHub 登录并写入专用公开评论仓库。
- 网易云音乐挂件加载真实歌曲列表。
- 自定义域名、备案信息、CNAME 状态与用户真实情况一致。
- 两端 `npm run build` 通过，配置检查通过，排除交接文档后的业务文件旧作者关键词扫描无命中，密钥泄露扫描无异常。

## 6. 后续专项提示词

### 6.1 接入真实图片和资料

```text
请继续私有化 D:\work\blog。先读 PRIVATEIZATION_HANDOFF.md。用户会提供头像、favicon、背景图、默认封面、照片墙图和公开联系方式。请只把这些真实资料填入 my-blog-manager/siteConfig.ts，再同步或手动确认 XHBlogs/siteConfig.ts 的公开字段一致。不要伪造邮箱、QQ、微信、备案或域名。改完后构建两端并检查前台展示。
```

### 6.2 接入图床

```text
请为 D:\work\blog 的 my-blog-manager 接入用户提供的真实图床配置。图床 Token 只能留在后台配置或本地环境中，不能进入 XHBlogs。接入后测试后台 Token 探针、编辑器上传图片、Markdown 插图展示，并用 rg 确认 XHBlogs 不包含 picBedToken/picBedUrl/picBedName。
```

### 6.3 接入评论

```text
请为 D:\work\blog 接入 GitHub Issues 评论系统。用户会提供评论仓库、GitHub owner/admin、OAuth Client ID 和 Client Secret。请配置 gitalkConfig，并验证文章、说说、灵境评论在本地和线上域名下都能登录和创建 issue。不要复用用户的重要 OAuth App；如缺参数，明确列出缺哪一项。
```

### 6.4 部署到 Vercel

```text
请协助把 D:\work\blog 部署到 Vercel。仓库是 RubiumOnly/blog，Root Directory 必须是 XHBlogs。请检查 package/build 配置、Vercel 环境变量 GEMINI_API_KEY 和 QWEATHER_KEY、自定义域名 DNS、构建日志和线上页面。不要把任何密钥写入前台代码。
```

### 6.5 最终私有化验收

```text
请对 D:\work\blog 做最终私有化验收。按 PRIVATEIZATION_HANDOFF.md 的最终验收标准执行：两端 build、checkConfig、旧作者关键词扫描、前台密钥扫描、后台同步流程、Git 推送、Vercel 部署、AI、天气、评论、图床、音乐、相册、移动端浏览器验证。发现问题请直接修复并重新验证。
```
