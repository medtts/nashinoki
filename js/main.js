// ========================================
// スクロールに応じたヘッダーの配色切り替え
// ========================================
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

// ==========================================
// スライドショー
// ========================================
const wrapper = document.getElementById('slidesWrapper');

// slidesWrapper が無いときは処理をストップさせる
if (!wrapper) {
  // 必要であればここで return して以降の処理を中断
} else {

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

} // if (!wrapper) の閉じ括弧

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
        end: "+=1000",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: true,              // 画面に固定する
        scrub: true,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        invalidateOnRefresh: true
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
        ease: "none",
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
        ease: "none",
        duration: 0.4  // 1000px のうち「40%（＝400pxスクロール時点）」で完了させる
    }, 
    0
    );

    // 例2: テキスト（.hero-content）を下にスライドさせながらフェードアウトさせる
    heroTl.fromTo(".hero-content",
        {
        y: 200,
        opacity: 0,
        ease: "none"
    }, 
    {
        y: 0,
        opacity: 1,
        ease: "none",
        duration: 0.4
    }, 0);

    // ==========================================

    // ==========================================
    // background-ourのtopのアニメーション  
    const topOurTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-our",
            start: "top center",
            end: "bottom center", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    topOurTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-our", {
        y: -200,
        opacity: 1,
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-our", {
        y: -250,
        opacity: 1,
        ease: "none",
        duration: 1.2
    });
    
    // heroを暗くする処理
    topOurTl.fromTo(".hero", {
        ease: "none",
        duration: 0.1  // 1000px のうち「40%（＝400pxスクロール時点）」で完了させる
    }, {
        "--my-brightness": 0.5, // 変数を1から0.2へ動かす
        ease: "none",
        duration: 0.1  // 1000px のうち「40%（＝400pxスクロール時点）」で完了させる
    }, 
    0.0
    );

    // ==========================================

    // ==========================================
    // すべての .hagi-img を配列として取得してループ処理
    gsap.utils.toArray(".hagi-img").forEach((img) => {
    const topHagiTl = gsap.timeline({
        scrollTrigger: {
        trigger: img, // クラス名ではなく、現在の要素（img）を指定
        start: "top center",
        end: "bottom center",
        scrub: 2.0,
        // markers: true
        }
    });

    topHagiTl
        // 1つ目のアニメーション
        .to(img, {
        x: -10,
        opacity: 1,
        ease: "none",
        duration: 1.2
        })
        // 2つ目のアニメーション
        .to(img, {
        x: 0,
        opacity: 1,
        ease: "none",
        duration: 1.2
        });
    });
    
    // ==========================================

    // ==========================================
    // background-galleryのtopのアニメーション  
    const topGalleryTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-gallery",
            start: "top bottom",
            end: "center top", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    topGalleryTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-gallery", {
        // y: -200,
        // opacity: 1,
        filter: "brightness(100%)",
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-gallery", {
        // y: -250,
        // opacity: 1,
        filter: "brightness(100%)",
        ease: "none",
        duration: 1.2
    });

    // ==========================================

    // ==========================================
    // background-menu の連続パララックスアニメーション
    const bgMenuTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".background-menu",
        start: "top bottom",     // 要素の上が画面の下に入ったらスタート
        end: "bottom center",       // 要素の下が画面の上に抜けたら終了（全体のスクロール区間に合わせる）
        scrub: 2.5,              // スクロールに滑らかに追従
        // markers: true,        // 位置調整時はコメント解除
    }
    });

    // 1つのタイムラインに順番に追加（キーフレームのように連続して動く）
    bgMenuTl
    // 1つ目の移動: y: 0 -> y: -200
    .fromTo(".background-menu", 
        { y: 0 }, 
        { y: -200, ease: "none" }
    )
    // 2つ目の移動: y: -200 -> y: -400（前の移動が終わった直後に続く）
    .to(".background-menu", 
        { y: -500, ease: "none" }
    );

    // ==========================================
    
    // ==========================================
    // background-courseのtopのアニメーション  
    const topCourseTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-course",
            start: "top bottom",
            end: "bottom top", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    topCourseTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-course", {
        // y: -200,
        // opacity: 1,
        filter: "brightness(100%)",
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-course", {
        // y: -250,
        // opacity: 1,
        filter: "brightness(0%)",
        ease: "none",
        duration: 1.2
    });

    // ==========================================

    // ==========================================

    // const topInfoTl = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: ".background-info",
    //         start: "top bottom",
    //         end: "bottom center",
    //         scrub: 2.0,
    //         // markers: true
    //     }
    // });

    // topInfoTl
    // // ① top center に達してから y: -100 へ
    // .to(".background-info", {
    //     y: -300,
    //     filter: "brightness(100%)",
    //     opacity: 1,
    //     ease: "none",
    //     duration: 1.2
    // })
    // // ② 続いて bottom bottom 付近で y: -200 へ
    // .to(".background-info", {
    //     y: -300,
    //     filter: "brightness(20%)",
    //     opacity: 1,
    //     ease: "none",
    //     duration: 1.2
    // });
    const topInfoTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".background-info",
        start: "top bottom",     // 画面に入り始めた瞬間
        end: "bottom center",   // 画面中央に達した時点
        scrub: 2.0,
        // markers: true
    }
});

