// 荆州众志足球俱乐部官方网站 - 用户认证功能

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    checkUserLoginStatus();
});

// 检查用户登录状态
function checkUserLoginStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const loginNavItem = document.querySelector('a[href="login.html"]')?.parentElement;
    
    if (isLoggedIn && loginNavItem) {
        // 如果用户已登录，替换登录/注册链接为个人中心链接
        loginNavItem.innerHTML = '<a class="nav-link" href="user-profile.html"><i class="fas fa-user-circle"></i> 个人中心</a>';
    }
}

// 更新用户登录状态
function updateLoginStatus(isLoggedIn) {
    if (isLoggedIn) {
        localStorage.setItem('loggedIn', 'true');
    } else {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
    }
    
    // 重新加载页面以更新导航栏
    window.location.reload();
}

// 验证用户输入
function validateForm(formData, rules) {
    const errors = {};
    
    // 检查必填字段
    if (rules.requiredFields) {
        rules.requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                errors[field] = '此字段为必填项';
            }
        });
    }
    
    // 检查最小长度
    if (rules.minLength) {
        for (const field in rules.minLength) {
            if (formData[field] && formData[field].length < rules.minLength[field]) {
                errors[field] = `最少需要${rules.minLength[field]}个字符`;
            }
        }
    }
    
    // 检查邮箱格式
    if (rules.emailFields) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        rules.emailFields.forEach(field => {
            if (formData[field] && !emailRegex.test(formData[field])) {
                errors[field] = '请输入有效的邮箱地址';
            }
        });
    }
    
    // 检查密码匹配
    if (rules.matchFields) {
        for (const [field1, field2] of Object.entries(rules.matchFields)) {
            if (formData[field1] !== formData[field2]) {
                errors[field2] = '两次输入的内容不匹配';
            }
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// 显示错误消息
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        // 检查是否已有错误消息元素
        let errorElement = element.parentElement.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger mt-1 text-sm';
            element.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // 为输入元素添加错误样式
        element.classList.add('border-danger');
        
        // 清除错误消息
        element.addEventListener('input', function clearError() {
            if (errorElement) {
                errorElement.remove();
            }
            element.classList.remove('border-danger');
            element.removeEventListener('input', clearError);
        });
    }
}

// 保存用户设置
function saveUserSettings(settings) {
    try {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('保存用户设置失败:', e);
        return false;
    }
}

// 加载用户设置
function loadUserSettings() {
    try {
        const settings = localStorage.getItem('userSettings');
        return settings ? JSON.parse(settings) : {};
    } catch (e) {
        console.error('加载用户设置失败:', e);
        return {};
    }
}