// ===================================
// Statistics View
// ===================================

function renderStatistics(challengeId) {
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

    return `
    <div class="statistics-view">
      <div class="mb-lg">
        <button class="btn-icon" onclick="navigateTo('challenge', '${challengeId}')" style="margin-bottom: var(--space-md);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1>数据统计</h1>
        <p>${sanitizeHTML(challenge.title)}</p>
      </div>
      
      <!-- Overall Progress -->
      <div class="card mb-lg">
        <h3 class="mb-lg">总体进度</h3>
        <div class="flex items-center justify-center" style="flex-direction: column; padding: var(--space-xl) 0;">
          ${renderProgressCircle(stats.overallProgress)}
          <div class="mt-lg text-center">
            <div style="font-size: 1.125rem; color: var(--color-text-light); margin-bottom: var(--space-xs);">整体完成度</div>
            <div style="font-size: 3rem; font-weight: 700; color: var(--color-primary);">${stats.overallProgress}%</div>
            <div style="font-size: 1rem; color: var(--color-text-light); margin-top: var(--space-sm);">
              已完成 ${formatNumber(stats.completedQuantity)} / ${formatNumber(stats.totalQuantity)}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Task Breakdown -->
      <div class="card mb-lg">
        <div class="flex justify-between items-center mb-lg">
          <h3 style="margin: 0;">任务详情</h3>
          <button class="btn-secondary btn-sm" onclick="exportChallengeData('${challengeId}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            导出数据
          </button>
        </div>
        
        <div class="grid" style="gap: var(--space-lg);">
          ${challenge.tasks.map(task => renderTaskStatistics(task)).join('')}
        </div>
      </div>
      
      <!-- Member Contributions -->
      <div class="card">
        <h3 class="mb-lg">成员贡献</h3>
        ${renderMemberContributions(challenge)}
      </div>
    </div>
  `;
}

function renderProgressCircle(percentage) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return `
    <svg width="200" height="200" style="transform: rotate(-90deg);">
      <!-- Background circle -->
      <circle
        cx="100"
        cy="100"
        r="${radius}"
        fill="none"
        stroke="var(--color-border)"
        stroke-width="16"
      />
      <!-- Progress circle -->
      <circle
        cx="100"
        cy="100"
        r="${radius}"
        fill="none"
        stroke="var(--color-primary)"
        stroke-width="16"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}"
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.5s ease;"
      />
    </svg>
  `;
}

function renderTaskStatistics(task) {
    const percentage = calculatePercentage(task.completedQuantity, task.targetQuantity);
    const remaining = Math.max(0, task.targetQuantity - task.completedQuantity);

    return `
    <div style="padding: var(--space-lg); border: 2px solid var(--color-border); border-radius: var(--radius-md);">
      <div class="flex justify-between items-start mb-md">
        <h4 style="margin: 0;">${sanitizeHTML(task.name)}</h4>
        <div class="badge ${getStatusBadgeClass(percentage)}">${percentage}%</div>
      </div>
      
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-bottom: var(--space-md);">
        <div>
          <div style="font-size: 0.75rem; color: var(--color-text-light); margin-bottom: var(--space-xs);">已完成</div>
          <div style="font-size: 1.25rem; font-weight: 700;">${formatNumber(task.completedQuantity)}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; color: var(--color-text-light); margin-bottom: var(--space-xs);">目标</div>
          <div style="font-size: 1.25rem; font-weight: 700;">${formatNumber(task.targetQuantity)}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; color: var(--color-text-light); margin-bottom: var(--space-xs);">剩余</div>
          <div style="font-size: 1.25rem; font-weight: 700;">${formatNumber(remaining)}</div>
        </div>
      </div>
      
      <div class="progress">
        <div class="progress-bar ${percentage === 100 ? 'progress-bar-success' : ''}" style="width: ${Math.min(percentage, 100)}%"></div>
      </div>
      
      ${task.logs.length > 0 ? `
        <div style="margin-top: var(--space-md); font-size: 0.875rem; color: var(--color-text-light);">
          共 ${task.logs.length} 次打卡记录
        </div>
      ` : `
        <div style="margin-top: var(--space-md); font-size: 0.875rem; color: var(--color-text-light);">
          暂无打卡记录
        </div>
      `}
    </div>
  `;
}

function renderMemberContributions(challenge) {
    const currentUser = getCurrentUser();

    // Calculate contributions per member
    const contributions = challenge.members.map(member => {
        let totalAmount = 0;
        let logCount = 0;

        challenge.tasks.forEach(task => {
            task.logs.forEach(log => {
                if (log.userId === member.id) {
                    totalAmount += log.amount;
                    logCount++;
                }
            });
        });

        return {
            ...member,
            totalAmount,
            logCount
        };
    });

    // Sort by total amount descending
    contributions.sort((a, b) => b.totalAmount - a.totalAmount);

    if (contributions.every(c => c.logCount === 0)) {
        return '<p style="color: var(--color-text-light); text-align: center;">暂无打卡数据</p>';
    }

    return contributions.map((member, index) => `
    <div style="display: flex; align-items: center; padding: var(--space-md) 0; border-bottom: 1px solid var(--color-border);">
      <div style="font-size: 1.5rem; font-weight: 700; color: ${index === 0 ? 'var(--color-cta)' : 'var(--color-text-light)'}; width: 40px; text-align: center;">
        ${index + 1}
      </div>
      <div class="avatar avatar-sm" style="margin: 0 var(--space-md);">${member.avatar}</div>
      <div style="flex: 1;">
        <div style="font-weight: 600;">${sanitizeHTML(member.name)} ${member.id === currentUser.id ? '(我)' : ''}</div>
        <div style="font-size: 0.875rem; color: var(--color-text-light);">${member.logCount} 次打卡</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary);">${formatNumber(member.totalAmount)}</div>
        <div style="font-size: 0.75rem; color: var(--color-text-light);">总完成量</div>
      </div>
    </div>
  `).join('');
}

function exportChallengeData(challengeId) {
    const challenge = getChallenge(challengeId);
    if (!challenge) return;

    const filename = `${challenge.title.replace(/\s+/g, '-')}-${formatDateForInput(new Date())}.json`;
    exportToJSON(challenge, filename);

    showToast('数据导出成功', 'success');
}