topInfoTl
    // ① yの移動（画面に入ってから最後までずっと連続して動かす）
    .to(".background-info", {
        y: -300,
        opacity: 1,
        ease: "none",
        duration: 2.0
    }, 0) // 開始地点（0秒）からスタート

    // ② 明るさの変化（見えた時点では100%を維持し、後半1.0秒から暗くする）
    .to(".background-info", {
        // filter: "brightness(20%)",
        "--my-brightness": 0.2, // 変数を1から0.2へ動かす
        ease: "none",
        duration: 1.0
    }, 1.0); // 1.0秒（全体の折り返し地点）から割り込んでスタート

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
        ease: "none"
    }, 
    {
        yPercent: -5,
        scale: 1.1,
        ease: "none",
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
        ease: "none"
    }, 
    {
        yPercent: -5,
        scale: 1.1,
        ease: "none",
        duration: 0.4
    }, 0);
    

    // ==========================================

    // ==========================================

    const infoCardTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".info-card",
            start: "top bottom",
            end: "bottom+=600 bottom",
            scrub: 2.0,
            // markers: true,
        }
    });

    infoCardTl
    .to(".info-card", {
        y: -150,
        opacity: 1,
        ease: "none",
        duration: 1.2
    })
    .to(".info-card", {
        y: -250,
        opacity: 1,
        ease: "none",
        duration: 1.2
    });
    
    // ==========================================

    // ==========================================
    // background-snsのtopのアニメーション  
    const topSNSTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-sns",
            start: "top bottom",
            end: "bottom top", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    topSNSTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-sns", {
        // y: -200,
        // opacity: 1,
        filter: "brightness(100%)",
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-sns", {
        // y: -250,
        // opacity: 1,
        filter: "brightness(100%)",
        ease: "none",
        duration: 1.2
    });

    // ==========================================

    // ==========================================
    // 2. マウスホバー処理（scale のアニメーション）
    const wrappers = document.querySelectorAll('.story-img-wrapper, .menu-img-wrapper');

    wrappers.forEach((wrapper) => {
        const img = wrapper.querySelector('img');
        if (!img) return;

        // 初期状態の scale を 1.1 に設定
        gsap.set(img, { scale: 1.10 });

        // ホバーした時：scale 1.5 へ拡大
        wrapper.addEventListener('mouseenter', () => {
        gsap.to(img, {
            scale: 1.12,
            duration: 0.2,
            ease: 'none',
            overwrite: 'auto' // スクロールのtransformとscale指定がぶつかるのを自動調整
        });
        });

        // ホバーが外れた時：元の scale 1.1 へ戻す
        wrapper.addEventListener('mouseleave', () => {
        gsap.to(img, {
            scale: 1.10,
            duration: 0.2,
            ease: 'none',
            overwrite: 'auto'
        });
        });
    });

    // ==========================================
    // 追加: 初期化完了後に一度だけrefreshし、位置を確定させる
    // ==========================================
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });

});

// ==========================================
// logoアニメーションの発火管理
// ==========================================
// document.addEventListener('DOMContentLoaded', () => {
//   const heroLogo = document.querySelector('.hero-logo');

//   document.fonts.ready.then(() => {
//     requestAnimationFrame(() => {
//       if (heroLogo && !heroLogo.classList.contains('is-animated')) {
//         heroLogo.classList.add('is-animated');

//         // 左（または右）の要素のアニメーション完了を検知
//         const animElement = heroLogo.querySelector('.logo-anim-left');
//         if (animElement) {
//           animElement.addEventListener('animationend', (e) => {
//             // expandX アニメーションが終わった時だけ処理をする
//             if (e.animationName === 'expandX') {
//               heroLogo.classList.add('is-logo-animated');
//             }
//           }, { once: true }); // 1回だけ発火するように制限
//         }
//       }
//     });
//   });
// });


// document.addEventListener('DOMContentLoaded', () => {
//   const heroLogo = document.querySelector('.hero-logo');

//   document.fonts.ready.then(() => {
//     requestAnimationFrame(() => {
//       if (heroLogo && !heroLogo.classList.contains('is-animated')) {
//         heroLogo.classList.add('is-animated');

//         const animElement = heroLogo.querySelector('.logo-anim-left');
//         if (animElement) {
//           // すでにリスナーがあれば追加しない
//           const handler = (e) => {
//             if (e.animationName === 'expandX') {
//               heroLogo.classList.add('is-logo-animated');
//             }
//           };
//           animElement.addEventListener('animationend', handler, { once: true });
//         }
//       }
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  const heroLogo = document.querySelector('.hero-logo');

  window.addEventListener('load', () => {
    if (heroLogo && !heroLogo.classList.contains('is-animated')) {
      heroLogo.classList.add('is-animated');

      const animElement = heroLogo.querySelector('.logo-anim-left');
      if (animElement) {
        animElement.addEventListener('animationend', (e) => {
          if (e.animationName === 'expandX') {
            heroLogo.classList.add('is-logo-animated');
          }
        }, { once: true });
      }
    }
  });
});