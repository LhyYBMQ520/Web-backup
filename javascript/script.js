// ==================== 时间更新功能 ====================
function updateTime() {
    // 获取当前时间对象
    const now = new Date();
    // 获取小时，不足两位补0
    const h = String(now.getHours()).padStart(2, '0');
    // 获取分钟，不足两位补0
    const m = String(now.getMinutes()).padStart(2, '0');
    // 获取秒数，不足两位补0
    const s = String(now.getSeconds()).padStart(2, '0');
    // 更新页面上的时间显示
    document.getElementById('currentTime').textContent = `${h}:${m}:${s}`;

    // 获取年份
    const y = now.getFullYear();
    // 获取月份（注意：月份从0开始，所以要+1），不足两位补0
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    // 获取日期，不足两位补0
    const d = String(now.getDate()).padStart(2, '0');
    // 更新页面上的日期显示
    document.getElementById('currentDate').textContent = `${y}年 ${mo}月 ${d}日`;
}
// 页面加载时立即执行一次时间更新
updateTime();
// 设置定时器，每100毫秒更新一次时间（实现秒表效果）
setInterval(updateTime, 100);

// ==================== 版权年份动态生成 ====================
// 获取当前日期对象
const now = new Date();
// 获取当前年份
const currentYear = now.getFullYear();
// 获取当前月份，不足两位补0
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
// 设置起始年份
const startYear = 2025;

// 生成版权年份显示文本：如果当前年份等于起始年份，只显示起始年份；否则显示 "起始年份 - 当前年份/月份"
const displayText = currentYear === startYear
    ? `${startYear}`
    : `${startYear} - ${currentYear}/${currentMonth}`;

// 更新版权年份显示
document.getElementById('copyright-year-range').textContent = displayText;

// ==================== 今日一句功能 ====================
// 存储所有句子的数组
let allSentences = [];
// 默认句子（加载失败时显示）
const defaultSentence = {
    content: "加载失败",
    source: "加载失败"
};

// 异步加载句子数据（从JSON文件）
async function loadSentences() {
    try {
        // 发起GET请求获取JSON文件
        const response = await fetch('jsons/sentences.json');
        // 检查响应状态，如果不是200-299则抛出错误
        if (!response.ok) {
            throw new Error(`请求失败：${response.status}`);
        }
        // 解析JSON数据
        const data = await response.json();
        // 检查数据格式是否正确（是否有sentences数组且长度>0）
        if (Array.isArray(data.sentences) && data.sentences.length > 0) {
            // 将数据存入allSentences数组
            allSentences = data.sentences;
        } else {
            // 数据格式错误，抛出错误
            throw new Error("JSON文件格式错误或无句子数据");
        }
    } catch (error) {
        // 捕获错误并打印到控制台
        console.error("加载句子失败：", error);
        // 使用默认句子
        allSentences = [defaultSentence];
    }
    // 显示随机句子
    showRandomSentence();
}

// 显示随机句子
function showRandomSentence() {
    // 生成随机索引（0到数组长度-1）
    const randomIndex = Math.floor(Math.random() * allSentences.length);
    // 获取随机选中的句子
    const selectedSentence = allSentences[randomIndex];

    // 更新页面上的句子内容
    document.getElementById('sentenceContent').textContent = selectedSentence.content;
    // 更新页面上的句子来源
    document.getElementById('sentenceSource').textContent = `—— ${selectedSentence.source}`;
}

