// ===================================
// Local Storage Data Layer
// ===================================

const STORAGE_KEYS = {
    CHALLENGES: 'challenges',
    CURRENT_USER: 'currentUser',
    SETTINGS: 'settings'
};

/**
 * Initialize current user if not exists
 */
function initCurrentUser() {
    let user = getItem(STORAGE_KEYS.CURRENT_USER);

    if (!user) {
        user = {
            id: generateUUID(),
            name: '我',
            avatar: '👤',
            createdAt: new Date().toISOString()
        };
        setItem(STORAGE_KEYS.CURRENT_USER, user);
    }

    return user;
}

/**
 * Get current user
 */
function getCurrentUser() {
    return getItem(STORAGE_KEYS.CURRENT_USER) || initCurrentUser();
}

/**
 * Update current user
 */
function updateCurrentUser(updates) {
    const user = getCurrentUser();
    const updated = { ...user, ...updates };
    setItem(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
}

/**
 * Get item from localStorage
 */
function getItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (err) {
        console.error(`Error getting ${key}:`, err);
        return null;
    }
}

/**
 * Set item in localStorage
 */
function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (err) {
        console.error(`Error setting ${key}:`, err);
        showToast('存储失败，请检查浏览器存储空间', 'error');
        return false;
    }
}

/**
 * Remove item from localStorage
 */
function removeItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (err) {
        console.error(`Error removing ${key}:`, err);
        return false;
    }
}

/**
 * Get all challenges
 */
function getChallenges() {
    const challenges = getItem(STORAGE_KEYS.CHALLENGES) || [];
    return challenges;
}

/**
 * Get challenge by ID
 */
function getChallenge(id) {
    const challenges = getChallenges();
    return challenges.find(c => c.id === id);
}

/**
 * Get challenge by invite code
 */
function getChallengeByInviteCode(code) {
    const challenges = getChallenges();
    return challenges.find(c => c.inviteCode === code);
}

/**
 * Save new challenge
 */
function saveChallenge(challengeData) {
    const challenges = getChallenges();
    const currentUser = getCurrentUser();

    const challenge = {
        id: generateUUID(),
        title: challengeData.title,
        description: challengeData.description || '',
        imageUrl: challengeData.imageUrl || '',
        startDate: challengeData.startDate,
        endDate: challengeData.endDate,
        inviteCode: generateInviteCode(),
        tasks: challengeData.tasks.map(task => ({
            id: generateUUID(),
            name: task.name,
            targetQuantity: parseFloat(task.targetQuantity),
            unit: task.unit || '',
            completedQuantity: 0,
            logs: []
        })),
        members: [{
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            joinedAt: new Date().toISOString(),
            isCreator: true
        }],
        createdBy: currentUser.id,
        createdAt: new Date().toISOString()
    };

    challenges.push(challenge);
    setItem(STORAGE_KEYS.CHALLENGES, challenges);

    return challenge;
}

/**
 * Update challenge
 */
function updateChallenge(id, updates) {
    const challenges = getChallenges();
    const index = challenges.findIndex(c => c.id === id);

    if (index === -1) return null;

    challenges[index] = { ...challenges[index], ...updates };
    setItem(STORAGE_KEYS.CHALLENGES, challenges);

    return challenges[index];
}

/**
 * Delete challenge
 */
function deleteChallenge(id) {
    const challenges = getChallenges();
    const filtered = challenges.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CHALLENGES, filtered);
    return true;
}

/**
 * Join challenge with invite code
 */
function joinChallenge(inviteCode, memberName, memberAvatar = '👤') {
    const challenges = getChallenges();
    const challenge = challenges.find(c => c.inviteCode === inviteCode);

    if (!challenge) {
        return { success: false, error: '邀请码无效' };
    }

    const currentUser = getCurrentUser();

    // Check if already a member
    if (challenge.members.some(m => m.id === currentUser.id)) {
        return { success: false, error: '您已加入该挑战' };
    }

    // Add new member
    challenge.members.push({
        id: currentUser.id,
        name: memberName || currentUser.name,
        avatar: memberAvatar || currentUser.avatar,
        joinedAt: new Date().toISOString(),
        isCreator: false
    });

    // Update user info if provided
    if (memberName || memberAvatar) {
        updateCurrentUser({
            name: memberName || currentUser.name,
            avatar: memberAvatar || currentUser.avatar
        });
    }

    setItem(STORAGE_KEYS.CHALLENGES, challenges);

    return { success: true, challenge };
}

