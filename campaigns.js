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

// ===== STEP NAVIGATION =====
let currentStep = 1;
let selectedChannel = 'email';

function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-content')[step - 1].classList.add('active');
    document.querySelectorAll('.step-indicator .step').forEach((s, i) => {
        s.classList.remove('active', 'done');
        if (i + 1 === step) s.classList.add('active');
        else if (i + 1 < step) s.classList.add('done');
    });
    if (step === 3) updateSummary();
}

document.querySelectorAll('.step-indicator .step').forEach(s => {
    s.addEventListener('click', () => goToStep(parseInt(s.dataset.step)));
});
document.getElementById('stepAudienceNext').addEventListener('click', () => goToStep(2));
document.getElementById('stepMessagePrev').addEventListener('click', () => goToStep(1));
document.getElementById('stepMessageNext').addEventListener('click', () => goToStep(3));
document.getElementById('stepSchedulingPrev').addEventListener('click', () => goToStep(2));

// ===== CHANNEL SELECTOR =====
document.querySelectorAll('.channel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedChannel = btn.dataset.channel;
        // Show correct editor
        document.getElementById('emailEditor').style.display = selectedChannel === 'email' ? '' : 'none';
        document.getElementById('smsEditor').style.display = selectedChannel === 'sms' ? '' : 'none';
        document.getElementById('whatsappEditor').style.display = selectedChannel === 'whatsapp' ? '' : 'none';
    });
});

// ===== AUDIENCE MODE =====
document.querySelectorAll('input[name="audienceMode"]').forEach(r => {
    r.addEventListener('change', () => {
        document.getElementById('audienceExisting').style.display = r.value === 'existing' ? '' : 'none';
        document.getElementById('audienceNew').style.display = r.value === 'new' ? '' : 'none';
    });
});

// Segment preview
document.getElementById('segmentSelect').addEventListener('change', (e) => {
    const preview = document.getElementById('segmentPreview');
    if (e.target.value) {
        preview.style.display = 'flex';
        const count = Math.floor(Math.random() * 20000) + 2000;
        document.getElementById('segmentPreviewCount').textContent = count.toLocaleString() + ' users';
        document.getElementById('segmentPreviewReach').textContent = Math.floor(count * 0.82).toLocaleString() + ' reachable';
    } else { preview.style.display = 'none'; }
});

// ===== A/B TESTING =====
let variantCount = 2;
document.getElementById('abTestToggle').addEventListener('change', (e) => {
    document.getElementById('abTestSection').style.display = e.target.checked ? '' : 'none';
});
document.getElementById('addVariantBtn').addEventListener('click', () => {
    variantCount++;
    const letter = String.fromCharCode(64 + variantCount);
    const split = Math.floor(100 / variantCount);
    const card = document.createElement('div');
    card.className = 'ab-variant-card';
    card.dataset.variant = letter;
    card.innerHTML = `<div class="variant-header"><span class="variant-badge">${letter}</span><span class="variant-title">Variant ${letter}</span></div><div class="variant-split"><label class="form-label">Split %</label><input type="number" class="f-input variant-split-input" value="${split}" min="1" max="99" data-variant="${letter}" /></div>`;
    document.getElementById('abVariants').appendChild(card);
    // Rebalance
    document.querySelectorAll('.variant-split-input').forEach(inp => inp.value = split);
    showToast('Variant ' + letter + ' added');
});

// ===== HOLDOUT =====
document.getElementById('holdoutToggle').addEventListener('change', (e) => {
    document.getElementById('holdoutSection').style.display = e.target.checked ? '' : 'none';
});

// ===== SCHEDULING =====
document.querySelectorAll('input[name="sendTiming"]').forEach(r => {
    r.addEventListener('change', () => {
        document.getElementById('schedulePicker').style.display = r.value === 'later' ? 'flex' : 'none';
    });
});

// ===== EMAIL DRAG & DROP EDITOR =====
const canvas = document.getElementById('editorCanvas');
let selectedBlock = null;
let emailBlocks = [];

// Preview toggle
document.getElementById('previewDesktop').addEventListener('click', () => {
    canvas.classList.remove('phone-view');
    document.getElementById('previewDesktop').classList.add('active');
    document.getElementById('previewPhone').classList.remove('active');
});
document.getElementById('previewPhone').addEventListener('click', () => {
    canvas.classList.add('phone-view');
    document.getElementById('previewPhone').classList.add('active');
    document.getElementById('previewDesktop').classList.remove('active');
});

// Drag from palette
document.querySelectorAll('.palette-block').forEach(block => {
    block.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('blockType', block.dataset.block);
    });
});

