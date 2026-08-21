// ========================================
// スクロールに応じたヘッダーの配色切り替え
// ========================================
const header = document.querySelector('.site-header');
const heroSection = document.querySelector('.philosophy');

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
        trigger: ".background-about",       // 固定する要素
        start: "top top",       // heroの上端が画面の上端に達したらスタート
        end: "+=1500",          // 1000pxスクロールする間固定（ここで固定距離を調整）
        pin: false,              // 画面に固定する
        scrub: true,            // スクロール量に動きを完全連動させる
        // markers: true,       // 開発中に位置調整したい場合はコメントアウトを外す
        }
    });

    // 最後の 0 はアニメーションの開始タイミング（同時に動かす）
    heroTl.fromTo(".background-nashinoki", 
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
        duration: 0.1  // 1000px のうち「40%（＝400pxスクロール時点）」で完了させる
    }, 
    0.0
    );
    // ==========================================

    // ==========================================
    // background-storeexpansionのtopのアニメーション  
    const storeexpansionTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-storeexpansion",
            start: "top bottom",
            end: "bottom bottom", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    storeexpansionTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-storeexpansion", {
        y: -100,
        opacity: 1,
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-storeexpansion", {
        y: -200,
        opacity: 1,
        ease: "none",
        duration: 1.2
    });
    // ==========================================

    // ==========================================
    // background-storesのtopのアニメーション  
    const storesTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".background-stores",
            start: "top bottom",
            end: "center bottom", // 開始（top center）から終了（bottom+600px）までを全体とする
            scrub: 2.0,
            // markers: true
        }
    });

    storesTl
    // 1つ目のアニメーション（top center 〜）
    .to(".background-stores", {
        y: -100,
        opacity: 1,
        ease: "none",
        duration: 1.2
    })
    // 2つ目のアニメーション（bottom bottom 〜）
    .to(".background-stores", {
        y: -200,
        opacity: 1,
        ease: "none",
        duration: 1.2
    });

});
// ==========================================
// 日本地図
// ==========================================
const maps = [ "../assets/images/map-mobile.svg" ]
const containers = document.querySelectorAll( '.map' )
const targetPrefs = [ "tokyo", "shiga", "kyoto", "osaka" ]

maps.forEach( async ( map, index ) => {
    const res = await fetch( map )
    if ( res.ok ) {
        const svg = await res.text()
        containers[ index ].innerHTML = svg
        const prefs = document.querySelectorAll( '.geolonia-svg-map .prefecture' )

        prefs.forEach( ( pref ) => {
            const isTarget = targetPrefs.some( target => pref.classList.contains( target ) )

            if ( isTarget ) {
                pref.addEventListener( 'mouseover', ( event ) => {
                    event.currentTarget.style.fill = "#5A7352"
                } )
                pref.addEventListener( 'mouseleave', ( event ) => {
                    event.currentTarget.style.fill = ""
                } )

                pref.addEventListener( 'click', ( event ) => {
                    const matchedTarget = targetPrefs.find( target => event.currentTarget.classList.contains( target ) )
                    if ( matchedTarget ) {
                        const targetSection = document.getElementById( `area-${matchedTarget}` )
                        if ( targetSection ) {
                            const rect = targetSection.getBoundingClientRect()
                            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                            const targetY = rect.top + scrollTop - 300

                            window.scrollTo({
                                top: targetY,
                                behavior: 'smooth'
                            })
                        }
                    }
                } )
                pref.style.cursor = 'pointer'
            } else {
                pref.style.cursor = 'default'
                pref.style.pointerEvents = 'none'
            }
        } )
    }
} )
