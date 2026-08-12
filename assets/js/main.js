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