/**
 * 荆州众志足球俱乐部管理终端脚本
 * 模块化设计，包含管理员认证、申请表单管理、工具函数和图表处理
 */

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保ApplicationManager可用
    if (typeof ApplicationManager === 'undefined') {
        console.error('ApplicationManager is not loaded!');
        
        // 如果ApplicationManager未加载，加载mock-data.js
        const script = document.createElement('script');
        script.src = 'js/mock-data.js';
        script.onload = function() {
            console.log('mock-data.js loaded successfully');
        };
        document.head.appendChild(script);
    } else {
        // 初始化ApplicationManager
        ApplicationManager.initialize();
    }
});

// 管理员认证模块
const AdminAuth = {
    // 验证管理员登录凭证
    authenticate(username, password) {
        try {
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            const admin = admins.find(a => a.username === username && a.password === password);
            
            if (admin) {
                // 更新最后登录时间
                admin.lastLoginTime = new Date().toISOString();
                localStorage.setItem('admins', JSON.stringify(admins));
                
                // 设置登录状态
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentAdmin', JSON.stringify({
                    id: admin.id,
                    username: admin.username,
                    email: admin.email
                }));
                
                return { success: true, admin };
            } else {
                return { success: false, error: '用户名或密码错误' };
            }
        } catch (error) {
            console.error('认证过程中出错:', error);
            return { success: false, error: '认证失败，请重试' };
        }
    },
    
    // 检查管理员是否已登录
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },
    
    // 获取当前登录的管理员信息
    getCurrentAdmin() {
        try {
            if (!this.isLoggedIn()) {
                return null;
            }
            
            const currentAdmin = localStorage.getItem('currentAdmin');
            return currentAdmin ? JSON.parse(currentAdmin) : null;
        } catch (error) {
            console.error('获取管理员信息时出错:', error);
            return null;
        }
    },
    
    // 登出管理员
    logout() {
        try {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentAdmin');
            
            // 跳转到登录页面
            window.location.href = 'admin-login.html';
        } catch (error) {
            console.error('登出过程中出错:', error);
        }
    },
    
    // 注册新管理员
    registerAdmin(adminData) {
        try {
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            
            // 检查用户名是否已存在
            if (admins.some(a => a.username === adminData.username)) {
                return { success: false, error: '用户名已存在' };
            }
            
            // 创建新管理员
            const newAdmin = {
                id: Date.now().toString(),
                username: adminData.username,
                password: adminData.password,
                email: adminData.email,
                createdAt: new Date().toISOString(),
                lastLoginTime: null
            };
            
            admins.push(newAdmin);
            localStorage.setItem('admins', JSON.stringify(admins));
            
            return { success: true, admin: newAdmin };
        } catch (error) {
            console.error('注册新管理员时出错:', error);
            return { success: false, error: '注册失败，请重试' };
        }
    },
    
    // 修改管理员密码
    changePassword(adminId, currentPassword, newPassword) {
        try {
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            const adminIndex = admins.findIndex(a => a.id === adminId);
            
            if (adminIndex === -1) {
                return { success: false, error: '管理员不存在' };
            }
            
            const admin = admins[adminIndex];
            
            // 验证当前密码
            if (admin.password !== currentPassword) {
                return { success: false, error: '当前密码错误' };
            }
            
            // 更新密码
            admin.password = newPassword;
            localStorage.setItem('admins', JSON.stringify(admins));
            
            return { success: true };
        } catch (error) {
            console.error('修改密码时出错:', error);
            return { success: false, error: '修改密码失败，请重试' };
        }
    },
    
    // 验证管理员访问权限
    verifyAccess() {
        if (!this.isLoggedIn()) {
            window.location.href = 'admin-login.html';
            return false;
        }
        return true;
    }
};


    


