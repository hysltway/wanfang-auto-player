# 【荔枝糖】万方数据视频自动播放助手

<div align="center">

![Version](https://img.shields.io/badge/version-1.2.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-支持-brightgreen.svg)
![Edge](https://img.shields.io/badge/Edge-支持-brightgreen.svg)

**一键实现万方数据视频自动播放、自动跳转、后台挂机学习** 🎓

</div>

---

## 📖 目录

- [功能特性](#-功能特性)
- [安装教程](#-安装教程-从零开始)
  - [步骤1：安装 Tampermonkey](#步骤1安装-tampermonkey-油猴插件)
  - [步骤2：安装本脚本](#步骤2安装本脚本)
  - [步骤3：开始使用](#步骤3开始使用)
- [功能说明](#-功能说明)
- [反检测技术](#-反检测技术详解)
- [使用指南](#-使用指南)
- [常见问题](#-常见问题)
- [更新日志](#-更新日志)
- [开源协议](#-开源协议)

---

## ✨ 功能特性

- ✅ **自动播放视频** - 页面加载后自动开始播放
- ✅ **自动跳转下一个** - 视频播放完成后自动进入下一个视频
- ✅ **防页面切换检测** - 切换标签页、最小化窗口视频不会暂停
- ✅ **后台挂机学习** - 可以将浏览器放在后台，视频继续播放
- ✅ **可视化控制面板** - 提供友好的操作界面
- ✅ **智能重试机制** - 播放失败自动重试
- ✅ **实时通知提示** - 关键操作都有通知反馈

---

## 📥 安装教程 (从零开始)

### 步骤1：安装 Tampermonkey (油猴插件)

> Tampermonkey 是一个浏览器扩展程序，用于管理用户脚本。

#### 🔹 方法一：从 Chrome 应用商店安装（推荐）

1. 打开 Chrome 浏览器
2. 访问 Chrome 应用商店 Tampermonkey 页面：
   ```
   https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
   ```
3. 点击右上角 **"添加至 Chrome"** 按钮
4. 在弹出窗口中点击 **"添加扩展程序"**
5. 等待安装完成，浏览器右上角会出现 Tampermonkey 图标 ![TM图标](https://tampermonkey.net/favicon.ico)

![安装Tampermonkey](https://user-images.githubusercontent.com/placeholder-tampermonkey-install.png)

#### 🔹 方法二：从 Edge 商店安装（适用于 Edge 浏览器）

1. 打开 Microsoft Edge 浏览器
2. 访问 Edge 插件商店：
   ```
   https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd
   ```
3. 点击 **"获取"** 按钮
4. 点击 **"添加扩展"**

#### 🔹 方法三：离线安装（无法访问应用商店时）

1. 从 [Tampermonkey 官网](https://www.tampermonkey.net/) 下载离线安装包
2. 打开 Chrome，访问 `chrome://extensions/`
3. 打开右上角的 **"开发者模式"**
4. 将下载的 `.crx` 文件拖入页面即可安装

---

### 步骤2：安装本脚本

#### 🔹 方法一：手动创建脚本

1. 点击浏览器右上角的 **Tampermonkey 图标**

2. 选择 **"管理面板"**

   ![Tampermonkey菜单](https://user-images.githubusercontent.com/placeholder-tm-menu.png)

3. 点击左侧的 **"+"** 号（添加新脚本）

   ![添加脚本](https://user-images.githubusercontent.com/placeholder-add-script.png)

4. 删除编辑器中的所有内容

5. 复制本项目的 `wanfang_auto_next.js` 文件内容

6. 粘贴到编辑器中

7. 按 `Ctrl + S`（或 `Cmd + S`）保存

8. 看到保存成功提示即可

   ![保存脚本](https://user-images.githubusercontent.com/placeholder-save-script.png)

---

### 步骤3：开始使用

1. **访问万方数据视频页面**
   
   打开浏览器，访问万方数据课程页面：
   ```
   https://cx.wanfangdata.com.cn/
   ```

2. **检查脚本是否运行**
   
   - 页面右下角应该出现 **"🎬 荔枝糖视频助手"** 控制面板
   - 页面加载后视频应该自动开始播放
   - 右上角会出现 **"荔枝糖视频助手已启动"** 的通知

   ![控制面板](https://user-images.githubusercontent.com/placeholder-control-panel.png)

3. **查看调试信息（可选）**
   
   - 按 `F12` 打开浏览器开发者工具
   - 切换到 **"控制台 (Console)"** 标签
   - 应该能看到类似以下日志：
     ```
     [荔枝糖自动跳转] 脚本已加载
     [荔枝糖自动跳转] 启动反检测功能
     [反检测] 已劫持 document.hidden
     [荔枝糖自动跳转] 正在初始化...
     ```

4. **享受自动播放！** 🎉

---

## 🎯 功能说明

### 控制面板

脚本运行后，页面右下角会显示一个可拖动的控制面板：

| 选项 | 说明 | 默认状态 |
|------|------|---------|
| 🎬 **自动播放视频** | 页面加载后自动点击播放按钮 | ✅ 启用 |
| ⏭️ **自动跳转下一个** | 视频结束后自动进入下一个视频 | ✅ 启用 |
| 🔔 **显示通知** | 显示操作提示通知 | ✅ 启用 |
| 🛡️ **防检测** | 防止网站检测页面切换（固定启用） | ✅ 启用 |

#### 控制按钮

- **▶️ 手动播放视频** - 手动触发播放（当自动播放失败时使用）
- **⏭️ 手动跳转下一个** - 手动跳转到下一个视频

#### 拖动面板

按住控制面板任意空白区域，可以拖动到屏幕的任意位置。

---

## 🛡️ 反检测技术详解

### 为什么需要反检测？

很多在线学习平台会检测用户是否真正在观看视频，一旦检测到用户切换标签页或最小化浏览器，就会自动暂停视频。本脚本通过以下技术绕过这些检测。

### 技术实现

#### 1️⃣ **拦截 visibilitychange 事件**

```javascript
EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'visibilitychange' || type === 'webkitvisibilitychange') {
        return; // 不添加这个监听器
    }
    return originalAddEventListener.call(this, type, listener, options);
};
```

**作用**：网站无法通过 `visibilitychange` 事件检测到页面切换。

#### 2️⃣ **劫持 document.hidden 属性**

```javascript
Object.defineProperty(document, 'hidden', {
    get: function() {
        return false; // 始终返回 false，表示页面可见
    }
});
```

**作用**：即使切换标签页，网站读取到的 `document.hidden` 始终为 `false`。

#### 3️⃣ **劫持 document.visibilityState 属性**

```javascript
Object.defineProperty(document, 'visibilityState', {
    get: function() {
        return 'visible'; // 始终返回 visible
    }
});
```

**作用**：网站检测页面可见状态时，始终返回 `visible`。

#### 4️⃣ **拦截窗口焦点事件**

```javascript
const blockEvents = ['blur', 'focusout'];
blockEvents.forEach(eventType => {
    window.addEventListener(eventType, function(e) {
        e.stopImmediatePropagation(); // 阻止事件传播
    }, true);
});
```

**作用**：网站无法检测到窗口失去焦点。

#### 5️⃣ **劫持 document.hasFocus 方法**

```javascript
document.hasFocus = function() {
    return true; // 始终返回 true，表示页面有焦点
};
```

**作用**：网站调用 `document.hasFocus()` 时，始终返回 `true`。

#### 6️⃣ **防止视频被暂停**

```javascript
HTMLMediaElement.prototype.pause = function() {
    const stack = new Error().stack;
    // 只拦截非用户手动暂停的操作
    if (stack && !stack.includes('user-gesture') && this.currentTime > 0) {
        return; // 阻止暂停
    }
    return originalPause.call(this);
};
```

**作用**：拦截网站代码对视频的暂停操作，但允许用户手动暂停。

#### 7️⃣ **自动恢复播放监控**

```javascript
setInterval(() => {
    const video = document.querySelector('video');
    if (video && video.paused && video.currentTime > 0) {
        video.play(); // 自动恢复播放
    }
}, 1000);
```

**作用**：每秒检查一次，如果检测到视频被暂停，立即恢复播放。

#### 8️⃣ **劫持 Webkit 前缀 API**

```javascript
Object.defineProperty(document, 'webkitHidden', {
    get: function() { return false; }
});
Object.defineProperty(document, 'webkitVisibilityState', {
    get: function() { return 'visible'; }
});
```

**作用**：兼容 Webkit 内核浏览器（如 Safari、旧版 Chrome）。

---

### 反检测工作流程

```
用户切换标签页
    ↓
网站尝试检测 document.hidden
    ↓
脚本劫持返回 false (伪装页面可见)
    ↓
网站认为页面仍然可见
    ↓
视频继续播放 ✅
```

```
网站尝试暂停视频
    ↓
触发 video.pause()
    ↓
脚本拦截暂停操作
    ↓
暂停操作被阻止
    ↓
视频继续播放 ✅
```

```
视频意外暂停
    ↓
1秒后监控检测到
    ↓
自动调用 video.play()
    ↓
视频恢复播放 ✅
```

---

### 执行时机

```javascript
// @run-at document-start
```

脚本在页面加载最早期执行（`document-start`），确保在网站检测代码运行之前完成 API 劫持。

---

## 📚 使用指南

### 正常使用场景

#### ✅ 可以做的事情（视频不会暂停）

- ✅ 切换到其他标签页浏览网页
- ✅ 最小化浏览器窗口
- ✅ 将浏览器窗口移到后台
- ✅ 切换到其他应用程序工作
- ✅ 锁屏（部分情况下有效）
- ✅ 同时学习多个课程（多标签页）

#### ⚠️ 注意事项

- 用户手动点击暂停按钮仍然可以暂停视频
- 如果浏览器要求用户交互才能播放媒体（浏览器安全策略），脚本可能需要用户先手动点击一次播放
- 电脑休眠或关机后视频会停止
- 网络断开时视频会暂停

---

### 高级用法

#### 🔹 多标签页同时挂机

1. 打开多个万方数据课程标签页
2. 每个标签页都会独立运行脚本
3. 可以同时学习多门课程
4. 切换标签页不会影响其他标签页的播放

#### 🔹 后台挂机

1. 打开视频页面，确认脚本正常运行
2. 将浏览器最小化或切换到其他应用
3. 视频会继续在后台播放
4. 播放完成后自动跳转到下一个

#### 🔹 配置个性化设置

如需修改脚本行为，可以编辑脚本源码中的 `config` 对象：

```javascript
const config = {
    autoPlay: true,              // 是否自动播放
    autoNext: true,              // 是否自动跳转
    waitTime: 2000,              // 跳转等待时间（毫秒）
    checkInterval: 1000,         // 检测间隔（毫秒）
    showNotification: true,      // 是否显示通知
    playButtonWaitTime: 1500,    // 播放按钮等待时间
    playButtonRetry: 10,         // 播放按钮重试次数
    antiDetection: true,         // 是否启用反检测
    videoEndCheckInterval: 2000  // 视频结束检测间隔
};
```

---

## ❓ 常见问题

### Q1: 脚本没有运行，页面没有控制面板

**解决方案：**

1. 检查 Tampermonkey 是否已正确安装（浏览器右上角应有图标）
2. 点击 Tampermonkey 图标，确认脚本已启用（开关是绿色的）
3. 确认当前网址是 `https://cx.wanfangdata.com.cn/*`
4. 按 `Ctrl + F5` 强制刷新页面
5. 查看浏览器控制台（F12）是否有错误信息

### Q2: 视频没有自动播放

**解决方案：**

1. 点击控制面板中的 **"▶️ 手动播放视频"** 按钮
2. 检查 **"自动播放视频"** 选项是否已勾选
3. 有些浏览器要求用户先手动交互一次才能播放媒体，手动点击一次播放后，后续视频就可以自动播放了
4. 查看控制台日志，看是否有播放失败的错误信息

### Q3: 视频播放完成后没有自动跳转

**解决方案：**

1. 检查 **"自动跳转下一个"** 选项是否已勾选
2. 如果是最后一个视频，会显示"已经是最后一个视频了"的通知
3. 查看控制台日志，确认是否检测到视频结束事件
4. 可以点击 **"⏭️ 手动跳转下一个"** 按钮手动跳转

### Q4: 切换标签页后视频仍然被暂停

**解决方案：**

1. 检查控制台是否有反检测相关的日志（如 `[反检测] 已劫持...`）
2. 确认脚本执行时机为 `document-start`（在脚本管理器中查看脚本信息）
3. 尝试清除浏览器缓存后重新加载页面
4. 检查是否有其他脚本与本脚本冲突
5. 确认 `config.antiDetection` 为 `true`

### Q5: 通知提示太频繁，想关闭

**解决方案：**

取消勾选控制面板中的 **"显示通知"** 选项即可。

### Q6: 控制面板位置不合适，想移动

**解决方案：**

按住控制面板任意空白区域，拖动到想要的位置即可。

### Q7: 想临时禁用脚本

**解决方案：**

1. 点击浏览器右上角的 Tampermonkey 图标
2. 找到 **"【荔枝糖】万方数据自动跳转下一个视频"**
3. 点击脚本名称左边的开关，变成灰色即为禁用
4. 刷新页面生效

### Q8: 脚本更新后如何重新安装

**解决方案：**

1. 如果是通过链接安装的，再次点击安装链接即可覆盖更新
2. 如果是手动创建的，需要在 Tampermonkey 管理面板中删除旧版本，然后重新创建
3. Tampermonkey 也支持自动检查更新（需要脚本配置了更新源）

---

## 🔒 安全性说明

1. **仅作用于当前标签页**：所有劫持和修改仅在当前页面生效，不影响其他网站
2. **不修改浏览器设置**：脚本运行在沙箱中，刷新页面后恢复正常
3. **无网络请求**：反检测功能完全在本地执行，不发送任何数据
4. **开源透明**：所有代码公开，可以自行审查

---

## 📝 更新日志

### v1.2.3 (当前版本)
- ✅ 优化视频结束检测逻辑
- ✅ 修复部分情况下的误触发问题
- ✅ 改进播放按钮查找机制
- ✅ 增强稳定性

### v1.2.0
- ✅ 新增可视化控制面板
- ✅ 支持拖动面板
- ✅ 新增手动操作按钮

### v1.1.0
- ✅ 新增完整的反检测功能
- ✅ 劫持 7 种不同的检测方式
- ✅ 自动恢复播放监控
- ✅ 兼容 Webkit 内核浏览器
- ✅ 优化执行时机为 document-start

### v1.0.0
- ✅ 基础的自动播放和自动跳转功能

---

## 🤝 贡献与支持

### 反馈问题

如果遇到问题或有改进建议：

1. 优先查看 [常见问题](#-常见问题) 章节
2. 查看浏览器控制台（F12）的日志信息
3. 在 GitHub 上提交 Issue（如果有仓库链接）

### 贡献代码

欢迎提交 Pull Request！

### 支持作者

如果这个脚本对你有帮助，欢迎：

- ⭐ Star 本项目（如果在 GitHub 上）
- 📢 分享给需要的朋友
- 💬 提供反馈和建议

---

## 📄 开源协议

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源协议。

```
MIT License

Copyright (c) 2024 hysltway

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 作者信息

- **作者**: hysltway
- **邮箱**: hysltway@gmail.com
- **GitHub**: [https://github.com/hysltway](https://github.com/hysltway)

---

<div align="center">

**享受无忧的视频自动播放体验！** 🎉

Made with ❤️ by [hysltway](https://github.com/hysltway)

</div>


