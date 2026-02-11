// ===================================
// Register View
// ===================================

function renderRegister() {
    return `
    <div class="auth-view" style="min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center;">
      <div class="card" style="max-width: 450px; width: 100%;">
        <div style="text-align: center; margin-bottom: var(--space-xl);">
          <div style="font-size: 3rem; margin-bottom: var(--space-md);">🚀</div>
          <h1 style="margin-bottom: var(--space-sm);">创建账号</h1>
          <p style="color: var(--color-text-light);">加入挑战追踪器</p>
        </div>
        
        <form id="register-form" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label class="form-label" for="register-username">用户名 *</label>
            <input 
              type="text" 
              id="register-username" 
              class="form-input" 
              placeholder="选择一个唯一的用户名"
              autocomplete="username"
              minlength="3"
              required 
              autofocus
            >
            <div class="form-help">至少3个字符，仅字母、数字和下划线</div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="register-displayname">显示名称 *</label>
            <input 
              type="text" 
              id="register-displayname" 
              class="form-input" 
              placeholder="你的名字"
              required
            >
            <div class="form-help">其他用户看到的名称</div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="register-password">密码 *</label>
            <input 
              type="password" 
              id="register-password" 
              class="form-input" 
              placeholder="选择一个安全的密码"
              autocomplete="new-password"
              minlength="6"
              required
            >
            <div class="form-help">至少6个字符</div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="register-confirm-password">确认密码 *</label>
            <input 
              type="password" 
              id="register-confirm-password" 
              class="form-input" 
              placeholder="再次输入密码"
              autocomplete="new-password"
              minlength="6"
              required
            >
          </div>
          
          <button type="submit" class="btn-primary btn-full" style="margin-top: var(--space-lg);">
            创建账号
          </button>
        </form>
        
        <div style="text-align: center; margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid var(--color-border);">
          <p style="color: var(--color-text-light); margin-bottom: var(--space-sm);">已有账号？</p>
          <button class="btn-secondary" onclick="navigateTo('login')">
            立即登录
          </button>
        </div>
      </div>
    </div>
  `;
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value.trim();
    const displayName = document.getElementById('register-displayname').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showToast('用户名只能包含字母、数字和下划线', 'error');
        return;
    }

    // Check password match
    if (password !== confirmPassword) {
        showToast('两次输入的密码不一致', 'error');
        return;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '创建中...';
    submitBtn.disabled = true;

    try {
        const result = await register(username, password, displayName);

        if (result.success) {
            showToast('账号创建成功！正在登录...', 'success');

            // Auto login after registration
            const loginResult = await login(username, password);
            if (loginResult.success) {
                navigateTo('home');
            } else {
                showToast('请手动登录', 'warning');
                navigateTo('login');
            }
        } else {
            showToast(result.error, 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        console.error('Register error:', err);
        showToast('注册失败，请重试', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}
