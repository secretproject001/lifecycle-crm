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
    'email_opened': ['campaign_id', 'subject_line'],
    'email_clicked': ['campaign_id', 'link_url'],
    'push_clicked': ['campaign_id', 'title'],
};
const behaviorActions = ['Has Executed', 'Has Not Executed'];
const behaviorCounts = ['at least', 'at most', 'exactly'];
const timeframes = ['in the last', 'between', 'before', 'after', 'ever'];
const attrOperators = ['is', 'is not', 'contains', 'greater than', 'less than', 'exists'];

// Block logic: inside blocks = intraLogic, between blocks = opposite
let intraLogic = 'AND'; // conditions inside a block
function getInterLogic() { return intraLogic === 'AND' ? 'OR' : 'AND'; }

let blockCounter = 0;

// ===== RENDER A SINGLE CONDITION (property or behavior) =====
function renderCondition(type) {
    const condId = 'cond-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const div = document.createElement('div');
    div.className = 'condition-item';
    div.dataset.condId = condId;

    if (type === 'property') {
        div.innerHTML = `
            <div class="condition-row">
                <select class="f-select prop-select">${userProperties.map(p => `<option value="${p}">${p}</option>`).join('')}</select>
                <select class="f-select type-hint"><option>Date</option><option>String</option><option>Number</option></select>
                <select class="f-select op-select">${propOperators.date.map(o => `<option>${o}</option>`).join('')}</select>
                <input type="text" class="f-input f-input-wide" placeholder="Value" />
                <select class="f-select"><option>date</option><option>days ago</option></select>
                <button class="cond-remove">×</button>
            </div>
        `;
    } else if (type === 'behavior') {
        div.innerHTML = `
            <div class="condition-row">
                <select class="f-select">${behaviorActions.map(a => `<option>${a}</option>`).join('')}</select>
                <select class="f-select event-select">${userEvents.map(e => `<option value="${e}">${e}</option>`).join('')}</select>
                <select class="f-select">${behaviorCounts.map(c => `<option>${c}</option>`).join('')}</select>
                <input type="text" class="f-input" placeholder="5" style="width:50px" />
                <span class="f-text">times</span>
                <button class="cond-remove">×</button>
            </div>
            <div class="condition-row">
                <select class="f-select">${timeframes.map(t => `<option>${t}</option>`).join('')}</select>
                <input type="text" class="f-input" placeholder="30" style="width:50px" />
                <select class="f-select"><option>days</option><option>hours</option><option>weeks</option></select>
            </div>
            <div class="event-attrs-section"></div>
            <div class="filter-links"><span class="filter-link add-attr-link">+ Attributes</span></div>
        `;
    } else if (type === 'segment') {
        div.innerHTML = `
            <div class="condition-row">
                <span class="filter-row-label">User is in</span>
                <select class="f-select" style="min-width:200px">
                    <option>High-Value Customers</option><option>Cart Abandoners (7d)</option><option>Churning Users</option><option>Power Users</option><option>New Signups (30d)</option>
                </select>
                <button class="cond-remove">×</button>
            </div>
        `;
    }

    // Remove handler
    div.querySelector('.cond-remove').addEventListener('click', () => {
        const block = div.closest('.filter-block');
        div.remove();
        updateBlockConnectors(block);
    });

    // Property change → update operators
    const propSel = div.querySelector('.prop-select');
    if (propSel) {
        propSel.addEventListener('change', () => {
            const type = propTypes[propSel.value] || 'string';
            const opSel = div.querySelector('.op-select');
            opSel.innerHTML = propOperators[type].map(o => `<option>${o}</option>`).join('');
            const hint = div.querySelector('.type-hint');
            if (hint) hint.value = type.charAt(0).toUpperCase() + type.slice(1);
        });
    }

    // Event select → populate attrs
    const evSel = div.querySelector('.event-select');
    if (evSel) {
        evSel.addEventListener('change', () => {
            // Reset attrs section
            const section = div.querySelector('.event-attrs-section');
            section.innerHTML = '';
        });
    }

    // + Attributes
    const addAttrLink = div.querySelector('.add-attr-link');
    if (addAttrLink) {
        addAttrLink.addEventListener('click', () => {
            const event = div.querySelector('.event-select').value;
            const attrs = eventAttrs[event] || [];
            if (!attrs.length) { showToast('No attributes for this event'); return; }
            addAttributeRow(div, attrs);
        });
    }

    return div;
}

