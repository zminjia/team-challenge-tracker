// ===================================
// Challenge Detail View
// ===================================

function renderChallengeDetail(challengeId) {
    const challenge = getChallenge(challengeId);

    if (!challenge) {
        return `
      <div class="empty-state">
        <h2>挑战不存在</h2>
        <button class="btn-primary mt-lg" onclick="navigateTo('home')">返回首页</button>
      </div>
    `;
    }

    const stats = getChallengeStats(challengeId);
    const currentUser = getCurrentUser();
    const isCreator = challenge.createdBy === currentUser.id;

    return `
    <div class="challenge-detail-view">
      <div class="mb-lg">
        <button class="btn-icon" onclick="navigateTo('home')" style="margin-bottom: var(--space-md);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
      </div>
      
      <!-- Challenge Header -->
      <div class="card mb-lg">
        ${challenge.imageUrl ? `<img src="${challenge.imageUrl}" alt="${sanitizeHTML(challenge.title)}" class="card-image" style="height: 300px;">` : ''}
        
        <div class="flex justify-between items-start mb-md">
          <div>
            <h1 class="mb-sm">${sanitizeHTML(challenge.title)}</h1>
            ${challenge.description ? `<p class="card-subtitle">${sanitizeHTML(challenge.description)}</p>` : ''}
          </div>
          <div class="badge ${getStatusBadgeClass(stats.overallProgress)}">
            ${stats.isCompleted ? '✓ 已完成' : stats.daysRemaining < 0 ? '已过期' : `进行中`}
          </div>
        </div>
        
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-lg); margin: var(--space-lg) 0;">
          <div>
            <div style="font-size: 0.875rem; color: var(--color-text-light); margin-bottom: var(--space-xs);">总进度</div>
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">${stats.overallProgress}%</div>
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--color-text-light); margin-bottom: var(--space-xs);">剩余天数</div>
            <div style="font-size: 2rem; font-weight: 700; color: ${stats.daysRemaining < 0 ? 'var(--color-error)' : 'var(--color-primary)'};">${stats.daysRemaining >= 0 ? stats.daysRemaining : 0}</div>
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--color-text-light); margin-bottom: var(--space-xs);">完成任务</div>
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">${stats.completedTasks}/${stats.totalTasks}</div>
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--color-text-light); margin-bottom: var(--space-xs);">成员数量</div>
            <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">${challenge.members.length}</div>
          </div>
        </div>
        
        <div class="flex gap-md mt-lg">
          <button class="btn-primary" onclick="navigateTo('checkin', '${challengeId}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            今日打卡
          </button>
          <button class="btn-secondary" onclick="navigateTo('stats', '${challengeId}')">
            数据统计
          </button>
          <button class="btn-secondary" onclick="shareChallenge('${challengeId}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            分享
          </button>
        </div>
      </div>
      
      <!-- Tasks List -->
      <div class="mb-lg">
        <h2 class="mb-md">挑战任务</h2>
        <div class="grid grid-2">
          ${challenge.tasks.map(task => renderTaskCard(task, challengeId)).join('')}
        </div>
      </div>
      
      <!-- Members List -->
      <div class="card">
        <h3 class="mb-md">参与成员 (${challenge.members.length})</h3>
        <div class="flex gap-md" style="flex-wrap: wrap;">
          ${challenge.members.map(member => `
            <div class="flex items-center gap-sm">
              <div class="avatar avatar-sm">${member.avatar}</div>
              <div>
                <div style="font-weight: 600;">${sanitizeHTML(member.name)}</div>
                ${member.isCreator ? '<div class="badge badge-primary" style="font-size: 0.625rem;">创建者</div>' : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderTaskCard(task, challengeId) {
    const percentage = calculatePercentage(task.completedQuantity, task.targetQuantity);
    const isCompleted = task.completedQuantity >= task.targetQuantity;

    return `
    <div class="card task-card">
      <div class="task-card-header">
        <div class="task-card-name">${sanitizeHTML(task.name)}</div>
        ${isCompleted ? '<div class="badge badge-success">已完成</div>' : ''}
      </div>
      
      <div class="task-card-stats mt-md">
        <div class="task-stat">
          <span class="task-stat-label">已完成</span>
          <span class="task-stat-value">${formatNumber(task.completedQuantity)} ${task.unit}</span>
        </div>
        <div class="task-stat">
          <span class="task-stat-label">目标</span>
          <span class="task-stat-value">${formatNumber(task.targetQuantity)} ${task.unit}</span>
        </div>
        <div class="task-stat">
          <span class="task-stat-label">剩余</span>
          <span class="task-stat-value">${formatNumber(Math.max(0, task.targetQuantity - task.completedQuantity))} ${task.unit}</span>
        </div>
      </div>
      
      <div class="mt-md">
        <div class="progress-info">
          <span class="progress-label">进度</span>
          <span class="progress-percent">${percentage}%</span>
        </div>
        <div class="progress">
          <div class="progress-bar ${isCompleted ? 'progress-bar-success' : ''}" style="width: ${Math.min(percentage, 100)}%"></div>
        </div>
      </div>
      
      ${task.logs.length > 0 ? `
        <div class="mt-md" style="font-size: 0.875rem; color: var(--color-text-light);">
          最近打卡：${formatDate(task.logs[task.logs.length - 1].date)}
        </div>
      ` : ''}
    </div>
  `;
}

function shareChallenge(challengeId) {
    const challenge = getChallenge(challengeId);
    if (!challenge) return;

    const shareText = `邀请码：${challenge.inviteCode}\n\n加入我的挑战"${challenge.title}"！`;

    copyToClipboard(`${shareText}\n\n在挑战追踪器中输入邀请码加入：${challenge.inviteCode}`);

    showToast(`邀请码 ${challenge.inviteCode} 已复制`, 'success');
}
