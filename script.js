// ===== SIDEBAR TOGGLE =====
const sidebar = document.getElementById('sidebar');
const collapseBtn = document.getElementById('sidebarCollapse');
const expandBtn = document.getElementById('sidebarExpand');

collapseBtn.addEventListener('click', () => sidebar.classList.add('collapsed'));
expandBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));

// ===== NAV ACTIVE =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.querySelector('.page-title').textContent = 
            item.dataset.page.charAt(0).toUpperCase() + item.dataset.page.slice(1);
    });
});

// ===== TOGGLE BUTTONS =====
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.chart-col .bar').forEach(bar => {
            bar.style.height = (Math.random() * 65 + 25) + '%';
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

            if (divide > 1) {
                el.textContent = (current / divide).toFixed(1) + suffix;
            } else if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ===== TOOLTIPS =====
const tooltip = document.getElementById('tooltip');

document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
        tooltip.textContent = el.dataset.tooltip;
        tooltip.classList.add('visible');
    });
    el.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.clientX + 12 + 'px';
        tooltip.style.top = e.clientY - 30 + 'px';
    });
    el.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
    });
});

// ===== NOTIFICATION PANEL =====
const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');
const notifClose = document.getElementById('notifClose');

notifBtn.addEventListener('click', () => notifPanel.classList.toggle('open'));
notifClose.addEventListener('click', () => notifPanel.classList.remove('open'));

// Close on outside click
document.addEventListener('click', (e) => {
    if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        notifPanel.classList.remove('open');
    }
});

// ===== AI BANNER =====
const aiBanner = document.getElementById('aiBanner');
const aiBannerDismiss = document.getElementById('aiBannerDismiss');
aiBannerDismiss.addEventListener('click', () => aiBanner.classList.add('hidden'));

// Rotate AI insights
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
    setTimeout(() => {
        textEl.textContent = aiInsights[insightIdx];
        textEl.style.opacity = '1';
    }, 200);
}, 8000);

// ===== TOAST NOTIFICATIONS =====
const toastContainer = document.getElementById('toastContainer');
const toastMessages = [
    { text: '12 new users synced from Shopify', color: 'blue' },
    { text: 'Campaign "Flash Deal" sent to 1,204 users', color: 'blue' },
    { text: 'Journey "Onboarding" completed for 89 users', color: 'blue' },
    { text: 'Segment "Churning" updated: 342 users added', color: 'red' },
    { text: 'Push notification delivered: 98.2% success', color: 'blue' },
    { text: 'Email bounce rate alert: 2.4% on "Summer Sale"', color: 'red' },
];

function showToast() {
    const msg = toastMessages[Math.floor(Math.random() * toastMessages.length)];
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon ${msg.color === 'red' ? 'red' : ''}"></div><span>${msg.text}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('leaving');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Show toasts periodically
setTimeout(showToast, 3000);
setInterval(showToast, 12000);

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
    '<strong>A/B test</strong> winner declared: Variant B (+12% CTR)',
];

function addFeedItem() {
    const msg = feedMessages[Math.floor(Math.random() * feedMessages.length)];
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
        <div class="feed-dot"></div>
        <div class="feed-body">
            <p>${msg}</p>
            <span>Just now</span>
        </div>
    `;
    feed.insertBefore(item, feed.firstChild);
    
    // Update the first-child dot color
    feed.querySelectorAll('.feed-dot').forEach((dot, i) => {
        dot.style.background = i === 0 ? 'var(--red)' : '';
        dot.style.boxShadow = i === 0 ? '0 0 6px rgba(212,88,63,0.15)' : '';
    });

    // Remove last item if too many
    if (feed.children.length > 6) {
        feed.lastElementChild.remove();
    }
}

setInterval(addFeedItem, 8000);

// ===== ANIMATE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Number animations
    animateNumbers();

    // Animate chart bars
    document.querySelectorAll('.chart-col .bar').forEach((bar, i) => {
        const h = bar.style.height;
        bar.style.height = '0%';
        setTimeout(() => { bar.style.height = h; }, 150 + i * 80);
    });

    // Animate stat bars
    document.querySelectorAll('.stat-bar-fill').forEach((bar, i) => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = w; }, 300 + i * 120);
    });

    // Animate channel bars
    document.querySelectorAll('.channel-bar').forEach((bar, i) => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = w; }, 500 + i * 100);
    });

    // Animate journey bars
    document.querySelectorAll('.journey-bar').forEach((bar, i) => {
        const w = bar.style.width;
        bar.style.width = '0%';
        bar.style.transition = 'width 0.6s cubic-bezier(0.4,0,0.2,1)';
        setTimeout(() => { bar.style.width = w; }, 700 + i * 120);
    });

    // Periodic stat value flicker (simulating live data)
    setInterval(() => {
        const values = document.querySelectorAll('.stat-value');
        const idx = Math.floor(Math.random() * values.length);
        const el = values[idx];
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const divide = parseFloat(el.dataset.divide) || 1;
        const isDecimal = el.dataset.decimal === 'true';
        
        // Small random fluctuation
        const delta = Math.random() * 0.02 - 0.01; // ±1%
        const newVal = target * (1 + delta);
        
        el.style.transition = 'color 0.2s';
        el.style.color = 'var(--red)';
        
        if (divide > 1) {
            el.textContent = (newVal / divide).toFixed(1) + suffix;
        } else if (isDecimal) {
            el.textContent = newVal.toFixed(1) + suffix;
        } else {
            el.textContent = Math.floor(newVal).toLocaleString();
        }
        
        setTimeout(() => { el.style.color = ''; }, 600);
    }, 5000);
});

// ===== NEW CAMPAIGN BUTTON =====
document.getElementById('newCampaignBtn').addEventListener('click', () => {
    showToast();
    const toast = toastContainer.lastElementChild;
    if (toast) {
        toast.querySelector('span').textContent = 'Opening campaign builder...';
    }
});
