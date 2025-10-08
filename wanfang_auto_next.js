// ==UserScript==
// @name         【荔枝糖】万方数据自动跳转下一个视频
// @namespace    https://github.com/hysltway
// @version      1.2.3
// @description  自动播放视频、自动跳转下一个视频、防止页面切换检测，支持后台挂机学习
// @author       hysltway (hysltway@gmail.com)
// @homepage     https://github.com/hysltway
// @match        https://cx.wanfangdata.com.cn/*
// @icon         https://www.wanfangdata.com.cn/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

/**
 * 【荔枝糖】万方数据视频自动播放与跳转脚本
 * 
 * 功能特性：
 * - 自动检测并点击播放按钮
 * - 视频结束后自动跳转到下一个
 * - 防止页面切换/失焦检测（可后台运行）
 * - 可视化控制面板
 * 
 * 作者：hysltway
 * GitHub：https://github.com/hysltway
 * Email：hysltway@gmail.com
 */

(function() {
    'use strict';

    console.log('[荔枝糖自动跳转] 脚本已加载');

    const config = {
        autoPlay: true,
        autoNext: true,
        waitTime: 2000,
        checkInterval: 1000,
        showNotification: true,
        playButtonWaitTime: 1500,
        playButtonRetry: 10,
        antiDetection: true,
        videoEndCheckInterval: 2000
    };

    let antiDetectionInitialized = false;
    let lastVideoTime = 0;
    let videoEndCheckTimer = null;
    
    function preventVisibilityDetection() {
        if (!config.antiDetection || antiDetectionInitialized) return;
        
        antiDetectionInitialized = true;
        console.log('[荔枝糖自动跳转] 启动反检测功能');
        
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'visibilitychange' || type === 'webkitvisibilitychange') {
                console.log('[反检测] 已拦截 visibilitychange 事件监听');
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        try {
            Object.defineProperty(document, 'hidden', {
                get: function() { return false; },
                configurable: true
            });
            console.log('[反检测] 已劫持 document.hidden');
        } catch(e) {
            console.log('[反检测] 劫持 document.hidden 失败:', e);
        }

        try {
            Object.defineProperty(document, 'visibilityState', {
                get: function() { return 'visible'; },
                configurable: true
            });
            console.log('[反检测] 已劫持 document.visibilityState');
        } catch(e) {
            console.log('[反检测] 劫持 document.visibilityState 失败:', e);
        }

        ['blur', 'focusout'].forEach(eventType => {
            window.addEventListener(eventType, function(e) {
                e.stopImmediatePropagation();
                console.log(`[反检测] 已拦截 ${eventType} 事件`);
            }, true);
        });

        try {
            const originalHasFocus = document.hasFocus;
            document.hasFocus = function() { return true; };
            console.log('[反检测] 已劫持 document.hasFocus');
        } catch(e) {
            console.log('[反检测] 劫持 document.hasFocus 失败:', e);
        }

        const originalPause = HTMLMediaElement.prototype.pause;
        HTMLMediaElement.prototype.pause = function() {
            const stack = new Error().stack;
            if (stack && !stack.includes('user-gesture') && this.currentTime > 0 && this.currentTime < this.duration - 0.5) {
                console.log('[反检测] 已拦截视频暂停操作');
                return;
            }
            return originalPause.call(this);
        };

        setInterval(() => {
            const video = document.querySelector('video');
            if (video && video.paused && video.currentTime > 0 && video.currentTime < video.duration - 0.5) {
                console.log('[反检测] 检测到视频被暂停，自动恢复播放');
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(e => console.log('[反检测] 恢复播放失败:', e));
                }
            }
        }, 1000);

        try {
            Object.defineProperty(document, 'webkitHidden', {
                get: function() { return false; },
                configurable: true
            });
            Object.defineProperty(document, 'webkitVisibilityState', {
                get: function() { return 'visible'; },
                configurable: true
            });
            console.log('[反检测] 已劫持 webkit 可见性 API');
        } catch(e) {
            console.log('[反检测] 劫持 webkit API 失败:', e);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                showNotification('反检测功能已启动', 3000);
            });
        } else {
            showNotification('反检测功能已启动', 3000);
        }
    }

    function showNotification(message, duration = 3000) {
        if (!config.showNotification) return;

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 999999;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        if (!document.getElementById('wanfang-notification-style')) {
            const style = document.createElement('style');
            style.id = 'wanfang-notification-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    function findVideoElement() {
        return document.querySelector('video');
    }

    function findPlayButton() {
        const playBtn = document.querySelector('.prism-big-play-btn');
        if (playBtn) return playBtn;

        const altButtons = [
            document.querySelector('[class*="big-play"]'),
            document.querySelector('[class*="play-btn"]'),
            document.querySelector('.play-button'),
            document.querySelector('[id*="play"]')
        ];

        for (let btn of altButtons) {
            if (btn && btn.offsetParent !== null) return btn;
        }
        return null;
    }

    function clickPlayButton(retryCount = 0) {
        const playButton = findPlayButton();
        
        if (playButton) {
            console.log('[荔枝糖自动跳转] 找到播放按钮，准备点击');
            const style = window.getComputedStyle(playButton);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                playButton.click();
                console.log('[荔枝糖自动跳转] 已点击播放按钮');
                showNotification('视频开始播放');
                return true;
            } else {
                console.log('[荔枝糖自动跳转] 播放按钮不可见，视频可能已经在播放');
                return false;
            }
        } else {
            if (retryCount < config.playButtonRetry) {
                console.log(`[荔枝糖自动跳转] 未找到播放按钮，${config.playButtonWaitTime}ms后重试 (${retryCount + 1}/${config.playButtonRetry})`);
                setTimeout(() => clickPlayButton(retryCount + 1), config.playButtonWaitTime);
            } else {
                console.log('[荔枝糖自动跳转] 多次尝试后仍未找到播放按钮，可能视频已自动播放');
                const video = findVideoElement();
                if (video && video.paused) {
                    const playPromise = video.play();
                    if (playPromise && typeof playPromise.then === 'function') {
                        playPromise.then(() => {
                            console.log('[荔枝糖自动跳转] 已通过video元素直接播放');
                            showNotification('视频已开始播放');
                        }).catch(err => console.log('[荔枝糖自动跳转] 播放失败:', err));
                    }
                }
            }
            return false;
        }
    }

    function findNextButton() {
        const nextButtons = document.querySelectorAll('span.next');
        if (nextButtons.length > 0) return nextButtons[0];

        const allSpans = document.querySelectorAll('span');
        for (let span of allSpans) {
            const title = span.getAttribute('title') || '';
            const text = span.textContent || '';
            if (title || (text.includes('下一') && text.length < 50)) {
                return span;
            }
        }
        return null;
    }

    function clickNextButton() {
        const nextButton = findNextButton();
        if (nextButton) {
            const nextTitle = nextButton.getAttribute('title') || '下一个视频';
            console.log(`[荔枝糖自动跳转] 准备跳转到: ${nextTitle}`);
            showNotification(`正在跳转到: ${nextTitle}`);

            setTimeout(() => {
                nextButton.click();
                console.log('[荔枝糖自动跳转] 已点击下一个按钮');
                
                setTimeout(() => {
                    console.log('[荔枝糖自动跳转] 页面已跳转，尝试自动播放新视频');
                    clickPlayButton(0);
                }, config.playButtonWaitTime);
            }, config.waitTime);
        } else {
            console.log('[荔枝糖自动跳转] 未找到下一个按钮，可能已经是最后一个视频');
            showNotification('已经是最后一个视频了');
        }
    }

    function attachVideoEndedListener(video) {
        if (video.dataset.autoNextAttached) return;

        video.dataset.autoNextAttached = 'true';
        lastVideoTime = 0; // 重置视频时间记录，避免影响新视频判断
        console.log('[荔枝糖自动跳转] 已绑定视频结束监听器，已重置时间记录');

        // 方法1：监听 ended 事件
        video.addEventListener('ended', () => {
            console.log('[荔枝糖自动跳转] ★ ended事件触发 - 视频播放结束');
            showNotification('视频播放结束，即将跳转到下一个视频');
            if (videoEndCheckTimer) clearInterval(videoEndCheckTimer);
            if (config.autoNext) clickNextButton();
        });

        // 方法2：监听 pause 事件，判断是否接近视频结尾
        video.addEventListener('pause', () => {
            const currentTime = video.currentTime;
            const duration = video.duration;
            if (duration > 0 && currentTime > 0) {
                const remaining = duration - currentTime;
                const progress = (currentTime / duration) * 100;
                console.log(`[荔枝糖自动跳转] pause事件触发 - 当前时间: ${currentTime.toFixed(2)}s, 总时长: ${duration.toFixed(2)}s, 剩余: ${remaining.toFixed(2)}s, 进度: ${progress.toFixed(1)}%`);
                
                // 严格判断条件：
                // 1. 剩余时间小于1秒
                // 2. 视频已播放超过10秒（避免刚加载就误判）
                // 3. 播放进度超过95%（确保真的接近结尾）
                if (remaining < 1 && remaining >= 0 && currentTime > 10 && progress > 95) {
                    console.log('[荔枝糖自动跳转] ★ pause事件 + 接近结尾 - 判定为视频播放完成');
                    showNotification('视频播放结束，即将跳转到下一个视频');
                    if (videoEndCheckTimer) clearInterval(videoEndCheckTimer);
                    if (config.autoNext) {
                        setTimeout(() => clickNextButton(), 500);
                    }
                } else if (currentTime <= 10) {
                    console.log('[荔枝糖自动跳转] pause事件触发，但视频刚开始，忽略（避免误触发）');
                }
            }
        });

        // 方法3：定时检查视频播放进度
        if (videoEndCheckTimer) clearInterval(videoEndCheckTimer);
        videoEndCheckTimer = setInterval(() => {
            if (!video || !document.contains(video)) {
                console.log('[荔枝糖自动跳转] 视频元素已被移除，清除检测定时器');
                clearInterval(videoEndCheckTimer);
                return;
            }

            const currentTime = video.currentTime;
            const duration = video.duration;
            
            if (duration > 0 && currentTime > 0) {
                const remaining = duration - currentTime;
                const progress = (currentTime / duration) * 100;
                
                // 严格判断条件：避免误触发
                // 1. 剩余时间小于1秒
                // 2. 视频已暂停
                // 3. 视频已播放超过10秒
                // 4. 播放进度超过95%
                if (remaining < 1 && remaining >= 0 && video.paused && currentTime > 10 && progress > 95) {
                    console.log(`[荔枝糖自动跳转] ★ 定时检测 - 视频接近结尾且已暂停，剩余: ${remaining.toFixed(2)}s, 进度: ${progress.toFixed(1)}%`);
                    showNotification('视频播放结束，即将跳转到下一个视频');
                    clearInterval(videoEndCheckTimer);
                    if (config.autoNext) {
                        clickNextButton();
                    }
                }
                
                // 检查视频是否卡住（正在播放但时间不动）
                if (lastVideoTime === currentTime && currentTime < duration - 1 && !video.paused) {
                    console.log('[荔枝糖自动跳转] ⚠ 检测到视频卡住，尝试恢复播放');
                    const playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(err => console.log('[荔枝糖自动跳转] 恢复播放失败:', err));
                    }
                }
                
                lastVideoTime = currentTime;
            }
        }, config.videoEndCheckInterval);

        // 初始自动播放
        if (config.autoPlay && video.paused) {
            console.log('[荔枝糖自动跳转] 检测到视频暂停，尝试自动播放');
            setTimeout(() => {
                const clicked = clickPlayButton(0);
                if (!clicked && video && video.paused) {
                    const playPromise = video.play();
                    if (playPromise && typeof playPromise.then === 'function') {
                        playPromise.then(() => {
                            console.log('[荔枝糖自动跳转] 视频已通过video元素自动播放');
                            showNotification('视频已开始播放');
                        }).catch(err => {
                            console.log('[荔枝糖自动跳转] 自动播放失败，可能需要用户交互:', err);
                            showNotification('请手动点击播放按钮', 5000);
                        });
                    }
                }
            }, 500);
        }
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'wanfang-control-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            z-index: 999998;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-size: 13px;
            min-width: 200px;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; font-size: 14px; color: #333;">
                🎬 荔枝糖视频助手
            </div>
            <div style="margin-bottom: 8px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="autoPlay" ${config.autoPlay ? 'checked' : ''} style="margin-right: 8px;">
                    <span>自动播放视频</span>
                </label>
            </div>
            <div style="margin-bottom: 8px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="autoNext" ${config.autoNext ? 'checked' : ''} style="margin-right: 8px;">
                    <span>自动跳转下一个</span>
                </label>
            </div>
            <div style="margin-bottom: 8px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="showNotification" ${config.showNotification ? 'checked' : ''} style="margin-right: 8px;">
                    <span>显示通知</span>
                </label>
            </div>
            <div style="margin-bottom: 8px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="antiDetection" ${config.antiDetection ? 'checked' : ''} style="margin-right: 8px;" disabled>
                    <span style="color: #FF5722;">🛡️ 防检测（已启用）</span>
                </label>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                <button id="manualPlay" style="width: 100%; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 8px;">
                    ▶️ 手动播放视频
                </button>
                <button id="manualNext" style="width: 100%; padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ⏭️ 手动跳转下一个
                </button>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: #999; text-align: center;">
                按住拖动可移动面板
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('autoPlay').addEventListener('change', (e) => {
            config.autoPlay = e.target.checked;
            console.log(`[荔枝糖自动跳转] 自动播放: ${config.autoPlay}`);
        });

        document.getElementById('autoNext').addEventListener('change', (e) => {
            config.autoNext = e.target.checked;
            console.log(`[荔枝糖自动跳转] 自动跳转: ${config.autoNext}`);
        });

        document.getElementById('showNotification').addEventListener('change', (e) => {
            config.showNotification = e.target.checked;
            console.log(`[荔枝糖自动跳转] 显示通知: ${config.showNotification}`);
        });

        document.getElementById('manualPlay').addEventListener('click', () => {
            console.log('[荔枝糖自动跳转] 手动点击播放按钮');
            clickPlayButton(0);
        });

        document.getElementById('manualNext').addEventListener('click', () => {
            clickNextButton();
        });

        makeDraggable(panel);
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.bottom = "auto";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function init() {
        console.log('[荔枝糖自动跳转] 正在初始化...');
        showNotification('荔枝糖视频助手已启动');
        createControlPanel();

        if (config.autoPlay) {
            setTimeout(() => {
                console.log('[荔枝糖自动跳转] 首次加载，尝试自动播放');
                clickPlayButton(0);
            }, config.playButtonWaitTime);
        }

        setInterval(() => {
            const video = findVideoElement();
            if (video && !video.dataset.autoNextAttached) {
                console.log('[荔枝糖自动跳转] 找到视频元素');
                attachVideoEndedListener(video);
            }
        }, config.checkInterval);

        const observer = new MutationObserver(() => {
            const video = findVideoElement();
            if (video && !video.dataset.autoNextAttached) {
                console.log('[荔枝糖自动跳转] 检测到新的视频元素');
                attachVideoEndedListener(video);
                if (config.autoPlay) {
                    setTimeout(() => clickPlayButton(0), 500);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        const video = findVideoElement();
        if (video) attachVideoEndedListener(video);
    }

    preventVisibilityDetection();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }

})();
