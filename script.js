// ===== SIDEBAR TOGGLE =====
const sidebar = document.getElementById('sidebar');
document.getElementById('sidebarCollapse').addEventListener('click', () => sidebar.classList.add('collapsed'));
document.getElementById('sidebarExpand').addEventListener('click', () => sidebar.classList.toggle('collapsed'));

// ===== NAV ACTIVE =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.querySelector('.page-title').textContent = 
            item.dataset.page.charAt(0).toUpperCase() + item.dataset.page.slice(1);
        showToast('Navigating to ' + item.dataset.page + '...', 'red');
    });
});

// ===== TOGGLE BUTTONS =====
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.chart-col .bar').forEach((bar, i) => {
            setTimeout(() => { bar.style.height = (Math.random() * 65 + 25) + '%'; }, i * 50);
        });
    });
});

// ===== ANIMATED NUMBER COUNTING =====
function animateNumbers() {
    document.querySelectorAll('.stat-value').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const divide = parseFloat(el.dataset.divide) || 1;
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 1200;
        const start = performance.now();
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            let current = target * eased;
            if (divide > 1) el.textContent = (current / divide).toFixed(1) + suffix;
            else if (isDecimal) el.textContent = current.toFixed(1) + suffix;
            else el.textContent = Math.floor(current).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ===== TOOLTIPS =====
const tooltip = document.getElementById('tooltip');
document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', () => { tooltip.textContent = el.dataset.tooltip; tooltip.classList.add('visible'); });
    el.addEventListener('mousemove', (e) => { tooltip.style.left = e.clientX + 12 + 'px'; tooltip.style.top = e.clientY - 30 + 'px'; });
    el.addEventListener('mouseleave', () => { tooltip.classList.remove('visible'); });
});

// ===== NOTIFICATION PANEL =====
const notifPanel = document.getElementById('notifPanel');
document.getElementById('notifBtn').addEventListener('click', () => notifPanel.classList.toggle('open'));
document.getElementById('notifClose').addEventListener('click', () => notifPanel.classList.remove('open'));
document.addEventListener('click', (e) => {
    if (!notifPanel.contains(e.target) && !document.getElementById('notifBtn').contains(e.target)) notifPanel.classList.remove('open');
});

// ===== AI BANNER =====
const aiBanner = document.getElementById('aiBanner');
document.getElementById('aiBannerDismiss').addEventListener('click', () => aiBanner.classList.add('hidden'));
const aiInsights = [
    'Your "Welcome Series" open rate is 23% above benchmark. Consider extending it to 5 emails.',
    'Cart abandonment is up 8% this week. Try reducing the delay from 2hr to 45min.',
    'WhatsApp channel outperforming email by 9.1% on CTR. Consider shifting budget.',
    'Users in the "High-Value" segment have 3.2x higher LTV. Target with exclusive offers.',
    'Best send time for your audience: Tuesday 10:30 AM. Current schedule is 2 hours off.',
];
let insightIdx = 0;
setInterval(() => {
    if (aiBanner.classList.contains('hidden')) return;
    insightIdx = (insightIdx + 1) % aiInsights.length;
    const textEl = document.getElementById('aiInsightText');
    textEl.style.opacity = '0';
    textEl.style.transform = 'translateY(4px)';
    setTimeout(() => {
        textEl.textContent = aiInsights[insightIdx];
        textEl.style.opacity = '1';
        textEl.style.transform = 'translateY(0)';
    }, 250);
}, 6000);

// ===== COMMAND PALETTE (Cmd+K / Ctrl+K) =====
const cmdPalette = document.getElementById('cmdPalette');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');
let selectedIdx = 0;

function openCmdPalette() {
    cmdPalette.classList.add('open');
    cmdInput.value = '';
    cmdInput.focus();
    selectedIdx = 0;
    updateCmdSelection();
}
function closeCmdPalette() { cmdPalette.classList.remove('open'); }

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openCmdPalette(); }
    if (e.key === 'Escape') closeCmdPalette();
    if (cmdPalette.classList.contains('open')) {
        const items = cmdResults.querySelectorAll('.cmd-result');
        if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = (selectedIdx + 1) % items.length; updateCmdSelection(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = (selectedIdx - 1 + items.length) % items.length; updateCmdSelection(); }
        if (e.key === 'Enter') { e.preventDefault(); executeCmdAction(items[selectedIdx]); closeCmdPalette(); }
    }
});

