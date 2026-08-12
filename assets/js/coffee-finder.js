document.addEventListener('DOMContentLoaded', () => {
    const finderBox = document.getElementById('coffee-finder');
    if (!finderBox) return;

    const steps = finderBox.querySelectorAll('.finder-step');
    const resultContainer = document.getElementById('finder-result');
    const resultText = document.getElementById('result-text');
    const restartBtn = document.getElementById('restart-finder');
    const q2Options = document.getElementById('q2-options');
    const q2Title = document.getElementById('q2-title');

    let answers = [];

    const beans = {
        decaf: {
            name: "インドネシア バリ神山 カフェインレス",
            en: "INDONESIA, Bali Shin-zan, Decaf",
            message: "カフェインレスなのに、しっかりとしたコーヒーの味わいと風味。"
        },
        fruity_typeA: {
            name: "中国 雲南 プーアルピーチ アナエロビック",
            en: "CHINA, Yunnan, Pu'er peach, Anaerobic",
            message: "ベリー系の酸味に、ブランデーのような濃厚な香り。",
            choice: "ベリーのような凝縮感と、お酒のような芳醇な香りを楽しみたい"
        },
        fruity_typeB: {
            name: "エチオピア イルガチェフェ G1 アメデラロ",
            en: "ETHIOPIA, Yirgacheffe G1, Amederararo",
            message: "まるで紅茶のよう。苦味はほぼ無く、華やかな香りが特徴的。",
            choice: "紅茶のように軽やかで、苦味の少ない味わいがいい"
        },
        fruity_other: {
            name: "東ティモール レテフォホ ゴウララ村",
            en: "EAST TIMOR, Letefoho, Goulala",
            message: "質の高い酸味と、雑味のないすっきりとした味。",
            choice: "雑味のない、澄んだクリアな酸味を味わいたい"
        },
        balanced_typeA: {
            name: "エルサルバドル サンタアナ サンタマリア農園",
            en: "EL SALVADOR, Santa Ana, St.Maria farm",
            message: "甘みと苦味のバランスが良く、すっきりとしたクリアな味わい。",
            choice: "甘みと苦味、両方のバランスをクリアに感じたい"
        },
        balanced_typeB: {
            name: "コロンビア シエラネバダ キョート農園",
            en: "COLOMBIA, Sierra Nevada, Finca Kyoto",
            message: "マイルドなコクと、バランスの良い味わい。",
            choice: "マイルドで飲みやすい、王道の一杯がいい"
        },
        balanced_other: {
            name: "コスタリカ ジャガープロジェクト",
            en: "COSTA RICA, Jaguar Project",
            message: "鮮やかな苦味の中に感じる甘み、そしてキレのある後味。",
            choice: "苦味の中にキレのある、メリハリの効いた味わいがいい"
        },
        deep_typeA: {
            name: "ウガンダ ルウェンゾリ アフリカンムーン",
            en: "UGANDA, Rwenzori, African Moon",
            message: "バランスの取れたほどよいコクと、ワイルドな苦味。",
            choice: "ワイルドな苦味の中にも、程よいコクを感じたい"
        },
        deep_typeB: {
            name: "パプアニューギニア シウェット マッドマン",
            en: "PAPUA NEW GUINEA, Siwet plantation, Madman",
            message: "まさにマッドなビターさ。どっしりと厚みあるボディ感。",
            choice: "どっしりと厚みのある、力強いボディ感を楽しみたい"
        },
        deep_other: {
            name: "ブラジル アマレロブルボン ベラビスタ農園",
            en: "BRAZIL, Amarelo Bourbon, Bela Vista estate",
            message: "まろやかな苦味と、チョコレートのような甘み、続く余韻。",
            choice: "チョコレートのような甘みと、まろやかな余韻がいい"
        }
    };

    const q1Titles = {
        fruity: "Q2. その華やかな酸味、どんな方向性がお好みですか？",
        balanced: "Q2. そのバランスの良さ、どんな方向性がお好みですか？",
        deep: "Q2. そのコクやビター感、どんな方向性がお好みですか？"
    };

    finderBox.querySelectorAll('#step-1 [data-next]').forEach(button => {
        button.addEventListener('click', () => {
            const nextStep = button.getAttribute('data-next');
            const value = button.getAttribute('data-value');
            answers.push(value);

            steps.forEach(step => step.classList.remove('is-active'));

            if (nextStep === 'result') {
                showResult();
            } else {
                buildQ2(value);
                document.getElementById(`step-${nextStep}`).classList.add('is-active');
            }
        });
    });

    function buildQ2(q1) {
        q2Title.textContent = q1Titles[q1];
        q2Options.innerHTML = '';

        ['typeA', 'typeB', 'other'].forEach(type => {
            const bean = beans[`${q1}_${type}`];
            const btn = document.createElement('button');
            btn.className = 'finder-btn';
            btn.setAttribute('data-value', type);
            btn.textContent = bean.choice;
            btn.addEventListener('click', () => {
                answers.push(type);
                steps.forEach(step => step.classList.remove('is-active'));
                showResult();
            });
            q2Options.appendChild(btn);
        });
    }

    function showResult() {
        resultContainer.classList.add('is-active');

        const q1 = answers[0];
        let key = q1 === 'decaf' ? 'decaf' : `${q1}_${answers[1]}`;
        const bean = beans[key];

        resultText.innerHTML = `
            <span style="font-size: 0.85rem; color: var(--color-hagi); font-family: 'Cormorant', serif; display: block; margin-bottom: 4px;">${bean.en}</span>
            <strong style="font-size: 1.15rem; font-family: 'Shippori Mincho', serif; color: var(--color-moss-deep); display: block; margin-bottom: 12px;">${bean.name}</strong>
            ${bean.message}
        `;
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            answers = [];
            resultContainer.classList.remove('is-active');
            steps.forEach(step => step.classList.remove('is-active'));
            document.getElementById('step-1').classList.add('is-active');
        });
    }
});