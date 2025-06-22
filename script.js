$(function() {
  // メニュー開閉トグル
  $('.hamburger').on('click', function(e) {
    e.stopPropagation();
    $('.menu').toggleClass('open');
    $(this).toggleClass('active');
  });

  // メニュー外クリックで閉じる
  $(document).on('click', function(e) {
    if ($('.menu').hasClass('open')) {
      // メニュー・ハンバーガー以外をクリックしたら閉じる
      if (
        !$(e.target).closest('.menu').length &&
        !$(e.target).closest('.hamburger').length
      ) {
        $('.menu').removeClass('open');
        $('.hamburger').removeClass('active');
      }
    }
  });

  // メニュー内のリンククリックで閉じる
  $('.menu a').on('click', function() {
    $('.menu').removeClass('open');
    $('.hamburger').removeClass('active');
  });
});