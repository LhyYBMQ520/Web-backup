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

Tailwind CSS 使用本地 CLI 在构建时编译，页面只会打包实际扫描到的 CSS 类。修改 HTML、JavaScript 或 Tailwind 源样式后，可使用监听模式自动重新生成：

```bash
pnpm run watch:css
```

生产部署时请保留构建生成的 `assets/tailwind.css` 文件。该文件已由构建脚本压缩，不需要在浏览器中加载 Tailwind CDN。

## 📁 仓库说明
本仓库为个人小破站的源码备份，可自由 Fork、自用修改，欢迎 Star ⭐

## 🔌 可选功能：IP 归属地欢迎文案

页面顶部支持根据访客 IP 显示个性化欢迎信息（如"欢迎，来自中国浙江省杭州市的用户，即将进入网页"），需要搭配 [IP-check-api](https://github.com/LhyYBMQ520/IP-check-api) 后端使用。

**启用步骤：**

1. 复制配置模板并重命名：
   ```bash
   cp jsons/api-config.example.json jsons/api-config.json
   ```

2. 编辑 `jsons/api-config.json`，填入你的 API 服务地址：
   ```json
   {
     "welcomeApi": "https://your-api-server.com"
   }
   ```

3. 刷新页面即可看到欢迎文案。

> 未配置时页面会静默降级显示默认文案"欢迎访问本站"，不影响正常使用。
