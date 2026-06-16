# 安全与素材隐私

《视频课程套壳》是本地课程视频 HUD 渲染工具。项目可能会在开发和测试时接触课程视频、讲师素材、客户内容和本地配置，因此安全边界必须明确。

## 不要提交的内容

请不要向仓库提交：

1. 真实课程视频。
2. 客户交付素材。
3. 未授权的讲师视频、头像或品牌资源。
4. `.env`、`.env.*`、API key、token、password、private key。
5. 本地 Obsidian 配置和工作区状态。
6. 构建产物、渲染产物和缓存目录。

## 已默认忽略

`.gitignore` 已默认忽略：

1. `node_modules/`
2. `dist/`
3. `out/`
4. `.cache/`
5. `.remotion/`
6. `.obsidian/`
7. `.env`
8. `.env.*`
9. `public/input/videos/*.mp4`
10. `public/input/videos/*.mov`
11. `public/input/videos/*.mkv`
12. `public/input/speakers/*.mp4`
13. `public/input/speakers/*.mov`
14. `public/input/speakers/*.mkv`

## 公开素材原则

如果需要提交示例素材，请确保：

1. 素材为自制、开源、公共领域，或已获得明确授权。
2. 文件体积足够小，不影响仓库克隆。
3. 不包含个人隐私、客户信息或商业机密。
4. 文档中写明来源和授权。

## 报告安全问题

如果你发现安全问题，请不要直接在公开 issue 中贴出密钥、客户素材或可复现的敏感数据。

建议报告内容包含：

1. 问题摘要。
2. 影响范围。
3. 复现步骤。
4. 建议修复方向。
5. 是否涉及敏感文件或私有素材。

在项目未配置专门安全邮箱前，可先通过 GitHub issue 提交不含敏感细节的报告，并说明需要私下沟通。
