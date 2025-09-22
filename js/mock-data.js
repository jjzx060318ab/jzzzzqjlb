/**
 * 荆州众志足球俱乐部管理终端 - 模拟数据
 * 提供模拟的申请表单数据和相关操作方法
 */

// 确保ApplicationManager对象存在
if (!window.ApplicationManager) {
    window.ApplicationManager = {};
}

// 模拟数据存储
const mockApplications = [];

// 生成唯一ID
function generateId() {
    return 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// 生成随机日期
function generateRandomDate(daysRange = 30) {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * daysRange) * -1;
    const randomDate = new Date(today);
    randomDate.setDate(today.getDate() + randomDays);
    return randomDate;
}

// 格式化日期为字符串
function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// 生成模拟申请数据
function generateMockApplications(count = 50) {
    const positions = ['前锋', '中场', '后卫', '守门员', '教练'];
    const statuses = ['pending', 'approved', 'rejected'];
    const firstNames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
    const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '强', '磊', '军', '洋'];
    
    // 清空现有数据
    mockApplications.length = 0;
    
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = firstName + lastName;
        const phone = '13' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
        const email = name.toLowerCase() + i + '@example.com';
        const position = positions[Math.floor(Math.random() * positions.length)];
        const experience = Math.floor(Math.random() * 10) + 1;
        const submittedAt = formatDate(generateRandomDate(60));
        
        // 随机生成状态，新创建的申请有80%概率是待处理状态
        let status = 'pending';
        let updatedAt = null;
        let notes = null;
        
        if (Math.random() < 0.4) {
            status = statuses[Math.floor(Math.random() * statuses.length)];
            if (status !== 'pending') {
                // 处理时间必须晚于提交时间
                const submittedDate = new Date(submittedAt);
                const updatedDate = new Date(submittedDate);
                updatedDate.setDate(submittedDate.getDate() + Math.floor(Math.random() * 3) + 1);
                updatedAt = formatDate(updatedDate);
                
                // 根据状态生成备注
                if (status === 'approved') {
                    notes = '申请已批准，请联系申请人安排后续事宜。';
                } else if (status === 'rejected') {
                    notes = '申请未通过，不符合当前招聘需求。';
                }
            }
        }
        
        const application = {
            id: generateId(),
            name: name,
            phone: phone,
            email: email,
            position: position,
            experience: experience,
            submittedAt: submittedAt,
            status: status,
            updatedAt: updatedAt,
            notes: notes
        };
        
        mockApplications.push(application);
    }
    
    // 按提交时间倒序排序
    mockApplications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    // 保存到localStorage
    saveApplicationsToStorage();
}

// 保存数据到localStorage
function saveApplicationsToStorage() {
    localStorage.setItem('joinClubApplications', JSON.stringify(mockApplications));
}

// 从localStorage加载数据
function loadApplicationsFromStorage() {
    const stored = localStorage.getItem('joinClubApplications');
    if (stored) {
        try {
            const applications = JSON.parse(stored);
            mockApplications.length = 0;
            applications.forEach(app => mockApplications.push(app));
            return true;
        } catch (e) {
            console.error('Failed to load applications from localStorage:', e);
            return false;
        }
    }
    return false;
}

// 创建默认管理员账户
function createDefaultAdmin() {
    // 注意：实际应用中应该使用加密存储密码
    const defaultAdmin = {
        username: 'admin',
        password: 'Admin123!', // 测试用密码，实际应用中应使用加密存储
        email: 'admin@jzzzzqjlb.fun',
        registerTime: new Date().toISOString()
    };
    
    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts')) || [];
    const hasDefaultAdmin = adminAccounts.some(admin => admin.username === 'admin');
    
    if (!hasDefaultAdmin) {
        adminAccounts.push(defaultAdmin);
        localStorage.setItem('adminAccounts', JSON.stringify(adminAccounts));
        console.log('已创建默认管理员账户');
    }
}

// ApplicationManager 方法
ApplicationManager.initialize = function() {
    // 尝试从localStorage加载数据
    const loaded = loadApplicationsFromStorage();
    
    // 如果没有数据，则生成模拟数据
    if (!loaded || mockApplications.length === 0) {
        generateMockApplications();
        console.log('已生成模拟申请数据');
    }
    
    // 确保有默认管理员账户
    createDefaultAdmin();
};

ApplicationManager.getAllApplications = function() {
    return [...mockApplications]; // 返回副本，避免直接修改原数据
};

ApplicationManager.getApplicationById = function(id) {
    return mockApplications.find(app => app.id === id);
};

ApplicationManager.getApplicationsByStatus = function(status) {
    return mockApplications.filter(app => app.status === status);
};

