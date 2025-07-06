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

// contactセクションの整列機能
$(function() {
  // contactリンクの高さを揃える
  function alignContactLinks() {
    const contactLinks = $('.contact-link');
    
    if (contactLinks.length > 0) {
      // 全てのリンクの高さをリセット
      contactLinks.css('height', 'auto');
      
      // 最大の高さを取得
      let maxHeight = 0;
      contactLinks.each(function() {
        const currentHeight = $(this).outerHeight();
        if (currentHeight > maxHeight) {
          maxHeight = currentHeight;
        }
      });
      
      // 全てのリンクに最大高さを適用（PC画面のみ）
      if ($(window).width() >= 769) {
        contactLinks.css('height', maxHeight + 'px');
      }
    }
  }
  
  // contactアイコンと文字の配置を調整
  function alignContactContent() {
    $('.contact-link').each(function() {
      const $link = $(this);
      const $icon = $link.find('.contact-icon');
      const $text = $link.find('span');
      
      // PC画面で中央揃えに調整
      if ($(window).width() >= 769) {
        $link.css({
          'flex-direction': 'column',
          'text-align': 'center',
          'justify-content': 'center',
          'align-items': 'center'
        });
        $icon.css('margin-right', '0');
        $icon.css('margin-bottom', '0.5rem');
      } else {
        // モバイル画面で横並びに戻す
        $link.css({
          'flex-direction': 'row',
          'text-align': 'left',
          'justify-content': 'flex-start',
          'align-items': 'center'
        });
        $icon.css('margin-right', '1rem');
        $icon.css('margin-bottom', '0');
      }
    });
  }
  
  // 初回実行
  setTimeout(function() {
    alignContactContent();
    alignContactLinks();
  }, 100);
  
  // リサイズ時に再実行
  $(window).on('resize', function() {
    clearTimeout(window.contactResizeTimer);
    window.contactResizeTimer = setTimeout(function() {
      alignContactContent();
      alignContactLinks();
    }, 250);
  });
  
  // contactリンクにホバー時の3D効果を追加
  $('.contact-link').hover(
    function() {
      $(this).css({
        'transform': 'translateY(-3px) scale(1.02)',
        'transition': 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
      });
    },
    function() {
      $(this).css({
        'transform': 'translateY(0) scale(1)',
        'transition': 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
      });
    }
  );
});

// SNS共有機能
function shareOnTwitter() {
    const url = window.location.href;
    const text = 'RiceZero Portfolio - 「オモシロイ」を「形」に、「笑顔」に';
    const hashtags = 'ポートフォリオ,WebDesign,JavaScript,HTML,CSS';
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

function shareOnFacebook() {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn() {
    const url = window.location.href;
    const title = 'RiceZero Portfolio';
    const summary = '「オモシロイ」を「形」に、「笑顔」に - クリエイティブなWebデザインとプログラミング';
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
}

function copyToClipboard() {
    const url = window.location.href;
    
    // Clipboard API を使用（モダンブラウザ）
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
            showCopyNotification('URLをクリップボードにコピーしました！');
        }).catch(function(err) {
            console.error('クリップボードへのコピーに失敗しました:', err);
            fallbackCopyToClipboard(url);
        });
    } else {
        // フォールバック（古いブラウザ）
        fallbackCopyToClipboard(url);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification('URLをクリップボードにコピーしました！');
    } catch (err) {
        console.error('クリップボードへのコピーに失敗しました:', err);
        showCopyNotification('URLのコピーに失敗しました。手動でコピーしてください。');
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification(message) {
    // 既存の通知があれば削除
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素を作成
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(52, 199, 89, 0.95);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(52, 199, 89, 0.4);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // フェードイン
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // 3秒後にフェードアウト
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 共有ボタンにタッチフィードバック追加（モバイル対応）
document.addEventListener('DOMContentLoaded', function() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        // タッチ開始時
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        // タッチ終了時
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.2s ease';
            
            // ボタンの種類に応じて適切な関数を呼び出し
            setTimeout(() => {
                if (this.classList.contains('twitter-share')) {
                    shareOnTwitter();
                } else if (this.classList.contains('facebook-share')) {
                    shareOnFacebook();
                } else if (this.classList.contains('linkedin-share')) {
                    shareOnLinkedIn();
                } else if (this.classList.contains('copy-link')) {
                    copyToClipboard();
                }
            }, 100);
        });
        
        // タッチキャンセル時
        button.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.2s ease';
        });
    });
});

// フッターの動的な更新日設定
document.addEventListener('DOMContentLoaded', function() {
    const lastUpdatedElement = document.querySelector('.last-updated time');
    if (lastUpdatedElement) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('ja-JP', options);
        lastUpdatedElement.textContent = formattedDate;
        lastUpdatedElement.setAttribute('datetime', now.toISOString().split('T')[0]);
    }
});