function addAttributeRow(condDiv, attrs) {
    const section = condDiv.querySelector('.event-attrs-section');
    const row = document.createElement('div');
    row.className = 'attr-sub-row';
    row.innerHTML = `
        <span class="filter-row-label">With Attribute</span>
        <select class="f-select">${attrs.map(a => `<option value="${a}">${a}</option>`).join('')}</select>
        <select class="f-select">${attrOperators.map(o => `<option>${o}</option>`).join('')}</select>
        <input type="text" class="f-input f-input-wide" placeholder="Value" />
        <label class="checkbox-label"><input type="checkbox" /><span class="checkbox-custom"></span> Case Sensitive</label>
        <button class="attr-remove">×</button>
    `;
    section.appendChild(row);
    row.querySelector('.attr-remove').addEventListener('click', () => row.remove());
}

// ===== FILTER BLOCK =====
function createBlock(container) {
    blockCounter++;
    const block = document.createElement('div');
    block.className = 'filter-block';
    block.dataset.blockId = blockCounter;

    block.innerHTML = `
        <div class="block-header">
            <span class="block-logic-label">${intraLogic}</span>
            <button class="block-remove">×</button>
        </div>
        <div class="block-conditions"></div>
        <div class="block-add-row">
            <button class="block-add-btn" data-type="property">+ User Property</button>
            <button class="block-add-btn" data-type="behavior">+ User Behavior</button>
            <button class="block-add-btn" data-type="segment">+ Custom Segment</button>
        </div>
    `;

    // Add inter-block connector if not first block
    if (container.children.length > 0) {
        const connector = document.createElement('div');
        connector.className = 'inter-block-connector';
        connector.innerHTML = `<span>${getInterLogic()}</span>`;
        container.appendChild(connector);
    }

    container.appendChild(block);

    // Add one default condition
    const condArea = block.querySelector('.block-conditions');
    condArea.appendChild(renderCondition('property'));

    // Add condition buttons
    block.querySelectorAll('.block-add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cond = renderCondition(btn.dataset.type);
            condArea.appendChild(cond);
            updateBlockConnectors(block);
        });
    });

    // Remove block
    block.querySelector('.block-remove').addEventListener('click', () => {
        const prev = block.previousElementSibling;
        if (prev && prev.classList.contains('inter-block-connector')) prev.remove();
        else { const next = block.nextElementSibling; if (next && next.classList.contains('inter-block-connector')) next.remove(); }
        block.remove();
    });

    return block;
}

function updateBlockConnectors(block) {
    if (!block) return;
    const conditions = block.querySelectorAll('.condition-item');
    // Show intra-logic labels between conditions
    conditions.forEach((cond, i) => {
        const existing = cond.querySelector('.intra-connector');
        if (existing) existing.remove();
        if (i > 0) {
            const conn = document.createElement('div');
            conn.className = 'intra-connector';
            conn.innerHTML = `<span>${intraLogic}</span>`;
            cond.prepend(conn);
        }
    });
}

// Update all connectors and labels
function updateAllLogic() {
    // Update block headers
    document.querySelectorAll('.block-logic-label').forEach(label => {
        label.textContent = intraLogic;
    });
    // Update inter-block connectors
    document.querySelectorAll('.inter-block-connector span').forEach(span => {
        span.textContent = getInterLogic();
    });
    // Update intra connectors
    document.querySelectorAll('.intra-connector span').forEach(span => {
        span.textContent = intraLogic;
    });
    // Exclude too
    document.querySelectorAll('#excludeGroups .block-logic-label').forEach(label => {
        label.textContent = intraLogic;
    });
    document.querySelectorAll('#excludeGroups .inter-block-connector span').forEach(span => {
        span.textContent = getInterLogic();
    });
}

// ===== INIT =====
const filterGroups = document.getElementById('filterGroups');
const excludeGroups = document.getElementById('excludeGroups');

// Start with one block
createBlock(filterGroups);

