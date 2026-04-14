// State Management
let currentRole: string = 'normal';
let currentUser: User | null = null;

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    password?: string;
    role: string;
    details?: Record<string, string>;
}

// Page Navigation
function showPage(pageId: string, data?: any): void {
    const content = document.getElementById('app-content');
    const template = document.getElementById(`${pageId}-page`) as HTMLTemplateElement | null;
    
    if (template && content) {
        content.innerHTML = '';
        const clone = template.content.cloneNode(true) as DocumentFragment;
        content.appendChild(clone);
        
        // Post-render logic
        if (pageId === 'register') {
            currentRole = 'normal';
            updateRoleUI();
        } else if (pageId === 'dashboard' && data) {
            renderDashboard(data);
        }
    }
}

// Role Selection Logic
function setRole(role: string): void {
    currentRole = role;
    updateRoleUI();
}

function updateRoleUI(): void {
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('border-indigo-600', 'bg-indigo-50/50');
        btn.classList.add('border-zinc-100', 'bg-zinc-50');
    });
    
    const activeRegBtn = document.getElementById(`role-${currentRole}`);
    if (activeRegBtn) {
        activeRegBtn.classList.remove('border-zinc-100', 'bg-zinc-50');
        activeRegBtn.classList.add('border-indigo-600', 'bg-indigo-50/50');
    }

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
function handleLogin(event: Event): void {
    event.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;
    
    const users: User[] = JSON.parse(localStorage.getItem('wb_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        loginUser(user);
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function handleRegister(event: Event): void {
    event.preventDefault();
    
    const userData: User = {
        id: 'WB-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: (document.getElementById('reg-name') as HTMLInputElement).value,
        email: (document.getElementById('reg-email') as HTMLInputElement).value,
        phone: (document.getElementById('reg-phone') as HTMLInputElement).value,
        location: (document.getElementById('reg-location') as HTMLInputElement).value,
        password: (document.getElementById('reg-password') as HTMLInputElement).value,
        role: currentRole
    };

    if (currentRole === 'business') {
        userData.details = {
            'Kind of Business': (document.getElementById('reg-category') as HTMLInputElement).value,
            'Years Doing': (document.getElementById('reg-years-biz') as HTMLInputElement).value,
            'Description': (document.getElementById('reg-desc') as HTMLTextAreaElement).value
        };
    } else if (currentRole === 'helper') {
        userData.details = {
            'Last Place of Work': (document.getElementById('reg-last-work') as HTMLInputElement).value,
            'Years of Experience': (document.getElementById('reg-exp') as HTMLInputElement).value,
            'Preferred Work': (document.getElementById('reg-pref-work') as HTMLInputElement).value,
            'Timing': (document.getElementById('reg-avail') as HTMLInputElement).value
        };
    }

    const users: User[] = JSON.parse(localStorage.getItem('wb_users') || '[]');
    if (users.some(u => u.email === userData.email)) {
        alert('This email is already registered.');
        return;
    }
    users.push(userData);
    localStorage.setItem('wb_users', JSON.stringify(users));

    loginUser(userData);
}

function loginUser(user: User): void {
    currentUser = user;
    localStorage.setItem('wb_session', JSON.stringify(user));
    showPage('dashboard', user);
}

function logoutUser(): void {
    currentUser = null;
    localStorage.removeItem('wb_session');
    showPage('home');
}

function renderDashboard(user: User): void {
    const nameElem = document.getElementById('dash-name');
    const roleElem = document.getElementById('dash-role');
    const phoneElem = document.getElementById('dash-phone');
    const locElem = document.getElementById('dash-location');
    const idElem = document.getElementById('dash-id');
    const detailsContainer = document.getElementById('dash-details');

    if (nameElem) nameElem.textContent = user.name;
    if (roleElem) roleElem.textContent = user.role;
    if (phoneElem) phoneElem.textContent = user.phone;
    if (locElem) locElem.textContent = user.location;
    if (idElem) idElem.textContent = user.id;

    if (detailsContainer) {
        detailsContainer.innerHTML = '';

        if (user.details) {
            Object.entries(user.details).forEach(([key, value]) => {
                const div = document.createElement('div');
                div.className = 'p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1';
                div.innerHTML = `
                    <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">${key}</p>
                    <p class="text-zinc-900 font-semibold">${value || 'Not specified'}</p>
                `;
                detailsContainer.appendChild(div);
            });
        } else {
            detailsContainer.innerHTML = '<p class="text-zinc-500 italic col-span-2">No additional details provided.</p>';
        }
    }
}

// Attach functions to window for HTML access
(window as any).showPage = showPage;
(window as any).setRole = setRole;
(window as any).handleLogin = handleLogin;
(window as any).handleRegister = handleRegister;
(window as any).logoutUser = logoutUser;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('wb_session');
    if (session) {
        const user = JSON.parse(session);
        loginUser(user);
    } else {
        showPage('home');
    }
});
