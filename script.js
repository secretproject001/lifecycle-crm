// ===== NAV ACTIVE STATE =====
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const page = item.dataset.page;
        document.querySelector('.page-title').textContent = 
            page.charAt(0).toUpperCase() + page.slice(1);
    });
});

// ===== TOGGLE BUTTONS =====
const toggleBtns = document.querySelectorAll('.toggle-btn');

toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Randomize chart bars
        document.querySelectorAll('.chart-col .bar').forEach(bar => {
            bar.style.height = (Math.random() * 65 + 25) + '%';
        });
    });
});

// ===== ANIMATE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Animate bars in
    const bars = document.querySelectorAll('.chart-col .bar');
    bars.forEach((bar, i) => {
        const h = bar.style.height;
        bar.style.height = '0%';
        setTimeout(() => {
            bar.style.height = h;
        }, 100 + i * 60);
    });

    // Animate stat bars
    const statBars = document.querySelectorAll('.stat-bar-fill');
    statBars.forEach((bar, i) => {
        const w = bar.style.width;
        bar.style.width = '0%';
        bar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            bar.style.width = w;
        }, 200 + i * 100);
    });

    // Animate channel bars
    const chBars = document.querySelectorAll('.channel-bar');
    chBars.forEach((bar, i) => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = w;
        }, 400 + i * 80);
    });

    // Animate journey bars
    const jBars = document.querySelectorAll('.journey-bar');
    jBars.forEach((bar, i) => {
        const w = bar.style.width;
        bar.style.width = '0%';
        bar.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            bar.style.width = w;
        }, 600 + i * 100);
    });
});
