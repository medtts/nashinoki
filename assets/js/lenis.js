document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('js-hamburger');
    const nav = document.getElementById('js-nav');
    const toTopButton = document.getElementById('js-to-top');

    // 1. ハンバーガーメニューの開閉
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            hamburger.classList.toggle('is-open');

            // --- ここを修正 ---
            if (isOpen) {
                // メニューが開いた時
                document.body.style.overflow = 'hidden';
                if (typeof lenis !== 'undefined') lenis.stop(); // Lenisを停止
            } else {
                // メニューが閉じた時
                document.body.style.overflow = '';
                if (typeof lenis !== 'undefined') lenis.start(); // Lenisを再開
            }
            // ------------------
        });

        // メニュー内リンククリック時
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-open');
                nav.classList.remove('is-open');
                document.body.style.overflow = '';
                if (typeof lenis !== 'undefined') lenis.start(); // 再開
            });
        });

        // 画面幅拡大時にメニューを強制リセット
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('is-open')) {
                hamburger.classList.remove('is-open');
                nav.classList.remove('is-open');
                document.body.style.overflow = '';
                if (typeof lenis !== 'undefined') lenis.start(); // 再開
            }
        });
    }

    // 2. スクロールによるトップに戻るボタンの表示・非表示
    if (toTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                toTopButton.classList.add('is-show');
            } else {
                toTopButton.classList.remove('is-show');
            }
        });

        toTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});



// ==========================================
// 1. Lenisの初期化（必ず一番上に書く）
// ==========================================
const lenis = new Lenis({
  duration: 1.2,      
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  smoothWheel: true,  
  wheelMultiplier: 1, 
});

// ==========================================
// 2. 毎フレーム Lenis を更新するループ
// ==========================================
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
// ここで初めて raf を呼び出す
requestAnimationFrame(raf);

// ==========================================
// 3. GSAP ScrollTrigger と同期させる設定
// ==========================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// ==========================================
// 4. ページ内リンク（アンカーリンク）の制御
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    if (target !== '#') {
      lenis.scrollTo(target, {
        offset: -80, 
        duration: 1.5,
      });
    }
  });
});