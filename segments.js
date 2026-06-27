// ===== SIDEBAR =====
document.getElementById('sidebarCollapse').addEventListener('click', () => document.getElementById('sidebar').classList.add('collapsed'));
document.getElementById('sidebarExpand').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('collapsed'));

// ===== TOAST =====
const toastContainer = document.getElementById('toastContainer');
function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon red"></div><span>${text}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('leaving'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ===== DATA =====
const userProperties = ['Last Seen', 'First Seen', 'City', 'Country', 'Email', 'Phone', 'Gender', 'Age', 'Plan', 'Signup Source', 'Device OS', 'App Version', 'Lifetime Value', 'Total Orders'];
const propTypes = { 'Last Seen': 'date', 'First Seen': 'date', 'Age': 'number', 'Lifetime Value': 'number', 'Total Orders': 'number' };
const propOperators = { date: ['on', 'before', 'after', 'in the last', 'between'], number: ['equals', 'greater than', 'less than', 'between'], string: ['is', 'is not', 'contains', 'does not contain', 'exists', 'does not exist'] };

const userEvents = ['product_viewed', 'add_to_cart', 'checkout_started', 'purchase_completed', 'app_open', 'page_view', 'search', 'signup', 'login', 'push_clicked', 'email_opened', 'email_clicked', 'form_submitted', 'referral_sent'];
const eventAttrs = {
    'product_viewed': ['product_id', 'product_name', 'category', 'price', 'brand'],
    'add_to_cart': ['product_id', 'quantity', 'cart_value', 'source'],
    'purchase_completed': ['order_id', 'total_amount', 'items_count', 'payment_method', 'coupon_code'],
    'checkout_started': ['cart_value', 'items_count', 'source'],
    'page_view': ['page_url', 'page_title', 'referrer'],
    'search': ['query', 'results_count', 'category'],
};
const behaviorActions = ['Has Executed', 'Has Not Executed'];
const behaviorCounts = ['at least', 'at most', 'exactly'];
const timeframes = ['in the last', 'between', 'before', 'after', 'ever'];

let groupCounter = 0;

// ===== CREATE FILTER GROUP =====
function createFilterGroup(container) {
    groupCounter++;
    const id = 'group-' + groupCounter;

    // Add AND/OR connector if not first
    if (container.children.length > 0) {
        const connector = document.createElement('div');
        connector.className = 'logic-connector';
        connector.innerHTML = `<select><option value="AND">AND</option><option value="OR">OR</option></select>`;
        container.appendChild(connector);
    }

    const group = document.createElement('div');
    group.className = 'filter-group';
    group.id = id;
    group.innerHTML = `
        <div class="filter-group-header">
            <div class="filter-group-logic"></div>
            <button class="filter-group-remove" data-id="${id}">×</button>
        </div>
        <div class="filter-tabs">
            <button class="filter-tab active" data-type="property">User property</button>
            <button class="filter-tab" data-type="behavior">User behavior</button>
            <button class="filter-tab" data-type="segment">Custom segment</button>
        </div>
        <div class="filter-content" data-group-id="${id}">
            ${renderPropertyFilter()}
        </div>
        <div class="filter-links" style="padding: 0 16px 12px;">
            <span class="filter-link nested-trigger" data-group-id="${id}">+ Nested Filter</span>
        </div>
    `;
    container.appendChild(group);

    // Tab switching
    group.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            group.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const content = group.querySelector('.filter-content');
            if (tab.dataset.type === 'property') content.innerHTML = renderPropertyFilter();
            else if (tab.dataset.type === 'behavior') content.innerHTML = renderBehaviorFilter();
            else content.innerHTML = renderSegmentFilter();
            attachFilterListeners(content);
        });
    });

    // Remove
    group.querySelector('.filter-group-remove').addEventListener('click', () => {
        const prev = group.previousElementSibling;
        if (prev && prev.classList.contains('logic-connector')) prev.remove();
        else { const next = group.nextElementSibling; if (next && next.classList.contains('logic-connector')) next.remove(); }
        group.remove();
    });

    // Nested
    group.querySelector('.nested-trigger').addEventListener('click', () => {
        const links = group.querySelector('.filter-links');
        if (group.querySelector('.nested-filter')) return;
        const nested = document.createElement('div');
        nested.className = 'nested-filter';
        nested.innerHTML = `<div class="nested-label">Nested Condition (AND)</div>${renderPropertyFilter()}
            <div class="filter-tabs" style="padding:8px 0 0">
                <button class="filter-tab active" data-type="property" style="font-size:10px;padding:5px 10px">Property</button>
                <button class="filter-tab" data-type="behavior" style="font-size:10px;padding:5px 10px">Behavior</button>
            </div>`;
        links.before(nested);
        nested.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                nested.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const rows = nested.querySelectorAll('.filter-row, .attr-sub-row, .filter-links:not(:last-child)');
                rows.forEach(r => r.remove());
                const frag = tab.dataset.type === 'property' ? renderPropertyFilter() : renderBehaviorFilter();
                nested.querySelector('.nested-label').insertAdjacentHTML('afterend', frag);
                attachFilterListeners(nested);
            });
        });
        attachFilterListeners(nested);
    });

    attachFilterListeners(group.querySelector('.filter-content'));
}

function renderPropertyFilter() {
    return `
        <div class="filter-row">
            <select class="f-select prop-select">${userProperties.map(p => `<option value="${p}">${p}</option>`).join('')}</select>
            <select class="f-select type-hint"><option>Date</option><option>String</option><option>Number</option></select>
            <select class="f-select op-select">${propOperators.date.map(o => `<option value="${o}">${o}</option>`).join('')}</select>
            <input type="text" class="f-input f-input-wide" placeholder="01 Jan 2024" />
            <select class="f-select"><option>date</option><option>days ago</option></select>
        </div>
    `;
}