/**
 * Get task by ID within a challenge
 */
function getTask(challengeId, taskId) {
    const challenge = getChallenge(challengeId);
    if (!challenge) return null;

    return challenge.tasks.find(t => t.id === taskId);
}

/**
 * Update task
 */
function updateTask(challengeId, taskId, updates) {
    const challenge = getChallenge(challengeId);
    if (!challenge) return null;

    const taskIndex = challenge.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    challenge.tasks[taskIndex] = { ...challenge.tasks[taskIndex], ...updates };
    updateChallenge(challengeId, challenge);

    return challenge.tasks[taskIndex];
}

/**
 * Add log to task
 */
function addTaskLog(challengeId, taskId, amount, date = null) {
    const challenge = getChallenge(challengeId);
    if (!challenge) return { success: false, error: '挑战不存在' };

    const task = challenge.tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: '任务不存在' };

    const currentUser = getCurrentUser();
    const logDate = date || new Date().toISOString();

    // Check if already logged today
    const today = new Date(logDate).toDateString();
    const existingLogIndex = task.logs.findIndex(log => {
        const logDateStr = new Date(log.date).toDateString();
        return logDateStr === today && log.userId === currentUser.id;
    });

    if (existingLogIndex !== -1) {
        // Update existing log
        task.logs[existingLogIndex].amount += parseFloat(amount);
    } else {
        // Add new log
        task.logs.push({
            id: generateUUID(),
            userId: currentUser.id,
            userName: currentUser.name,
            amount: parseFloat(amount),
            date: logDate,
            createdAt: new Date().toISOString()
        });
    }

    // Update completed quantity
    task.completedQuantity = task.logs.reduce((sum, log) => sum + log.amount, 0);

    updateChallenge(challengeId, challenge);

    return { success: true, task };
}

/**
 * Get user's challenges (created + joined)
 */
function getUserChallenges() {
    const challenges = getChallenges();
    const currentUser = getCurrentUser();

    return challenges.filter(challenge =>
        challenge.members.some(m => m.id === currentUser.id)
    );
}

/**
 * Get challenge statistics
 */
function getChallengeStats(challengeId) {
    const challenge = getChallenge(challengeId);
    if (!challenge) return null;

    const totalTasks = challenge.tasks.length;
    const completedTasks = challenge.tasks.filter(t =>
        t.completedQuantity >= t.targetQuantity
    ).length;

    const totalQuantity = challenge.tasks.reduce((sum, t) => sum + t.targetQuantity, 0);
    const completedQuantity = challenge.tasks.reduce((sum, t) => sum + t.completedQuantity, 0);

    const overallProgress = calculatePercentage(completedQuantity, totalQuantity);
    const daysRemaining = getDaysRemaining(challenge.endDate);

    return {
        totalTasks,
        completedTasks,
        totalQuantity,
        completedQuantity,
        overallProgress,
        daysRemaining,
        isCompleted: completedTasks === totalTasks,
        isActive: daysRemaining >= 0
    };
}

/**
 * Export all data
 */
function exportAllData() {
    const data = {
        challenges: getChallenges(),
        currentUser: getCurrentUser(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };

    const filename = `challenge-tracker-backup-${formatDateForInput(new Date())}.json`;
    exportToJSON(data, filename);
}

/**
 * Import data
 */
async function importData() {
    try {
        const data = await importFromJSON();

        if (!data.challenges || !Array.isArray(data.challenges)) {
            showToast('无效的备份文件', 'error');
            return false;
        }

        // Confirm before importing
        const confirm = window.confirm('导入数据将覆盖当前所有数据，确定继续吗？');
        if (!confirm) return false;

        setItem(STORAGE_KEYS.CHALLENGES, data.challenges);

        if (data.currentUser) {
            setItem(STORAGE_KEYS.CURRENT_USER, data.currentUser);
        }

        showToast('数据导入成功', 'success');
        return true;
    } catch (err) {
        console.error('Import error:', err);
        showToast('导入失败', 'error');
        return false;
    }
}

/**
 * Clear all data
 */
function clearAllData() {
    const confirm = window.confirm('确定要清除所有数据吗？此操作不可撤销！');
    if (!confirm) return false;

    removeItem(STORAGE_KEYS.CHALLENGES);
    removeItem(STORAGE_KEYS.CURRENT_USER);
    removeItem(STORAGE_KEYS.SETTINGS);

    showToast('数据已清除', 'success');
    return true;
}

// Initialize user on load
initCurrentUser();
