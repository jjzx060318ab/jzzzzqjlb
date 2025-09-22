// 微信公众号设置脚本

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 查找所有页面中的微信公众号链接
    const wechatLinks = document.querySelectorAll('a.btn-outline-light.btn-sm i.fab.fa-weixin').forEach(icon => {
        const link = icon.parentElement;
        // 移除默认的href属性
        link.removeAttribute('href');
        // 添加点击事件
        link.addEventListener('click', showWechatQRCode);
    });
});

/**
 * 显示微信公众号二维码
 */
function showWechatQRCode() {
    // 检查是否已存在二维码弹窗
    let qrCodeModal = document.getElementById('wechatQRCodeModal');
    
    if (!qrCodeModal) {
        // 创建二维码弹窗
        qrCodeModal = createQRCodeModal();
        document.body.appendChild(qrCodeModal);
    }
    
    // 显示弹窗
    qrCodeModal.style.display = 'flex';
}

/**
 * 创建二维码弹窗元素
 */
function createQRCodeModal() {
    const modal = document.createElement('div');
    modal.id = 'wechatQRCodeModal';
    modal.className = 'modal fade show';
    modal.style = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        justify-content: center;
        align-items: center;
        z-index: 1050;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-dialog modal-sm';
    modalContent.style = 'max-width: 300px;';
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-content text-center p-4 bg-white rounded-lg shadow-lg';
    
    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'close position-absolute top-2 right-2';
    closeButton.style = 'background: none; border: none; font-size: 1.5rem; line-height: 1;';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };
    
    // 标题
    const title = document.createElement('h6');
    title.className = 'mb-4';
    title.textContent = '荆州众志足球俱乐部';
    
    // 二维码图片（使用占位符图片）
    const qrCodeContainer = document.createElement('div');
    qrCodeContainer.className = 'mb-4';
    qrCodeContainer.style = 'width: 200px; height: 200px; margin: 0 auto; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center;';
    
    const qrCodeImage = document.createElement('img');
    qrCodeImage.src = 'images/qrcode_for_gh_3ec4467a74a0_430.jpg'; // 使用现有占位图片
    qrCodeImage.alt = '微信公众号二维码';
    qrCodeImage.style = 'max-width: 100%; max-height: 100%;';
    
    qrCodeContainer.appendChild(qrCodeImage);
    
    // 提示文字
    const hintText = document.createElement('p');
    hintText.className = 'text-muted';
    hintText.textContent = '扫描二维码关注公众号';
    
    // 组装弹窗
    modalBody.appendChild(closeButton);
    modalBody.appendChild(title);
    modalBody.appendChild(qrCodeContainer);
    modalBody.appendChild(hintText);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
    // 点击弹窗外部关闭
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    return modal;
}

// 导出函数以便在其他脚本中使用
window.showWechatQRCode = showWechatQRCode;