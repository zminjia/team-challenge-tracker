// ===================================
// Create Challenge View
// ===================================

function renderCreateChallenge() {
    return `
    <div class="create-challenge-view">
      <div class="mb-xl">
        <button class="btn-icon" onclick="navigateTo('home')" style="margin-bottom: var(--space-md);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1>创建新挑战</h1>
        <p>设置挑战目标，邀请好友一起完成</p>
      </div>
      
      <form id="create-challenge-form" onsubmit="handleCreateChallenge(event)">
        <div class="card" style="max-width: 800px;">
          <h3 class="mb-lg">基本信息</h3>
          
          <div class="form-group">
            <label class="form-label" for="challenge-title">挑战标题 *</label>
            <input type="text" id="challenge-title" class="form-input" placeholder="例如：30天阅读挑战" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="challenge-description">描述</label>
            <textarea id="challenge-description" class="form-textarea" placeholder="描述挑战的目标和规则..." rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">挑战图片（可选）</label>
            <div class="form-file-upload" id="image-upload-area">
              <input type="file" id="challenge-image" accept="image/*" onchange="handleImageUpload(event)">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto var(--space-md); opacity: 0.5;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p style="margin: 0; color: var(--color-text-light);">点击上传图片</p>
              <div id="image-preview" style="margin-top: var(--space-md); display: none;">
                <img id="preview-img" src="" alt="Preview" style="max-width: 100%; border-radius: var(--radius-md);">
              </div>
            </div>
          </div>
          
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: var(--space-md);">
            <div class="form-group">
              <label class="form-label" for="start-date">开始日期 *</label>
              <input type="date" id="start-date" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="end-date">结束日期 *</label>
              <input type="date" id="end-date" class="form-input" required>
            </div>
          </div>
        </div>
        
        <div class="card mt-lg" style="max-width: 800px;">
          <div class="flex justify-between items-center mb-lg">
            <h3 style="margin: 0;">挑战任务</h3>
            <button type="button" class="btn-secondary btn-sm" onclick="addTaskField()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              添加任务
            </button>
          </div>
          
          <div id="tasks-container">
            <!-- Task fields will be added here -->
          </div>
        </div>
        
        <div class="mt-xl" style="max-width: 800px;">
          <button type="submit" class="btn-primary btn-lg btn-full">创建挑战</button>
        </div>
      </form>
    </div>
  `;
}

let imageBase64 = '';

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    compressImage(file, 800, 0.8).then(base64 => {
        imageBase64 = base64;
        document.getElementById('image-preview').style.display = 'block';
        document.getElementById('preview-img').src = base64;
    }).catch(err => {
        console.error('Image upload error:', err);
        showToast('图片上传失败', 'error');
    });
}

let taskCount = 0;

function addTaskField() {
    taskCount++;
    const taskHTML = `
    <div class="task-field mb-md" id="task-${taskCount}" style="padding: var(--space-md); border: 2px solid var(--color-border); border-radius: var(--radius-md);">
      <div class="flex justify-between items-center mb-md">
        <strong>任务 ${taskCount}</strong>
        <button type="button" class="btn-icon" onclick="removeTaskField(${taskCount})" style="width: 32px; height: 32px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
      
      <div class="form-group">
        <label class="form-label">任务名称 *</label>
        <input type="text" class="form-input task-name" placeholder="例如：阅读页数" required>
      </div>
      
      <div class="grid" style="grid-template-columns: 2fr 1fr; gap: var(--space-md);">
        <div class="form-group">
          <label class="form-label">目标数量 *</label>
          <input type="number" class="form-input task-quantity" placeholder="例如：600" min="0" step="any" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">单位</label>
          <input type="text" class="form-input task-unit" placeholder="例如：页" maxlength="10">
        </div>
      </div>
    </div>
  `;

    document.getElementById('tasks-container').insertAdjacentHTML('beforeend', taskHTML);
}

function removeTaskField(id) {
    const field = document.getElementById(`task-${id}`);
    if (field) {
        field.remove();
    }
}

function handleCreateChallenge(event) {
    event.preventDefault();

    const title = document.getElementById('challenge-title').value.trim();
    const description = document.getElementById('challenge-description').value.trim();
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Validate dates
    if (new Date(endDate) <= new Date(startDate)) {
        showToast('结束日期必须晚于开始日期', 'error');
        return;
    }

    // Collect tasks
    const taskFields = document.querySelectorAll('.task-field');
    if (taskFields.length === 0) {
        showToast('请至少添加一个任务', 'error');
        return;
    }

    const tasks = [];
    taskFields.forEach(field => {
        const name = field.querySelector('.task-name').value.trim();
        const quantity = field.querySelector('.task-quantity').value;
        const unit = field.querySelector('.task-unit').value.trim();

        if (name && quantity) {
            tasks.push({ name, targetQuantity: quantity, unit });
        }
    });

    if (tasks.length === 0) {
        showToast('请完成任务信息', 'error');
        return;
    }

    // Create challenge
    const challengeData = {
        title,
        description,
        imageUrl: imageBase64,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        tasks
    };

    const challenge = saveChallenge(challengeData);

    showToast('挑战创建成功！', 'success');
    navigateTo('challenge', challenge.id);
}

// Initialize with one task field when view loads
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#/create') {
        setTimeout(() => addTaskField(), 100);
    }
});
