// ===================================
// Daily Check-in View
// ===================================

function renderDailyCheckin(challengeId) {
    const challenge = getChallenge(challengeId);

    if (!challenge) {
        return `
      <div class="empty-state">
        <h2>挑战不存在</h2>
        <button class="btn-primary mt-lg" onclick="navigateTo('home')">返回首页</button>
      </div>
    `;
    }

    return `
    <div class="daily-checkin-view">
      <div class="mb-lg">
        <button class="btn-icon" onclick="navigateTo('challenge', '${challengeId}')" style="margin-bottom: var(--space-md);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1>今日打卡</h1>
        <p>${sanitizeHTML(challenge.title)}</p>
      </div>
      
      <form id="checkin-form" onsubmit="handleCheckin(event, '${challengeId}')">
        <div class="card" style="max-width: 600px;">
          <h3 class="mb-lg">记录完成量</h3>
          
          <div class="form-group">
            <label class="form-label" for="task-select">选择任务 *</label>
            <select id="task-select" class="form-select" required onchange="updateQuickButtons()">
              <option value="">请选择任务...</option>
              ${challenge.tasks.map(task => `
                <option value="${task.id}" data-unit="${task.unit}">
                  ${sanitizeHTML(task.name)} (${formatNumber(task.completedQuantity)}/${formatNumber(task.targetQuantity)} ${task.unit})
                </option>
              `).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="amount-input">完成数量 *</label>
            <div class="flex gap-sm items-center">
              <input type="number" id="amount-input" class="form-input" placeholder="输入完成数量" min="0" step="any" required style="flex: 1;">
              <span id="unit-display" style="font-weight: 600; min-width: 40px;"></span>
            </div>
            <div class="form-help">可输入小数，例如：20.5</div>
          </div>
          
          <div class="flex gap-sm mb-md" id="quick-buttons">
            <!-- Quick buttons will be added here -->
          </div>
          
          <div class="form-group">
            <label class="form-label" for="checkin-date">打卡日期</label>
            <input type="date" id="checkin-date" class="form-input" value="${formatDateForInput(new Date())}">
            <div class="form-help">默认为今天，可选择其他日期补卡</div>
          </div>
          
          <button type="submit" class="btn-primary btn-lg btn-full mt-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            提交打卡
          </button>
        </div>
      </form>
      
      <!-- Recent Logs -->
      <div class="card mt-lg" style="max-width: 600px;" id="recent-logs">
        <h3 class="mb-md">最近打卡记录</h3>
        <div id="logs-list">
          <!-- Logs will be loaded here -->
        </div>
      </div>
    </div>
  `;
}

function updateQuickButtons() {
    const select = document.getElementById('task-select');
    const selectedOption = select.options[select.selectedIndex];
    const unit = selectedOption ? selectedOption.getAttribute('data-unit') : '';

    document.getElementById('unit-display').textContent = unit;

    const quickButtonsContainer = document.getElementById('quick-buttons');

    if (select.value) {
        quickButtonsContainer.innerHTML = `
      <button type="button" class="btn-secondary btn-sm" onclick="addQuickAmount(1)">+1</button>
      <button type="button" class="btn-secondary btn-sm" onclick="addQuickAmount(5)">+5</button>
      <button type="button" class="btn-secondary btn-sm" onclick="addQuickAmount(10)">+10</button>
      <button type="button" class="btn-secondary btn-sm" onclick="clearAmount()">清空</button>
    `;
    } else {
        quickButtonsContainer.innerHTML = '';
    }

    loadRecentLogs();
}

function addQuickAmount(amount) {
    const input = document.getElementById('amount-input');
    const currentValue = parseFloat(input.value) || 0;
    input.value = currentValue + amount;
}

function clearAmount() {
    document.getElementById('amount-input').value = '';
}

function loadRecentLogs() {
    const select = document.getElementById('task-select');
    if (!select.value) {
        document.getElementById('logs-list').innerHTML = '<p style="color: var(--color-text-light); text-align: center;">选择任务后查看打卡记录</p>';
        return;
    }

    const challengeId = window.location.hash.split('/')[2];
    const challenge = getChallenge(challengeId);
    const task = challenge.tasks.find(t => t.id === select.value);

    if (!task || task.logs.length === 0) {
        document.getElementById('logs-list').innerHTML = '<p style="color: var(--color-text-light); text-align: center;">暂无打卡记录</p>';
        return;
    }

    const recentLogs = task.logs.slice(-5).reverse();

    const logsHTML = recentLogs.map(log => `
    <div style="display: flex; justify-content: space-between; padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-border);">
      <div>
        <div style="font-weight: 600;">${formatDate(log.date)}</div>
        <div style="font-size: 0.875rem; color: var(--color-text-light);">${sanitizeHTML(log.userName)}</div>
      </div>
      <div style="font-weight: 700; color: var(--color-primary); font-size: 1.125rem;">
        +${formatNumber(log.amount)} ${task.unit}
      </div>
    </div>
  `).join('');

    document.getElementById('logs-list').innerHTML = logsHTML;
}

function handleCheckin(event, challengeId) {
    event.preventDefault();

    const taskId = document.getElementById('task-select').value;
    const amount = parseFloat(document.getElementById('amount-input').value);
    const date = document.getElementById('checkin-date').value;

    if (!taskId || !amount || amount <= 0) {
        showToast('请完整填写打卡信息', 'error');
        return;
    }

    const result = addTaskLog(challengeId, taskId, amount, new Date(date).toISOString());

    if (result.success) {
        showToast(`打卡成功！+${amount}`, 'success');

        // Reset form
        document.getElementById('amount-input').value = '';

        // Reload logs
        loadRecentLogs();

        // Optionally navigate back after a delay
        setTimeout(() => {
            navigateTo('challenge', challengeId);
        }, 1500);
    } else {
        showToast(result.error, 'error');
    }
}