// ==================== 页面加载完成后执行的主逻辑 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const toTop = document.getElementById('toTop');
    const changeSentenceBtn = document.getElementById('changeSentenceBtn');

    // 加载句子数据
    loadSentences();
    // 为"换一句"按钮添加点击事件，点击时显示随机句子
    changeSentenceBtn.addEventListener('click', showRandomSentence);

    // 定义主题常量
    const THEMES = {
        SYSTEM: 'system',  // 跟随系统
        LIGHT: 'light',    // 亮色模式
        DARK: 'dark'       // 暗色模式
    };

    // 获取系统主题
    const getSystemTheme = () => {
        // 检测系统是否偏好暗色模式
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    };

    // 获取当前主题模式（从localStorage读取，没有则返回SYSTEM）
    const getCurrentMode = () => {
        return localStorage.getItem('theme-mode') || THEMES.SYSTEM;
    };

    // 设置主题模式（存入localStorage并应用）
    const setMode = (mode) => {
        localStorage.setItem('theme-mode', mode);
        applyTheme();
    };

    // 应用主题样式
    const applyTheme = () => {
        // 获取当前模式
        const mode = getCurrentMode();
        // 最终应用的主题
        let finalTheme;

        // 根据不同模式设置最终主题
        if (mode === THEMES.SYSTEM) {
            // 跟随系统模式
            finalTheme = getSystemTheme();
            // 切换按钮图标为桌面图标
            themeToggle.innerHTML = '<i class="fas fa-desktop"></i>';
        } else if (mode === THEMES.DARK) {
            // 暗色模式
            finalTheme = 'dark';
            // 切换按钮图标为月亮图标
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            // 亮色模式
            finalTheme = 'light';
            // 切换按钮图标为太阳图标
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // 根据最终主题切换body的dark类
        body.classList.toggle('dark', finalTheme === 'dark');
        // 切换主题按钮的暗色样式
        themeToggle.classList.toggle('theme-btn-dark', finalTheme === 'dark');
        // 切换回到顶部按钮的暗色样式
        toTop.classList.toggle('totop-btn-dark', finalTheme === 'dark');
    };

    // ==================== 主题切换按钮点击事件 ====================
    themeToggle.addEventListener('click', () => {
        // 获取当前模式
        const mode = getCurrentMode();

        // 循环切换模式：SYSTEM → LIGHT → DARK → SYSTEM
        if (mode === THEMES.SYSTEM) {
            setMode(THEMES.LIGHT);
        } else if (mode === THEMES.LIGHT) {
            setMode(THEMES.DARK);
        } else {
            setMode(THEMES.SYSTEM);
        }
    });

    // ==================== 监听系统主题变化 ====================
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
            // 只有当当前模式是SYSTEM时，才响应系统主题变化
            if (getCurrentMode() === THEMES.SYSTEM) {
                applyTheme();
            }
        });

    // ==================== 回到顶部功能 ====================
    // 监听滚动事件
    window.addEventListener("scroll", () => {
        // 获取滚动距离
        const distanceY = document.documentElement.scrollTop;
        // 滚动距离>100px时显示回到顶部按钮，否则隐藏
        toTop.classList.toggle('hidden', distanceY <= 100);
    });

    // 回到顶部按钮点击事件
    toTop.addEventListener("click", () => {
        // 平滑滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 初始应用主题
    applyTheme();

    // ==================== 字体设置功能 ====================
    const enFontRadios = document.querySelectorAll('input[name="en-font"]');
    const zhFontRadios = document.querySelectorAll('input[name="zh-font"]');

    // 从 localStorage 获取保存的字体设定，或者使用默认值
    const savedEnFont = localStorage.getItem('en-font') || '"Poppins"';
    const savedZhFont = localStorage.getItem('zh-font') || '"ZCOOL KuaiLe"';

    // 应用字体到页面（修改 CSS 根变量）
    const applyFonts = (en, zh) => {
        document.documentElement.style.setProperty('--en-font', en);
        document.documentElement.style.setProperty('--zh-font', zh);
    };

    // 页面加载时初始化字体应用并勾选对应的单选框
    applyFonts(savedEnFont, savedZhFont);

    enFontRadios.forEach(radio => {
        if (radio.value === savedEnFont) radio.checked = true;
        radio.addEventListener('change', (e) => {
            const selectedFont = e.target.value;
            localStorage.setItem('en-font', selectedFont);
            applyFonts(selectedFont, localStorage.getItem('zh-font') || '"ZCOOL KuaiLe"');
        });
    });

    zhFontRadios.forEach(radio => {
        if (radio.value === savedZhFont) radio.checked = true;
        radio.addEventListener('change', (e) => {
            const selectedFont = e.target.value;
            localStorage.setItem('zh-font', selectedFont);
            applyFonts(localStorage.getItem('en-font') || '"Poppins"', selectedFont);
        });
    });

    // ==================== 设置弹窗功能 ====================
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const confirmSettingsBtn = document.getElementById('confirmSettingsBtn');
    const modalContent = settingsModal.querySelector('div');

    // --- 新手引导提示逻辑 ---
    const fontHint = document.getElementById('fontHint');
    const settingsNewDot = document.getElementById('settingsNewDot');

    if (!localStorage.getItem('hasOpenedSettings')) {
        // 显示小红点
        settingsNewDot.classList.remove('hidden');

        // 延迟 1.5 秒显示提示气泡
        setTimeout(() => {
            fontHint.classList.remove('hidden');
            // 强制重绘以触发过渡动画
            void fontHint.offsetWidth;
            fontHint.classList.remove('opacity-0', 'translate-y-2');
            fontHint.classList.add('opacity-100', 'translate-y-0');

            // 8秒后自动淡出气泡
            setTimeout(() => {
                fontHint.classList.remove('opacity-100', 'translate-y-0');
                fontHint.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => fontHint.classList.add('hidden'), 500);
            }, 8000);
        }, 1500);
    }

    const openModal = () => {
        // 如果是第一次打开，记录并隐藏提示
        if (!localStorage.getItem('hasOpenedSettings')) {
            localStorage.setItem('hasOpenedSettings', 'true');
            settingsNewDot.classList.add('hidden');
            fontHint.classList.add('hidden');
        }

        settingsModal.classList.remove('hidden');
        settingsModal.classList.add('flex');
        // 延迟一帧添加逐渐显示的过渡效果
        requestAnimationFrame(() => {
            settingsModal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
        });
    };

    const closeModal = () => {
        settingsModal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        // 等待过渡动画完成后再隐藏元素
        setTimeout(() => {
            settingsModal.classList.remove('flex');
            settingsModal.classList.add('hidden');
        }, 300);
    };

    settingsBtn.addEventListener('click', openModal);
    closeSettingsBtn.addEventListener('click', closeModal);
    confirmSettingsBtn.addEventListener('click', closeModal);

    // 点击遮罩层背景关闭弹窗
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeModal();
        }
    });

    // ==================== 设置弹窗选项卡切换 ====================
    const tabs = settingsModal.querySelectorAll('.settings-tab');
    const panes = settingsModal.querySelectorAll('.settings-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 重置所有tab样式
            tabs.forEach(t => {
                t.classList.remove('text-pink-500', 'border-pink-500', 'active');
                t.classList.add('text-gray-500', 'border-transparent');
            });

            // 隐藏所有面板
            panes.forEach(p => {
                p.classList.remove('block');
                p.classList.add('hidden');
            });

            // 激活当前tab
            tab.classList.remove('text-gray-500', 'border-transparent');
            tab.classList.add('text-pink-500', 'border-pink-500', 'active');

            // 显示目标面板
            const targetId = tab.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.remove('hidden');
                targetPane.classList.add('block');
            }
        });
    });
});
