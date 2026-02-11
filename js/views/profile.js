// ===================================
// Profile View
// ===================================

function renderProfile() {
    const currentUser = getCurrentUser();
    const challenges = getUserChallenges();

    // Calculate user statistics
    const totalChallenges = challenges.length;
    const completedChallenges = challenges.filter(c => {
        const stats = getChallengeStats(c.id);
        return stats.isCompleted;
    }).length;

    let totalLogs = 0;
    challenges.forEach(challenge => {
        challenge.tasks.forEach(task => {
            totalLogs += task.logs.filter(log => log.userId === currentUser.id).length;
        });
    });

    return `
    <div class="profile-view">
      <div class="mb-xl">
        <button class="btn-icon" onclick="navigateTo('home')" style="margin-bottom: var(--space-md);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1>个人资料</h1>
      </div>
      
      <!-- User Info -->
      <div class="card mb-lg" style="max-width: 600px;">
        <div class="flex items-center gap-lg mb-lg">
          <div class="avatar avatar-lg">${currentUser.avatar}</div>
          <div style="flex: 1;">
            <h2 style="margin-bottom: var(--space-xs);">${sanitizeHTML(currentUser.name)}</h2>
            <p style="color: var(--color-text-light); margin: 0; font-size: 0.875rem;">
              加入于 ${formatDate(currentUser.createdAt)}
            </p>
          </div>
          <button class="btn-secondary btn-sm" onclick="showEditProfileModal()">编辑</button>
        </div>
        
        <div class="grid grid-3 mt-lg">
          <div style="text-align: center; padding: var(--space-md); background: var(--color-background); border-radius: var(--radius-md);">
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">${totalChallenges}</div>
            <div style="font-size: 0.875rem; color: var(--color-text-light); margin-top: var(--space-xs);">参与挑战</div>
          </div>
          <div style="text-align: center; padding: var(--space-md); background: var(--color-background); border-radius: var(--radius-md);">
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">${completedChallenges}</div>
            <div style="font-size: 0.875rem; color: var(--color-text-light); margin-top: var(--space-xs);">已完成</div>
          </div>
          <div style="text-align: center; padding: var(--space-md); background: var(--color-background); border-radius: var(--radius-md);">
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">${totalLogs}</div>
            <div style="font-size: 0.875rem; color: var(--color-text-light); margin-top: var(--space-xs);">打卡次数</div>
          </div>
        </div>
      </div>
      
      <!-- Settings & Data -->
      <div class="card" style="max-width: 600px;">
        <h3 class="mb-lg">数据管理</h3>
        
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          <button class="btn-secondary btn-full" onclick="exportAllData()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            导出所有数据
          </button>
          
          <button class="btn-secondary btn-full" onclick="handleImportData()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            导入数据
          </button>
          
          <button class="btn-danger btn-full" onclick="handleClearData()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            清除所有数据
          </button>
        </div>
      </div>
    </div>
  `;
}

function showEditProfileModal() {
    const currentUser = getCurrentUser();

    const modalHTML = `
    <div class="modal-overlay" id="edit-profile-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">编辑资料</h2>
          <button class="modal-close" onclick="closeEditProfileModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form id="edit-profile-form" onsubmit="handleEditProfile(event)">
            <div class="form-group">
              <label class="form-label" for="profile-name">昵称</label>
              <input type="text" id="profile-name" class="form-input" value="${sanitizeHTML(currentUser.name)}" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">选择头像</label>
              <div class="flex gap-sm" style="flex-wrap: wrap;">
                ${['👤', '😀', '😎', '🚀', '💪', '🎯', '⭐', '🔥', '💡', '🏆'].map(emoji => `
                  <button type="button" class="avatar ${currentUser.avatar === emoji ? 'badge-primary' : ''}" 
                          onclick="selectAvatar('${emoji}')" 
                          style="cursor: pointer; ${currentUser.avatar === emoji ? 'outline: 3px solid var(--color-primary);' : ''}">
                    ${emoji}
                  </button>
                `).join('')}
              </div>
              <input type="hidden" id="profile-avatar" value="${currentUser.avatar}">
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn-secondary" onclick="closeEditProfileModal()">取消</button>
              <button type="submit" class="btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.remove();
    }
}

function selectAvatar(emoji) {
    document.getElementById('profile-avatar').value = emoji;

    // Update visual selection
    document.querySelectorAll('#edit-profile-modal .avatar').forEach(btn => {
        if (btn.textContent.trim() === emoji) {
            btn.classList.add('badge-primary');
            btn.style.outline = '3px solid var(--color-primary)';
        } else {
            btn.classList.remove('badge-primary');
            btn.style.outline = 'none';
        }
    });
}

function handleEditProfile(event) {
    event.preventDefault();

    const name = document.getElementById('profile-name').value.trim();
    const avatar = document.getElementById('profile-avatar').value;

    updateCurrentUser({ name, avatar });

    showToast('资料更新成功', 'success');
    closeEditProfileModal();

    // Refresh view
    navigateTo('profile');
}

function handleImportData() {
    importData().then(success => {
        if (success) {
            navigateTo('home');
        }
    });
}

function handleClearData() {
    if (clearAllData()) {
        navigateTo('home');
    }
}
