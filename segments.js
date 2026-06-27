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
