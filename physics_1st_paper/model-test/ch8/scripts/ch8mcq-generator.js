const MathUtils = {
    getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    getRandomElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
    getGCD: function(a, b) {
        return b === 0 ? a : this.getGCD(b, a % b);
    }
};

const Ch8Generators = {
    gen_diff_eq_omega: () => {
        const a = MathUtils.getRandomElement([1, 2, 4, 5, 8]);
        const omega = MathUtils.getRandomInt(2, 12);
        const b = a * omega * omega;
        
        return {
            question: `একটি কণা $${a === 1 ? '' : a}\\frac{d^2x}{dt^2} + ${b}x = 0$ সমীকরণ অনুযায়ী সরল ছন্দিত গতিতে দুলছে। এর কৌণিক কম্পাঙ্ক ($\\omega$) কত?`,
            rawOptions: [
                `$${omega}$ rad/s`,
                `$${b}$ rad/s`,
                `$${omega * omega}$ rad/s`,
                `$${a * b}$ rad/s`
            ],
            explanation: `প্রদত্ত সমীকরণ: $${a === 1 ? '' : a}\\frac{d^2x}{dt^2} + ${b}x = 0$<br>
            বা, $\\frac{d^2x}{dt^2} + ${omega * omega}x = 0$ ${a !== 1 ? `(${a} দ্বারা ভাগ করে)` : ''}<br>
            আদর্শ সমীকরণ $\\frac{d^2x}{dt^2} + \\omega^2x = 0$ এর সাথে তুলনা করে পাই, $\\omega^2 = ${omega * omega}$<br>
            $\\implies \\omega = \\sqrt{\\frac{${b}}{${a}}} = ${omega}$ rad/s।`
        };
    },

    gen_diff_eq_period: () => {
        const a = MathUtils.getRandomElement([1, 2, 4, 5]);
        const omega = MathUtils.getRandomElement([2, 4, 5, 10]);
        const b = a * omega * omega;
        
        return {
            question: `একটি কণা $${a === 1 ? '' : a}\\frac{d^2y}{dt^2} + ${b}y = 0$ সমীকরণ অনুযায়ী সরল ছন্দিত গতিতে দুলছে। কণাটির পর্যায়কাল কত?`,
            rawOptions: [
                `$\\frac{2\\pi}{${omega}}$ s`,
                `$\\frac{\\pi}{${omega}}$ s`,
                `$${omega * 2}\\pi$ s`,
                `$\\frac{${omega}}{2\\pi}$ s`
            ],
            explanation: `সমীকরণটিকে $\\frac{d^2y}{dt^2} + \\omega^2y = 0$ এর সাথে তুলনা করে পাই, $\\omega^2 = \\frac{${b}}{${a}} = ${omega * omega} \\implies \\omega = ${omega}$ rad/s।<br>
            পর্যায়কাল $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{${omega}}$ s।`
        };
    },

    gen_diff_eq_freq: () => {
        const a = MathUtils.getRandomElement([1, 2, 4, 5]);
        const omega = MathUtils.getRandomElement([2, 4, 6, 8]);
        const b = a * omega * omega;
        
        return {
            question: `$${a === 1 ? '' : a}\\frac{d^2x}{dt^2} + ${b}x = 0$ সমীকরণ দ্বারা বর্ণিত গতিশীল কোনো কণার কম্পাংক কত?`,
            rawOptions: [
                `$\\frac{${omega}}{2\\pi}$ Hz`,
                `$\\frac{${omega}}{\\pi}$ Hz`,
                `$\\frac{2\\pi}{${omega}}$ Hz`,
                `$${omega * 2}\\pi$ Hz`
            ],
            explanation: `সমীকরণটি হতে পাই, $\\omega^2 = \\frac{${b}}{${a}} = ${omega * omega} \\implies \\omega = ${omega}$ rad/s।<br>
            কম্পাঙ্ক $f = \\frac{\\omega}{2\\pi} = \\frac{${omega}}{2\\pi}$ Hz।`
        };
    },

    gen_time_max_disp: () => {
        const A = MathUtils.getRandomInt(2, 10);
        const k = MathUtils.getRandomElement([0.5, 1, 2, 4, 5]); 
        const t_ans = 1 / (2 * k);

        return {
            question: `একটি বস্তুকণার সরল ছন্দিত গতির সমীকরণ $x = ${A} \\sin(${k}\\pi t)$। সাম্যাবস্থান থেকে সর্বোচ্চ সরণে যেতে এটির কত সময় লাগবে?`,
            rawOptions: [
                `$${t_ans}$ s`,
                `$${t_ans * 2}$ s`,
                `$${t_ans / 2}$ s`,
                `$${t_ans * 4}$ s`
            ],
            explanation: `সর্বোচ্চ সরণের জন্য $x = A$ হতে হবে।<br>
            $\\implies ${A} = ${A} \\sin(${k}\\pi t) \\implies \\sin(${k}\\pi t) = 1$<br>
            $\\implies ${k}\\pi t = \\frac{\\pi}{2} \\implies t = \\frac{1}{2 \\times ${k}} = ${t_ans}$ s।`
        };
    },

    gen_vmax_from_A_T: () => {
        const hasMass = Math.random() > 0.5;
        const m = MathUtils.getRandomElement([0.02, 0.05, 0.1, 0.5]);
        const A_cm = MathUtils.getRandomElement([5, 10, 15, 20, 30]);
        const A = A_cm / 100;
        const T = MathUtils.getRandomElement([2, 4, 5, 8, 10]);
        
        const vmax = (2 * Math.PI * A) / T;
        
        let q = `একটি বস্তুর সর্বোচ্চ বিস্তার $${A_cm}$ cm এবং $${T}$ s দোলনকালে সরল ছন্দিত গতি সম্পন্ন। বস্তুটির সর্বোচ্চ বেগ বা দ্রুতি কত?`;
        if (hasMass) q = `$${m}$ kg ভরের বস্তু $${A_cm}$ cm বিস্তার এবং $${T}$ সেকেন্ড পর্যায়কালের সরলছন্দিত গতি প্রাপ্ত হলে বস্তুটির সর্বোচ্চ দ্রুতি কত?`;

        return {
            question: q,
            rawOptions: [
                `$${vmax.toFixed(3)}$ m/s`,
                `$${(vmax * 2).toFixed(3)}$ m/s`,
                `$${(vmax / 2).toFixed(3)}$ m/s`,
                `$${(vmax * Math.PI).toFixed(3)}$ m/s`
            ],
            explanation: `বিস্তার $A = ${A_cm}$ cm = $${A}$ m, পর্যায়কাল $T = ${T}$ s। (ভরের মানটি এখানে অপ্রয়োজনীয়/বিভ্রান্তিকর)।<br>
            সর্বোচ্চ বেগ $v_{max} = \\omega A = \\frac{2\\pi}{T} A = \\frac{2 \\times 3.1416}{${T}} \\times ${A} = ${vmax.toFixed(3)}$ m/s।`
        };
    },

    gen_vmax_from_eq: () => {
        const A = MathUtils.getRandomElement([5, 10, 15, 20]);
        const omega = MathUtils.getRandomElement([12, 24, 31, 50]);
        const phase = MathUtils.getRandomElement(['\\pi/6', '\\pi/4', '\\pi/3']);
        const ans = A * omega;

        return {
            question: `একটি সরল ছন্দিত স্পন্দন সম্পন্ন কণার সমীকরণ $y = ${A} \\sin(${omega}t - ${phase}) m$। কণাটির সর্বোচ্চ বেগ কত?`,
            rawOptions: [
                `$${ans}$ m/s`,
                `$${A}$ m/s`,
                `$${omega}$ m/s`,
                `$${ans / 2}$ m/s`
            ],
            explanation: `আদর্শ সমীকরণ $y = A \\sin(\\omega t + \\delta)$ এর সাথে তুলনা করে পাই,<br>
            বিস্তার, $A = ${A}$ m এবং কৌণিক বেগ, $\\omega = ${omega}$ rad/s।<br>
            সর্বোচ্চ বেগ, $v_{max} = \\omega A = ${omega} \\times ${A} = ${ans}$ m/s।`
        };
    },

    gen_vel_at_fraction_A: () => {
        const fractions = [
            { text: 'অর্ধেক (A/2)', n: 2, top: 3 },
            { text: 'এক-তৃতীয়াংশ (A/3)', n: 3, top: 8 },
            { text: 'এক-চতুর্থাংশ (A/4)', n: 4, top: 15 }
        ];
        const sc = MathUtils.getRandomElement(fractions);
        
        return {
            question: `স্প্রিং এ সংযুক্ত কোনো কণার সরণ বিস্তারের ${sc.text} হলে সেক্ষেত্রে বেগ কত হবে? ($v_{max}$ = সর্বোচ্চ বেগ)`,
            rawOptions: [
                `$\\frac{\\sqrt{${sc.top}}}{${sc.n}} v_{max}$`,
                `$\\frac{${sc.top}}{${sc.n}} v_{max}$`,
                `$\\frac{1}{${sc.n}} v_{max}$`,
                `$\\frac{\\sqrt{${sc.n}}}{${sc.top}} v_{max}$`
            ],
            explanation: `বেগ $v = \\omega\\sqrt{A^2 - x^2}$<br>
            সরণ $x = \\frac{A}{${sc.n}}$ বসিয়ে পাই,<br>
            $v = \\omega\\sqrt{A^2 - \\frac{A^2}{${sc.n * sc.n}}} = \\omega\\sqrt{\\frac{${sc.n * sc.n - 1}A^2}{${sc.n * sc.n}}} = \\omega A \\frac{\\sqrt{${sc.top}}}{${sc.n}}$<br>
            যেহেতু $v_{max} = \\omega A$, সুতরাং $v = \\frac{\\sqrt{${sc.top}}}{${sc.n}} v_{max}$।`
        };
    },

    gen_vel_from_A_f_x: () => {
        const A = 0.01;
        const x = 0.005;
        const f = MathUtils.getRandomElement([10, 12, 15, 20]);
        const v = 2 * Math.PI * f * Math.sqrt(A*A - x*x);

        return {
            question: `সরল ছন্দিত গতিতে চলমান একটি বস্তুর বিস্তার $${A}$ m ও কম্পাঙ্ক $${f}$ Hz। বস্তুটির $${x}$ m সরণে বেগ কত?`,
            rawOptions: [
                `$${v.toFixed(3)}$ m/s`,
                `$${(v/2).toFixed(3)}$ m/s`,
                `$${(v*2).toFixed(3)}$ m/s`,
                `$${(2 * Math.PI * f * A).toFixed(3)}$ m/s`
            ],
            explanation: `আমরা জানি, বেগ $v = \\omega\\sqrt{A^2 - x^2} = 2\\pi f\\sqrt{A^2 - x^2}$<br>
            এখানে $A = ${A}$ m, $x = ${x}$ m, $f = ${f}$ Hz।<br>
            $v = 2 \\times 3.1416 \\times ${f} \\times \\sqrt{${A}^2 - ${x}^2} = ${v.toFixed(3)}$ m/s।`
        };
    },

    gen_T_from_vmax_A: () => {
        const vmax = MathUtils.getRandomElement([6, 12, 18]);
        const A_cm = MathUtils.getRandomElement([20, 30, 40]);
        const A = A_cm / 100;
        const T = (2 * Math.PI * A) / vmax;

        return {
            question: `একটি সরলছন্দিত গতিসম্পন্ন কণার সর্বোচ্চ বেগ $${vmax}$ m/s এবং কণাটির বিস্তার $${A_cm}$ cm হলে কণাটির পর্যায়কাল কত?`,
            rawOptions: [
                `$${T.toFixed(2)}$ s`,
                `$${(T*2).toFixed(2)}$ s`,
                `$${(vmax/A).toFixed(2)}$ s`,
                `$${(A/vmax).toFixed(2)}$ s`
            ],
            explanation: `আমরা জানি, $v_{max} = \\frac{2\\pi}{T}A \\implies T = \\frac{2\\pi A}{v_{max}}$<br>
            $T = \\frac{2 \\times 3.1416 \\times ${A}}{${vmax}} = ${T.toFixed(2)}$ s।`
        };
    },

    gen_omega_from_vmax_A: () => {
        const vmax = MathUtils.getRandomElement([0.03, 0.05, 0.08]);
        const A = MathUtils.getRandomElement([0.005, 0.006, 0.010]);
        const omega = vmax / A;

        return {
            question: `একটি সরল ছন্দিত গতিসম্পন্ন কণার সর্বোচ্চ বেগ $${vmax}$ m/s এবং কণাটির বিস্তার $${A}$ m হলে কৌণিক কম্পাংক কত?`,
            rawOptions: [
                `$${omega.toFixed(1)}$ rad/s`,
                `$${(omega*2).toFixed(1)}$ rad/s`,
                `$${(1/omega).toFixed(2)}$ rad/s`,
                `$${(vmax*A).toFixed(4)}$ rad/s`
            ],
            explanation: `$v_{max} = \\omega A \\implies \\omega = \\frac{v_{max}}{A} = \\frac{${vmax}}{${A}} = ${omega.toFixed(1)}$ rad/s।`
        };
    },

    gen_acc_x_relation_T: () => {
        const T = MathUtils.getRandomElement([5, 10, 15, 20]);
        return {
            question: `সরল ছন্দিত স্পন্দনশীল একটি কণার দোলনকাল $${T}$ s। কোন সমীকরণটি এর ত্বরণ 'a' এবং সরণ 'x' এর সম্পর্ক প্রকাশ করে?`,
            rawOptions: [
                `$a = -(\\frac{2\\pi}{${T}})^2 x$`,
                `$a = -(${T*2}\\pi) x$`,
                `$a = -(\\frac{\\pi}{${T}})^2 x$`,
                `$a = -(${T}\\pi)^2 x$`
            ],
            explanation: `সরল দোলন গতি সম্পন্ন কণার ক্ষেত্রে ত্বরণ $a = -\\omega^2 x$<br>
            যেহেতু $\\omega = \\frac{2\\pi}{T}$, তাই $a = -(\\frac{2\\pi}{${T}})^2 x$।`
        };
    },

    gen_omega_from_vmax_amax: () => {
        const omega = MathUtils.getRandomElement([1.5, 2, 3, 4]);
        const vmax = MathUtils.getRandomElement([10, 12, 16, 20]);
        const amax = vmax * omega;

        return {
            question: `সরল ছন্দিত স্পন্দন সম্পন্ন কণার সর্বোচ্চ বেগ ও সর্বোচ্চ ত্বরণ যথাক্রমে $${vmax}$ m/s ও $${amax}$ m/s² হলে কৌণিক কম্পাঙ্ক কত?`,
            rawOptions: [
                `$${omega}$ rad/s`,
                `$${omega * omega}$ rad/s`,
                `$\\frac{1}{${omega}}$ rad/s`,
                `$${vmax * amax}$ rad/s`
            ],
            explanation: `সর্বোচ্চ বেগ $v_{max} = \\omega A$, সর্বোচ্চ ত্বরণ $a_{max} = \\omega^2 A$<br>
            $\\frac{a_{max}}{v_{max}} = \\frac{\\omega^2 A}{\\omega A} = \\omega$<br>
            $\\implies \\omega = \\frac{${amax}}{${vmax}} = ${omega}$ rad/s।`
        };
    },

    gen_amax_from_eq: () => {
        const A = MathUtils.getRandomElement([5, 10, 15, 20]);
        const omega = MathUtils.getRandomElement([2, 4, 5, 10]);
        const amax = omega * omega * A;
        
        return {
            question: `একটি তরঙ্গের সমীকরণ $y = ${A} \\sin(${omega}t)$ হলে, তরঙ্গটির সর্বোচ্চ ত্বরণ কত একক?`,
            rawOptions: [
                `$${amax}$`,
                `$${omega * A}$`,
                `$${A}$`,
                `$${omega * omega}$`
            ],
            explanation: `সমীকরণটিকে $y = A \\sin(\\omega t)$ এর সাথে তুলনা করে পাই, বিস্তার $A = ${A}$ এবং $\\omega = ${omega}$।<br>
            সর্বোচ্চ ত্বরণ $a_{max} = \\omega^2 A = (${omega})^2 \\times ${A} = ${amax}$ একক।`
        };
    },

    gen_T_from_a_x: () => {
        const omega = MathUtils.getRandomElement([2, 4, 5, 8, 10]);
        const x = MathUtils.getRandomElement([2, 4, 5, 10]);
        const a = omega * omega * x;
        
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const div = gcd(2, omega);
        const top = 2 / div;
        const bot = omega / div;

        let ans = top === 1 && bot === 1 ? `\\pi` : (top === 1 ? `\\frac{\\pi}{${bot}}` : `\\frac{${top}\\pi}{${bot}}`);
        
        return {
            question: `সরল দোলন গতিসম্পন্ন একটি কণার সরণ $${x}$ cm হলে এর ত্বরণ $${a}$ cm/s² হয়। এর পর্যায়কাল কত?`,
            rawOptions: [
                `$${ans}$ s`,
                `$\\frac{\\pi}{${omega}}$ s`,
                `$${ans.replace('\\pi', '')}$ s`,
                `$${bot}\\pi$ s`
            ],
            explanation: `আমরা জানি, ত্বরণের মান $a = \\omega^2 x$<br>
            $\\implies \\omega = \\sqrt{\\frac{a}{x}} = \\sqrt{\\frac{${a}}{${x}}} = ${omega}$ rad/s<br>
            পর্যায়কাল $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{${omega}} = ${ans}$ s।`
        };
    },

    gen_T_from_vmax_A_2: () => {
        const A_cm = MathUtils.getRandomElement([3, 4, 5, 6]);
        const T = MathUtils.getRandomElement([2, 3, 4, 5]);
        const omega = (2 * Math.PI) / T;
        const vmax = omega * A_cm; 
        
        return {
            question: `কোনো সরল ছন্দিত স্পন্দন গতিসম্পন্ন কণার বিস্তার $${A_cm}$ cm এবং সর্বোচ্চ বেগ $${vmax.toFixed(2)}$ cm/s হলে, কণাটির পর্যায়কাল কত?`,
            rawOptions: [
                `$${T}$ s`,
                `$${(T * 2).toFixed(2)}$ s`,
                `$${(T / 2).toFixed(2)}$ s`,
                `$${(1 / T).toFixed(2)}$ s`
            ],
            explanation: `আমরা জানি, সর্বোচ্চ বেগ $v_{max} = \\omega A = \\frac{2\\pi}{T}A$<br>
            $\\implies T = \\frac{2\\pi A}{v_{max}} = \\frac{2 \\times 3.1416 \\times ${A_cm}}{${vmax.toFixed(2)}} = ${T}$ s।`
        };
    },

    gen_f_from_T: () => {
        const T = MathUtils.getRandomElement([2, 4, 5, 10, 20]);
        const f = 1 / T;
        return {
            question: `একটি সরল দোলকের পর্যায়কাল $${T}$ s হলে এর কম্পাঙ্ক কত?`,
            rawOptions: [
                `$${f}$ Hz`,
                `$${T}$ Hz`,
                `$${(f * 2).toFixed(2)}$ Hz`,
                `$${(T * 2).toFixed(2)}$ Hz`
            ],
            explanation: `আমরা জানি, কম্পাঙ্ক $f = \\frac{1}{T} = \\frac{1}{${T}} = ${f}$ Hz।`
        };
    },

    gen_f_from_eq: () => {
        const A = MathUtils.getRandomElement([5, 10, 15, 20]);
        const omegaPi = MathUtils.getRandomElement([2, 4, 6, 8, 10]);
        const phasePi = MathUtils.getRandomElement([2, 3, 4]);
        
        const f = omegaPi / 2;

        return {
            question: `একটি সরলছন্দিত কণার গতির সমীকরণ $x = ${A} \\sin(${omegaPi}\\pi t + ${phasePi}\\pi)$। কণাটির কম্পাংক কত?`,
            rawOptions: [
                `$${f}$ Hz`,
                `$${omegaPi}$ Hz`,
                `$${f * 2}$ Hz`,
                `$${phasePi}$ Hz`
            ],
            explanation: `প্রদত্ত সমীকরণকে $x = A \\sin(\\omega t + \\delta)$ এর সাথে তুলনা করে পাই,<br>
            $\\omega = ${omegaPi}\\pi$<br>
            $\\implies 2\\pi f = ${omegaPi}\\pi \\implies f = \\frac{${omegaPi}}{2} = ${f}$ Hz।`
        };
    },

    gen_omega_from_T: () => {
        const T = MathUtils.getRandomElement([2, 5, 10, 20, 25]);
        const isPiFormat = Math.random() > 0.5;
        
        let ans, w1, w2, w3;
        if (isPiFormat) {
            ans = `$\\frac{2\\pi}{${T}}$ rad/s`;
            if (T % 2 === 0) ans = `$\\frac{\\pi}{${T/2}}$ rad/s`;
            w1 = `$\\frac{\\pi}{${T}}$ rad/s`;
            w2 = `$\\frac{2\\pi}{${T * 2}}$ rad/s`;
            w3 = `$\\frac{${T}}{\\pi}$ rad/s`;
        } else {
            ans = `$${(2 * Math.PI / T).toFixed(3)}$ rad/s`;
            w1 = `$${(Math.PI / T).toFixed(3)}$ rad/s`;
            w2 = `$${(T / Math.PI).toFixed(3)}$ rad/s`;
            w3 = `$${(4 * Math.PI / T).toFixed(3)}$ rad/s`;
        }

        return {
            question: `সরল ছন্দিত স্পন্দনে গতিশীল একটি বস্তুর দোলনকাল $${T}$ s হলে এর কৌণিক কম্পাঙ্ক কত?`,
            rawOptions: [ans, w1, w2, w3],
            explanation: `কৌণিক কম্পাঙ্ক $\\omega = \\frac{2\\pi}{T} = \\frac{2\\pi}{${T}} = ${isPiFormat ? ans : (2 * Math.PI / T).toFixed(3) + ' rad/s'}।`
        };
    },

    gen_k_from_m_omega: () => {
        const m = MathUtils.getRandomElement([2, 5, 10, 20]);
        const omega = MathUtils.getRandomElement([5, 10, 15, 20]);
        const k = m * omega * omega;

        return {
            question: `সরলছন্দিত গতিসম্পন্ন $${m}$ kg ভরের কোন বস্তুর কৌণিক কম্পাঙ্ক $${omega}$ rad/s হলে বল ধ্রুবক কত?`,
            rawOptions: [
                `$${k}$ N/m`,
                `$${m * omega}$ N/m`,
                `$${omega * omega / m}$ N/m`,
                `$${k / 2}$ N/m`
            ],
            explanation: `আমরা জানি, $\\omega = \\sqrt{\\frac{k}{m}} \\implies k = m\\omega^2$<br>
            $\\implies k = ${m} \\times (${omega})^2 = ${m} \\times ${omega * omega} = ${k}$ N/m।`
        };
    },

    gen_shm_eq_from_params: () => {
        const A = 0.1;
        const T = MathUtils.getRandomElement([2, 4, 8]);
        const phaseDeg = 30;
        const omegaCoeff = 2 / T;
        
        let omegaStr = omegaCoeff === 1 ? '\\pi' : `\\frac{\\pi}{${T/2}}`;

        return {
            question: `একটি সরল ছন্দিত গতি সম্পন্ন কণার বিস্তার $${A}$ m, পর্যায়কাল $${T}$ s এবং আদি দশা $${phaseDeg}^\\circ$। উক্ত কণাটির দোলনগতির সমীকরণ কোনটি?`,
            rawOptions: [
                `$x = ${A} \\sin(${omegaStr} t + \\frac{\\pi}{6})$`,
                `$x = ${A} \\sin(\\frac{\\pi}{${T}} t + \\frac{\\pi}{6})$`,
                `$x = ${A} \\sin(${omegaStr} t + \\frac{\\pi}{3})$`,
                `$x = 1.0 \\sin(${omegaStr} t + \\frac{\\pi}{6})$`
            ],
            explanation: `বিস্তার $A = ${A}$ m<br>
            কৌণিক বেগ $\\omega = \\frac{2\\pi}{T} = \\frac{2\\pi}{${T}} = ${omegaStr}$ rad/s<br>
            আদি দশা $\\delta = 30^\\circ = \\frac{\\pi}{6}$ rad<br>
            সমীকরণ $x = A \\sin(\\omega t + \\delta) = ${A} \\sin(${omegaStr} t + \\frac{\\pi}{6})$।`
        };
    },

    gen_T_moon_earth: () => {
        const ge = 9.8;
        const gm = 1.6;
        const Te = MathUtils.getRandomElement([1, 2, 3]);

        return {
            question: `পৃথিবী পৃষ্ঠে ($g_e = 9.8 \\text{ m/s}^2$) একটি দোলক ঘড়ি সঠিক সময় দেয়। ঘড়িটি চন্দ্রপৃষ্ঠে ($g_m = 1.6 \\text{ m/s}^2$) নেওয়া হলে পৃথিবী পৃষ্ঠের $${Te}$ h সময় চন্দ্রপৃষ্ঠে কত হবে?`,
            rawOptions: [
                `$${Te} \\sqrt{\\frac{9.8}{1.6}}$ h`,
                `$${Te} \\sqrt{\\frac{1.6}{9.8}}$ h`,
                `$\\frac{9.8}{1.6}$ h`,
                `$\\frac{1.6}{9.8}$ h`
            ],
            explanation: `দোলনকাল $T \\propto \\frac{1}{\\sqrt{g}}$<br>
            $\\implies \\frac{T_m}{T_e} = \\sqrt{\\frac{g_e}{g_m}} \\implies T_m = T_e \\times \\sqrt{\\frac{g_e}{g_m}}$<br>
            $\\implies T_m = ${Te} \\times \\sqrt{\\frac{9.8}{1.6}}$ h।`
        };
    },

    gen_T_from_L_g: () => {
        const L = MathUtils.getRandomElement([1.5, 2.45, 3.5, 4.9]);
        const g = 9.8;
        const T = 2 * Math.PI * Math.sqrt(L / g);

        return {
            question: `একটি সরল দোলকের দৈর্ঘ্য $${L}$ m। কোন স্থানে অভিকর্ষজ ত্বরণ $9.8 \\text{ m/s}^2$ হলে ঐ স্থানে দোলকটির দোলনকাল কত?`,
            rawOptions: [
                `$${T.toFixed(2)}$ s`,
                `$${(T*2).toFixed(2)}$ s`,
                `$${(T/2).toFixed(2)}$ s`,
                `$${Math.sqrt(L/g).toFixed(2)}$ s`
            ],
            explanation: `আমরা জানি, $T = 2\\pi\\sqrt{\\frac{L}{g}}$<br>
            $\\implies T = 2 \\times 3.1416 \\times \\sqrt{\\frac{${L}}{9.8}} = ${T.toFixed(2)}$ s।`
        };
    },

    gen_L_from_T_ratio: () => {
        const L1 = 0.3;
        const T1 = 0.8;
        const factor = MathUtils.getRandomElement([2, 3, 4]); 
        const T2 = T1 * factor;
        const L2 = L1 * (factor * factor);

        return {
            question: `$${L1}$ m দৈর্ঘ্যবিশিষ্ট একটি সরল দোলকের দোলনকাল $${T1.toFixed(1)}$ s। দোলনকাল $${T2.toFixed(1)}$ s করতে হলে দোলকটির দৈর্ঘ্য কত হবে?`,
            rawOptions: [
                `$${L2.toFixed(2)}$ m`,
                `$${(L2 / 2).toFixed(2)}$ m`,
                `$${(L1 * factor).toFixed(2)}$ m`,
                `$${(L2 * 2).toFixed(2)}$ m`
            ],
            explanation: `আমরা জানি, $T \\propto \\sqrt{L} \\implies \\frac{T_1}{T_2} = \\sqrt{\\frac{L_1}{L_2}}$<br>
            $\\implies L_2 = L_1 \\times (\\frac{T_2}{T_1})^2 = ${L1} \\times (\\frac{${T2.toFixed(1)}}{${T1.toFixed(1)}})^2 = ${L1} \\times ${factor}^2 = ${L2.toFixed(2)}$ m।`
        };
    },

    gen_T_sec_pendulum_length_change: () => {
        const factorSq = MathUtils.getRandomElement([1.44, 1.96, 2.25, 2.56]);
        const factor = Math.sqrt(factorSq);
        const T1 = 2;
        const T2 = T1 * factor;

        return {
            question: `কোনো সেকেন্ড দোলকের কার্যকরী দৈর্ঘ্য $${factorSq}$ গুণ করলে এর নতুন দোলনকাল কত হবে?`,
            rawOptions: [
                `$${T2.toFixed(2)}$ s`,
                `$${factor.toFixed(2)}$ s`,
                `$${(T2 * 2).toFixed(2)}$ s`,
                `$${(T1 / factor).toFixed(2)}$ s`
            ],
            explanation: `সেকেন্ড দোলকের আদি দোলনকাল $T_1 = 2$ s।<br>
            দোলনকাল $T \\propto \\sqrt{L}$<br>
            যেহেতু দৈর্ঘ্য $${factorSq}$ গুণ করা হয়েছে, দোলনকাল $\\sqrt{${factorSq}} = ${factor}$ গুণ হবে।<br>
            $\\therefore T_2 = 2 \\times ${factor} = ${T2.toFixed(2)}$ s।`
        };
    },

    gen_osc_time_from_L_change: () => {
        const L1 = 40;
        const osc1 = 40;
        const time1 = 60;
        const multiplier = MathUtils.getRandomElement([4, 9]); 
        const L2 = L1 * multiplier;
        const osc2 = 60;

        const T1 = time1 / osc1; 
        const T2 = T1 * Math.sqrt(multiplier);
        const totalTime = T2 * osc2;

        return {
            question: `$${L1}$ cm দীর্ঘ একটি সরল দোলক প্রতি মিনিটে $${osc1}$ বার দোল দেয়। যদি এর দৈর্ঘ্য $${L2}$ cm করা হয়, তবে $${osc2}$ বার দুলতে কত সময় নেবে?`,
            rawOptions: [
                `$${totalTime}$ s`,
                `$${totalTime / 60}$ min`,
                `$${totalTime / 2}$ s`,
                `$${totalTime * 2}$ s`
            ],
            explanation: `দৈর্ঘ্য $L_1 = ${L1}$ cm, $L_2 = ${L2}$ cm (অর্থাৎ ${multiplier} গুণ)।<br>
            $T \\propto \\sqrt{L}$ হওয়ায় দোলনকাল $\\sqrt{${multiplier}} = ${Math.sqrt(multiplier)}$ গুণ হবে।<br>
            আদি দোলনকাল $T_1 = \\frac{60}{${osc1}} = ${T1}$ s<br>
            নতুন দোলনকাল $T_2 = ${T1} \\times ${Math.sqrt(multiplier)} = ${T2}$ s<br>
            $\\therefore ${osc2}$ বার দুলতে সময় লাগবে = $${osc2} \\times ${T2} = ${totalTime}$ s।`
        };
    },

    gen_TA_from_TB_L_ratio: () => {
        const isADouble = Math.random() > 0.5;
        const Tb = MathUtils.getRandomElement([2, 3, 4, 5]);
        
        let question, ans, exp;
        if (isADouble) {
            question = `দুটি সরল দোলক A এবং B। যদি A এর দৈর্ঘ্য B এর দ্বিগুণ এবং B এর দোলনকাল $${Tb}$ s হয় তবে A এর দোলনকাল কত?`;
            ans = Tb * Math.sqrt(2);
            exp = `$L_A = 2L_B$<br>আমরা জানি, $T \\propto \\sqrt{L} \\implies \\frac{T_A}{T_B} = \\sqrt{\\frac{L_A}{L_B}} = \\sqrt{2}$<br>$\\implies T_A = T_B \\sqrt{2} = ${Tb} \\times 1.414 = ${ans.toFixed(2)}$ s।`;
        } else {
            question = `একটি সরল দোলকের দৈর্ঘ্য অপরটির দ্বিগুণ। দ্বিতীয় সরল দোলকের দোলনকাল $${Tb}$ s হলে প্রথমটির দোলনকাল কত?`;
            ans = Tb * Math.sqrt(2);
            exp = `$L_1 = 2L_2$<br>আমরা জানি, $\\frac{T_1}{T_2} = \\sqrt{\\frac{L_1}{L_2}} = \\sqrt{2}$<br>$\\implies T_1 = T_2 \\sqrt{2} = ${Tb} \\times 1.414 = ${ans.toFixed(2)}$ s।`;
        }

        return {
            question,
            rawOptions: [
                `$${ans.toFixed(2)}$ s`,
                `$${(ans / 2).toFixed(2)}$ s`,
                `$${(Tb * 2).toFixed(2)}$ s`,
                `$${(Tb / 2).toFixed(2)}$ s`
            ],
            explanation: exp
        };
    },

    gen_T_increase_from_L_percent: () => {
        const percentL = MathUtils.getRandomElement([21, 25.44, 44, 69]); 
        const factorL = 1 + (percentL / 100);
        const factorT = Math.sqrt(factorL);
        const percentT = (factorT - 1) * 100;

        return {
            question: `একটি সেকেন্ড দোলকের কার্যকরী দৈর্ঘ্য $${percentL}\\%$ বৃদ্ধি করা হলে দোলনকাল শতকরা কত বৃদ্ধি পাবে?`,
            rawOptions: [
                `$${percentT.toFixed(0)}\\%$`,
                `$${(percentL / 2).toFixed(0)}\\%$`,
                `$${percentL.toFixed(0)}\\%$`,
                `$${(percentT * 2).toFixed(0)}\\%$`
            ],
            explanation: `ধরি, আদি দৈর্ঘ্য $L_1 = L$<br>
            নতুন দৈর্ঘ্য $L_2 = L + L \\times \\frac{${percentL}}{100} = ${factorL}L$<br>
            আমরা জানি, $T \\propto \\sqrt{L}$<br>
            $\\frac{T_2}{T_1} = \\sqrt{\\frac{L_2}{L_1}} = \\sqrt{${factorL}} = ${factorT}$<br>
            দোলনকাল বৃদ্ধি = $(T_2 - T_1) / T_1 \\times 100\\% = (${factorT} - 1) \\times 100\\% = ${percentT.toFixed(0)}\\%$।`
        };
    },

    gen_L_ratio_from_T_ratio: () => {
        const r1 = MathUtils.getRandomElement([2, 3, 4]);
        const r2 = MathUtils.getRandomElement([3, 5, 7]);
        const r1_sq = r1 * r1;
        const r2_sq = r2 * r2;

        return {
            question: `কোনো স্থানে দুটি সরল দোলকের দোলনকালের অনুপাত $${r1}:${r2}$ হলে এদের কার্যকর দৈর্ঘ্যের অনুপাত হবে-`,
            rawOptions: [
                `$${r1_sq}:${r2_sq}$`,
                `$${r2_sq}:${r1_sq}$`,
                `$${r1}:${r2}$`,
                `$${Math.sqrt(r1).toFixed(1)}:${Math.sqrt(r2).toFixed(1)}$`
            ],
            explanation: `আমরা জানি, $T = 2\\pi\\sqrt{\\frac{L}{g}} \\implies T \\propto \\sqrt{L}$<br>
            $\\implies L \\propto T^2$<br>
            $\\frac{L_1}{L_2} = (\\frac{T_1}{T_2})^2 = (\\frac{${r1}}{${r2}})^2 = \\frac{${r1_sq}}{${r2_sq}}$<br>
            $\\therefore L_1 : L_2 = ${r1_sq} : ${r2_sq}$।`
        };
    },

    gen_pos_ek_eq_ep: () => {
        const A = MathUtils.getRandomElement([2, 4, 6, 8, 10]);
        const x = A / Math.sqrt(2);
        
        let ansStr = `$${A}\\sqrt{2}$ cm`;
        if (A % 2 === 0) {
            ansStr = `$${A / 2}\\sqrt{2}$ cm`;
        } else {
            ansStr = `$\\frac{${A}}{\\sqrt{2}}$ cm`;
        }

        return {
            question: `একটি বস্তু $${A}$ cm বিস্তারে সরল ছন্দিত স্পন্দন সম্পন্ন করছে। সাম্যবস্থা থেকে কত দূরত্বে বস্তুটির গতিশক্তি ও স্থিতিশক্তি সমান হবে?`,
            rawOptions: [
                ansStr,
                `$${A}$ cm`,
                `$${A / 2}$ cm`,
                `$\\sqrt{${A}}$ cm`
            ],
            explanation: `শর্তমতে, গতিশক্তি ($E_k$) = স্থিতিশক্তি ($E_p$)<br>
            $\\implies \\frac{1}{2}m\\omega^2(A^2 - x^2) = \\frac{1}{2}m\\omega^2x^2$<br>
            $\\implies A^2 - x^2 = x^2 \\implies 2x^2 = A^2 \\implies x^2 = \\frac{A^2}{2}$<br>
            $\\implies x = \\frac{A}{\\sqrt{2}} = \\frac{${A}}{\\sqrt{2}}$ cm $= ${ansStr}$।`
        };
    },

    gen_F_from_k_x: () => {
        const k = MathUtils.getRandomElement([50, 100, 150, 200, 250, 500]);
        const x_cm = MathUtils.getRandomElement([2, 4, 5, 10]);
        const x_m = x_cm / 100;
        const F = k * x_m;

        return {
            question: `$${k} \\text{ Nm}^{-1}$ স্প্রিং ধ্রুবকসম্পন্ন একটি স্প্রিংকে $${x_cm}$ cm প্রসারিত করতে দৈর্ঘ্য বরাবর প্রযুক্ত বল হবে-`,
            rawOptions: [
                `$${F}$ N`,
                `$${F * 100}$ N`,
                `$${F / 2}$ N`,
                `$${k / x_cm}$ N`
            ],
            explanation: `আমরা জানি, প্রযুক্ত বল (মান), $F = kx$<br>
            এখানে, স্প্রিং ধ্রুবক $k = ${k} \\text{ Nm}^{-1}$, প্রসারণ $x = ${x_cm} \\text{ cm} = ${x_m} \\text{ m}$<br>
            $\\therefore F = ${k} \\times ${x_m} = ${F}$ N।`
        };
    },

    gen_cut_spring_constant: () => {
        const k = MathUtils.getRandomElement([100, 200, 500, 1000]);
        const pieces = MathUtils.getRandomElement([2, 3, 4, 5]);
        const k_new = k * pieces;
        
        let pieceText = pieces === 2 ? 'অর্ধেক' : `$1/${pieces}$ অংশে`;

        return {
            question: `কোনো স্প্রিং এর স্প্রিং ধ্রুবক $${k} \\text{ Nm}^{-1}$। স্প্রিংটিকে কেটে ${pieceText} করলে পরিবর্তিত স্প্রিং ধ্রুবক কত হবে?`,
            rawOptions: [
                `$${k_new} \\text{ Nm}^{-1}$`,
                `$${k / pieces} \\text{ Nm}^{-1}$`,
                `$${k} \\text{ Nm}^{-1}$`,
                `$${k_new * 2} \\text{ Nm}^{-1}$`
            ],
            explanation: `স্প্রিং ধ্রুবক ($k$) এবং দৈর্ঘ্য ($L$) এর গুণফল সর্বদা ধ্রুবক থাকে। অর্থাৎ, $k \\propto \\frac{1}{L}$।<br>
            স্প্রিংটিকে কেটে ${pieceText} করা হলে দৈর্ঘ্য পূর্বের $\\frac{1}{${pieces}}$ গুণ হবে।<br>
            তাই নতুন স্প্রিং ধ্রুবক $k' = ${pieces} \\times k = ${pieces} \\times ${k} = ${k_new} \\text{ Nm}^{-1}$।`
        };
    },

    gen_T_from_m_x: () => {
        const x_m = MathUtils.getRandomElement([0.02, 0.04, 0.08, 0.1]);
        const g = 9.8;
        const T = 2 * Math.PI * Math.sqrt(x_m / g);

        return {
            question: `কোন স্প্রিং এর এক প্রান্তে $m$ ভরের একটি বস্তু ঝুলালে এটি $${x_m}$ m প্রসারিত হয়। বস্তুটি একটু টেনে ছেড়ে দিলে পর্যায়কাল কত? (ধরি $g = 9.8 \\text{ m/s}^2$)`,
            rawOptions: [
                `$${T.toFixed(3)}$ s`,
                `$${(T * 2).toFixed(3)}$ s`,
                `$${(T / 2).toFixed(3)}$ s`,
                `$${Math.sqrt(x_m/g).toFixed(3)}$ s`
            ],
            explanation: `আমরা জানি, ঝুলানো স্প্রিং এর ক্ষেত্রে, $mg = kx \\implies \\frac{m}{k} = \\frac{x}{g}$<br>
            আবার, পর্যায়কাল $T = 2\\pi\\sqrt{\\frac{m}{k}} = 2\\pi\\sqrt{\\frac{x}{g}}$<br>
            $\\therefore T = 2 \\times 3.1416 \\times \\sqrt{\\frac{${x_m}}{9.8}} = ${T.toFixed(3)}$ s।`
        };
    },

    gen_f_spring_mass: () => {
        const L_cm = MathUtils.getRandomElement([5, 10, 20, 25]);
        const L_m = L_cm / 100;
        const g = 9.8;
        const f = (1 / (2 * Math.PI)) * Math.sqrt(g / L_m);

        return {
            question: `একটি ভারহীন স্প্রিং থেকে একটি বস্তু ঝুলিয়ে দেওয়ায় স্প্রিংটির দৈর্ঘ্য $${L_cm}$ cm বৃদ্ধি পেল। একে টেনে ছেড়ে দিলে স্পন্দন কম্পাঙ্ক কত হবে?`,
            rawOptions: [
                `$${f.toFixed(2)}$ Hz`,
                `$${(f * 2).toFixed(2)}$ Hz`,
                `$${(f / 2).toFixed(2)}$ Hz`,
                `$${Math.sqrt(g/L_m).toFixed(2)}$ Hz`
            ],
            explanation: `প্রসারণ $x = ${L_cm}$ cm $= ${L_m}$ m।<br>
            আমরা জানি, দোলনকাল $T = 2\\pi\\sqrt{\\frac{x}{g}}$<br>
            কম্পাঙ্ক $f = \\frac{1}{T} = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{x}}$<br>
            $\\therefore f = \\frac{1}{2 \\times 3.1416} \\times \\sqrt{\\frac{9.8}{${L_m}}} = ${f.toFixed(2)}$ Hz।`
        };
    },

    gen_x_from_m_k: () => {
        const m = MathUtils.getRandomElement([2, 5, 10, 20]);
        const k = MathUtils.getRandomElement([100, 200, 490, 500, 980]);
        const g = 9.8;
        const x_m = (m * g) / k;

        return {
            question: `$${m}$ kg ভরের একটি বস্তুকে স্প্রিং থেকে ঝুলানো হল যার স্প্রিং ধ্রুবক $${k} \\text{ N/m}$। স্প্রিং এর দৈর্ঘ্য বৃদ্ধি কত হবে? ($g = 9.8 \\text{ m/s}^2$)`,
            rawOptions: [
                `$${x_m.toFixed(3)}$ m`,
                `$${(x_m * 2).toFixed(3)}$ m`,
                `$${(x_m * 100).toFixed(1)}$ m`,
                `$${(m / k).toFixed(3)}$ m`
            ],
            explanation: `সাম্যাবস্থায়, বস্তুর ওজন = স্প্রিং এর প্রত্যয়নী বল<br>
            $\\implies mg = kx$<br>
            $\\implies x = \\frac{mg}{k} = \\frac{${m} \\times 9.8}{${k}} = \\frac{${(m * 9.8).toFixed(1)}}{${k}} = ${x_m.toFixed(3)}$ m।`
        };
    },
    
    gen_T_other_planet: () => {
        const g_factor = MathUtils.getRandomElement([2, 3, 4, 9, 16]);
        const T_earth = 2;
        const T_planet = T_earth / Math.sqrt(g_factor);

        return {
            question: `একটি সেকেন্ড দোলককে '$${g_factor}g$' অভিকর্ষজ ত্বরণের একটি গ্রহে নিয়ে গেলে এর দোলনকাল কত হবে? (যেখানে $g$ = পৃথিবীর অভিকর্ষজ ত্বরণ)`,
            rawOptions: [
                `$${T_planet.toFixed(2)}$ s`,
                `$${(T_earth * Math.sqrt(g_factor)).toFixed(2)}$ s`,
                `$${(T_earth * g_factor).toFixed(2)}$ s`,
                `$${(T_earth / g_factor).toFixed(2)}$ s`
            ],
            explanation: `সেকেন্ড দোলকের পৃথিবীতে দোলনকাল, $T_e = 2$ s।<br>
            আমরা জানি, $T \\propto \\frac{1}{\\sqrt{g}}$<br>
            গ্রহে ত্বরণ $g_p = ${g_factor}g$<br>
            $\\frac{T_p}{T_e} = \\sqrt{\\frac{g}{g_p}} = \\sqrt{\\frac{g}{${g_factor}g}} = \\frac{1}{\\sqrt{${g_factor}}} = \\frac{1}{${Math.sqrt(g_factor)}}$<br>
            $\\implies T_p = \\frac{T_e}{${Math.sqrt(g_factor)}} = \\frac{2}{${Math.sqrt(g_factor)}} = ${T_planet.toFixed(2)}$ s।`
        };
    },

    gen_clock_beats_lost: () => {
        const T_new = MathUtils.getRandomElement([2.001, 2.002, 2.004, 2.005]);
        const beats_lost_per_hour = 3600 - (3600 * 2 / T_new);

        return {
            question: `একটি সেকেন্ড দোলক ঘড়ির দোলনকাল পরিবর্তিত হয়ে $${T_new}$ s হলে, ঘড়িটি ঘন্টায় কতটি বিট (অর্ধদোলন) হারাবে?`,
            rawOptions: [
                `$${beats_lost_per_hour.toFixed(1)}$ টি`,
                `$${(beats_lost_per_hour * 2).toFixed(1)}$ টি`,
                `$${(beats_lost_per_hour / 2).toFixed(1)}$ টি`,
                `$3600$ টি`
            ],
            explanation: `সঠিক সেকেন্ড দোলক ২ সেকেন্ডে ২টি বিট বা অর্ধদোলন দেয়।<br>
            সুতরাং, ১ ঘন্টায় ($3600$ সেকেন্ডে) দেয় = $3600$ টি বিট।<br>
            পরিবর্তিত ঘড়িটি $${T_new}$ সেকেন্ডে দেয় = ২টি বিট।<br>
            তাহলে এটি ১ ঘন্টায় ($3600$ সেকেন্ডে) বিট দেয় = $\\frac{2 \\times 3600}{${T_new}} = ${(3600 * 2 / T_new).toFixed(2)}$ টি বিট।<br>
            অতএব, প্রতি ঘন্টায় বিট হারায় = $3600 - ${(3600 * 2 / T_new).toFixed(2)} = ${beats_lost_per_hour.toFixed(1)}$ টি।`
        };
    },

    gen_percent_increase_T: () => {
        const percent_L = MathUtils.getRandomElement([2.01, 4.04, 6.09, 8.16]);
        const L_factor = 1 + (percent_L / 100);
        const T_factor = Math.sqrt(L_factor);
        const percent_T = (T_factor - 1) * 100;

        return {
            question: `একটি সেকেন্ড দোলকের কার্যকরী দৈর্ঘ্য $${percent_L}\\%$ বৃদ্ধি করলে, এর দোলনকাল শতকরা কত বৃদ্ধি পাবে?`,
            rawOptions: [
                `$${percent_T.toFixed(1)}\\%$`,
                `$${percent_L.toFixed(1)}\\%$`,
                `$${(percent_T * 2).toFixed(1)}\\%$`,
                `$${(percent_L / 2).toFixed(1)}\\%$`
            ],
            explanation: `ধরি আদি দৈর্ঘ্য $L_1 = L$<br>
            নতুন দৈর্ঘ্য $L_2 = L + L \\times \\frac{${percent_L}}{100} = ${L_factor.toFixed(4)}L$<br>
            আমরা জানি, $T \\propto \\sqrt{L}$<br>
            $\\frac{T_2}{T_1} = \\sqrt{\\frac{L_2}{L_1}} = \\sqrt{${L_factor.toFixed(4)}} = ${T_factor.toFixed(2)}$<br>
            দোলনকাল বৃদ্ধি = $(T_2 - T_1) / T_1 \\times 100\\% = (${T_factor.toFixed(2)} - 1) \\times 100\\% = ${percent_T.toFixed(1)}\\%$।`
        };
    },

    gen_T_length_doubled: () => {
        const multipliers = [
            { text: 'দ্বিগুণ', val: 2 },
            { text: 'তিনগুণ', val: 3 },
            { text: 'চারগুণ', val: 4 }
        ];
        const mult = MathUtils.getRandomElement(multipliers);
        
        let ansHTML;
        if(mult.val === 4) ansHTML = `$4$ s`;
        else ansHTML = `$2\\sqrt{${mult.val}}$ s`;

        return {
            question: `একটি সেকেন্ড দোলকের কার্যকর দৈর্ঘ্য ${mult.text} করা হলে দোলনকাল কত হবে?`,
            rawOptions: [
                ansHTML,
                `$${mult.val}$ s`,
                `$\\sqrt{${mult.val}}$ s`,
                `$\\frac{1}{\\sqrt{${mult.val}}}$ s`
            ],
            explanation: `সেকেন্ড দোলকের দোলনকাল, $T_1 = 2$ s।<br>
            আমরা জানি, $T \\propto \\sqrt{L}$<br>
            কার্যকর দৈর্ঘ্য ${mult.text} করা হলে পরিবর্তিত দোলনকাল, $T_2 = T_1\\sqrt{${mult.val}} = 2\\sqrt{${mult.val}}$ s।`
        };
    },

    gen_L_from_osc_time: () => {
        const min = MathUtils.getRandomElement([1, 2, 3]);
        const osc = MathUtils.getRandomElement([30, 60, 90]);
        const totalTime = min * 60;
        const T = totalTime / osc;
        const g = 9.8;
        const L = (T * T * g) / (4 * Math.PI * Math.PI);

        return {
            question: `একটি সরল দোলক $${min}$ মিনিটে $${osc}$ বার দোলন দেয়। দোলকটির দৈর্ঘ্য (m) নির্ণয় কর।`,
            rawOptions: [
                `$${L.toFixed(3)}$`,
                `$${(L * 2).toFixed(3)}$`,
                `$${(L / 2).toFixed(3)}$`,
                `$${Math.sqrt(L).toFixed(3)}$`
            ],
            explanation: `পর্যায়কাল $T = \\frac{${min} \\times 60}{${osc}} = ${T}$ s।<br>
            আমরা জানি, $T = 2\\pi\\sqrt{\\frac{L}{g}} \\implies L = \\frac{T^2g}{4\\pi^2}$<br>
            $\\implies L = \\frac{${T}^2 \\times 9.8}{4 \\times (3.1416)^2} = ${L.toFixed(3)}$ m।`
        };
    },

    gen_depth_fraction_g: () => {
        const fractions = [
            { text: 'অর্ধেক', val: 2 },
            { text: 'এক-তৃতীয়াংশ', val: 3 },
            { text: 'এক-চতুর্থাংশ', val: 4 }
        ];
        const frac = MathUtils.getRandomElement(fractions);

        return {
            question: `পৃথিবীর ব্যাসার্ধ ($R$) এর তুলনায় কত গভীরতায় অভিকর্ষজ ত্বরণের মান ভূ-পৃষ্ঠের অভিকর্ষজ ত্বরণের ${frac.text} হবে?`,
            rawOptions: [
                `$\\frac{${frac.val - 1}R}{${frac.val}}$`,
                `$\\frac{R}{${frac.val}}$`,
                `$\\frac{R}{${frac.val * 2}}$`,
                `$\\frac{${frac.val - 1}R}{${frac.val * 2}}$`
            ],
            explanation: `গভীরতায় অভিকর্ষজ ত্বরণ, $g_d = g(1-\\frac{d}{R})$<br>
            শর্তমতে, $g_d = \\frac{g}{${frac.val}}$<br>
            $\\implies \\frac{g}{${frac.val}} = g(1-\\frac{d}{R}) \\implies \\frac{1}{${frac.val}} = 1-\\frac{d}{R}$<br>
            $\\implies \\frac{d}{R} = 1 - \\frac{1}{${frac.val}} = \\frac{${frac.val - 1}}{${frac.val}}$<br>
            $\\implies d = \\frac{${frac.val - 1}R}{${frac.val}}$।`
        };
    },

    gen_weight_change_from_L: () => {
        const percent = MathUtils.getRandomElement([5, 10, 15, 20]);
        const loc1 = MathUtils.getRandomElement(['রাজশাহীতে', 'ঢাকায়', 'সিলেটে']);
        const loc2 = MathUtils.getRandomElement(['কুমিল্লায়', 'খুলনায়', 'বরিশালে']);
        
        return {
            question: `${loc2} অবস্থিত একটি সেকেণ্ড দোলকের দৈর্ঘ্য ${loc1} অবস্থিত দোলকের চেয়ে $${percent}\\%$ বেশি হলে, কোনো বস্তুকে ${loc1} থেকে ${loc2} নেয়া হলে তার ওজন কত হবে?`,
            rawOptions: [
                `$${percent}\\%$ বেশি`,
                `$${percent}\\%$ কম`,
                `সমান থাকবে`,
                `$\\sqrt{${percent}}\\%$ বেশি`
            ],
            explanation: `সেকেন্ড দোলকের ক্ষেত্রে পর্যায়কাল $T$ ধ্রুবক (2s)।<br>
            আমরা জানি, $T = 2\\pi\\sqrt{\\frac{L}{g}} \\implies g \\propto L$<br>
            যেহেতু ${loc2} দৈর্ঘ্য $${percent}\\%$ বেশি, তাই সেখানে অভিকর্ষজ ত্বরণ ($g$) ও $${percent}\\%$ বেশি হবে।<br>
            ওজন $W = mg$, তাই $g$ যত শতাংশ বাড়বে, ওজনও তত শতাংশ বাড়বে।<br>
            অর্থাৎ, ওজন $${percent}\\%$ বেশি হবে।`
        };
    }
};

window.Ch8Generators = Ch8Generators;