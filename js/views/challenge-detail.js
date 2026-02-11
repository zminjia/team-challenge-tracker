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
        
        <div class="flex gap-md mt-lg" style="flex-wrap: wrap;">
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
          ${isCreator ? `
            <button class="btn-secondary" onclick="showEditChallengeModal('${challengeId}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              编辑
            </button>
            <button class="btn-danger" onclick="confirmDeleteChallenge('${challengeId}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              删除
            </button>
          ` : ''}
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

// ===================================
// Edit Challenge
// ===================================

function showEditChallengeModal(challengeId) {
  const challenge = getChallenge(challengeId);
  if (!challenge) return;

  const currentUser = getCurrentUser();
  if (challenge.createdBy !== currentUser.id) {
    showToast('只有创建者可以编辑挑战', 'error');
    return;
  }

  const modalHTML = `
    <div class="modal-overlay" id="edit-challenge-modal">
      <div class="modal" style="max-width: 800px;">
        <div class="modal-header">
          <h2 class="modal-title">编辑挑战</h2>
          <button class="modal-close" onclick="closeEditChallengeModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form id="edit-challenge-form" onsubmit="handleEditChallenge(event, '${challengeId}')">
            <div class="form-group">
              <label class="form-label" for="edit-title">挑战标题 *</label>
              <input type="text" id="edit-title" class="form-input" value="${sanitizeHTML(challenge.title)}" required>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="edit-description">描述</label>
              <textarea id="edit-description" class="form-textarea" rows="3">${sanitizeHTML(challenge.description || '')}</textarea>
            </div>
            
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: var(--space-md);">
              <div class="form-group">
                <label class="form-label" for="edit-start-date">开始日期 *</label>
                <input type="date" id="edit-start-date" class="form-input" value="${formatDateForInput(challenge.startDate)}" required>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="edit-end-date">结束日期 *</label>
                <input type="date" id="edit-end-date" class="form-input" value="${formatDateForInput(challenge.endDate)}" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">任务列表</label>
              <div class="form-help" style="margin-bottom: var(--space-md);">
                ⚠️ 注意：修改任务可能影响已有打卡数据。建议仅修改任务名称或目标数量，不建议删除已有任务。
              </div>
              <div id="edit-tasks-container">
                ${challenge.tasks.map((task, index) => `
                  <div class="task-field mb-md" data-task-id="${task.id}" style="padding: var(--space-md); border: 2px solid var(--color-border); border-radius: var(--radius-md);">
                    <div class="flex justify-between items-center mb-md">
                      <strong>任务 ${index + 1}</strong>
                      ${task.logs.length === 0 ? `
                        <button type="button" class="btn-icon" onclick="removeEditTaskField('${task.id}')" style="width: 32px; height: 32px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      ` : `<span class="badge">已有打卡</span>`}
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">任务名称 *</label>
                      <input type="text" class="form-input edit-task-name" value="${sanitizeHTML(task.name)}" required>
                    </div>
                    
                    <div class="grid" style="grid-template-columns: 2fr 1fr; gap: var(--space-md);">
                      <div class="form-group">
                        <label class="form-label">目标数量 *</label>
                        <input type="number" class="form-input edit-task-quantity" value="${task.targetQuantity}" min="0" step="any" required>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">单位</label>
                        <input type="text" class="form-input edit-task-unit" value="${sanitizeHTML(task.unit)}" maxlength="10">
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
              <button type="button" class="btn-secondary btn-sm mt-md" onclick="addEditTaskField()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                添加新任务
              </button>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn-secondary" onclick="closeEditChallengeModal()">取消</button>
              <button type="submit" class="btn-primary">保存修改</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

let editTaskCounter = 1000;

function addEditTaskField() {
  editTaskCounter++;
  const taskHTML = `
    <div class="task-field mb-md" data-task-id="new-${editTaskCounter}" style="padding: var(--space-md); border: 2px solid var(--color-border); border-radius: var(--radius-md);">
      <div class="flex justify-between items-center mb-md">
        <strong>新任务</strong>
        <button type="button" class="btn-icon" onclick="removeEditTaskField('new-${editTaskCounter}')" style="width: 32px; height: 32px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
      
      <div class="form-group">
        <label class="form-label">任务名称 *</label>
        <input type="text" class="form-input edit-task-name" placeholder="例如：阅读页数" required>
      </div>
      
      <div class="grid" style="grid-template-columns: 2fr 1fr; gap: var(--space-md);">
        <div class="form-group">
          <label class="form-label">目标数量 *</label>
          <input type="number" class="form-input edit-task-quantity" placeholder="例如：600" min="0" step="any" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">单位</label>
          <input type="text" class="form-input edit-task-unit" placeholder="例如：页" maxlength="10">
        </div>
      </div>
    </div>
  `;

  document.getElementById('edit-tasks-container').insertAdjacentHTML('beforeend', taskHTML);
}

function removeEditTaskField(taskId) {
  const field = document.querySelector(`[data-task-id="${taskId}"]`);
  if (field) {
    field.remove();
  }
}

function closeEditChallengeModal() {
  const modal = document.getElementById('edit-challenge-modal');
  if (modal) {
    modal.remove();
  }
}

function handleEditChallenge(event, challengeId) {
  event.preventDefault();

  const title = document.getElementById('edit-title').value.trim();
  const description = document.getElementById('edit-description').value.trim();
  const startDate = document.getElementById('edit-start-date').value;
  const endDate = document.getElementById('edit-end-date').value;

  // Validate dates
  if (new Date(endDate) <= new Date(startDate)) {
    showToast('结束日期必须晚于开始日期', 'error');
    return;
  }

  // Collect tasks
  const taskFields = document.querySelectorAll('#edit-tasks-container .task-field');
  const tasks = [];

  taskFields.forEach(field => {
    const taskId = field.getAttribute('data-task-id');
    const name = field.querySelector('.edit-task-name').value.trim();
    const quantity = field.querySelector('.edit-task-quantity').value;
    const unit = field.querySelector('.edit-task-unit').value.trim();

    if (name && quantity) {
      if (taskId.startsWith('new-')) {
        // New task
        tasks.push({
          id: generateUUID(),
          name,
          targetQuantity: parseFloat(quantity),
          unit,
          completedQuantity: 0,
          logs: []
        });
      } else {
        // Existing task - preserve logs and completed quantity
        const challenge = getChallenge(challengeId);
        const existingTask = challenge.tasks.find(t => t.id === taskId);

        tasks.push({
          ...existingTask,
          name,
          targetQuantity: parseFloat(quantity),
          unit
        });
      }
    }
  });

  if (tasks.length === 0) {
    showToast('请至少保留一个任务', 'error');
    return;
  }

  // Update challenge
  const updates = {
    title,
    description,
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString(),
    tasks
  };

  const updated = updateChallenge(challengeId, updates);

  if (updated) {
    showToast('挑战更新成功！', 'success');
    closeEditChallengeModal();
    navigateTo('challenge', challengeId);
  } else {
    showToast('更新失败', 'error');
  }
}

// ===================================
// Delete Challenge
// ===================================

function confirmDeleteChallenge(challengeId) {
  const challenge = getChallenge(challengeId);
  if (!challenge) return;

  const currentUser = getCurrentUser();
  if (challenge.createdBy !== currentUser.id) {
    showToast('只有创建者可以删除挑战', 'error');
    return;
  }

  const modalHTML = `
    <div class="modal-overlay" id="delete-confirm-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">确认删除</h2>
          <button class="modal-close" onclick="closeDeleteConfirmModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div class="modal-body">
          <p style="margin-bottom: var(--space-lg);">
            确定要删除挑战 <strong>"${sanitizeHTML(challenge.title)}"</strong> 吗？
          </p>
          <p style="color: var(--color-error); margin-bottom: 0;">
            ⚠️ 此操作将永久删除该挑战及所有相关数据（任务、打卡记录等），且不可恢复！
          </p>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" onclick="closeDeleteConfirmModal()">取消</button>
          <button class="btn-danger" onclick="handleDeleteChallenge('${challengeId}')">确认删除</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeDeleteConfirmModal() {
  const modal = document.getElementById('delete-confirm-modal');
  if (modal) {
    modal.remove();
  }
}

function handleDeleteChallenge(challengeId) {
  const success = deleteChallenge(challengeId);

  if (success) {
    showToast('挑战已删除', 'success');
    closeDeleteConfirmModal();
    navigateTo('home');
  } else {
    showToast('删除失败', 'error');
  }
}
