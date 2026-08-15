document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('js-hamburger');
    const nav = document.getElementById('js-nav');
    const toTopButton = document.getElementById('js-to-top');

    // 1. ハンバーガーメニューの開閉
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-open');
            nav.classList.toggle('is-open');
            document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
        });

        // メニュー内リンククリック時
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-open');
                nav.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });

        // 画面幅拡大時にメニューを強制リセット
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('is-open')) {
                hamburger.classList.remove('is-open');
                nav.classList.remove('is-open');
                document.body.style.overflow = '';
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

    // 3. スクロールで静かに現れる演出（reduced motion 環境では無効）
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealTargets = document.querySelectorAll(
            '.content-section .section-title, ' +
            '.content-section p, ' +
            '.content-section .btn-accent, ' +
            '.content-section .grid-2, ' +
            '.content-section .info-card, ' +
            '.content-section .map-embed'
        );

        revealTargets.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${Math.min(i % 4, 3) * 90}ms`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        revealTargets.forEach(el => observer.observe(el));
    }
});

// 4. スクロールに応じたヘッダーの配色切り替え（Heroセクション判定）
    const header = document.querySelector('.site-header');
    const heroSection = document.querySelector('.hero');

    if (header && heroSection) {
        const updateHeaderStyle = () => {
            // heroセクションの下端位置を取得
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            
            // ヘッダーの高さ分を考慮して、heroが見えている間かどうか判定
            if (heroBottom > 60) {
                header.classList.remove('is-scrolled');
            } else {
                header.classList.add('is-scrolled');
            }
        };

        window.addEventListener('scroll', updateHeaderStyle);
        window.addEventListener('resize', updateHeaderStyle);
        updateHeaderStyle(); // 初期実行
    }

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. ホバー時のTIPS（ツールチップ）制御
    // ==========================================
    const tooltip = document.getElementById('flavorTooltip');
    const tipTitle = tooltip ? tooltip.querySelector('.tip-title') : null;
    const tipEn = tooltip ? tooltip.querySelector('.tip-en') : null;
    // const tipDesc = tooltip ? tooltip.querySelector('.tip-desc') : null;
    const beanPoints = document.querySelectorAll('.bean-point');

    if (tooltip) {
        beanPoints.forEach(point => {
            point.addEventListener('mouseenter', () => {
                tipTitle.textContent = point.dataset.title;
                tipEn.textContent = point.dataset.en; // 英語表記を追加
                // tipDesc.textContent = point.dataset.desc;
                tooltip.classList.add('is-active');
            });

            point.addEventListener('mousemove', (e) => {
                // マウスの位置にツールチップを追従させる
                tooltip.style.transform = `translate(${e.clientX + 15}px, ${e.clientY + 15}px)`;
            });

            point.addEventListener('mouseleave', () => {
                tooltip.classList.remove('is-active');
            });
        });
    }

    // ==========================================
    // 2. クリック（タップ）時の詳細リストへのスクロール制御
    // ==========================================
    beanPoints.forEach(point => {
        point.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = point.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // 選択された詳細リストを一時的にハイライトする演出
                targetElement.style.transition = 'background-color 0.4s ease';
                targetElement.style.backgroundColor = 'rgba(140, 110, 134, 0.12)';
                
                setTimeout(() => {
                    targetElement.style.backgroundColor = 'transparent';
                }, 1200);
            }
        });
    });
});

// ==========================================
// スライドショー
// ========================================
const wrapper = document.getElementById('slidesWrapper');
const realSlides = wrapper.querySelectorAll('.slide.real');
const dots = document.querySelectorAll('.dot');

const realCount = realSlides.length; // 本物の画像の枚数 (3)
const AUTO_PLAY_INTERVAL = 4000;

let currentIndex = 1; // 1 = 本物の1枚目の位置（0は前方のクローン）
let autoPlayTimer = null;
let isTransitioning = false;

// 初期位置を「本物の1枚目」にセット
function initPosition() {
const slideWidth = wrapper.clientWidth;
wrapper.scrollLeft = slideWidth * currentIndex;
}

// 位置の更新とアニメーション処理
function goToIndex(index, smooth = true) {
currentIndex = index;
const slideWidth = wrapper.clientWidth;

if (smooth) {
    wrapper.scrollTo({
    left: slideWidth * currentIndex,
    behavior: 'smooth'
    });
} else {
    wrapper.scrollLeft = slideWidth * currentIndex;
}

updateDots();
}

// ドットの同期更新
function updateDots() {
// クローン位置のインデックス補正
let realIndex = (currentIndex - 1 + realCount) % realCount;

dots.forEach((dot, idx) => {
    if (idx === realIndex) {
    dot.classList.add('active');
    } else {
    dot.classList.remove('active');
    }
});
}

// スクロール停止時にクローン画像上にいたら「本物」の位置へ一瞬でワープ
let scrollTimeout;
wrapper.addEventListener('scroll', () => {
clearTimeout(scrollTimeout);

scrollTimeout = setTimeout(() => {
    const slideWidth = wrapper.clientWidth;
    currentIndex = Math.round(wrapper.scrollLeft / slideWidth);

    // 最後のクローンに達した -> 本物の1枚目へワープ
    if (currentIndex === realCount + 1) {
    goToIndex(1, false);
    } 
    // 先頭のクローンに達した -> 本物の最後へワープ
    else if (currentIndex === 0) {
    goToIndex(realCount, false);
    } else {
    updateDots();
    }
}, 100);
});

// 自動再生処理
function nextSlide() {
goToIndex(currentIndex + 1, true);
}

function startAutoPlay() {
stopAutoPlay();
autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
}

function stopAutoPlay() {
if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
}
}

// スマホタッチ制御
wrapper.addEventListener('touchstart', stopAutoPlay, { passive: true });
wrapper.addEventListener('touchend', startAutoPlay, { passive: true });

// PCドラッグ操作
let isDown = false;
let startX;
let scrollLeft;

wrapper.addEventListener('mousedown', (e) => {
stopAutoPlay();
isDown = true;
startX = e.pageX - wrapper.offsetLeft;
scrollLeft = wrapper.scrollLeft;
});

wrapper.addEventListener('mouseleave', () => {
if (!isDown) return;
isDown = false;
startAutoPlay();
});

wrapper.addEventListener('mouseup', () => {
if (!isDown) return;
isDown = false;
// 一番近い画像の位置にピタッと寄せる
const slideWidth = wrapper.clientWidth;
const nearestIndex = Math.round(wrapper.scrollLeft / slideWidth);
goToIndex(nearestIndex, true);
startAutoPlay();
});

wrapper.addEventListener('mousemove', (e) => {
if (!isDown) return;
e.preventDefault();
const x = e.pageX - wrapper.offsetLeft;
const walk = (x - startX) * 1.5;
wrapper.scrollLeft = scrollLeft - walk;
});

// リサイズ時の位置ずれ防止
window.addEventListener('resize', () => {
initPosition();
});

// 初期起動
window.addEventListener('load', () => {
initPosition();
startAutoPlay();
});

// ==========================================
// .hero 全体をピン留め対象（trigger）にして pin: true を設定し、end: "+=1000"（1000px分スクロールするまで）と指定
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
  
    // ==========================================
    // hero
    const heroTl = gsap.timeline({
        scrollTrigger: {
        trigger: ".hero",       // 固定する要素
        start: "top top",       // heroの上端が画面の上端に達したらスタート
        end: "+=2000",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: true,              // 画面に固定する
        scrub: true,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    // 最後の 0 はアニメーションの開始タイミング（同時に動かす）
    heroTl.fromTo(".hero-logo", 
    {
        y: 0,       // 初期位置（右に100pxずれた場所からスタート）
        scale: 1,
        opacity: 1
    }, 
    {
        y: -1000,      // 最終位置（左に300px動いた場所へ）
        scale: 1,
        opacity: 0,
        ease: "power2.out",
        duration: 0.1  // 1000px のうち「40%（＝400pxスクロール時点）」で完了させる
    }, 
    0.0
    );

    heroTl.fromTo(".hero-tag", 
    {
        x: 100,       // 初期位置（右に100pxずれた場所からスタート）
        opacity: 0
    }, 
    {
        x: 0,      // 最終位置（左に300px動いた場所へ）
        opacity: 1,
        ease: "power2.out",
        duration: 0.4  // 1000px のうち「40%（＝400pxスクロール時点）」で完了させる
    }, 
    0
    );

    // 例2: テキスト（.hero-content）を下にスライドさせながらフェードアウトさせる
    heroTl.fromTo(".hero-content",
        {
        y: 200,
        opacity: 0,
        ease: "power2.out"
    }, 
    {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 0.4
    }, 0);

    // ==========================================

    // ==========================================
    // background-ourのtopのアニメーション  
    const topOurTl = gsap.timeline({
        scrollTrigger: {
        trigger: ".background-our",       // 固定する要素
        start: "top center",       // heroの上端が画面の上端に達したらスタート
        end: "+=300",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: false,              // 画面に固定する
        scrub: 2.5,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    topOurTl.fromTo(".background-our",
    {
        y: 0,
        opacity: 1,
        ease: "power2.out"
    }, 
    {
        y: -100,
        opacity: 1,
        ease: "power2.out",
        duration: 1.2
    }, 0);

    // ==========================================
    // background-ourのbottomのアニメーション  
    const topOurBottomTl = gsap.timeline({
        scrollTrigger: {
        trigger: ".background-our",       // 固定する要素
        start: "bottom bottom",       // heroの上端が画面の上端に達したらスタート
        end: "+=600",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: false,              // 画面に固定する
        scrub: 2.0,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    topOurBottomTl.fromTo(".background-our",
    {
        y: 0,
        opacity: 1,
        ease: "power2.out"
    }, 
    {
        y: -200,
        opacity: 1,
        ease: "power2.out",
        duration: 1.2
    }, 0);

    // ==========================================

    // ==========================================
    // background-menuのアニメーション  
    const bgMenuTl = gsap.timeline({
        scrollTrigger: {
        trigger: ".background-menu",       // 固定する要素
        start: "top bottom",       // heroの上端が画面の上端に達したらスタート
        end: "+=600",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: false,              // 画面に固定する
        scrub: 2.5,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    bgMenuTl.fromTo(".background-menu",
    {
        y: 0,
        opacity: 1,
        ease: "power2.out"
    }, 
    {
        y: -200,
        opacity: 1,
        ease: "power2.out",
        duration: 1.2
    }, 0);

    // ==========================================

    // ==========================================
    // storyセクション
    const storyTl = gsap.timeline({
        scrollTrigger: {
        trigger: ".story-section",       // 固定する要素
        start: "top center",       // heroの上端が画面の上端に達したらスタート
        end: "+=100%",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: false,              // 画面に固定する
        scrub: true,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    storyTl.fromTo(".grid-2 .story-img-wrapper img",
        {
        yPercent: 5,
        scale: 1.1,
        ease: "power2.out"
    }, 
    {
        yPercent: -5,
        scale: 1.1,
        ease: "power2.out",
        duration: 0.4
    }, 0);

    // ==========================================

    // ==========================================
    //  menuセクション
    const menuTl = gsap.timeline({
        scrollTrigger: {
        trigger: ".menu-section",       // 固定する要素
        start: "top center",       // heroの上端が画面の上端に達したらスタート
        end: "+=100%",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: false,              // 画面に固定する
        scrub: true,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    menuTl.fromTo(".grid-2 .menu-img-wrapper img",
        {
        yPercent: 5,
        scale: 1.1,
        ease: "power2.out"
    }, 
    {
        yPercent: -5,
        scale: 1.1,
        ease: "power2.out",
        duration: 0.4
    }, 0);

    // ==========================================

    // ==========================================
    // 2. マウスホバー処理（scale のアニメーション）
    const wrappers = document.querySelectorAll('.story-img-wrapper, .menu-img-wrapper');

    wrappers.forEach((wrapper) => {
        const img = wrapper.querySelector('img');
        if (!img) return;

        // 初期状態の scale を 1.1 に設定
        gsap.set(img, { scale: 1.1 });

        // ホバーした時：scale 1.5 へ拡大
        wrapper.addEventListener('mouseenter', () => {
        gsap.to(img, {
            scale: 1.2,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto' // スクロールのtransformとscale指定がぶつかるのを自動調整
        });
        });

        // ホバーが外れた時：元の scale 1.1 へ戻す
        wrapper.addEventListener('mouseleave', () => {
        gsap.to(img, {
            scale: 1.1,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
        });
        });
    });
});

// ==========================================
// logoアニメーションの発火管理
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const heroLogo = document.querySelector('.hero-logo');

  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      if (heroLogo && !heroLogo.classList.contains('is-animated')) {
        heroLogo.classList.add('is-animated');

        // 左（または右）の要素のアニメーション完了を検知
        const animElement = heroLogo.querySelector('.logo-anim-left');
        if (animElement) {
          animElement.addEventListener('animationend', (e) => {
            // expandX アニメーションが終わった時だけ処理をする
            if (e.animationName === 'expandX') {
              heroLogo.classList.add('is-logo-animated');
            }
          }, { once: true }); // 1回だけ発火するように制限
        }
      }
    });
  });
});


// ==========================================
// Lenisの初期化
// ==========================================
const lenis = new Lenis({
  duration: 1.2,      // スクロールの慣性（減速）の長さ（秒）。0.8〜1.5程度が心地よい
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ぬるっと止まるイージング関数
  smoothWheel: true,  // マウスホイールのスクロールを滑らかにする
  wheelMultiplier: 1, // ホイールの移動量の倍率（大きくすると1回のスクロールで大きく動く）
});

//  毎フレーム Lenis を更新するループ（必須）
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP ScrollTrigger と同期させる設定（※GSAPを使っている場合は必須）
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ページ内リンク（アンカーリンク）へスムーズに移動させる
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    if (target !== '#') {
      lenis.scrollTo(target, {
        offset: -80, // ヘッダーの高さを考慮して位置をずらす場合
        duration: 1.5,
      });
    }
  });
});