// Add block
document.getElementById('addFilterBtn').addEventListener('click', () => createBlock(filterGroups));
document.getElementById('addExcludeFilterBtn').addEventListener('click', () => createBlock(excludeGroups));

// Logic toggle
document.getElementById('logicToggle').addEventListener('click', () => {
    intraLogic = intraLogic === 'AND' ? 'OR' : 'AND';
    document.getElementById('logicToggle').textContent = `Inside blocks: ${intraLogic} · Between blocks: ${getInterLogic()}`;
    updateAllLogic();
    showToast(`Logic switched — inside: ${intraLogic}, between: ${getInterLogic()}`);
});

// Exclude toggle
document.getElementById('excludeToggle').addEventListener('change', (e) => {
    document.getElementById('excludeSection').style.display = e.target.checked ? '' : 'none';
    if (e.target.checked && excludeGroups.children.length === 0) createBlock(excludeGroups);
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
    filterGroups.innerHTML = '';
    excludeGroups.innerHTML = '';
    document.getElementById('excludeToggle').checked = false;
    document.getElementById('excludeSection').style.display = 'none';
    document.getElementById('queryResults').style.display = 'none';
    blockCounter = 0;
    createBlock(filterGroups);
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
    const blocks = filterGroups.querySelectorAll('.filter-block').length;
    const totalConds = filterGroups.querySelectorAll('.condition-item').length;
    document.getElementById('queryResultsBody').innerHTML = `
        <tr>
            <td>${time}</td>
            <td>${blocks} block(s), ${totalConds} condition(s) — ${intraLogic} inside, ${getInterLogic()} between</td>
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
        document.querySelector('.filter-area').style.display = isAll ? 'none' : '';
    });
});

// ===== PAGE TABS =====
const tabs = document.querySelectorAll('.page-tab');
const tabCreate = document.getElementById('tabCreate');
const tabSaved = document.getElementById('tabSaved');
const tabDetail = document.getElementById('tabDetail');

function showTab(name) {
    tabCreate.style.display = name === 'create' ? '' : 'none';
    tabSaved.style.display = name === 'saved' ? '' : 'none';
    tabDetail.style.display = name === 'detail' ? '' : 'none';
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
}
tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));

// ===== SAVED SEGMENTS STORE =====
let savedSegments = [
    { id: 1, name: 'High-Value Customers', desc: 'Users where Lifetime Value is greater than $500 AND Total Orders is greater than 5', users: 12430, created: 'Jun 12, 2026' },
    { id: 2, name: 'Cart Abandoners (7d)', desc: 'Users who Has Executed add_to_cart at least 1 times in the last 7 days AND Has Not Executed purchase_completed', users: 3891, created: 'Jun 8, 2026' },
    { id: 3, name: 'Churning Users', desc: 'Users where Last Seen is before 30 days ago OR Total Orders equals 0', users: 1204, created: 'Jun 5, 2026' },
    { id: 4, name: 'Power Users', desc: 'Users who Has Executed app_open at least 10 times in the last 7 days AND Lifetime Value is greater than $200', users: 890, created: 'May 28, 2026' },
    { id: 5, name: 'New Signups (30d)', desc: 'Users where First Seen is in the last 30 days', users: 5612, created: 'May 20, 2026' },
];

const sampleUsers = [
    { id: 'user_29481', email: 'priya@gmail.com', city: 'Mumbai', plan: 'Pro', ltv: '$1,240', lastActive: '2 min ago' },
    { id: 'user_10234', email: 'rahul.k@outlook.com', city: 'Delhi', plan: 'Free', ltv: '$180', lastActive: '1 hr ago' },
    { id: 'user_44821', email: 'sneha.d@yahoo.com', city: 'Bangalore', plan: 'Pro', ltv: '$2,890', lastActive: '15 min ago' },
    { id: 'user_55190', email: 'amit.p@gmail.com', city: 'Ahmedabad', plan: 'Enterprise', ltv: '$8,420', lastActive: '5 min ago' },
    { id: 'user_33847', email: 'meera.r@hotmail.com', city: 'Hyderabad', plan: 'Pro', ltv: '$720', lastActive: '3 hrs ago' },
    { id: 'user_19283', email: 'vikram@gmail.com', city: 'Chennai', plan: 'Pro', ltv: '$960', lastActive: '20 min ago' },
    { id: 'user_77012', email: 'anjali.m@gmail.com', city: 'Pune', plan: 'Free', ltv: '$340', lastActive: '45 min ago' },
    { id: 'user_88431', email: 'deepak.s@yahoo.com', city: 'Kolkata', plan: 'Pro', ltv: '$1,100', lastActive: '10 min ago' },
    { id: 'user_62190', email: 'nisha.k@outlook.com', city: 'Jaipur', plan: 'Enterprise', ltv: '$5,200', lastActive: '8 min ago' },
    { id: 'user_41098', email: 'ravi.t@gmail.com', city: 'Lucknow', plan: 'Free', ltv: '$90', lastActive: '2 hrs ago' },
    { id: 'user_55623', email: 'kavya.n@gmail.com', city: 'Mumbai', plan: 'Pro', ltv: '$1,780', lastActive: '30 min ago' },
    { id: 'user_38291', email: 'arjun.b@outlook.com', city: 'Delhi', plan: 'Pro', ltv: '$640', lastActive: '1 hr ago' },
];

function renderSavedSegments() {
    const body = document.getElementById('savedSegmentsBody');
    const recent = savedSegments.slice(-30).reverse();
    body.innerHTML = recent.map(seg => `
        <tr class="saved-row" data-seg-id="${seg.id}">
            <td class="td-name">${seg.name}</td>
            <td><span class="saved-desc">${seg.desc}</span></td>
            <td class="td-num">${seg.users.toLocaleString()}</td>
            <td class="td-date">${seg.created}</td>
            <td>
                <div class="saved-actions">
                    <button class="saved-action-btn export-seg" data-seg-id="${seg.id}">Export</button>
                </div>
            </td>
        </tr>
    `).join('');
    document.getElementById('savedCount').textContent = recent.length + ' segments';

    // Row click → detail
    body.querySelectorAll('.saved-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('.saved-action-btn')) return;
            openSegmentDetail(parseInt(row.dataset.segId));
        });
    });

    // Export buttons
    body.querySelectorAll('.export-seg').forEach(btn => {
        btn.addEventListener('click', () => openExport(parseInt(btn.dataset.segId)));
    });
}

// ===== GENERATE DESCRIPTION FROM BUILDER =====
function generateDescription() {
    const blocks = filterGroups.querySelectorAll('.filter-block');
    if (blocks.length === 0) return 'All users';
    const parts = [];
    blocks.forEach(block => {
        const conds = block.querySelectorAll('.condition-item');
        const condParts = [];
        conds.forEach(cond => {
            const selects = cond.querySelectorAll('.f-select');
            const inputs = cond.querySelectorAll('.f-input');
            const values = [...selects, ...inputs].map(el => el.value).filter(v => v);
            condParts.push(values.join(' '));
        });
        parts.push(condParts.join(` ${intraLogic} `));
    });
    return 'Users where ' + parts.join(` ${getInterLogic()} `);
}

// ===== SAVE SEGMENT =====
document.getElementById('saveSegmentBtn').addEventListener('click', () => {
    const name = document.getElementById('segmentNameInput').value || 'Untitled Segment #' + (savedSegments.length + 1);
    const desc = generateDescription();
    const count = Math.floor(Math.random() * 12000) + 500;
    const now = new Date();
    const created = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    savedSegments.push({ id: Date.now(), name, desc, users: count, created });
    renderSavedSegments();
    showToast('Segment "' + name + '" saved — ' + count.toLocaleString() + ' users');
    showTab('saved');
});

// ===== SEGMENT DETAIL =====
let currentDetailSegment = null;

function openSegmentDetail(segId) {
    const seg = savedSegments.find(s => s.id === segId);
    if (!seg) return;
    currentDetailSegment = seg;
    showTab('detail');
    document.getElementById('detailTitle').textContent = seg.name;
    document.getElementById('detailDesc').textContent = seg.desc;
    document.getElementById('detailUserCount').textContent = seg.users.toLocaleString();
    document.getElementById('detailDate').textContent = seg.created;

    // Show 10 random users
    const shuffled = [...sampleUsers].sort(() => Math.random() - 0.5).slice(0, 10);
    document.getElementById('detailUsersBody').innerHTML = shuffled.map(u => `
        <tr>
            <td class="td-name">${u.id}</td>
            <td>${u.email}</td>
            <td>${u.city}</td>
            <td><span class="badge">${u.plan}</span></td>
            <td>${u.ltv}</td>
            <td class="td-date">${u.lastActive}</td>
        </tr>
    `).join('');
}

document.getElementById('backToSaved').addEventListener('click', () => showTab('saved'));
document.getElementById('exportBtn').addEventListener('click', () => {
    if (currentDetailSegment) openExport(currentDetailSegment.id);
});

// ===== EXPORT =====
const exportableAttrs = ['user_id', 'email', 'phone', 'name', 'city', 'country', 'gender', 'age', 'plan', 'signup_date', 'total_orders', 'lifetime_value', 'last_active', 'device_type', 'signup_source'];
let selectedExportAttrs = new Set(['user_id', 'email', 'city', 'plan', 'lifetime_value']);
let exportSegmentId = null;

function openExport(segId) {
    exportSegmentId = segId;
    const overlay = document.getElementById('exportOverlay');
    overlay.style.display = 'flex';
    renderExportAttrs();
}

function renderExportAttrs() {
    const container = document.getElementById('exportAttrs');
    container.innerHTML = exportableAttrs.map(attr => `
        <div class="export-attr-item ${selectedExportAttrs.has(attr) ? 'selected' : ''}" data-attr="${attr}">${attr}</div>
    `).join('');
    container.querySelectorAll('.export-attr-item').forEach(item => {
        item.addEventListener('click', () => {
            const attr = item.dataset.attr;
            if (selectedExportAttrs.has(attr)) selectedExportAttrs.delete(attr);
            else selectedExportAttrs.add(attr);
            item.classList.toggle('selected');
        });
    });
}

document.getElementById('exportClose').addEventListener('click', () => document.getElementById('exportOverlay').style.display = 'none');
document.getElementById('exportCancel').addEventListener('click', () => document.getElementById('exportOverlay').style.display = 'none');
document.getElementById('selectAllAttrs').addEventListener('click', () => { selectedExportAttrs = new Set(exportableAttrs); renderExportAttrs(); });
document.getElementById('deselectAllAttrs').addEventListener('click', () => { selectedExportAttrs = new Set(); renderExportAttrs(); });

document.getElementById('exportConfirm').addEventListener('click', () => {
    if (selectedExportAttrs.size === 0) { showToast('Select at least one attribute'); return; }
    const seg = savedSegments.find(s => s.id === exportSegmentId);
    const attrs = [...selectedExportAttrs];
    
    // Generate CSV
    let csv = attrs.join(',') + '\n';
    const shuffled = [...sampleUsers].sort(() => Math.random() - 0.5).slice(0, 10);
    shuffled.forEach(u => {
        const row = attrs.map(a => {
            const map = { user_id: u.id, email: u.email, city: u.city, plan: u.plan, lifetime_value: u.ltv, last_active: u.lastActive, name: u.id, phone: '+91 XXXXX XXXXX', country: 'India', gender: Math.random() > 0.5 ? 'Male' : 'Female', age: Math.floor(Math.random() * 20) + 22, signup_date: '2024-' + String(Math.floor(Math.random()*12)+1).padStart(2,'0') + '-' + String(Math.floor(Math.random()*28)+1).padStart(2,'0'), total_orders: Math.floor(Math.random() * 30) + 1, device_type: ['iOS','Android','Web'][Math.floor(Math.random()*3)], signup_source: ['organic','referral','paid','social'][Math.floor(Math.random()*4)] };
            return map[a] || '';
        });
        csv += row.join(',') + '\n';
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (seg ? seg.name.replace(/\s+/g, '_') : 'segment') + '_export.csv';
    a.click();
    URL.revokeObjectURL(url);

    document.getElementById('exportOverlay').style.display = 'none';
    showToast('CSV exported with ' + attrs.length + ' attributes');
});

// ===== INIT =====
renderSavedSegments();
