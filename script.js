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

// ===== TAB BUTTONS =====
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Animate chart bars with random data
        const bars = document.querySelectorAll('.chart-bar-fill');
        bars.forEach(bar => {
            const height = Math.floor(Math.random() * 60) + 25;
            bar.style.height = height + '%';
        });
    });
});

// ===== ANIMATE STATS ON LOAD =====
const statValues = document.querySelectorAll('.stat-value');

const animateValue = (el, start, end, suffix = '') => {
    const duration = 800;
    const startTime = performance.now();
    
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);
        
        el.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    
    requestAnimationFrame(update);
};

// Trigger animations when visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            
            if (text.includes('M')) {
                animateValue(el, 0, 1.2, 'M');
            } else if (text.includes('%')) {
                animateValue(el, 0, parseFloat(text), '%');
            } else if (text.includes(',')) {
                animateValue(el, 0, parseInt(text.replace(/,/g, '')), '');
                // Re-format with commas after animation
                setTimeout(() => { el.textContent = text; }, 850);
            } else {
                animateValue(el, 0, parseInt(text), '');
            }
            
            observer.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statValues.forEach(el => observer.observe(el));

// ===== CHART BAR HOVER =====
const chartBars = document.querySelectorAll('.chart-bar-wrapper');

chartBars.forEach(bar => {
    bar.addEventListener('mouseenter', () => {
        bar.querySelector('.chart-bar-fill').style.opacity = '0.7';
    });
    bar.addEventListener('mouseleave', () => {
        bar.querySelector('.chart-bar-fill').style.opacity = '1';
    });
});