canvas.addEventListener('dragover', (e) => { e.preventDefault(); canvas.classList.add('drag-over-canvas'); });
canvas.addEventListener('dragleave', () => canvas.classList.remove('drag-over-canvas'));
canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('drag-over-canvas');
    const type = e.dataTransfer.getData('blockType');
    if (type) addBlockToCanvas(type);
});

// Also allow click to add
document.querySelectorAll('.palette-block').forEach(block => {
    block.addEventListener('click', () => addBlockToCanvas(block.dataset.block));
});

function addBlockToCanvas(type) {
    // Remove placeholder
    const placeholder = canvas.querySelector('.canvas-placeholder');
    if (placeholder) placeholder.remove();

    const blockData = { type, id: Date.now(), content: getDefaultContent(type), fontSize: '16', textColor: '#333333', bgColor: '#ffffff', padding: '16', link: '' };
    emailBlocks.push(blockData);

    const el = document.createElement('div');
    el.className = 'canvas-block';
    el.dataset.blockId = blockData.id;
    el.innerHTML = `${renderBlockContent(blockData)}<button class="canvas-block-delete">×</button>`;
    canvas.appendChild(el);

    el.addEventListener('click', (e) => {
        if (e.target.classList.contains('canvas-block-delete')) { el.remove(); emailBlocks = emailBlocks.filter(b => b.id !== blockData.id); selectBlock(null); return; }
        selectBlock(blockData.id);
    });

    selectBlock(blockData.id);
    showToast(type.charAt(0).toUpperCase() + type.slice(1) + ' block added');
}

function getDefaultContent(type) {
    switch(type) {
        case 'header': return 'Your Email Header';
        case 'text': return 'Write your message here. Use dynamic tags like {{first_name}} to personalize.';
        case 'image': return 'https://placehold.co/600x200/f0f0f0/999?text=Image+Block';
        case 'html': return '<div style="padding:12px;background:#f5f5f5;font-size:12px;">&lt;Custom HTML&gt;</div>';
        case 'button': return 'Shop Now';
        default: return '';
    }
}

function renderBlockContent(block) {
    const style = `padding:${block.padding}px;color:${block.textColor};background:${block.bgColor};font-size:${block.fontSize}px;`;
    switch(block.type) {
        case 'header': return `<h2 style="${style}font-weight:700;margin:0;">${block.content}</h2>`;
        case 'text': return `<p style="${style}margin:0;line-height:1.6;">${block.content}</p>`;
        case 'image': return `<div style="${style}"><img src="${block.content}" style="width:100%;display:block;" alt="Image" /></div>`;
        case 'html': return `<div style="${style}">${block.content}</div>`;
        case 'button': return `<div style="${style}text-align:center;"><a href="${block.link || '#'}" style="display:inline-block;padding:12px 28px;background:${block.textColor};color:${block.bgColor};font-weight:600;font-size:${block.fontSize}px;text-decoration:none;">${block.content}</a></div>`;
        default: return '';
    }
}

// ===== BLOCK SELECTION & PROPERTIES =====
function selectBlock(blockId) {
    document.querySelectorAll('.canvas-block').forEach(el => el.classList.remove('selected'));
    if (!blockId) { document.getElementById('propertiesForm').style.display = 'none'; document.getElementById('propertiesEmpty').style.display = ''; selectedBlock = null; return; }

    selectedBlock = emailBlocks.find(b => b.id === blockId);
    const el = canvas.querySelector(`[data-block-id="${blockId}"]`);
    if (el) el.classList.add('selected');

    document.getElementById('propertiesEmpty').style.display = 'none';
    document.getElementById('propertiesForm').style.display = '';

    document.getElementById('propContent').value = selectedBlock.content;
    document.getElementById('propFontSize').value = selectedBlock.fontSize;
    document.getElementById('propTextColor').value = selectedBlock.textColor;
    document.getElementById('propBgColor').value = selectedBlock.bgColor;
    document.getElementById('propPadding').value = selectedBlock.padding;
    document.getElementById('propLink').value = selectedBlock.link || '';
}

// Property change handlers
['propContent', 'propFontSize', 'propTextColor', 'propBgColor', 'propPadding', 'propLink'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateSelectedBlock);
    document.getElementById(id).addEventListener('change', updateSelectedBlock);
});

function updateSelectedBlock() {
    if (!selectedBlock) return;
    selectedBlock.content = document.getElementById('propContent').value;
    selectedBlock.fontSize = document.getElementById('propFontSize').value;
    selectedBlock.textColor = document.getElementById('propTextColor').value;
    selectedBlock.bgColor = document.getElementById('propBgColor').value;
    selectedBlock.padding = document.getElementById('propPadding').value;
    selectedBlock.link = document.getElementById('propLink').value;

    const el = canvas.querySelector(`[data-block-id="${selectedBlock.id}"]`);
    if (el) el.innerHTML = `${renderBlockContent(selectedBlock)}<button class="canvas-block-delete">×</button>`;
}

