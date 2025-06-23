// 雲の動的生成とアニメーション
document.addEventListener('DOMContentLoaded', function () {
    const cloudsContainer = document.querySelector('.clouds-container');    // 追加の雲を動的に生成（パステル風）
    function createRandomCloud() {
        const cloud = document.createElement('div');
        const isPastelCloud = Math.random() > 0.6; // 40%の確率でパステル雲
        
        if (isPastelCloud) {
            cloud.className = 'cloud-sunset dynamic-cloud';
            // パステル雲のスタイル
            const size = Math.random() * 80 + 60; // 60-140px
            const height = size * 0.5;
            const top = Math.random() * 70; // 0-70%
            const animationDuration = Math.random() * 25 + 20; // 20-45s

            cloud.style.width = `${size}px`;
            cloud.style.height = `${height}px`;
            cloud.style.top = `${top}%`;
            cloud.style.left = '-200px';
            cloud.style.animation = `float-cloud ${animationDuration}s infinite linear`;
            cloud.style.background = `linear-gradient(45deg, 
                rgba(255, 192, 203, ${Math.random() * 0.3 + 0.6}) 0%, 
                rgba(221, 160, 221, ${Math.random() * 0.3 + 0.5}) 30%, 
                rgba(255, 255, 255, ${Math.random() * 0.2 + 0.8}) 60%,
                rgba(173, 216, 230, ${Math.random() * 0.3 + 0.4}) 100%)`;
            cloud.style.filter = `blur(${Math.random() * 1 + 0.5}px) drop-shadow(0 ${Math.random() * 8 + 4}px ${Math.random() * 8 + 8}px rgba(221, 160, 221, 0.4))`;
        } else {
            cloud.className = 'cloud dynamic-cloud';
            // 通常の雲のスタイル
            const size = Math.random() * 60 + 40; // 40-100px
            const height = size * 0.4;
            const top = Math.random() * 80; // 0-80%
            const animationDuration = Math.random() * 20 + 15; // 15-35s

            cloud.style.width = `${size}px`;
            cloud.style.height = `${height}px`;
            cloud.style.top = `${top}%`;
            cloud.style.left = '-100px';
            cloud.style.animation = `float ${animationDuration}s infinite linear`;
            cloud.style.opacity = Math.random() * 0.4 + 0.4;
            cloud.style.background = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.7})`;
            cloud.style.filter = `drop-shadow(0 ${Math.random() * 4 + 2}px ${Math.random() * 6 + 4}px rgba(221, 160, 221, 0.3))`;

            // 雲の装飾部分を追加
            const before = document.createElement('div');
            before.style.cssText = `
                position: absolute;
                width: ${size * 0.5}px;
                height: ${size * 0.5}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.2 + 0.8});
                border-radius: 50%;
                top: ${-height * 0.6}px;
                left: ${size * 0.2}px;
                filter: drop-shadow(0 1px 4px rgba(173, 216, 230, 0.2));
            `;
            cloud.appendChild(before);
        }

        cloudsContainer.appendChild(cloud);

        // アニメーション終了後に削除
        setTimeout(() => {
            if (cloud.parentNode) {
                cloud.parentNode.removeChild(cloud);
            }
        }, (isPastelCloud ? 45 : 35) * 1000);
    }

    // 定期的に新しい雲を生成
    setInterval(createRandomCloud, 8000);

    // スクロール時のパララックス効果
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const clouds = document.querySelectorAll('.cloud');

        clouds.forEach((cloud, index) => {
            const speed = (index + 1) * 0.5;
            cloud.style.transform = `translateX(${scrolled * speed * 0.1}px)`;
        });
    });

    // コンテンツボックスのホバー効果
    const contentClouds = document.querySelectorAll('.content-cloud, .profile-cloud');

    contentClouds.forEach(cloud => {
        cloud.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease';
        });

        cloud.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
});

// スムーススクロール（統合版）
$(function () {
    $('a[href^="#"]').click(function (e) {
        e.preventDefault();
        
        var speed = 800; // スクロール速度(ミリ秒)
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        
        if (target.length) {
            var position = target.offset().top;
            
            // ナビゲーションの高さを考慮したオフセット
            var navHeight = $('nav').outerHeight();
            var scrollPosition = position - navHeight - 20; // 20pxの余白を追加
            
            $('html, body').animate({ 
                scrollTop: scrollPosition 
            }, speed, 'swing');
        }
        
        return false;
    });
});

// ハンバーガーメニューの開閉機能を追加
$(function() {
  $('.hamburger').on('click', function(e) {
    e.stopPropagation();
    var isExpanded = $(this).attr('aria-expanded') === 'true';
    
    $('.nav-links ul').toggleClass('active');
    $(this).toggleClass('active');
    $('.menu-overlay').toggleClass('active');
    
    // ARIAの状態を更新
    $(this).attr('aria-expanded', !isExpanded);
    $(this).attr('aria-label', isExpanded ? 'メニューを開く' : 'メニューを閉じる');
    
    // フォーカス管理
    if (!isExpanded) {
      $('.nav-links ul li:first-child a').focus();
    }
  });

  // メニュー外クリックで閉じる
  $(document).on('click', function(e) {
    if ($('.nav-links ul').hasClass('active')) {
      if (
        !$(e.target).closest('.nav-links').length &&
        !$(e.target).closest('.hamburger').length
      ) {
        closeMenu();
      }
    }
  });

  // ESCキーでメニューを閉じる
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $('.nav-links ul').hasClass('active')) {
      closeMenu();
      $('.hamburger').focus();
    }
  });

  // オーバーレイクリックで閉じる
  $('.menu-overlay').on('click', function() {
    closeMenu();
  });
  // メニュー内のリンククリックで閉じる（スムーズスクロール後）
  $('.nav-links a').on('click', function() {
    // スクロール完了後にメニューを閉じる
    setTimeout(function() {
      closeMenu();
    }, 300); // スクロール開始後にメニューを閉じる
  });
  
  // メニューを閉じる共通関数
  function closeMenu() {
    $('.nav-links ul').removeClass('active');
    $('.hamburger').removeClass('active');
    $('.menu-overlay').removeClass('active');
    $('.hamburger').attr('aria-expanded', 'false');
    $('.hamburger').attr('aria-label', 'メニューを開く');
  }
});