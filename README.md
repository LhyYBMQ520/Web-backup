# L菌の导航站
个人主页 & 导航站点开源备份仓库，**纯前端静态页面**，无后端依赖，推荐使用 Nginx 部署。

## 🌐 在线访问
双栈访问地址：
> https://www.lcatnya.top/

## 🚀 快速部署
1. 克隆本仓库到本地
```bash
git clone https://github.com/LhyYBMQ520/Web-backup
```
2. 安装依赖并构建生产 CSS （如没有 pnpm 请使用`npm install -g pnpm`安装）：
```bash
pnpm install
pnpm run build:css
```
3. 将仓库内静态文件放入 Nginx 站点根目录，主入口文件为默认的 `index.html`
4. 配置 Nginx 并重启，即可直接访问使用

## 🛠️ 本地开发

Tailwind CSS 使用本地 CLI 在构建时编译，页面只会打包实际扫描到的 CSS 类。

当前扫描范围为引用该样式的 `close-the-AD.html` 和 `speedtest.html`，包含页面内联脚本中动态使用的类名。新增引用 `assets/tailwind.css` 的页面或拆分脚本时，请同步更新 `tailwind.config.js` 的 `content` 列表。

修改 HTML、JavaScript 或 Tailwind 源样式后，可使用监听模式自动重新生成：

```bash
pnpm run watch:css
```

生产部署时请保留构建生成的 `assets/tailwind.css` 文件。该文件已由构建脚本压缩，不需要在浏览器中加载 Tailwind CDN。

## 📁 仓库说明
本仓库为个人小破站的源码备份，可自由 Fork、自用修改，欢迎 Star ⭐
