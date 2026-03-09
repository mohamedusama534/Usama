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

// Form Handlers
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    
    // Mock user data for login
    const userData = {
        name: 'John Doe',
        role: 'normal',
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
    
    // We need a small timeout because showPage is async-like (DOM injection)
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
    }, 50);
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
});
