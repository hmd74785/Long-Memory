document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('counter');
    const progress = document.getElementById('progress');
    const progressPercentage = document.getElementById('progress-percentage');
    const counterRing = document.querySelector('.counter-ring');
    const container = document.querySelector('.container');
    const countLimit = document.getElementById('countLimit');
    const counterContainer = document.querySelector('.counter-container');
    const touchButton = document.querySelector('.click-text');
    const keyButton = document.querySelector('.key');
    
    let count = 0;
    let maxCount = parseInt(countLimit.value);
    
    // إنشاء عناصر الصوت
    const reachTenSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'); // صوت مميز للرقم 10
    const resetSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // صوت إعادة التعيين
    const tickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'); // صوت النقرات العادية
    
    // ضبط مستوى الصوت
    reachTenSound.volume = 0.7;
    resetSound.volume = 0.6;
    tickSound.volume = 0.6;
    
    // دالة تشغيل الصوت مع معالجة الأخطاء
    const playSound = (sound) => {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.log('تعذر تشغيل الصوت');
            console.error(error);
        });
    };
    
    // تحميل مسبق للأصوات
    const preloadSounds = () => {
        reachTenSound.load();
        resetSound.load();
        tickSound.load();
    };
    
    // تحميل الأصوات عند بدء التطبيق
    preloadSounds();
    
    // تحديث العداد
    const updateCounter = () => {
        const oldCount = count;
        count = (count + 1) % (maxCount + 1);
        
        if (count === maxCount) {
            // صوت خاص عند الوصول للرقم المستهدف
            playSound(reachTenSound);
            
            // تأثير وميض قوي للعداد
            counter.style.textShadow = '0 0 50px #fff, 0 0 30px #4fc3f7';
            setTimeout(() => {
                counter.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
            }, 800);
            
            // تسريع دوران الحلقات
            counterRing.style.animationDuration = '0.5s';
        } else if (count === 0) {
            // صوت إعادة التعيين
            playSound(resetSound);
            
            // إعادة تعيين سرعة الدوران
            counterRing.style.animationDuration = '3s';
            
            // إعادة تعيين شريط التقدم بتأثير متحرك
            progress.style.transition = 'width 0.5s ease';
            progress.style.width = '0%';
            
            // تأثير وميض للعداد
            counter.style.textShadow = '0 0 30px #fff';
            setTimeout(() => {
                counter.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
            }, 500);
        } else {
            // صوت النقرة للأرقام العادية
            playSound(tickSound);
        }
        
        // تحريك الرقم بشكل متحرك
        animateValue(oldCount, count, 200);
        
        // تحديث شريط التقدم
        updateProgress();
        
        // إضافة تأثير النبض
        counter.classList.remove('animate');
        void counter.offsetWidth;
        counter.classList.add('animate');
    };
    
    // تحديث شريط التقدم
    const updateProgress = () => {
        const percentage = (count / maxCount) * 100;
        progress.style.width = `${percentage}%`;
        
        // تحديث النسبة المئوية
        const formattedPercentage = percentage.toFixed(0).padStart(2, '0');
        progressPercentage.textContent = `${formattedPercentage}%`;
        
        progress.classList.remove('progress-pulse');
        void progress.offsetWidth;
        progress.classList.add('progress-pulse');
        
        const animationDuration = 5 - (percentage / 20);
        progress.style.animationDuration = `${animationDuration}s`;
        
        const ringSpeed = 3 - (percentage / 40);
        counterRing.style.animationDuration = `${ringSpeed}s`;
    };
    
    // تأثير الأرقام المتحركة
    const animateValue = (start, end, duration) => {
        const range = end - start;
        const increment = range > 0 ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            counter.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    };
    
    // إضافة مستمع حدث لتغيير الحد الأقصى
    countLimit.addEventListener('change', () => {
        maxCount = parseInt(countLimit.value);
        count = 0;
        counter.textContent = '0';
        progress.style.width = '0%';
        progressPercentage.textContent = '00%';
        playSound(resetSound);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    touchButton.addEventListener('click', () => {
        updateCounter();
        touchButton.classList.add('active');
        setTimeout(() => touchButton.classList.remove('active'), 200);
    });
    
    keyButton.addEventListener('click', () => {
        updateCounter();
        keyButton.classList.add('active');
        setTimeout(() => keyButton.classList.remove('active'), 200);
    });
    
    // مستمع حدث للوحة المفاتيح
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            keyButton.classList.add('active');
            updateCounter();
            setTimeout(() => keyButton.classList.remove('active'), 200);
        }
    });
    
    // تفعيل الأصوات عند أول تفاعل من المستخدم
    document.addEventListener('click', function initAudio() {
        preloadSounds();
        document.removeEventListener('click', initAudio);
    }, { once: true });
});
