// ===================================
// Home View - Challenge List
// ===================================

function renderHome() {
    const challenges = getUserChallenges();
    const currentUser = getCurrentUser();

    let html = `
    <div class="home-view">
      <div class="home-header mb-xl">
        <h1>我的挑战</h1>
        <p class="mb-md">欢迎回来，${sanitizeHTML(currentUser.name)}！</p>
        <div class="flex gap-md">
          <button class="btn-primary" onclick="navigateTo('create')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            创建挑战
          </button>
          <button class="btn-secondary" onclick="showJoinChallengeModal()">
            加入挑战
          </button>
        </div>
      </div>
      
      ${challenges.length === 0 ? renderEmptyState() : renderChallengeGrid(challenges)}
    </div>
  `;

    return html;
}

function renderEmptyState() {
    return `
    <div class="empty-state">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h2 class="empty-state-title">还没有挑战</h2>
      <p class="empty-state-description">创建您的第一个挑战，或通过邀请码加入好友的挑战</p>
    </div>
  `;
}

function renderChallengeGrid(challenges) {
    const challengeCards = challenges.map(challenge => {
        const stats = getChallengeStats(challenge.id);
        const isCreator = challenge.createdBy === getCurrentUser().id;

        return `
      <div class="card challenge-card card-clickable" onclick="navigateTo('challenge', '${challenge.id}')">
        ${challenge.imageUrl ? `<img src="${challenge.imageUrl}" alt="${sanitizeHTML(challenge.title)}" class="challenge-card-image">` : ''}
        
        ${stats.isCompleted ? '<div class="challenge-card-badge">已完成</div>' :
                stats.daysRemaining < 0 ? '<div class="challenge-card-badge" style="background: var(--color-error);">已过期</div>' :
                    stats.daysRemaining <= 3 ? '<div class="challenge-card-badge" style="background: var(--color-warning);">即将结束</div>' : ''}
        
        <div class="card-body">
          <h3 class="card-title">${sanitizeHTML(challenge.title)}</h3>
          ${challenge.description ? `<p class="card-subtitle">${sanitizeHTML(challenge.description)}</p>` : ''}
          
          <div class="flex gap-md mt-md mb-md" style="font-size: 0.875rem; color: var(--color-text-light);">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; vertical-align: text-bottom; margin-right: 4px;">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              ${formatDate(challenge.startDate)} - ${formatDate(challenge.endDate)}
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; vertical-align: text-bottom; margin-right: 4px;">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              ${challenge.members.length} 人
            </div>
          </div>
          
          <div class="challenge-card-progress">
            <div class="progress-info">
              <span class="progress-label">${stats.completedTasks}/${stats.totalTasks} 任务完成</span>
              <span class="progress-percent">${stats.overallProgress}%</span>
            </div>
            <div class="progress">
              <div class="progress-bar ${stats.isCompleted ? 'progress-bar-success' : ''}" style="width: ${stats.overallProgress}%"></div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <span style="font-size: 0.875rem; color: var(--color-text-light);">
            ${isCreator ? '📝 我创建的' : '👥 已加入'}
          </span>
          <span style="font-size: 0.875rem; font-weight: 600; color: ${stats.daysRemaining < 0 ? 'var(--color-error)' : 'var(--color-primary)'};">
            ${stats.daysRemaining >= 0 ? `剩余 ${stats.daysRemaining} 天` : '已结束'}
          </span>
        </div>
      </div>
    `;
    }).join('');

    return `<div class="grid grid-2">${challengeCards}</div>`;
}

function showJoinChallengeModal() {
    const modalHTML = `
    <div class="modal-overlay" id="join-modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">加入挑战</h2>
          <button class="modal-close" onclick="closeJoinModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form id="join-form" onsubmit="handleJoinChallenge(event)">
            <div class="form-group">
              <label class="form-label" for="invite-code">邀请码</label>
              <input type="text" id="invite-code" class="form-input" placeholder="输入 6 位邀请码" maxlength="6" required style="text-transform: uppercase;">
              <div class="form-help">请输入好友分享的邀请码</div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="member-name">您的昵称</label>
              <input type="text" id="member-name" class="form-input" placeholder="输入您的昵称" value="${sanitizeHTML(getCurrentUser().name)}" required>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn-secondary" onclick="closeJoinModal()">取消</button>
              <button type="submit" class="btn-primary">加入挑战</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('invite-code').focus();
}

function closeJoinModal() {
    const modal = document.getElementById('join-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function handleJoinChallenge(event) {
    event.preventDefault();

    const inviteCode = document.getElementById('invite-code').value.toUpperCase().trim();
    const memberName = document.getElementById('member-name').value.trim();

    const result = joinChallenge(inviteCode, memberName);

    if (result.success) {
        showToast('成功加入挑战！', 'success');
        closeJoinModal();
        navigateTo('challenge', result.challenge.id);
    } else {
        showToast(result.error, 'error');
    }
}
