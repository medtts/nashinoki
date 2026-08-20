// ========================================
// スクロールに応じたヘッダーの配色切り替え
// ========================================
const header = document.querySelector('.site-header');
const heroSection = document.querySelector('.story');

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
// .hero 全体をピン留め対象（trigger）にして pin: true を設定し、end: "+=1000"（1000px分スクロールするまで）と指定
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
  
    // ==========================================
    // background-about
    const heroTl = gsap.timeline({
        scrollTrigger: {
        trigger: ".background-storyTop",       // 固定する要素
        start: "top top",       // heroの上端が画面の上端に達したらスタート
        end: "+=500",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: true,              // 画面に固定する
        scrub: true,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    // 最後の 0 はアニメーションの開始タイミング（同時に動かす）
    heroTl.fromTo(".background-storyWater", 
    {
        y: -50,       // 初期位置（右に100pxずれた場所からスタート）
        scale: 1,
        opacity: 1
    }, 
    {
        y: -100,      // 最終位置（左に300px動いた場所へ）
        scale: 1,
        opacity: 1,
        ease: "none",
        duration: 0.1  // 1000px のうち「40%（＝400pxスクロール時点）」で完了させる
    }, 
    0.0
    );
    // ==========================================

    // ==========================================
    // background-storeexpansionのtopのアニメーション  
    const storeexpansionTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-storyArchitecture",
            start: "top bottom",
            end: "bottom bottom", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    storeexpansionTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-storyArchitecture", {
        y: -100,
        opacity: 1,
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-storyArchitecture", {
        y: -200,
        opacity: 1,
        ease: "none",
        duration: 1.2
    });
    // ==========================================

    // ==========================================

});
