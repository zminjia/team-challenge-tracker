// ===================================
// Main Application Controller
// ===================================

let deferredPrompt;

// Initialize app
function initApp() {
    // Set initial date for create challenge form
    const today = formatDateForInput(new Date());
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Setup navigation
    setupNavigation();

    // Load initial route
    handleRoute();

    // Setup PWA install prompt
    setupPWAInstall();

    // Add task field when on create page
    if (window.location.hash === '#/create') {
        setTimeout(() => {
            if (document.getElementById('start-date')) {
                document.getElementById('start-date').value = today;
                document.getElementById('end-date').value = formatDateForInput(endDate);
            }
            addTaskField();
        }, 100);
    }
}

// Setup navigation
function setupNavigation() {
    // Home button
    const btnHome = document.getElementById('btn-home');
    if (btnHome) {
        btnHome.addEventListener('click', () => navigateTo('home'));
    }

    // Profile button
    const btnProfile = document.getElementById('btn-profile');
    if (btnProfile) {
        btnProfile.addEventListener('click', () => navigateTo('profile'));
    }

    // Handle browser back/forward
    window.addEventListener('hashchange', handleRoute);
}

// Router
function navigateTo(view, param = '') {
    const routes = {
        'home': '#/',
        'create': '#/create',
        'challenge': `#/challenge/${param}`,
        'checkin': `#/checkin/${param}`,
        'stats': `#/stats/${param}`,
        'profile': '#/profile'
    };

    window.location.hash = routes[view] || '#/';
}

function handleRoute() {
    const hash = window.location.hash || '#/';
    const mainContent = document.getElementById('main-content');

    if (!mainContent) return;

    // Parse route
    const parts = hash.substring(2).split('/');
    const view = parts[0] || 'home';
    const param = parts[1] || '';

    // Render appropriate view
    let content = '';

    switch (view) {
        case 'create':
            content = renderCreateChallenge();
            break;
        case 'challenge':
            content = renderChallengeDetail(param);
            break;
        case 'checkin':
            content = renderDailyCheckin(param);
            break;
        case 'stats':
            content = renderStatistics(param);
            break;
        case 'profile':
            content = renderProfile();
            break;
        case 'home':
        default:
            content = renderHome();
            break;
    }

    mainContent.innerHTML = content;

    // Scroll to top
    window.scrollTo(0, 0);

    // Initialize view-specific logic
    if (view === 'create') {
        setTimeout(() => {
            const today = formatDateForInput(new Date());
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);

            if (document.getElementById('start-date')) {
                document.getElementById('start-date').value = today;
                document.getElementById('end-date').value = formatDateForInput(endDate);
            }

            if (document.getElementById('tasks-container').children.length === 0) {
                addTaskField();
            }

            // Setup file upload click handler
            const uploadArea = document.getElementById('image-upload-area');
            if (uploadArea) {
                uploadArea.addEventListener('click', () => {
                    document.getElementById('challenge-image').click();
                });
            }
        }, 100);
    }
}

// PWA Install Prompt
function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Show install prompt
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.style.display = 'block';
        }
    });

    // Install button
    const btnInstall = document.getElementById('btn-install-app');
    if (btnInstall) {
        btnInstall.addEventListener('click', async () => {
            if (!deferredPrompt) return;

            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                showToast('应用安装成功！', 'success');
            }

            deferredPrompt = null;
            document.getElementById('install-prompt').style.display = 'none';
        });
    }

    // Dismiss button
    const btnDismiss = document.getElementById('btn-dismiss-install');
    if (btnDismiss) {
        btnDismiss.addEventListener('click', () => {
            document.getElementById('install-prompt').style.display = 'none';
        });
    }

    // Hide prompt if already installed
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        document.getElementById('install-prompt').style.display = 'none';
        showToast('应用已添加到主屏幕', 'success');
    });
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