ApplicationManager.updateApplicationStatus = function(id, status, notes) {
    try {
        const applicationIndex = mockApplications.findIndex(app => app.id === id);
        
        if (applicationIndex === -1) {
            return { success: false, error: '未找到申请记录' };
        }
        
        mockApplications[applicationIndex].status = status;
        mockApplications[applicationIndex].updatedAt = formatDate(new Date());
        mockApplications[applicationIndex].notes = notes;
        
        // 重新排序
        mockApplications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        
        // 保存到localStorage
        saveApplicationsToStorage();
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

ApplicationManager.addApplication = function(applicationData) {
    try {
        const newApplication = {
            id: generateId(),
            name: applicationData.name,
            phone: applicationData.phone,
            email: applicationData.email,
            position: applicationData.position,
            experience: applicationData.experience,
            submittedAt: formatDate(new Date()),
            status: 'pending',
            updatedAt: null,
            notes: null
        };
        
        mockApplications.unshift(newApplication); // 添加到数组开头
        
        // 保存到localStorage
        saveApplicationsToStorage();
        
        return { success: true, application: newApplication };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

ApplicationManager.deleteApplication = function(id) {
    try {
        const applicationIndex = mockApplications.findIndex(app => app.id === id);
        
        if (applicationIndex === -1) {
            return { success: false, error: '未找到申请记录' };
        }
        
        mockApplications.splice(applicationIndex, 1);
        
        // 保存到localStorage
        saveApplicationsToStorage();
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

ApplicationManager.getApplicationsStats = function() {
    const total = mockApplications.length;
    const approved = mockApplications.filter(app => app.status === 'approved').length;
    const rejected = mockApplications.filter(app => app.status === 'rejected').length;
    const pending = mockApplications.filter(app => app.status === 'pending').length;
    
    return {
        total: total,
        approved: approved,
        rejected: rejected,
        pending: pending
    };
};

ApplicationManager.getStatusCounts = function(applications = null) {
    const apps = applications || mockApplications;
    
    const pending = apps.filter(app => app.status === 'pending').length;
    const approved = apps.filter(app => app.status === 'approved').length;
    const rejected = apps.filter(app => app.status === 'rejected').length;
    
    return {
        pending: pending,
        approved: approved,
        rejected: rejected
    };
};

ApplicationManager.getWeeklyTrends = function() {
    const today = new Date();
    const dates = [];
    const counts = [];
    
    // 生成近7天的日期
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.getMonth() + 1 + '/' + date.getDate());
        
        // 统计当天的申请数量
        const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
        const dayCount = mockApplications.filter(app => {
            const appDate = new Date(app.submittedAt);
            return appDate.toISOString().slice(0, 10) === dateStr;
        }).length;
        
        counts.push(dayCount);
    }
    
    return {
        dates: dates,
        counts: counts
    };
};

ApplicationManager.exportToCSV = function(applications = null) {
    try {
        const apps = applications || mockApplications;
        
        // CSV 头部
        const headers = ['申请编号', '姓名', '联系电话', '邮箱', '申请位置', '经验年限', '申请状态', '提交时间', '更新时间', '处理备注'];
        
        // 转换为CSV格式
        let csvContent = headers.join(',') + '\n';
        
        apps.forEach(app => {
            const row = [
                app.id,
                '"' + app.name + '"', // 添加引号以处理包含逗号的文本
                '"' + app.phone + '"',
                '"' + app.email + '"',
                '"' + app.position + '"',
                app.experience,
                app.status === 'pending' ? '待处理' : app.status === 'approved' ? '已批准' : '已拒绝',
                '"' + app.submittedAt + '"',
                app.updatedAt ? '"' + app.updatedAt + '"' : '',
                app.notes ? '"' + app.notes + '"' : ''
            ];
            
            csvContent += row.join(',') + '\n';
        });
        
        // 创建并下载CSV文件
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'applications_' + formatDate(new Date()).replace(/[:\s]/g, '-') + '.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 初始化数据
if (typeof window !== 'undefined') {
    // 确保在浏览器环境中运行时初始化数据
    document.addEventListener('DOMContentLoaded', function() {
        ApplicationManager.initialize();
    });
} else {
    // 非浏览器环境（如Node.js）也初始化数据
    ApplicationManager.initialize();
}

// 兼容旧的导入方式
try {
    // 尝试导出函数供其他页面使用（ES模块环境）
const initMockData = ApplicationManager.initialize;
// 移除导出声明，因为它不应放在 try-catch 块内，若需要导出应放在顶层
// 此代码已移到 try-catch 外部处理
    window.generateMockApplications = generateMockApplications;
} catch (e) {
    // 在非ES模块环境中忽略错误
    console.log('Running in non-ES module environment');
}