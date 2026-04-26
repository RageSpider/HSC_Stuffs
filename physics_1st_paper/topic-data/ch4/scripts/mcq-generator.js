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

    gen_T_percent_increase_from_L_increase: () => {
        const increaseL = MathUtils.getRandomElement([25.6, 44, 69, 96]); 
        let percentT = 0;
        
        if(increaseL === 25.6) percentT = 12;
        else if(increaseL === 44) percentT = 20;
        else if(increaseL === 69) percentT = 30;
        else if(increaseL === 96) percentT = 40;

        return {
            question: `একটি সেকেন্ড দোলকের কার্যকরী দৈর্ঘ্য $${increaseL}\\%$ বৃদ্ধি করা হলে দোলনকাল কত বৃদ্ধি হবে?`,
            rawOptions: [
                `$${percentT}\\%$`,
                `$${increaseL}\\%$`,
                `$${(percentT * 2).toFixed(1)}\\%$`,
                `$${(increaseL / 2).toFixed(1)}\\%$`
            ],
            explanation: `আমরা জানি, $T \\propto \\sqrt{L}$।<br>
            $\\frac{T_2}{T_1} = \\sqrt{\\frac{L_2}{L_1}}$<br>
            এখানে $L_2 = L_1 + ${increaseL}\\% L_1 = ${(1 + increaseL/100).toFixed(3)} L_1$<br>
            $\\implies \\frac{T_2}{T_1} = \\sqrt{${(1 + increaseL/100).toFixed(3)}} = ${(1 + percentT/100).toFixed(2)}$<br>
            দোলনকাল বৃদ্ধি = $(${1 + percentT/100} - 1) \\times 100\\% = ${percentT}\\%$।`
        };
    },

    gen_L_multiplier_from_T_percent: () => {
        const percentT = MathUtils.getRandomElement([20, 50, 100]);
        const ratio = 1 + percentT / 100;
        const L_ratio = ratio * ratio;
        const L_increase = L_ratio - 1;

        return {
            question: `একটি সরল দোলকের দোলনকাল $${percentT}\\%$ বৃদ্ধি করতে এর কার্যকরী দৈর্ঘ্য কতগুণ বাড়াতে হবে?`,
            rawOptions: [
                `$${L_increase.toFixed(2)}$ গুণ`,
                `$${L_ratio.toFixed(2)}$ গুণ`,
                `$${ratio.toFixed(2)}$ গুণ`,
                `$${(percentT / 100).toFixed(2)}$ গুণ`
            ],
            explanation: `$T \\propto \\sqrt{L} \\implies \\frac{L_2}{L_1} = (\\frac{T_2}{T_1})^2$<br>
            $T_2 = T_1 + ${percentT}\\% T_1 = ${ratio} T_1$<br>
            $L_2 = L_1 \\times (${ratio})^2 = ${L_ratio.toFixed(2)} L_1$<br>
            $L_2 = L_1 + ${L_increase.toFixed(2)} L_1$।<br>
            অর্থাৎ $${L_increase.toFixed(2)}$ গুণ বাড়াতে হবে।`
        };
    },

    gen_L_ratio_from_T_ratio: () => {
        const t1 = MathUtils.getRandomElement([2, 3, 4]);
        const t2 = MathUtils.getRandomElement([3, 5, 7]);
        const l1 = t1 * t1;
        const l2 = t2 * t2;

        return {
            question: `কোনো স্থানে দুটি সরল দোলকের দোলনকালের অনুপাত $${t1}:${t2}$ হলে এদের কার্যকর দৈর্ঘ্যের অনুপাত হবে-`,
            rawOptions: [
                `$${l1}:${l2}$`,
                `$${t1}:${t2}$`,
                `$${t2}:${t1}$`,
                `$${l2}:${l1}$`
            ],
            explanation: `আমরা জানি, $\\frac{T_1}{T_2} = \\sqrt{\\frac{L_1}{L_2}}$<br>
            $\\implies \\frac{L_1}{L_2} = (\\frac{T_1}{T_2})^2 = (\\frac{${t1}}{${t2}})^2 = \\frac{${l1}}{${l2}}$<br>
            $\\therefore L_1 : L_2 = ${l1} : ${l2}$।`
        };
    },

    gen_U2_from_U1_x1_x2: () => {
        const x1 = MathUtils.getRandomElement([2, 3, 4]);
        const factor = MathUtils.getRandomElement([2, 3, 4, 5]);
        const x2 = x1 * factor;
        const ans = factor * factor;

        return {
            question: `একটি স্প্রিং এর $${x1}$ cm সংকোচনের ফলে স্প্রিংটির বিভব শক্তি হয় $U$। যদি স্প্রিংটিকে $${x2}$ cm সংকোচন করা হয় তাহলে স্প্রিং এর বিভব শক্তি হবে-`,
            rawOptions: [
                `$${ans}U$`,
                `$U/${ans}$`,
                `$${factor}U$`,
                `$U/${factor}$`
            ],
            explanation: `বিভবশক্তি $U = \\frac{1}{2}kx^2 \\implies U \\propto x^2$<br>
            $\\frac{U_2}{U_1} = (\\frac{x_2}{x_1})^2 = (\\frac{${x2}}{${x1}})^2 = ${factor}^2 = ${ans}$<br>
            $\\therefore U_2 = ${ans} U_1 = ${ans}U$।`
        };
    },

    gen_E2_from_E1_A_multiplier: () => {
        const multiplier = MathUtils.getRandomElement([2, 3, 4]);
        const ans = multiplier * multiplier;

        return {
            question: `সরল ছন্দিত গতিতে চলমান একটি বস্তুর মোট শক্তি $E$। কম্পাঙ্ক অপরিবর্তিত রেখে বিস্তার $${multiplier}$ গুণ করলে বস্তুর মোট শক্তি কত হবে?`,
            rawOptions: [
                `$${ans}E$`,
                `$${multiplier}E$`,
                `$E/${multiplier}$`,
                `$E/${ans}$`
            ],
            explanation: `আমরা জানি, মোট শক্তি $E = \\frac{1}{2}kA^2$<br>
            যখন কম্পাঙ্ক (বা k) স্থির থাকে, তখন $E \\propto A^2$<br>
            বিস্তার $${multiplier}$ গুণ করা হলে, মোট শক্তি $(${multiplier})^2 = ${ans}$ গুণ হবে। অর্থাৎ $E' = ${ans}E$।`
        };
    },

    gen_x_for_equal_kinetic_potential: () => {
        const A = MathUtils.getRandomElement([4, 6, 8, 10]);
        const x_sq = (A * A) / 2;
        const x = Math.sqrt(x_sq);
        let ans_str = `\\frac{${A}}{\\sqrt{2}}`;
        if (A % 2 === 0) {
            ans_str = `${A / 2}\\sqrt{2}`;
        }

        return {
            question: `একটি বস্তু $${A}$ cm বিস্তারে সরল ছন্দিত স্পন্দন সম্পন্ন করছে। সাম্যবস্থা থেকে কত দূরত্বে বস্তুটির গতিশক্তি ও স্থিতিশক্তি সমান হবে?`,
            rawOptions: [
                `$${ans_str}$ cm`,
                `$${A / 2}$ cm`,
                `$${x_sq}$ cm`,
                `$\\sqrt{${A}}$ cm`
            ],
            explanation: `শর্তমতে, $E_k = E_p$<br>
            $\\implies \\frac{1}{2}k(A^2 - x^2) = \\frac{1}{2}kx^2$<br>
            $\\implies A^2 - x^2 = x^2 \\implies 2x^2 = A^2 \\implies x = \\frac{A}{\\sqrt{2}}$<br>
            $\\implies x = \\frac{${A}}{\\sqrt{2}} = ${ans_str}$ cm।`
        };
    },

    gen_spring_compression_from_collision: () => {
        const v = MathUtils.getRandomElement([2, 3, 4]);
        const m = MathUtils.getRandomElement([2, 4, 5]);
        const k = MathUtils.getRandomElement([100, 200, 500]);
        const x = Math.sqrt((m * v * v) / k);

        return {
            question: `$${v}$ m/s বেগে চলন্ত $${m}$ kg ভরের একটি বস্তু, স্প্রিংযুক্ত ভরশূন্য ও $${k}$ N/m স্প্রিং ধ্রুবক সম্পন্ন বাম্পারের সঙ্গে সংঘর্ষ হয়। স্প্রিংটির সর্বোচ্চ সংকোচন কত?`,
            rawOptions: [
                `$${x.toFixed(2)}$ m`,
                `$${(x * 2).toFixed(2)}$ m`,
                `$${(x / 2).toFixed(2)}$ m`,
                `$${(v * m / k).toFixed(3)}$ m`
            ],
            explanation: `বস্তুটির সমস্ত গতিশক্তি স্প্রিং এর বিভবশক্তিতে রূপান্তরিত হয়।<br>
            $\\frac{1}{2}mv^2 = \\frac{1}{2}kx^2$<br>
            $\\implies x = \\sqrt{\\frac{mv^2}{k}} = \\sqrt{\\frac{${m} \\times ${v}^2}{${k}}} = \\sqrt{\\frac{${m * v * v}}{${k}}} = ${x.toFixed(2)}$ m।`
        };
    },

    gen_F_from_k_x: () => {
        const k = MathUtils.getRandomElement([100, 150, 200]);
        const x_cm = MathUtils.getRandomElement([2, 4, 5]);
        const x = x_cm / 100;
        const F = k * x;

        return {
            question: `$${k}$ N/m স্প্রিং ধ্রুবকসম্পন্ন একটি স্প্রিংকে $${x_cm}$ cm প্রসারিত করতে দৈর্ঘ্য বরাবর প্রযুক্ত বল হবে-`,
            rawOptions: [
                `$${F}$ N`,
                `$${(k * x_cm).toFixed(1)}$ N`,
                `$${(F / 2).toFixed(1)}$ N`,
                `$${(F * 2).toFixed(1)}$ N`
            ],
            explanation: `আমরা জানি, প্রযুক্ত বল $F = kx$<br>
            এখানে স্প্রিং ধ্রুবক $k = ${k}$ N/m এবং প্রসারণ $x = ${x_cm}$ cm = $${x}$ m<br>
            $\\therefore F = ${k} \\times ${x} = ${F}$ N।`
        };
    },

    gen_keq_series: () => {
        const k1 = MathUtils.getRandomElement([200, 300, 400]);
        const k2 = MathUtils.getRandomElement([300, 600]);
        const keq = (k1 * k2) / (k1 + k2);

        return {
            question: `দুটি স্প্রিং এর বল ধ্রুবক $${k1}$ N/m ও $${k2}$ N/m হলে শ্রেণিতে যুক্ত থাকলে তাদের বল ধ্রুবক কত হবে?`,
            rawOptions: [
                `$${keq.toFixed(0)}$ N/m`,
                `$${k1 + k2}$ N/m`,
                `$${Math.abs(k1 - k2)}$ N/m`,
                `$${Math.max(k1, k2)}$ N/m`
            ],
            explanation: `স্প্রিং দুটি শ্রেণিতে যুক্ত থাকলে তুল্য স্প্রিং ধ্রুবক $k$ হবে,<br>
            $\\frac{1}{k} = \\frac{1}{k_1} + \\frac{1}{k_2} = \\frac{1}{${k1}} + \\frac{1}{${k2}}$<br>
            $\\implies k = \\frac{${k1} \\times ${k2}}{${k1} + ${k2}} = ${keq.toFixed(0)}$ N/m।`
        };
    },

    gen_T_from_spring_extension: () => {
        const e_cm = MathUtils.getRandomElement([8, 10, 20]);
        const e = e_cm / 100;
        const T = 2 * Math.PI * Math.sqrt(e / 9.8);

        return {
            question: `কোন স্প্রিং এর এক প্রান্তে $m$ ভরের একটি বস্তু ঝুলালে এটি $${e_cm}$ cm প্রসারিত হয়। বস্তুটি একটু টেনে ছেড়ে দিলে পর্যায়কাল কত?`,
            rawOptions: [
                `$${T.toFixed(2)}$ s`,
                `$${(T * 2).toFixed(2)}$ s`,
                `$${(T / 2).toFixed(2)}$ s`,
                `$${Math.sqrt(e/9.8).toFixed(3)}$ s`
            ],
            explanation: `আমরা জানি, স্প্রিং-এর দোলনকাল $T = 2\\pi\\sqrt{\\frac{m}{k}}$।<br>
            আবার, $mg = ke \\implies \\frac{m}{k} = \\frac{e}{g}$<br>
            $\\therefore T = 2\\pi\\sqrt{\\frac{e}{g}} = 2 \\times 3.1416 \\times \\sqrt{\\frac{${e}}{9.8}} = ${T.toFixed(2)}$ s।`
        };
    },

    gen_x_from_m_k: () => {
        const m = MathUtils.getRandomElement([2, 5, 10]);
        const k = MathUtils.getRandomElement([100, 200, 500]);
        const x = (m * 9.8) / k;

        return {
            question: `$${m}$ kg ভরের একটি বস্তুকে স্প্রিং থেকে ঝুলানো হল যার স্প্রিং ধ্রুবক $${k}$ N/m। স্প্রিং এর দৈর্ঘ্য বৃদ্ধি কত হবে?`,
            rawOptions: [
                `$${x.toFixed(2)}$ m`,
                `$${(x * 100).toFixed(2)}$ m`,
                `$${(k / (m * 9.8)).toFixed(2)}$ m`,
                `$${(m / k).toFixed(3)}$ m`
            ],
            explanation: `সাম্যাবস্থায়, বস্তুর ওজন = স্প্রিং এর প্রত্যয়নী বল<br>
            $mg = kx \\implies x = \\frac{mg}{k}$<br>
            $\\therefore x = \\frac{${m} \\times 9.8}{${k}} = ${x.toFixed(2)}$ m।`
        };
    },

    gen_T_sec_pendulum_length_mult: () => {
        const multipliers = [
            { m: 2, ans: '2\\sqrt{2}', val: 2.828 },
            { m: 4, ans: '4', val: 4 },
            { m: 9, ans: '6', val: 6 },
            { m: 16, ans: '8', val: 8 }
        ];
        const item = MathUtils.getRandomElement(multipliers);
        
        return {
            question: `একটি সেকেন্ড দোলকের কার্যকর দৈর্ঘ্য $${item.m}$ গুণ করা হলে দোলনকাল কত হবে?`,
            rawOptions: [
                `$${item.ans}$ s`,
                `$${item.m}$ s`,
                `$${item.val * 2}$ s`,
                `$\\sqrt{${item.m}}$ s`
            ],
            explanation: `আমরা জানি, সেকেন্ড দোলকের আদি দোলনকাল $T_1 = 2$ s।<br>
            দোলনকাল, $T \\propto \\sqrt{L}$<br>
            কার্যকর দৈর্ঘ্য $${item.m}$ গুণ করা হলে, পরিবর্তিত দোলনকাল $T_2 = T_1 \\sqrt{${item.m}} = 2 \\times ${Math.sqrt(item.m)} = ${item.ans}$ s।`
        };
    },

    gen_T_percent_small_increase: () => {
        const p = MathUtils.getRandomElement([1, 2, 3, 4]);
        const increase = p / 2;
        return {
            question: `একটি সেকেন্ড দোলকের কার্যকরী দৈর্ঘ্য $${p}\\%$ বৃদ্ধি করলে, এর দোলনকাল শতকরা কত বৃদ্ধি পাবে?`,
            rawOptions: [
                `$${increase.toFixed(1)}\\%$`,
                `$${p}\\%$`,
                `$${(p * 2).toFixed(1)}\\%$`,
                `$${(increase / 2).toFixed(2)}\\%$`
            ],
            explanation: `আমরা জানি, $T = 2\\pi\\sqrt{\\frac{L}{g}} \\implies T \\propto L^{1/2}$<br>
            ক্ষুদ্র পরিবর্তনের ক্ষেত্রে শতকরা ত্রুটির সূত্রানুযায়ী:<br>
            $\\frac{\\Delta T}{T} \\times 100\\% = \\frac{1}{2} (\\frac{\\Delta L}{L} \\times 100\\%)$<br>
            $\\implies$ দোলনকাল বৃদ্ধি $= \\frac{1}{2} \\times ${p}\\% = ${increase.toFixed(1)}\\%$।`
        };
    },

    gen_T_moon_from_earth_radius_mass: () => {
        const x = MathUtils.getRandomElement([3, 4, 5]); 
        const y = MathUtils.getRandomElement([64, 81, 100]); 
        const Tm = (2 * Math.sqrt(y)) / x;
        
        return {
            question: `একটি সেকেণ্ড দোলক ভূপৃষ্ঠে সঠিক সময় দেয়। চন্দ্রে নিয়ে গেলে এর দোলনকাল কত হবে? পৃথিবীর ব্যাসার্ধ চন্দ্রের ব্যাসার্ধের $${x}$ গুণ এবং পৃথিবীর ভর চন্দ্রের ভরের $${y}$ গুণ।`,
            rawOptions: [
                `$${Tm.toFixed(1)}$ s`,
                `$${(Tm * 2).toFixed(1)}$ s`,
                `$${(Tm / 2).toFixed(1)}$ s`,
                `$${(Tm * x).toFixed(1)}$ s`
            ],
            explanation: `$g = \\frac{GM}{R^2} \\implies g \\propto \\frac{M}{R^2}$<br>
            $\\frac{g_m}{g_e} = \\frac{M_m}{M_e} \\times (\\frac{R_e}{R_m})^2 = \\frac{1}{${y}} \\times (${x})^2 = \\frac{${x*x}}{${y}}$<br>
            দোলনকাল $T \\propto \\frac{1}{\\sqrt{g}}$<br>
            $\\implies T_m = T_e \\sqrt{\\frac{g_e}{g_m}} = 2 \\times \\sqrt{\\frac{${y}}{${x*x}}} = \\frac{2 \\times ${Math.sqrt(y)}}{${x}} = ${Tm.toFixed(1)}$ s।`
        };
    },

    gen_depth_for_g_fraction: () => {
        const fractions = [
            { text: 'অর্ধেক', val: 2, ans: 'R/2', w1: 'R/4', w2: 'R/8', w3: 'R/16' },
            { text: 'এক-তৃতীয়াংশ', val: 3, ans: '2R/3', w1: 'R/3', w2: 'R/6', w3: 'R/9' },
            { text: 'এক-চতুর্থাংশ', val: 4, ans: '3R/4', w1: 'R/4', w2: 'R/2', w3: 'R/8' }
        ];
        const frac = MathUtils.getRandomElement(fractions);
        
        return {
            question: `পৃথিবীর ব্যাসার্ধ ($R$) এর তুলনায় কত গভীরতায় অভিকর্ষজ ত্বরণের মান ভূ-পৃষ্ঠের অভিকর্ষজ ত্বরণের ${frac.text} হবে?`,
            rawOptions: [
                `$${frac.ans}$`,
                `$${frac.w1}$`,
                `$${frac.w2}$`,
                `$${frac.w3}$`
            ],
            explanation: `গভীরতায় অভিকর্ষজ ত্বরণ, $g' = g(1-\\frac{d}{R})$<br>
            শর্তমতে, $g' = \\frac{g}{${frac.val}}$<br>
            $\\implies \\frac{g}{${frac.val}} = g(1-\\frac{d}{R}) \\implies \\frac{1}{${frac.val}} = 1-\\frac{d}{R}$<br>
            $\\implies \\frac{d}{R} = 1 - \\frac{1}{${frac.val}} = \\frac{${frac.val - 1}}{${frac.val}}$<br>
            $\\implies d = ${frac.ans}$।`
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
            যেহেতু দৈর্ঘ্য $${percent}\\%$ বেশি, তাই অভিকর্ষজ ত্বরণ $g$ এর মানও $${percent}\\%$ বেশি হবে।<br>
            ওজন $W = mg$, তাই ওজনও $${percent}\\%$ বেশি হবে।`
        };
    }
};

window.Ch8Generators = Ch8Generators;