// Dynamic tag insertion
document.getElementById('propDynamicTag').addEventListener('change', (e) => {
    if (e.target.value && selectedBlock) {
        selectedBlock.content += ' ' + e.target.value;
        document.getElementById('propContent').value = selectedBlock.content;
        updateSelectedBlock();
        e.target.value = '';
        showToast('Tag inserted');
    }
});

// ===== SMS EDITOR =====
const smsTemplates = {
    welcome: 'Hi {{first_name}}, welcome to Lifecycle! Start exploring our products at {{app_link}}',
    promo: '🎉 {{first_name}}, exclusive offer just for you! Use code {{promo_code}} for 20% off. Shop now: {{link}}',
    reminder: 'Hi {{first_name}}, you left items in your cart! Complete your order: {{cart_link}}',
    custom: ''
};
document.getElementById('smsTemplateSelect').addEventListener('change', (e) => {
    document.getElementById('smsBody').value = smsTemplates[e.target.value] || '';
    updateSmsCount();
});
document.getElementById('smsBody').addEventListener('input', updateSmsCount);
function updateSmsCount() { document.getElementById('smsCharCount').textContent = document.getElementById('smsBody').value.length; }
document.getElementById('smsDynamicTag').addEventListener('change', (e) => {
    if (e.target.value) { document.getElementById('smsBody').value += e.target.value; e.target.value = ''; updateSmsCount(); }
});

// ===== WHATSAPP EDITOR =====
const waTemplates = {
    'order-confirm': 'Hi {{first_name}}, your order #{{order_id}} has been confirmed! Track here: {{tracking_url}}',
    'shipping-update': 'Great news {{first_name}}! Your order #{{order_id}} has shipped. Expected delivery: {{delivery_date}}. Track: {{tracking_url}}',
    'appointment': 'Reminder: {{first_name}}, you have an appointment on {{date}} at {{time}}. Reply CONFIRM to confirm.',
    'promo': '🔥 Hi {{first_name}}! Flash sale: Get {{discount}}% off on {{category}}. Shop now: {{link}}. Limited time!'
};
document.getElementById('whatsappTemplateSelect').addEventListener('change', (e) => {
    document.getElementById('whatsappBody').value = waTemplates[e.target.value] || '';
});
document.getElementById('whatsappDynamicTag').addEventListener('change', (e) => {
    if (e.target.value) { document.getElementById('whatsappBody').value += e.target.value; e.target.value = ''; }
});

// ===== SUMMARY =====
function updateSummary() {
    document.getElementById('summaryChannel').textContent = selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1);
    const seg = document.getElementById('segmentSelect');
    document.getElementById('summaryAudience').textContent = seg.value ? seg.options[seg.selectedIndex].text : 'Custom segment';

    const abEnabled = document.getElementById('abTestToggle').checked;
    if (abEnabled) {
        const splits = [...document.querySelectorAll('.variant-split-input')].map(i => i.dataset.variant + ':' + i.value + '%');
        document.getElementById('summaryAB').textContent = splits.join(' / ');
    } else { document.getElementById('summaryAB').textContent = 'Disabled'; }

    const holdout = document.getElementById('holdoutToggle').checked;
    document.getElementById('summaryHoldout').textContent = holdout ? document.getElementById('holdoutPercent').value + '% holdout' : 'None';

    if (selectedChannel === 'email') {
        document.getElementById('summaryMessage').textContent = emailBlocks.length + ' blocks designed';
    } else if (selectedChannel === 'sms') {
        document.getElementById('summaryMessage').textContent = document.getElementById('smsBody').value.slice(0, 40) + '...';
    } else {
        document.getElementById('summaryMessage').textContent = document.getElementById('whatsappBody').value.slice(0, 40) + '...';
    }

    const timing = document.querySelector('input[name="sendTiming"]:checked').value;
    if (timing === 'now') document.getElementById('summaryTiming').textContent = 'Send immediately';
    else document.getElementById('summaryTiming').textContent = (document.getElementById('scheduleDate').value || '—') + ' at ' + (document.getElementById('scheduleTime').value || '—');
}

// ===== LAUNCH =====
document.getElementById('launchCampaignBtn').addEventListener('click', () => {
    const name = document.getElementById('campaignName').value || 'Untitled Campaign';
    showToast('🚀 Campaign "' + name + '" launched successfully!');
    setTimeout(() => showToast('Delivery started — monitoring performance'), 2000);
});
