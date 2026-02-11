// ===================================
// Authentication System
// ===================================

const AUTH_STORAGE_KEY = 'auth_users';
const CURRENT_USER_ID_KEY = 'current_user_id';

/**
 * Hash password using SHA-256
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get all registered users
 */
function getAllUsers() {
    try {
        const users = localStorage.getItem(AUTH_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    } catch (err) {
        console.error('Error getting users:', err);
        return [];
    }
}

/**
 * Save users to storage
 */
function saveUsers(users) {
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
        return true;
    } catch (err) {
        console.error('Error saving users:', err);
        return false;
    }
}

/**
 * Get user by username
 */
function getUserByUsername(username) {
    const users = getAllUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

/**
 * Get user by ID
 */
function getUserById(userId) {
    const users = getAllUsers();
    return users.find(u => u.id === userId);
}

/**
 * Register new user
 */
async function register(username, password, displayName) {
    // Validate input
    if (!username || username.length < 3) {
        return { success: false, error: '用户名至少需要3个字符' };
    }

    if (!password || password.length < 6) {
        return { success: false, error: '密码至少需要6个字符' };
    }

    if (!displayName || displayName.trim().length === 0) {
        return { success: false, error: '请输入显示名称' };
    }

    // Check if username exists
    if (getUserByUsername(username)) {
        return { success: false, error: '用户名已存在' };
    }

    // Create user
    const users = getAllUsers();
    const passwordHash = await hashPassword(password);

    const newUser = {
        id: generateUUID(),
        username: username.toLowerCase(),
        passwordHash: passwordHash,
        name: displayName.trim(),
        avatar: '👤',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, user: newUser };
}

/**
 * Login user
 */
async function login(username, password) {
    const user = getUserByUsername(username);

    if (!user) {
        return { success: false, error: '用户名或密码错误' };
    }

    const passwordHash = await hashPassword(password);

    if (passwordHash !== user.passwordHash) {
        return { success: false, error: '用户名或密码错误' };
    }

    // Set current user
    localStorage.setItem(CURRENT_USER_ID_KEY, user.id);

    // Update currentUser in old storage system
    setItem(STORAGE_KEYS.CURRENT_USER, {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt
    });

    return { success: true, user };
}

/**
 * Logout current user
 */
function logout() {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
    return true;
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    const userId = localStorage.getItem(CURRENT_USER_ID_KEY);
    return userId !== null && getUserById(userId) !== undefined;
}

/**
 * Get current logged in user
 */
function getCurrentAuthUser() {
    const userId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (!userId) return null;

    return getUserById(userId);
}

/**
 * Update current user profile
 */
function updateUserProfile(updates) {
    const user = getCurrentAuthUser();
    if (!user) return { success: false, error: '未登录' };

    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex === -1) {
        return { success: false, error: '用户不存在' };
    }

    // Update user
    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        id: user.id,  // Prevent ID change
        username: user.username,  // Prevent username change
        passwordHash: user.passwordHash  // Prevent direct password hash change
    };

    saveUsers(users);

    // Update currentUser in old storage system
    updateCurrentUser({
        name: users[userIndex].name,
        avatar: users[userIndex].avatar
    });

    return { success: true, user: users[userIndex] };
}

/**
 * Change password
 */
async function changePassword(oldPassword, newPassword) {
    const user = getCurrentAuthUser();
    if (!user) return { success: false, error: '未登录' };

    // Verify old password
    const oldPasswordHash = await hashPassword(oldPassword);
    if (oldPasswordHash !== user.passwordHash) {
        return { success: false, error: '旧密码错误' };
    }

    if (!newPassword || newPassword.length < 6) {
        return { success: false, error: '新密码至少需要6个字符' };
    }

    // Update password
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex === -1) {
        return { success: false, error: '用户不存在' };
    }

    const newPasswordHash = await hashPassword(newPassword);
    users[userIndex].passwordHash = newPasswordHash;

    saveUsers(users);

    return { success: true };
}
