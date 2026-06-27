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

// ===== MOCK USER DATA =====
const users = [
    { id: 'user_29481', email: 'priya@gmail.com', phone: '+91 98765 43210', plan: 'Pro', lastActive: '2 min ago', name: 'Priya Sharma', city: 'Mumbai', country: 'India', gender: 'Female', age: 28, signupDate: 'Jan 12, 2025', totalOrders: 14, ltv: '$1,240', device: 'iOS' },
    { id: 'user_10234', email: 'rahul.k@outlook.com', phone: '+91 87654 32109', plan: 'Free', lastActive: '1 hr ago', name: 'Rahul Kumar', city: 'Delhi', country: 'India', gender: 'Male', age: 34, signupDate: 'Mar 5, 2025', totalOrders: 3, ltv: '$180', device: 'Android' },
    { id: 'user_44821', email: 'sneha.d@yahoo.com', phone: '+91 76543 21098', plan: 'Pro', lastActive: '15 min ago', name: 'Sneha Desai', city: 'Bangalore', country: 'India', gender: 'Female', age: 26, signupDate: 'Nov 20, 2024', totalOrders: 22, ltv: '$2,890', device: 'iOS' },
    { id: 'user_55190', email: 'amit.p@gmail.com', phone: '+91 65432 10987', plan: 'Enterprise', lastActive: '5 min ago', name: 'Amit Patel', city: 'Ahmedabad', country: 'India', gender: 'Male', age: 41, signupDate: 'Jun 1, 2024', totalOrders: 45, ltv: '$8,420', device: 'Web' },
    { id: 'user_33847', email: 'meera.r@hotmail.com', phone: '+91 54321 09876', plan: 'Pro', lastActive: '3 hrs ago', name: 'Meera Reddy', city: 'Hyderabad', country: 'India', gender: 'Female', age: 31, signupDate: 'Aug 14, 2024', totalOrders: 9, ltv: '$720', device: 'Android' },
];

const userSegments = {
    'user_29481': ['High-Value Customers', 'Power Users', 'Email Engaged'],
    'user_10234': ['New Signups (30d)', 'Cart Abandoners'],
    'user_44821': ['High-Value Customers', 'Power Users', 'Repeat Buyers'],
    'user_55190': ['Enterprise', 'High-Value Customers', 'Power Users', 'Loyal Advocates'],
    'user_33847': ['Churning Users', 'Cart Abandoners'],
};

const userEvents = {
    'user_29481': [
        { name: 'purchase_completed', attrs: { order_id: 'ORD-9841', total_amount: '$89.00', items_count: '3', payment_method: 'UPI' }, time: 'Jun 28, 2026 10:42 AM' },
        { name: 'product_viewed', attrs: { product_id: 'SKU-441', product_name: 'Cotton Kurta Set', category: 'Apparel', price: '$32' }, time: 'Jun 28, 2026 10:38 AM' },
        { name: 'app_open', attrs: { source: 'push_notification' }, time: 'Jun 28, 2026 10:35 AM' },
        { name: 'email_clicked', attrs: { campaign_id: 'CAMP-221', link_url: '/summer-sale' }, time: 'Jun 28, 2026 09:12 AM' },
        { name: 'email_opened', attrs: { campaign_id: 'CAMP-221', subject_line: 'Summer Sale — 40% off!' }, time: 'Jun 28, 2026 09:10 AM' },
        { name: 'purchase_completed', attrs: { order_id: 'ORD-9790', total_amount: '$124.00', items_count: '5', payment_method: 'Card' }, time: 'Jun 26, 2026 3:22 PM' },
        { name: 'add_to_cart', attrs: { product_id: 'SKU-338', quantity: '2', cart_value: '$64', source: 'recommendation' }, time: 'Jun 26, 2026 3:18 PM' },
        { name: 'search', attrs: { query: 'blue denim jacket', results_count: '12', category: 'Apparel' }, time: 'Jun 26, 2026 3:15 PM' },
        { name: 'page_view', attrs: { page_url: '/collections/new-arrivals', page_title: 'New Arrivals', referrer: 'instagram' }, time: 'Jun 25, 2026 7:44 PM' },
        { name: 'push_clicked', attrs: { campaign_id: 'PUSH-89', title: 'New arrivals just dropped!' }, time: 'Jun 25, 2026 7:42 PM' },
    ],
    'user_10234': [
        { name: 'checkout_started', attrs: { cart_value: '$45.00', items_count: '2', source: 'direct' }, time: 'Jun 27, 2026 8:14 PM' },
        { name: 'add_to_cart', attrs: { product_id: 'SKU-112', quantity: '1', cart_value: '$45', source: 'browse' }, time: 'Jun 27, 2026 8:10 PM' },
        { name: 'product_viewed', attrs: { product_id: 'SKU-112', product_name: 'Running Shoes', category: 'Footwear', price: '$45' }, time: 'Jun 27, 2026 8:08 PM' },
        { name: 'app_open', attrs: { source: 'organic' }, time: 'Jun 27, 2026 8:05 PM' },
        { name: 'signup', attrs: { method: 'google_oauth', referral_source: 'friend' }, time: 'Jun 15, 2026 11:30 AM' },
    ],
    'user_44821': [
        { name: 'purchase_completed', attrs: { order_id: 'ORD-9855', total_amount: '$210.00', items_count: '4', payment_method: 'UPI', coupon_code: 'SUMMER20' }, time: 'Jun 28, 2026 11:05 AM' },
        { name: 'referral_sent', attrs: { referral_code: 'SNEHA10', channel: 'whatsapp' }, time: 'Jun 28, 2026 10:50 AM' },
        { name: 'product_viewed', attrs: { product_id: 'SKU-772', product_name: 'Silk Saree', category: 'Ethnic', price: '$85', brand: 'FabIndia' }, time: 'Jun 28, 2026 10:45 AM' },
        { name: 'email_opened', attrs: { campaign_id: 'CAMP-221', subject_line: 'Summer Sale — 40% off!' }, time: 'Jun 28, 2026 09:30 AM' },
        { name: 'login', attrs: { method: 'phone_otp', device: 'iPhone 15' }, time: 'Jun 28, 2026 09:28 AM' },
    ],
};
// Copy some events for remaining users
userEvents['user_55190'] = userEvents['user_29481'].slice(0, 6);
userEvents['user_33847'] = userEvents['user_10234'].slice();

