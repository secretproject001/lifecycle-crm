// ===== SIDEBAR =====
const sidebar = document.getElementById('sidebar');
document.getElementById('sidebarCollapse').addEventListener('click', () => sidebar.classList.add('collapsed'));
document.getElementById('sidebarExpand').addEventListener('click', () => sidebar.classList.toggle('collapsed'));

// ===== TOAST =====
const toastContainer = document.getElementById('toastContainer');
function showToast(text, color) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon ${color === 'red' ? 'red' : ''}"></div><span>${text}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('leaving'); setTimeout(() => toast.remove(), 300); }, 4000);
}

// ===== SEGMENT BUILDER =====
const overlay = document.getElementById('segmentBuilderOverlay');
const conditionsList = document.getElementById('conditionsList');
const previewCount = document.getElementById('previewCount');

document.getElementById('createSegmentBtn').addEventListener('click', openBuilder);
document.getElementById('builderClose').addEventListener('click', closeBuilder);
document.getElementById('builderCancel').addEventListener('click', closeBuilder);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeBuilder(); });

function openBuilder() { overlay.classList.add('open'); }
function closeBuilder() { overlay.classList.remove('open'); }

// ===== EVENT LIST =====
const events = [
    'app_open', 'page_view', 'product_viewed', 'add_to_cart', 'checkout_started',
    'purchase_completed', 'search', 'signup', 'login', 'push_clicked',
    'email_opened', 'email_clicked', 'form_submitted', 'referral_sent'
];
const eventAttributes = {
    'product_viewed': ['product_id', 'product_name', 'category', 'price', 'brand'],
    'add_to_cart': ['product_id', 'quantity', 'cart_value', 'source'],
    'purchase_completed': ['order_id', 'total_amount', 'items_count', 'payment_method', 'coupon_code'],
    'checkout_started': ['cart_value', 'items_count', 'source'],
    'page_view': ['page_url', 'page_title', 'referrer'],
    'search': ['query', 'results_count', 'category'],
    'email_opened': ['campaign_id', 'subject_line'],
    'email_clicked': ['campaign_id', 'link_url'],
};
const userAttributes = [
    'city', 'country', 'gender', 'age', 'plan_type', 'signup_date',
    'total_orders', 'lifetime_value', 'last_active', 'device_type',
    'email_verified', 'phone_verified', 'referral_source'
];
const operators = ['equals', 'not equals', 'contains', 'greater than', 'less than', 'exists', 'between', 'in last N days'];

// ===== ADD EVENT CONDITION =====
document.getElementById('addEventCondition').addEventListener('click', () => {
    const card = document.createElement('div');
    card.className = 'condition-card event-type';
    card.innerHTML = `
        <div class="condition-header">
            <span class="condition-type-label">Event Condition</span>
            <button class="condition-remove">×</button>
        </div>
        <div class="condition-row">
            <select class="condition-select event-select">
                <option value="" disabled selected>Select event...</option>
                ${events.map(e => `<option value="${e}">${e}</option>`).join('')}
            </select>
            <select class="condition-select operator-select">
                ${['has occurred', 'has not occurred', 'occurred ≥ N times', 'occurred in last N days'].map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
            <input type="text" class="condition-input" placeholder="Value..." />
        </div>
        <div class="condition-attr-row" style="display:none">
            <span class="condition-attr-label">Where attribute</span>
            <select class="condition-select attr-select">
                <option value="" disabled selected>Select attribute...</option>
            </select>
            <select class="condition-select operator-select">
                ${operators.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
            <input type="text" class="condition-input" placeholder="Value..." />
        </div>
    `;
    conditionsList.appendChild(card);
    updatePreview();

    // Event select change — show attribute row
    const eventSelect = card.querySelector('.event-select');
    const attrRow = card.querySelector('.condition-attr-row');
    const attrSelect = card.querySelector('.attr-select');
    
    eventSelect.addEventListener('change', () => {
        const attrs = eventAttributes[eventSelect.value];
        if (attrs && attrs.length) {
            attrRow.style.display = 'flex';
            attrSelect.innerHTML = '<option value="" disabled selected>Select attribute...</option>' + attrs.map(a => `<option value="${a}">${a}</option>`).join('');
        } else {
            attrRow.style.display = 'none';
        }
        updatePreview();
    });

    card.querySelector('.condition-remove').addEventListener('click', () => { card.remove(); updatePreview(); });
});

// ===== ADD ATTRIBUTE CONDITION =====
document.getElementById('addAttrCondition').addEventListener('click', () => {
    const card = document.createElement('div');
    card.className = 'condition-card attr-type';
    card.innerHTML = `
        <div class="condition-header">
            <span class="condition-type-label">Attribute Condition</span>
            <button class="condition-remove">×</button>
        </div>
        <div class="condition-row">
            <select class="condition-select">
                <option value="" disabled selected>Select attribute...</option>
                ${userAttributes.map(a => `<option value="${a}">${a}</option>`).join('')}
            </select>
            <select class="condition-select operator-select">
                ${operators.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
            <input type="text" class="condition-input" placeholder="Value..." />
        </div>
    `;
    conditionsList.appendChild(card);
    updatePreview();
    card.querySelector('.condition-remove').addEventListener('click', () => { card.remove(); updatePreview(); });
});

// ===== PREVIEW =====
function updatePreview() {
    const count = conditionsList.children.length;
    if (count === 0) { previewCount.textContent = '—'; return; }
    const base = Math.floor(Math.random() * 8000) + 1000;
    const result = Math.max(200, Math.floor(base / count));
    previewCount.textContent = result.toLocaleString() + ' users';
}

// ===== FILTER TABS =====
document.querySelectorAll('.segment-filter-tabs .toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.segment-filter-tabs .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.textContent.toLowerCase();
        document.querySelectorAll('.segment-row').forEach(row => {
            const badge = row.querySelector('.badge');
            if (filter === 'all') { row.style.display = ''; }
            else if (filter === 'event-based') { row.style.display = badge.classList.contains('type-event') ? '' : 'none'; }
            else { row.style.display = badge.classList.contains('type-attr') ? '' : 'none'; }
        });
    });
});

// ===== ROW CLICK =====
document.querySelectorAll('.segment-row').forEach(row => {
    row.addEventListener('click', () => {
        const name = row.querySelector('.td-name').textContent;
        showToast('Opening segment: ' + name, 'red');
    });
});

// ===== SAVE =====
document.querySelector('.btn-save').addEventListener('click', () => {
    const name = document.getElementById('segmentNameInput').value || 'Untitled Segment';
    showToast('Segment "' + name + '" saved successfully', 'red');
    closeBuilder();
});