cmdPalette.addEventListener('click', (e) => { if (e.target === cmdPalette) closeCmdPalette(); });

function updateCmdSelection() {
    cmdResults.querySelectorAll('.cmd-result').forEach((r, i) => r.classList.toggle('selected', i === selectedIdx));
}

function executeCmdAction(item) {
    const action = item?.dataset.action;
    if (action) showToast('Opening: ' + item.querySelector('.cmd-result-name').textContent, 'red');
}

cmdInput.addEventListener('input', () => {
    const query = cmdInput.value.toLowerCase();
    cmdResults.querySelectorAll('.cmd-result').forEach(r => {
        const name = r.querySelector('.cmd-result-name').textContent.toLowerCase();
        r.style.display = name.includes(query) ? '' : 'none';
    });
    selectedIdx = 0;
    updateCmdSelection();
});

// Also trigger palette from search box click
document.querySelector('.search-box').addEventListener('click', openCmdPalette);

// ===== TOAST SYSTEM =====
const toastContainer = document.getElementById('toastContainer');
const toastMessages = [
    { text: '12 new users synced from Shopify', color: '' },
    { text: 'Campaign "Flash Deal" sent to 1,204 users', color: '' },
    { text: 'Journey "Onboarding" completed for 89 users', color: '' },
    { text: 'Segment "Churning" updated — 342 users added', color: 'red' },
    { text: 'Push notification delivered: 98.2% success', color: '' },
    { text: 'Email bounce rate alert: 2.4%', color: 'red' },
    { text: 'A/B test winner: Variant B (+12% CTR)', color: '' },
    { text: 'New webhook received from Stripe', color: '' },
];

function showToast(text, color) {
    const msg = text || toastMessages[Math.floor(Math.random() * toastMessages.length)].text;
    const c = color || toastMessages[Math.floor(Math.random() * toastMessages.length)].color;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon ${c === 'red' ? 'red' : ''}"></div><span>${msg}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('leaving'); setTimeout(() => toast.remove(), 300); }, 4000);
}

setTimeout(showToast, 2500);
setInterval(showToast, 15000);

// ===== LIVE ACTIVITY FEED =====
const feed = document.getElementById('activityFeed');
const feedMessages = [
    '<strong>Cart Abandon</strong> triggered for 23 users',
    '<strong>Push notification</strong> delivered to iOS segment',
    '<strong>New user</strong> signed up from referral link',
    '<strong>Email opened</strong> by 412 users in last 5 min',
    '<strong>Journey step</strong> "Day 3 email" sent to 89 users',
    '<strong>Webhook</strong> received from Stripe: 3 events',
    '<strong>Segment</strong> "Power Users" grew by 1.2%',
    '<strong>A/B test</strong> winner declared: Variant B',
    '<strong>WhatsApp</strong> template approved by Meta',
    '<strong>Revenue</strong> milestone: $50K from automations',
];

function addFeedItem() {
    const msg = feedMessages[Math.floor(Math.random() * feedMessages.length)];
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `<div class="feed-dot"></div><div class="feed-body"><p>${msg}</p><span>Just now</span></div>`;
    feed.insertBefore(item, feed.firstChild);
    feed.querySelectorAll('.feed-dot').forEach((dot, i) => {
        dot.style.background = i === 0 ? 'var(--red)' : '';
        dot.style.boxShadow = i === 0 ? '0 0 6px rgba(212,88,63,0.15)' : '';
    });
    if (feed.children.length > 6) feed.lastElementChild.remove();
}
setInterval(addFeedItem, 7000);

// ===== TABLE ROW CLICK =====
document.querySelectorAll('table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
        const name = row.querySelector('.td-name')?.textContent;
        showToast('Opening campaign: ' + name, 'red');
    });
});

