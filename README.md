# 🔮 AI Prompt Syncer

**AI Prompt Syncer** 是一款适配 **Chrome** 和 **Firefox** 的浏览器插件，用于管理和同步 AI 提示词，支持与 **Notion** 数据库无缝集成。插件提供离线缓存、快速搜索和一键复制功能，帮助用户高效管理和使用提示词。

---


## ✨ 功能亮点

- **适配多平台：** 完美支持 Chrome 和 Firefox 浏览器。
- **与 Notion 同步：** 自动将提示词与 Notion 数据库实时同步，保持内容一致性。
- **离线模式：** 提示词使用 **IndexDB** 本地缓存，无需等待 Notion 连接。
- **快捷键搜索：** 通过自定义快捷键快速调出搜索界面。
- **一键复制：** 轻松复制提示词到剪贴板，用于聊天工具或其他应用。
- **标签管理：** 支持标签分类，方便组织和查找提示词。
  
## 🛠 技术特性
- 使用 **Vue 3 + Vite** 构建，性能高效，代码现代化。
- **Pinia** 状态管理，轻松处理数据流。
- **Dexie.js** 管理本地数据库，实现高效的提示词存储与检索。
- 通过 **Notion API** 实现云端同步，支持提示词的双向更新。
- **HMR（热模块替换）：** 开发时实时更新，无需重载插件。


## 🚀 快速开始
### 1. 安装插件
克隆项目到本地：

```bash
git clone https://github.com/AI-prompt-syncer/ai-prompt-syncer.git
cd ai-prompt-syncer
```

安装依赖:
```
pnpm install
```
构建插件：
```
pnpm build
```

---


###  2. 加载插件

#### Chrome：
1. 打开 `chrome://extensions/`。
2. 启用开发者模式。
3. 点击 **加载已解压的扩展程序**，选择 `extension` 文件夹。

#### Firefox：
1. 打开 `about:debugging#/runtime/this-firefox`。
2. 点击 **加载临时附加组件**，选择 `extension` 文件夹中的任意 `.zip` 文件。

### 3. 配置 Notion
1. 在插件设置中输入你的 **Notion API Token** 和 **Database ID**。
2. 开启同步功能。


## 📸 截图
### 🔍 快速搜索
轻松查找和使用提示词。
<p align="center">
<sub>index</sub><br/>
<img width="655" src="https://github.com/user-attachments/assets/83612b33-c52b-47d7-a335-e356dc4e914d"><br/>
</p>

### ⚡ 离线模式
即使没有网络，也可以查看和复制提示词。

### ☁ Notion 同步
提示词自动上传到 Notion 数据库，随时随地访问。

## 🌟 未来改进
- 支持更多第三方服务（如 Google Sheets）。
- 添加更多自定义模板支持。
- 提供跨设备同步功能。

## 📜 开源协议
本项目基于 **MIT 协议**，欢迎贡献和修改。





