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

// ==================== GitHub 项目动态加载 ====================
// 从 JSON 文件加载项目列表并渲染到页面
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
        const response = await fetch('jsons/projects.json');
        if (!response.ok) {
            throw new Error(`请求失败：${response.status}`);
        }
        const projects = await response.json();

        if (!Array.isArray(projects) || projects.length === 0) {
            throw new Error('项目数据为空或格式错误');
        }

        // 清空占位内容，渲染项目卡片
        grid.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'rounded-xl border border-white/20 bg-white/[0.85] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-[10px] transition-all duration-500 dark:border-white/10 dark:bg-black/60 dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]';
            card.innerHTML = `
                <h4 class="text-sm font-semibold mb-2">${escapeHtml(project.name)}</h4>
                <p class="mb-3 text-xs text-gray-600 dark:text-gray-300">${escapeHtml(project.desc)}</p>
                <a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer" title="查看${escapeHtml(project.name)}项目" class="text-xs text-pink-500 hover:underline">查看项目</a>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('加载项目列表失败：', error);
        grid.innerHTML = '<p class="text-sm text-gray-400 col-span-full text-center">项目加载失败，请稍后刷新重试</p>';
    }
}

// 简单的 HTML 转义，防止 XSS
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==================== 欢迎文案功能（IP归属地查询） ====================

// 免责声明 localStorage 键名
const DISCLAIMER_KEY = 'welcome-disclaimer-accepted';

// 检查用户是否已持久化同意免责声明
function hasAcceptedDisclaimer() {
    return localStorage.getItem(DISCLAIMER_KEY) === 'true';
}

// 加载 API 配置并从后端获取欢迎信息
async function loadWelcome() {
    const welcomeMsgEl = document.getElementById('welcomeMsg');
    const visitorIpEl = document.getElementById('visitorIp');

    try {
        // 第一步：从配置文件读取 API 地址
        const configResp = await fetch('jsons/api-config.json');
        if (!configResp.ok) {
            throw new Error(`配置文件加载失败：${configResp.status}`);
        }
        const config = await configResp.json();
        const apiBase = config.welcomeApi;

        // 第二步：调用欢迎接口
        const apiResp = await fetch(`${apiBase}/api/welcome`);
        if (!apiResp.ok) {
            throw new Error(`API 请求失败：${apiResp.status}`);
        }
        const data = await apiResp.json();

        // 更新页面显示
        welcomeMsgEl.textContent = data.welcomeMsg;
        visitorIpEl.textContent = data.ip;
    } catch (error) {
        console.error('加载欢迎信息失败：', error);
        // 兜底文案
        welcomeMsgEl.textContent = '欢迎访问本站';
        visitorIpEl.textContent = '-';
    }
}

// 初始化欢迎功能：根据免责声明同意状态决定是否激活 API
function initWelcome() {
    if (hasAcceptedDisclaimer()) {
        // 已持久化同意，直接激活
        document.getElementById('welcomeOverlay').classList.add('hidden');
        loadWelcome();
    }
    // 未同意时保持遮罩层显示，不激活 API
}

// 设置免责声明弹窗交互逻辑
function setupDisclaimer() {
    const overlay = document.getElementById('welcomeOverlay');
    const modal = document.getElementById('disclaimerModal');
    const modalCard = modal.querySelector('[data-modal-card]');
    const openBtn = document.getElementById('openDisclaimerBtn');
    const disagreeBtn = document.getElementById('disagreeBtn');
    const disagreeBtn2 = document.getElementById('disagreeBtn2');
    const agreeOnceBtn = document.getElementById('agreeOnceBtn');
    const agreePersistBtn = document.getElementById('agreePersistBtn');
    const scrollContainer = document.getElementById('disclaimerContent');
    const scrollHint = document.getElementById('scrollHint');

    let hasScrolledToBottom = false;

    // 打开弹窗
    function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modalCard.classList.remove('scale-95');
        });
        // 重置滚动状态
        scrollContainer.scrollTop = 0;
        hasScrolledToBottom = false;
        updateButtonState();
        scrollHint.textContent = '↓ 请完整阅读以上声明后进行操作 ↓';
        scrollHint.classList.remove('text-green-500', 'dark:text-green-400');
    }

    // 关闭弹窗
    function closeModal() {
        modal.classList.add('opacity-0');
        modalCard.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 300);
    }

    // 更新按钮可用状态
    function updateButtonState() {
        if (hasScrolledToBottom) {
            agreeOnceBtn.disabled = false;
            agreeOnceBtn.classList.remove('bg-gray-300', 'text-gray-500', 'dark:text-gray-400', 'cursor-not-allowed');
            agreeOnceBtn.classList.add('bg-pink-100', 'text-pink-600', 'hover:bg-pink-200', 'cursor-pointer');

            agreePersistBtn.disabled = false;
            agreePersistBtn.classList.remove('bg-gray-300', 'text-gray-500', 'dark:text-gray-400', 'cursor-not-allowed');
            agreePersistBtn.classList.add('bg-pink-500', 'text-white', 'hover:bg-pink-600', 'cursor-pointer');
        } else {
            agreeOnceBtn.disabled = true;
            agreeOnceBtn.classList.add('bg-gray-300', 'text-gray-500', 'dark:text-gray-400', 'cursor-not-allowed');
            agreeOnceBtn.classList.remove('bg-pink-100', 'text-pink-600', 'hover:bg-pink-200', 'cursor-pointer');

            agreePersistBtn.disabled = true;
            agreePersistBtn.classList.add('bg-gray-300', 'text-gray-500', 'dark:text-gray-400', 'cursor-not-allowed');
            agreePersistBtn.classList.remove('bg-pink-500', 'text-white', 'hover:bg-pink-600', 'cursor-pointer');
        }
    }

    // 同意后的激活流程
    function activateWelcome() {
        overlay.classList.add('hidden');
        closeModal();
        loadWelcome();
    }

    // --- 事件绑定 ---

    openBtn.addEventListener('click', openModal);

    disagreeBtn.addEventListener('click', closeModal);
    disagreeBtn2.addEventListener('click', closeModal);

    // 点击遮罩层关闭（视为不同意）
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 滚动检测：到底后启用按钮
    scrollContainer.addEventListener('scroll', () => {
        const threshold = 5;
        const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - threshold;

        if (atBottom && !hasScrolledToBottom) {
            hasScrolledToBottom = true;
            scrollHint.textContent = '✓ 你已阅读完毕，可以选择操作了';
            scrollHint.classList.add('text-green-500', 'dark:text-green-400');
            updateButtonState();
        }
    });

    // 我知道了 —— 仅本次会话生效
    agreeOnceBtn.addEventListener('click', () => {
        if (!hasScrolledToBottom) return;
        activateWelcome();
    });

    // 不再显示 —— 持久化到 localStorage，下次自动激活
    agreePersistBtn.addEventListener('click', () => {
        if (!hasScrolledToBottom) return;
        localStorage.setItem(DISCLAIMER_KEY, 'true');
        activateWelcome();
    });
}

// ==================== 页面加载完成后执行的主逻辑 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const toTop = document.getElementById('toTop');
    const scrollProgressCircle = document.getElementById('scrollProgressCircle');
    const changeSentenceBtn = document.getElementById('changeSentenceBtn');

    // 加载句子数据
    loadSentences();
    // 设置免责声明弹窗
    setupDisclaimer();
    // 初始化欢迎功能（检查是否已同意免责声明）
    initWelcome();
    // 加载项目列表
    loadProjects();
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

        // Tailwind 的 dark 变体由根元素上的 dark 类统一控制
        root.classList.toggle('dark', finalTheme === 'dark');
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
    // 根据当前滚动距离更新按钮显隐和环形进度
    const updateScrollProgress = () => {
        const distanceY = window.scrollY || document.documentElement.scrollTop;
        const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollableHeight > 0
            ? Math.min(100, Math.max(0, (distanceY / scrollableHeight) * 100))
            : 0;

        toTop.classList.toggle('hidden', distanceY <= 100);
        scrollProgressCircle.style.strokeDashoffset = String(100 - progress);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();

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
                t.classList.remove('text-pink-500', 'dark:text-pink-400', 'border-pink-500', 'active');
                t.classList.add('text-gray-500', 'dark:text-gray-400', 'border-transparent');
            });

            // 隐藏所有面板
            panes.forEach(p => {
                p.classList.remove('block');
                p.classList.add('hidden');
            });

            // 激活当前tab
            tab.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-transparent');
            tab.classList.add('text-pink-500', 'dark:text-pink-400', 'border-pink-500', 'active');

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