// 管理工具函数模块
const AdminUtils = {
    // 显示加载指示器
    showLoader(targetElement = document.body) {
        try {
            // 检查是否已存在加载指示器
            let loader = document.querySelector('.loading-indicator');
            
            if (!loader) {
                // 创建加载指示器
                loader = document.createElement('div');
                loader.className = 'loading-indicator';
                loader.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>加载中...</p>
                    </div>
                `;
                document.body.appendChild(loader);
            }
            
            // 设置目标元素样式
            if (targetElement !== document.body) {
                targetElement.style.position = 'relative';
                loader.style.position = 'absolute';
                loader.style.top = '0';
                loader.style.left = '0';
                loader.style.width = '100%';
                loader.style.height = '100%';
                loader.style.zIndex = '1000';
                
                // 添加到目标元素
                targetElement.appendChild(loader);
            } else {
                loader.style.position = 'fixed';
                loader.style.top = '0';
                loader.style.left = '0';
                loader.style.width = '100vw';
                loader.style.height = '100vh';
                loader.style.zIndex = '9999';
            }
            
            // 显示加载指示器
            loader.style.display = 'flex';
        } catch (error) {
            console.error('显示加载指示器时出错:', error);
        }
    },
    
    // 隐藏加载指示器
    hideLoader() {
        try {
            const loader = document.querySelector('.loading-indicator');
            if (loader) {
                loader.style.display = 'none';
                
                // 移除目标元素的相对定位
                const parent = loader.parentElement;
                if (parent && parent !== document.body) {
                    parent.style.position = '';
                    parent.removeChild(loader);
                }
            }
        } catch (error) {
            console.error('隐藏加载指示器时出错:', error);
        }
    },
    
    // 显示通知
    showNotification(message, type = 'info', duration = 3000) {
        try {
            // 检查是否已存在通知容器
            let notificationContainer = document.querySelector('.notification-container');
            
            if (!notificationContainer) {
                // 创建通知容器
                notificationContainer = document.createElement('div');
                notificationContainer.className = 'notification-container';
                document.body.appendChild(notificationContainer);
            }
            
            // 创建通知元素
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // 添加到容器
            notificationContainer.appendChild(notification);
            
            // 显示通知（触发动画）
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // 自动关闭通知
            setTimeout(() => {
                notification.classList.remove('show');
                
                // 等待动画完成后移除元素
                setTimeout(() => {
                    if (notificationContainer.contains(notification)) {
                        notificationContainer.removeChild(notification);
                    }
                }, 300);
            }, duration);
        } catch (error) {
            console.error('显示通知时出错:', error);
            // 如果通知系统失败，降级到console
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    },
    
    // 格式化日期时间
    formatDateTime(dateTime) {
        try {
            const date = new Date(dateTime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        } catch (error) {
            console.error('格式化日期时间时出错:', error);
            return dateTime;
        }
    },
    
    // 检查密码强度
    checkPasswordStrength(password) {
        let strength = 0;
        
        // 长度检查
        if (password.length >= 8) strength++;
        
        // 包含数字
        if (/\d/.test(password)) strength++;
        
        // 包含小写字母
        if (/[a-z]/.test(password)) strength++;
        
        // 包含大写字母
        if (/[A-Z]/.test(password)) strength++;
        
        // 包含特殊字符
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    },
    
    // 初始化管理页面
    initAdminPage() {
        try {
            // 验证访问权限
            if (!AdminAuth.verifyAccess()) {
                return;
            }
            
            // 获取当前管理员信息
            const currentAdmin = AdminAuth.getCurrentAdmin();
            if (currentAdmin) {
                // 更新界面上的管理员信息
                if (document.getElementById('admin-name')) {
                    document.getElementById('admin-name').textContent = currentAdmin.username;
                }
                
                if (document.getElementById('admin-email')) {
                    document.getElementById('admin-email').textContent = currentAdmin.email;
                }
                
                // 获取管理员详细信息
                const admins = JSON.parse(localStorage.getItem('admins')) || [];
                const adminDetails = admins.find(a => a.id === currentAdmin.id);
                
                if (adminDetails && document.getElementById('last-login')) {
                    document.getElementById('last-login').textContent = 
                        adminDetails.lastLoginTime ? 
                        AdminUtils.formatDateTime(adminDetails.lastLoginTime) : 
                        '首次登录';
                }
            }
            
            // 绑定退出登录按钮
            const logoutButton = document.getElementById('logout-btn');
            if (logoutButton) {
                logoutButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('确定要退出登录吗？')) {
                        AdminAuth.logout();
                    }
                });
            }
        } catch (error) {
            console.error('初始化管理页面时出错:', error);
            AdminUtils.showNotification('页面初始化失败，请刷新页面重试', 'error');
        }
    }
};

// 图表处理模块
const AdminCharts = {
    // 初始化申请状态分布图表
    initApplicationsChart(canvasId) {
        try {
            const ctx = document.getElementById(canvasId);
            if (!ctx || typeof Chart === 'undefined') {
                return null;
            }
            
            // 获取申请统计数据
            const stats = ApplicationManager.getApplicationStats();
            
            // 创建图表
            return new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['待处理', '已批准', '已拒绝'],
                    datasets: [{
                        data: [stats.pending, stats.approved, stats.rejected],
                        backgroundColor: [
                            'rgba(255, 193, 7, 0.7)',  // 黄色 - 待处理
                            'rgba(40, 167, 69, 0.7)',  // 绿色 - 已批准
                            'rgba(220, 53, 69, 0.7)'   // 红色 - 已拒绝
                        ],
                        borderColor: [
                            'rgba(255, 193, 7, 1)',
                            'rgba(40, 167, 69, 1)',
                            'rgba(220, 53, 69, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            });
        } catch (error) {
            console.error('初始化申请状态分布图表时出错:', error);
            return null;
        }
    },
    
    // 初始化申请趋势图表
    initTrendChart(canvasId) {
        try {
            const ctx = document.getElementById(canvasId);
            if (!ctx || typeof Chart === 'undefined') {
                return null;
            }
            
            // 获取所有申请数据
            const applications = ApplicationManager.getAllApplications();
            
            // 按日期统计申请数量
            const dateCounts = {};
            
            // 获取最近7天的日期
            const dates = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                dates.push(dateStr);
                dateCounts[dateStr] = 0;
            }
            
            // 统计每个日期的申请数量
            applications.forEach(app => {
                const appDate = new Date(app.submittedAt).toISOString().split('T')[0];
                if (dateCounts[appDate] !== undefined) {
                    dateCounts[appDate]++;
                }
            });
            
            // 准备图表数据
            const data = dates.map(date => dateCounts[date]);
            
            // 格式化日期显示
            const formattedDates = dates.map(date => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            });
            
            // 创建图表
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels: formattedDates,
                    datasets: [{
                        label: '申请数量',
                        data: data,
                        backgroundColor: 'rgba(0, 123, 255, 0.2)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `申请数量: ${context.raw}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                precision: 0
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        } catch (error) {
            console.error('初始化申请趋势图表时出错:', error);
            return null;
        }
    }
};

// 导出模块（兼容浏览器环境）
if (typeof window !== 'undefined') {
    window.AdminAuth = AdminAuth;
    window.ApplicationManager = ApplicationManager;
    window.AdminUtils = AdminUtils;
    window.AdminCharts = AdminCharts;
}