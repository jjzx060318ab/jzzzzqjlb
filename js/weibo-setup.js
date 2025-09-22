// 微博设置脚本

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 查找所有微博链接并设置点击事件
    const weiboLinks = document.querySelectorAll('a:has(i.fab.fa-weibo)');
    weiboLinks.forEach(link => {
        link.setAttribute('href', 'javascript:void(0);');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showWeiboPage();
        });
    });
});

// 显示微博页面
function showWeiboPage() {
    // 检查是否已存在微博模态框
    let weiboModal = document.getElementById('weiboModal');
    
    if (!weiboModal) {
        // 创建微博模态框
        weiboModal = document.createElement('div');
        weiboModal.id = 'weiboModal';
        weiboModal.className = 'modal fade';
        weiboModal.tabIndex = -1;
        weiboModal.setAttribute('role', 'dialog');
        weiboModal.setAttribute('aria-labelledby', 'weiboModalLabel');
        weiboModal.setAttribute('aria-hidden', 'true');
        
        weiboModal.innerHTML = `
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="weiboModalLabel">
                            <i class="fab fa-weibo" style="color: #e6162d;"></i> 荆州众志足球俱乐部微博
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="weibo-content">
                            <div class="weibo-intro mb-4">
                                <p>关注荆州众志足球俱乐部官方微博，获取最新赛事信息、球员动态和俱乐部活动！</p>
                            </div>
                            <div class="weibo-qr-code text-center mb-4">
                                <img src="images/Carousel_Placeholder.png" alt="微博二维码" class="img-fluid" style="max-width: 200px;">
                                <p class="mt-2">扫码关注官方微博</p>
                            </div>
                            <div class="weibo-features">
                                <h6>微博功能：</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-check-circle text-success"></i> 实时赛事播报</li>
                                    <li><i class="fas fa-check-circle text-success"></i> 球员独家采访</li>
                                    <li><i class="fas fa-check-circle text-success"></i> 训练花絮分享</li>
                                    <li><i class="fas fa-check-circle text-success"></i> 球迷互动活动</li>
                                    <li><i class="fas fa-check-circle text-success"></i> 俱乐部最新公告</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
                        <a href="https://weibo.com" target="_blank" class="btn btn-primary" style="background-color: #e6162d; border-color: #e6162d;">
                            前往微博官网
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(weiboModal);
        
        // 添加关闭事件监听
        const closeButton = weiboModal.querySelector('.close');
        const dismissButton = weiboModal.querySelector('[data-dismiss="modal"]');
        
        function closeModal() {
            weiboModal.classList.remove('show');
            setTimeout(() => {
                weiboModal.style.display = 'none';
            }, 300);
        }
        
        closeButton.addEventListener('click', closeModal);
        dismissButton.addEventListener('click', closeModal);
        
        // 点击模态框外部关闭
        weiboModal.addEventListener('click', function(e) {
            if (e.target === weiboModal) {
                closeModal();
            }
        });
    }
    
    // 显示模态框
    weiboModal.style.display = 'block';
    setTimeout(() => {
        weiboModal.classList.add('show');
    }, 10);
}

// 导出函数供其他脚本使用
window.showWeiboPage = showWeiboPage;