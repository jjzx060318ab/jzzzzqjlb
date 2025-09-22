// 荆州众志足球俱乐部官方网站 - 音乐播放器功能

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 创建音乐播放器元素
    createMusicPlayer();
});

// 创建音乐播放器
function createMusicPlayer() {
    // 检查是否已经存在音乐播放器
    if (document.getElementById('jz-music-player')) {
        return;
    }
    
    // 创建音乐播放器容器
    const musicPlayer = document.createElement('div');
    musicPlayer.id = 'jz-music-player';
    musicPlayer.className = 'music-player';
    
    // 创建播放/暂停按钮
    const playButton = document.createElement('button');
    playButton.id = 'music-play-btn';
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    
    // 创建歌词容器
    const lyricsContainer = document.createElement('div');
    lyricsContainer.className = 'lyrics-container';
    
    // 创建当前歌词元素
    const currentLyrics = document.createElement('div');
    currentLyrics.className = 'current-lyrics';
    currentLyrics.id = 'current-lyrics';
    currentLyrics.textContent = '音乐播放器';
    
    // 组装播放器
    lyricsContainer.appendChild(currentLyrics);
    musicPlayer.appendChild(playButton);
    musicPlayer.appendChild(lyricsContainer);
    
    // 添加到页面
    document.body.appendChild(musicPlayer);
    
    // 创建音频元素
    const audioElement = document.createElement('audio');
    audioElement.id = 'bg-music';
    audioElement.loop = true;
    
    // 设置音频源
    audioElement.src = 'music/Dreamers.mp3';
    
    // 添加音频元素到页面（但不显示）
    document.body.appendChild(audioElement);
    
    // 歌词数据
    const lyricsData = [
        {time: 0, text: "Dreamers - 荆州众志足球俱乐部"},
        {time: 10, text: "激情、团队、梦想 - 荆州足球的骄傲"},
        {time: 20, text: "欢迎收听俱乐部官方音乐"}
    ];
    
    // 播放控制
    let isPlaying = false;
    
    // 播放/暂停功能
    playButton.addEventListener('click', function() {
        if (isPlaying) {
            audioElement.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            // 尝试播放音乐
            audioElement.play().catch(function(error) {
                console.log('音乐播放需要用户交互:', error);
                // 显示提示信息
                currentLyrics.textContent = '请点击播放按钮以开始音乐';
                showPlayPrompt();
            });
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
    
    // 更新歌词
    audioElement.addEventListener('timeupdate', function() {
        updateLyrics(audioElement.currentTime, lyricsData);
    });
    
    // 错误处理
    audioElement.addEventListener('error', function(e) {
        console.error('音频播放错误:', e);
        currentLyrics.textContent = '音乐加载失败';
    });
    
    // 默认显示第一句歌词
    if (lyricsData.length > 0) {
        currentLyrics.textContent = lyricsData[0].text;
    }
}

// 更新歌词显示
function updateLyrics(currentTime, lyricsData) {
    const lyricsElement = document.getElementById('current-lyrics');
    
    // 找到当前时间对应的歌词
    for (let i = lyricsData.length - 1; i >= 0; i--) {
        if (currentTime >= lyricsData[i].time) {
            lyricsElement.textContent = lyricsData[i].text;
            // 动画效果
            lyricsElement.style.animation = 'none';
            void lyricsElement.offsetWidth; // 触发重绘
            lyricsElement.style.animation = 'scrollText 15s linear infinite';
            break;
        }
    }
}

// 自动播放提示
function showPlayPrompt() {
    // 创建提示元素
    const prompt = document.createElement('div');
    prompt.className = 'music-prompt';
    prompt.style.position = 'fixed';
    prompt.style.bottom = '80px';
    prompt.style.right = '20px';
    prompt.style.background = 'rgba(0, 51, 102, 0.9)';
    prompt.style.color = 'white';
    prompt.style.padding = '10px 15px';
    prompt.style.borderRadius = '5px';
    prompt.style.zIndex = '999';
    prompt.style.fontSize = '0.9rem';
    prompt.textContent = '点击播放按钮开始背景音乐';
    
    document.body.appendChild(prompt);
    
    // 3秒后自动消失
    setTimeout(function() {
        prompt.style.opacity = '0';
        prompt.style.transition = 'opacity 0.5s ease';
        setTimeout(function() {
            document.body.removeChild(prompt);
        }, 500);
    }, 3000);
}

// 为页面添加滚动动画效果
function addScrollAnimations() {
    const animateElements = document.querySelectorAll('.card, .img-item, .news-item, .player-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// 添加平滑滚动效果
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化页面增强功能
function initPageEnhancements() {
    // 添加滚动动画
    addScrollAnimations();
    
    // 添加平滑滚动
    addSmoothScroll();
    
    // 显示播放提示
    setTimeout(showPlayPrompt, 1000);
}