// ===== JOURNEY ROW CLICK =====
document.querySelectorAll('.journey-row').forEach(row => {
    row.addEventListener('click', () => {
        const name = row.querySelector('.journey-name')?.textContent;
        showToast('Viewing journey: ' + name, 'red');
    });
});

// ===== CHART BAR CLICK =====
document.querySelectorAll('.chart-col').forEach(col => {
    col.addEventListener('click', () => {
        const val = col.dataset.value;
        const day = col.querySelector('span').textContent;
        showToast(day + ': ' + val + ' messages delivered', '');
    });
});

// ===== CHANNEL ROW HOVER COUNTER =====
document.querySelectorAll('.channel-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
        const val = row.querySelector('.channel-val');
        val.style.color = 'var(--red)';
        val.style.transform = 'scale(1.1)';
        val.style.transition = 'all 0.15s';
    });
    row.addEventListener('mouseleave', () => {
        const val = row.querySelector('.channel-val');
        val.style.color = '';
        val.style.transform = '';
    });
});

// ===== STAT CARD CLICK =====
document.querySelectorAll('.stat-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        const label = card.querySelector('.stat-label').textContent;
        showToast('Drilling into: ' + label.toLowerCase(), 'red');
    });
});

// ===== PERIODIC STAT UPDATES (LIVE) =====
setInterval(() => {
    const values = document.querySelectorAll('.stat-value');
    const idx = Math.floor(Math.random() * values.length);
    const el = values[idx];
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const divide = parseFloat(el.dataset.divide) || 1;
    const isDecimal = el.dataset.decimal === 'true';
    const delta = Math.random() * 0.02 - 0.01;
    const newVal = target * (1 + delta);

    el.style.transition = 'color 0.2s, transform 0.2s';
    el.style.color = 'var(--red)';
    el.style.transform = 'scale(1.02)';

    if (divide > 1) el.textContent = (newVal / divide).toFixed(1) + suffix;
    else if (isDecimal) el.textContent = newVal.toFixed(1) + suffix;
    else el.textContent = Math.floor(newVal).toLocaleString();

    setTimeout(() => { el.style.color = ''; el.style.transform = ''; }, 800);
}, 4000);

// ===== KEYBOARD SHORTCUT HINTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'n' && !cmdPalette.classList.contains('open') && document.activeElement.tagName !== 'INPUT') {
        showToast('Opening campaign builder...', 'red');
    }
    if (e.key === 'j' && !cmdPalette.classList.contains('open') && document.activeElement.tagName !== 'INPUT') {
        showToast('Opening journey builder...', 'red');
    }
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        openCmdPalette();
    }
});

// ===== NEW CAMPAIGN BUTTON =====
document.getElementById('newCampaignBtn').addEventListener('click', () => {
    showToast('Opening campaign builder...', 'red');
});

// ===== ANIMATE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    animateNumbers();

    // Staggered bar animations
    document.querySelectorAll('.chart-col .bar').forEach((bar, i) => {
        const h = bar.style.height; bar.style.height = '0%';
        setTimeout(() => { bar.style.height = h; }, 150 + i * 80);
    });
    document.querySelectorAll('.stat-bar-fill').forEach((bar, i) => {
        const w = bar.style.width; bar.style.width = '0%';
        setTimeout(() => { bar.style.width = w; }, 300 + i * 120);
    });
    document.querySelectorAll('.channel-bar').forEach((bar, i) => {
        const w = bar.style.width; bar.style.width = '0%';
        setTimeout(() => { bar.style.width = w; }, 500 + i * 100);
    });
    document.querySelectorAll('.journey-bar').forEach((bar, i) => {
        const w = bar.style.width; bar.style.width = '0%';
        bar.style.transition = 'width 0.6s cubic-bezier(0.4,0,0.2,1)';
        setTimeout(() => { bar.style.width = w; }, 700 + i * 120);
    });

    // Welcome toast
    setTimeout(() => showToast('Welcome back, Anurag. You have 3 campaigns running.', 'red'), 1500);

    // Keyboard shortcut hint after 8s
    setTimeout(() => showToast('Tip: Press ⌘K to open command palette', ''), 8000);
});