function renderBehaviorFilter() {
    return `
        <div class="filter-row">
            <select class="f-select">${behaviorActions.map(a => `<option>${a}</option>`).join('')}</select>
            <select class="f-select event-select">${userEvents.map(e => `<option value="${e}">${e}</option>`).join('')}</select>
            <select class="f-select">${behaviorCounts.map(c => `<option>${c}</option>`).join('')}</select>
            <input type="text" class="f-input" placeholder="5" style="width:50px" />
            <span class="f-text">times</span>
        </div>
        <div class="filter-row">
            <select class="f-select">${timeframes.map(t => `<option>${t}</option>`).join('')}</select>
            <input type="text" class="f-input" placeholder="30" style="width:50px" />
            <select class="f-select"><option>days</option><option>hours</option><option>weeks</option></select>
        </div>
        <div class="attr-sub-row" style="display:none" data-attr-row>
            <span class="filter-row-label">With Attribute</span>
            <select class="f-select attr-pick"></select>
            <select class="f-select"><option>is</option><option>is not</option><option>contains</option><option>greater than</option><option>less than</option></select>
            <input type="text" class="f-input f-input-wide" placeholder="Value" />
            <label class="checkbox-label" style="margin-left:8px"><input type="checkbox" /><span class="checkbox-custom"></span> Case Sensitive</label>
        </div>
        <div class="filter-links">
            <span class="filter-link add-attr-link">+ Attributes</span>
            <span class="filter-link blue">+ Aggregation</span>
        </div>
    `;
}

function renderSegmentFilter() {
    return `
        <div class="filter-row">
            <span class="filter-row-label">User is in</span>
            <select class="f-select" style="min-width:200px">
                <option>High-Value Customers</option>
                <option>Cart Abandoners (7d)</option>
                <option>Churning Users</option>
                <option>Power Users</option>
                <option>New Signups (30d)</option>
            </select>
        </div>
    `;
}

// ===== ATTACH LISTENERS =====
function attachFilterListeners(container) {
    // Event select → show attribute options
    container.querySelectorAll('.event-select').forEach(sel => {
        sel.addEventListener('change', () => {
            const attrRow = container.querySelector('[data-attr-row]');
            const attrPick = container.querySelector('.attr-pick');
            if (attrRow && attrPick) {
                const attrs = eventAttrs[sel.value] || [];
                attrPick.innerHTML = attrs.map(a => `<option value="${a}">${a}</option>`).join('');
            }
        });
        sel.dispatchEvent(new Event('change'));
    });

    // + Attributes link
    container.querySelectorAll('.add-attr-link').forEach(link => {
        link.addEventListener('click', () => {
            const attrRow = container.querySelector('[data-attr-row]');
            if (attrRow) attrRow.style.display = 'flex';
            link.style.display = 'none';
        });
    });

    // Property select → update operators
    container.querySelectorAll('.prop-select').forEach(sel => {
        sel.addEventListener('change', () => {
            const type = propTypes[sel.value] || 'string';
            const opSelect = container.querySelector('.op-select');
            if (opSelect) {
                opSelect.innerHTML = propOperators[type].map(o => `<option value="${o}">${o}</option>`).join('');
            }
            const typeHint = container.querySelector('.type-hint');
            if (typeHint) typeHint.value = type.charAt(0).toUpperCase() + type.slice(1);
        });
    });
}

// ===== INIT =====
const filterGroups = document.getElementById('filterGroups');
const excludeGroups = document.getElementById('excludeGroups');

// Start with one filter
createFilterGroup(filterGroups);

// Add filter
document.getElementById('addFilterBtn').addEventListener('click', () => createFilterGroup(filterGroups));
document.getElementById('addExcludeFilterBtn').addEventListener('click', () => createFilterGroup(excludeGroups));

// Exclude toggle
document.getElementById('excludeToggle').addEventListener('change', (e) => {
    document.getElementById('excludeSection').style.display = e.target.checked ? '' : 'none';
    if (e.target.checked && excludeGroups.children.length === 0) createFilterGroup(excludeGroups);
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
    filterGroups.innerHTML = '';
    excludeGroups.innerHTML = '';
    document.getElementById('excludeToggle').checked = false;
    document.getElementById('excludeSection').style.display = 'none';
    document.getElementById('queryResults').style.display = 'none';
    groupCounter = 0;
    createFilterGroup(filterGroups);
    showToast('Filters reset');
});

// Show count
document.getElementById('showCountBtn').addEventListener('click', () => {
    const results = document.getElementById('queryResults');
    results.style.display = '';
    const count = Math.floor(Math.random() * 15000) + 500;
    const reachable = Math.floor(count * (0.7 + Math.random() * 0.25));
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('queryResultsBody').innerHTML = `
        <tr>
            <td>${time}</td>
            <td>Filter applied with ${filterGroups.querySelectorAll('.filter-group').length} condition(s)</td>
            <td>Real-time</td>
            <td><strong>${count.toLocaleString()}</strong></td>
            <td><strong>${reachable.toLocaleString()}</strong></td>
        </tr>
    `;
    showToast('Query executed — ' + count.toLocaleString() + ' users matched');
});

// Mode toggle
document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const isAll = radio.value === 'all';
        document.getElementById('filterGroups').style.display = isAll ? 'none' : '';
        document.querySelector('.add-filter-row').style.display = isAll ? 'none' : '';
        document.querySelector('.exclude-row').style.display = isAll ? 'none' : '';
        document.getElementById('excludeSection').style.display = 'none';
    });
});
