// State Management
let currentRole = 'normal';

// Page Navigation
function showPage(pageId) {
    const content = document.getElementById('app-content');
    const template = document.getElementById(`${pageId}-page`);
    
    if (template) {
        content.innerHTML = '';
        content.appendChild(template.content.cloneNode(true));
        
        // Reset role if on register page
        if (pageId === 'register') {
            currentRole = 'normal';
            updateRoleUI();
        }
    }
}

// Role Selection Logic
function setRole(role) {
    currentRole = role;
    updateRoleUI();
}

function updateRoleUI() {
    // Update registration buttons
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('border-indigo-600', 'bg-indigo-50/50');
        btn.classList.add('border-zinc-100', 'bg-zinc-50');
    });
    
    const activeRegBtn = document.getElementById(`role-${currentRole}`);
    if (activeRegBtn) {
        activeRegBtn.classList.remove('border-zinc-100', 'bg-zinc-50');
        activeRegBtn.classList.add('border-indigo-600', 'bg-indigo-50/50');
    }

    // Update login buttons
    document.querySelectorAll('.role-btn-login').forEach(btn => {
        btn.classList.remove('border-indigo-600', 'bg-indigo-50/50');
        btn.classList.add('border-zinc-100', 'bg-zinc-50');
    });

    const activeLoginBtn = document.getElementById(`role-login-${currentRole}`);
    if (activeLoginBtn) {
        activeLoginBtn.classList.remove('border-zinc-100', 'bg-zinc-50');
        activeLoginBtn.classList.add('border-indigo-600', 'bg-indigo-50/50');
    }

    // Show/Hide specific fields (only on register page)
    const bizFields = document.getElementById('business-fields');
    const helperFields = document.getElementById('helper-fields');

    if (bizFields) bizFields.classList.add('hidden');
    if (helperFields) helperFields.classList.add('hidden');

    if (currentRole === 'business' && bizFields) {
        bizFields.classList.remove('hidden');
    } else if (currentRole === 'helper' && helperFields) {
        helperFields.classList.remove('hidden');
    }
}

// Mock Data
const MOCK_JOBS = [
    { id: 1, title: 'Kitchen Helper', business: 'Spice Garden', location: 'Adyar', pay: '₹800/day', timing: '10 AM - 6 PM' },
    { id: 2, title: 'Delivery Partner', business: 'QuickBite', location: 'T. Nagar', pay: '₹600 + Petrol', timing: 'Flexible' },
    { id: 3, title: 'Store Assistant', business: 'Metro Mart', location: 'Velachery', pay: '₹15,000/month', timing: '9 AM - 9 PM' }
];

const MOCK_HELPERS = [
    { id: 1, name: 'Ramesh Kumar', exp: '5 Years', skill: 'Cooking', location: 'Guindy', avail: 'Immediate' },
    { id: 2, name: 'Suresh Raina', exp: '2 Years', skill: 'Driving', location: 'Mylapore', avail: 'Weekends' },
    { id: 3, name: 'Anitha S.', exp: '4 Years', skill: 'Housekeeping', location: 'Anna Nagar', avail: 'Full-time' }
];

// Form Handlers
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    
    // Use the currentRole set by the role buttons
    const userData = {
        name: 'John Doe',
        role: currentRole,
        phone: '+91 98765 43210',
        location: 'Chennai, TN'
    };
    
    showDashboard(userData);
}

function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        phone: document.getElementById('reg-phone').value,
        location: document.getElementById('reg-location').value,
        role: currentRole
    };

    // Collect role-specific data
    if (currentRole === 'business') {
        userData.details = {
            'Kind of Business': document.getElementById('reg-category').value,
            'Years Doing': document.getElementById('reg-years-biz').value,
            'Description': document.getElementById('reg-desc').value
        };
    } else if (currentRole === 'helper') {
        userData.details = {
            'Last Place of Work': document.getElementById('reg-last-work').value,
            'Years of Experience': document.getElementById('reg-exp').value,
            'Preferred Work': document.getElementById('reg-pref-work').value,
            'Timing': document.getElementById('reg-avail').value
        };
    }

    showDashboard(userData);
}

function showDashboard(user) {
    showPage('dashboard');
    
    setTimeout(() => {
        document.getElementById('dash-name').textContent = user.name;
        document.getElementById('dash-role').textContent = user.role;
        document.getElementById('dash-phone').textContent = user.phone;
        document.getElementById('dash-location').textContent = user.location;

        const detailsContainer = document.getElementById('dash-details');
        detailsContainer.innerHTML = '';

        if (user.details) {
            Object.entries(user.details).forEach(([key, value]) => {
                const div = document.createElement('div');
                div.className = 'space-y-1';
                div.innerHTML = `
                    <p class="text-xs font-bold text-zinc-400 uppercase tracking-wider">${key}</p>
                    <p class="text-zinc-700 font-medium">${value || 'Not specified'}</p>
                `;
                detailsContainer.appendChild(div);
            });
        } else {
            detailsContainer.innerHTML = '<p class="text-zinc-500 italic">No additional details provided.</p>';
        }

        // Render Role-Specific Content
        const roleContent = document.getElementById('role-content');
        roleContent.innerHTML = '';

        if (user.role === 'helper') {
            renderJobs(roleContent);
        } else if (user.role === 'business') {
            renderHelpers(roleContent);
        } else {
            roleContent.innerHTML = `
                <div class="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-center space-y-4">
                    <h3 class="text-xl font-bold text-indigo-900">Welcome to WorkBridge</h3>
                    <p class="text-indigo-700">You can browse jobs and helpers once you update your profile to a Helper or Business account.</p>
                </div>
            `;
        }
    }, 50);
}

function renderJobs(container) {
    container.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">Available Jobs</h3>
            <span class="text-sm text-zinc-500 font-medium">${MOCK_JOBS.length} jobs found</span>
        </div>
        <div class="grid grid-cols-1 gap-4">
            ${MOCK_JOBS.map(job => `
                <div class="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-indigo-300 transition-all group">
                    <div class="flex justify-between items-start">
                        <div class="space-y-1">
                            <h4 class="font-bold text-lg group-hover:text-indigo-600 transition-colors">${job.title}</h4>
                            <p class="text-sm text-zinc-500 font-medium">${job.business} • ${job.location}</p>
                        </div>
                        <span class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">${job.pay}</span>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <span class="text-xs text-zinc-400 font-medium">Timing: ${job.timing}</span>
                        <button class="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all">Apply Now</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderHelpers(container) {
    container.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">Available Helpers</h3>
            <span class="text-sm text-zinc-500 font-medium">${MOCK_HELPERS.length} helpers nearby</span>
        </div>
        <div class="grid grid-cols-1 gap-4">
            ${MOCK_HELPERS.map(helper => `
                <div class="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-emerald-300 transition-all group">
                    <div class="flex justify-between items-start">
                        <div class="flex gap-4">
                            <div class="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <div class="space-y-1">
                                <h4 class="font-bold text-lg group-hover:text-emerald-600 transition-colors">${helper.name}</h4>
                                <p class="text-sm text-zinc-500 font-medium">${helper.skill} • ${helper.exp} Exp</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">${helper.avail}</span>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <span class="text-xs text-zinc-400 font-medium">Location: ${helper.location}</span>
                        <button class="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all">Contact Helper</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function logoutUser() {
    // In a real app, we would clear session/tokens here
    showPage('home');
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
});