// ===== SEARCH =====
const searchInput = document.getElementById('userSearchInput');
const resultsSection = document.getElementById('userResults');
const resultsBody = document.getElementById('userResultsBody');
const resultCount = document.getElementById('resultCount');
const profileSection = document.getElementById('userProfile');

searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (q.length < 2) { resultsSection.style.display = 'none'; return; }

    const matches = users.filter(u =>
        u.id.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );

    if (matches.length === 0) {
        resultsSection.style.display = 'block';
        resultCount.textContent = '0 results';
        resultsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--grey-400);padding:24px">No users found</td></tr>';
        return;
    }

    resultsSection.style.display = 'block';
    profileSection.style.display = 'none';
    resultCount.textContent = matches.length + ' result' + (matches.length > 1 ? 's' : '');
    resultsBody.innerHTML = matches.map(u => `
        <tr class="user-row" data-uid="${u.id}">
            <td class="td-name">${u.id}</td>
            <td>${u.email}</td>
            <td>${u.phone}</td>
            <td><span class="badge">${u.plan}</span></td>
            <td class="td-date">${u.lastActive}</td>
        </tr>
    `).join('');

    // Attach click handlers
    resultsBody.querySelectorAll('.user-row').forEach(row => {
        row.addEventListener('click', () => openProfile(row.dataset.uid));
    });
});

// ===== HINT EXAMPLES =====
document.querySelectorAll('.hint-example').forEach(hint => {
    hint.addEventListener('click', () => {
        searchInput.value = hint.dataset.val;
        searchInput.dispatchEvent(new Event('input'));
    });
});

// ===== OPEN PROFILE =====
function openProfile(uid) {
    const user = users.find(u => u.id === uid);
    if (!user) return;

    resultsSection.style.display = 'none';
    profileSection.style.display = 'block';
    document.getElementById('profileTitle').textContent = user.name + ' (' + user.id + ')';

    // Fields
    const fields = document.getElementById('profileFields');
    fields.innerHTML = [
        ['Email', user.email],
        ['Phone', user.phone],
        ['City', user.city],
        ['Country', user.country],
        ['Gender', user.gender],
        ['Age', user.age],
        ['Plan', user.plan],
        ['Signup Date', user.signupDate],
        ['Total Orders', user.totalOrders],
        ['Lifetime Value', user.ltv],
        ['Device', user.device],
        ['Last Active', user.lastActive],
    ].map(([k, v]) => `<div class="profile-field"><span class="profile-field-key">${k}</span><span class="profile-field-val">${v}</span></div>`).join('');

    // Segments
    const segs = document.getElementById('profileSegments');
    const userSegs = userSegments[uid] || [];
    segs.innerHTML = userSegs.map(s => `<span class="segment-tag">${s}</span>`).join('');

    // Events
    renderEvents(uid, '');

    // Filter
    document.getElementById('eventFilter').value = '';
    document.getElementById('eventFilter').oninput = (e) => renderEvents(uid, e.target.value);

    showToast('Loaded profile for ' + user.name, 'red');
}

function renderEvents(uid, filter) {
    const eventsBody = document.getElementById('eventsBody');
    const events = (userEvents[uid] || []).filter(ev => 
        !filter || ev.name.toLowerCase().includes(filter.toLowerCase())
    );

    eventsBody.innerHTML = events.map(ev => {
        const attrs = Object.entries(ev.attrs).map(([k, v]) => 
            `<span class="event-attr-tag"><span class="attr-key">${k}:</span> ${v}</span>`
        ).join('');
        return `
            <tr>
                <td class="event-name-cell">${ev.name}</td>
                <td><div class="event-attrs">${attrs}</div></td>
                <td class="event-time">${ev.time}</td>
            </tr>
        `;
    }).join('');
}

// ===== CLOSE PROFILE =====
document.getElementById('closeProfile').addEventListener('click', () => {
    profileSection.style.display = 'none';
    resultsSection.style.display = 'block';
});
