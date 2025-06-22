// 雲の動的生成とアニメーション
document.addEventListener('DOMContentLoaded', function () {
    const cloudsContainer = document.querySelector('.clouds-container');

    // 追加の雲を動的に生成
    function createRandomCloud() {
        const cloud = document.createElement('div');
        cloud.className = 'cloud dynamic-cloud';

        // ランダムなサイズと位置
        const size = Math.random() * 60 + 40; // 40-100px
        const height = size * 0.4;
        const top = Math.random() * 80; // 0-80%
        const animationDuration = Math.random() * 20 + 15; // 15-35s

        cloud.style.width = `${size}px`;
        cloud.style.height = `${height}px`;
        cloud.style.top = `${top}%`;
        cloud.style.left = '-100px';
        cloud.style.animation = `float ${animationDuration}s infinite linear`;
        cloud.style.opacity = Math.random() * 0.3 + 0.2;

        // 雲の装飾部分を追加
        const before = document.createElement('div');
        before.style.cssText = `
            position: absolute;
            width: ${size * 0.5}px;
            height: ${size * 0.5}px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            top: ${-height * 0.6}px;
            left: ${size * 0.2}px;
        `;
        cloud.appendChild(before);

        cloudsContainer.appendChild(cloud);

        // アニメーション終了後に削除
        setTimeout(() => {
            if (cloud.parentNode) {
                cloud.parentNode.removeChild(cloud);
            }
        }, animationDuration * 1000);
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

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

$(function () {
    $('a[href^=#]').click(function () {
        var speed = 500; // スクロール速度(ミリ秒)
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        $('html').animate({ scrollTop: position }, speed, 'swing');
        return false;
    });
});

// ハンバーガーメニューの開閉機能を追加
$(function() {
  $('.hamburger').on('click', function(e) {
    e.stopPropagation();
    $('.nav-links ul').toggleClass('active');
    $(this).toggleClass('active');
    $('.menu-overlay').toggleClass('active');
  });

  // メニュー外クリックで閉じる
  $(document).on('click', function(e) {
    if ($('.nav-links ul').hasClass('active')) {
      if (
        !$(e.target).closest('.nav-links').length &&
        !$(e.target).closest('.hamburger').length
      ) {
        $('.nav-links ul').removeClass('active');
        $('.hamburger').removeClass('active');
        $('.menu-overlay').removeClass('active');
      }
    }
  });

  // オーバーレイクリックで閉じる
  $('.menu-overlay').on('click', function() {
    $('.nav-links ul').removeClass('active');
    $('.hamburger').removeClass('active');
    $(this).removeClass('active');
  });

  // メニュー内のリンククリックで閉じる
  $('.nav-links a').on('click', function() {
    $('.nav-links ul').removeClass('active');
    $('.hamburger').removeClass('active');
    $('.menu-overlay').removeClass('active');
  });
});