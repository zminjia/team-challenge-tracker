// ===================================
// Login View
// ===================================

function renderLogin() {
    return `
    <div class="auth-view" style="min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center;">
      <div class="card" style="max-width: 450px; width: 100%;">
        <div style="text-align: center; margin-bottom: var(--space-xl);">
          <div style="font-size: 3rem; margin-bottom: var(--space-md);">🏆</div>
          <h1 style="margin-bottom: var(--space-sm);">欢迎回来</h1>
          <p style="color: var(--color-text-light);">登录到挑战追踪器</p>
        </div>
        
        <form id="login-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label" for="login-username">用户名</label>
            <input 
              type="text" 
              id="login-username" 
              class="form-input" 
              placeholder="输入你的用户名"
              autocomplete="username"
              required 
              autofocus
            >
          </div>
          
          <div class="form-group">
            <label class="form-label" for="login-password">密码</label>
            <input 
              type="password" 
              id="login-password" 
              class="form-input" 
              placeholder="输入你的密码"
              autocomplete="current-password"
              required
            >
          </div>
          
          <button type="submit" class="btn-primary btn-full" style="margin-top: var(--space-lg);">
            登录
          </button>
        </form>
        
        <div style="text-align: center; margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid var(--color-border);">
          <p style="color: var(--color-text-light); margin-bottom: var(--space-sm);">还没有账号？</p>
          <button class="btn-secondary" onclick="navigateTo('register')">
            创建新账号
          </button>
        </div>
      </div>
    </div>
  `;
}

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showToast('请填写用户名和密码', 'error');
        return;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '登录中...';
    submitBtn.disabled = true;

    try {
        const result = await login(username, password);

        if (result.success) {
            showToast(`欢迎回来，${result.user.name}！`, 'success');
            navigateTo('home');
        } else {
            showToast(result.error, 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        console.error('Login error:', err);
        showToast('登录失败，请重试', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}
