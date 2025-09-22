// 初始化默认管理员账户脚本
// 用于首次设置或重置管理员账户

function initDefaultAdmin() {
    // 检查是否已有管理员账户
    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts')) || [];
    
    if (adminAccounts.length === 0) {
        // 创建默认管理员账户
        const defaultAdmin = {
            username: 'admin',
            email: 'admin@jzzzzqjlb.fun',
            password: 'Admin123!', // 注意：实际部署时应修改此密码
            registerTime: new Date().toISOString(),
            lastLoginTime: null
        };
        
        // 保存到localStorage
        adminAccounts.push(defaultAdmin);
        localStorage.setItem('adminAccounts', JSON.stringify(adminAccounts));
        
        console.log('默认管理员账户已创建：\n用户名: admin\n密码: Admin123!\n请尽快修改密码以确保安全！');
        
        // 为了演示目的，添加一些示例申请数据
        addSampleApplications();
    } else {
        console.log('已有管理员账户存在，无需创建默认账户');
    }
}

function addSampleApplications() {
    const sampleApplications = [
        {
            id: '1001',
            name: '张三',
            phone: '13800138001',
            email: 'zhangsan@example.com',
            address: '荆州市荆州区',
            age: 25,
            position: '前锋',
            experience: '5年',
            reason: '热爱足球，希望加入俱乐部提升技能',
            submissionTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            id: '1002',
            name: '李四',
            phone: '13900139002',
            email: 'lisi@example.com',
            address: '荆州市沙市区',
            age: 28,
            position: '中场',
            experience: '8年',
            reason: '希望成为职业球员，为俱乐部争光',
            submissionTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'approved',
            processedBy: 'admin',
            processedTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '1003',
            name: '王五',
            phone: '13700137003',
            email: 'wangwu@example.com',
            address: '荆州市江陵县',
            age: 22,
            position: '后卫',
            experience: '3年',
            reason: '锻炼身体，结交志同道合的朋友',
            submissionTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'rejected',
            processedBy: 'admin',
            processedTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            processingNotes: '经验不足，建议先参加培训课程'
        }
    ];
    
    localStorage.setItem('joinClubApplications', JSON.stringify(sampleApplications));
    console.log('已添加示例申请数据');
}

// 当页面加载时执行初始化
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        // 仅在URL参数中包含init=true时执行初始化
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('init') === 'true') {
            initDefaultAdmin();
        }
    });
}