// ==========================================
// .hero 全体をピン留め対象（trigger）にして pin: true を設定し、end: "+=1000"（1000px分スクロールするまで）と指定
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
  
    // ==========================================
    // background-menus
    const heroTl = gsap.timeline({
        scrollTrigger: {
        trigger: ".background-water",       // 固定する要素
        start: "top top",       // heroの上端が画面の上端に達したらスタート
        end: "+=700",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: false,              // 画面に固定する
        scrub: true,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    

    // 最後の 0 はアニメーションの開始タイミング（同時に動かす）
    heroTl.fromTo(".background-menus", 
    {
        y: 0,       // 初期位置（右に100pxずれた場所からスタート）
        scale: 1,
        opacity: 1
    }, 
    {
        y: -200,      // 最終位置（左に300px動いた場所へ）
        scale: 1,
        opacity: 1,
        ease: "none",
        duration: 1.2  // 1000px のうち「40%（＝400pxスクロール時点）」で完了させる
    }, 
    0.0
    );
    // ==========================================

    // ==========================================
    // background-chartのtopのアニメーション  
    const chartTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-chart",
            start: "top bottom",
            end: "bottom bottom", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    chartTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-chart", {
        y: -100,
        opacity: 1,
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-chart", {
        y: -200,
        opacity: 1,
        ease: "none",
        duration: 1.2
    });
    // ==========================================

    // ==========================================
    // background-detailsのtopのアニメーション  
    const detailsTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-details",
            start: "top bottom",
            end: "bottom bottom", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    detailsTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-details", {
        y: -300,
        opacity: 1,
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-details", {
        y: -400,
        opacity: 1,
        ease: "none",
        duration: 1.2
    });
    // ==========================================

    // ==========================================
});
    // ==========================================

    // ==========================================
