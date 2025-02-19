
// وظيفة تبديل طريقة تسجيل الدخول
function switchLoginMethod(method) {
    const codeLogin = document.getElementById('codeLogin');
    const credentialsLogin = document.getElementById('credentialsLogin');
    const options = document.querySelectorAll('.login-option');
    
    options.forEach(option => option.classList.remove('active'));
    
    if (method === 'code') {
        codeLogin.style.display = 'block';
        credentialsLogin.style.display = 'none';
        options[0].classList.add('active');
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
    } else {
        codeLogin.style.display = 'none';
        credentialsLogin.style.display = 'block';
        options[1].classList.add('active');
        document.getElementById('attendanceCode').value = '';
    }
}

// دالة JSONP للتواصل مع Google Apps Script
function fetchJsonp(params) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'jsonpCallback_' + Date.now();
        
        window[callbackName] = function(data) {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };

        const url = new URL('https://script.google.com/macros/s/AKfycbxdZ9EgCMEN868q3ZB06dO0ZfzMordQ0KofXH5fV4n1O6qiHGC3MmuM4_wfz5QqMX-6/exec');
        url.searchParams.append('callback', callbackName);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        script.src = url.toString();
        script.onerror = () => reject(new Error('فشل في الاتصال بالخادم'));
        document.body.appendChild(script);
    });
}

// إضافة مستمع الحدث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🔄 محاولة تسجيل الدخول...');
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'جاري التحقق...';

        try {
            const params = {
                action: 'verifyUser'
            };

            // التحقق من طريقة تسجيل الدخول
            const codeLogin = document.getElementById('codeLogin');
            if (codeLogin.style.display !== 'none') {
                params.attendanceCode = document.getElementById('attendanceCode').value.trim();
            } else {
                params.email = document.getElementById('email').value.trim();
                params.phone = document.getElementById('phone').value.trim();
            }

            const data = await fetchJsonp(params);
            console.log('✅ استجابة الخادم:', data);

            if (data.success) {
                localStorage.setItem('userData', JSON.stringify(data.data));
                localStorage.setItem('userEmail', data.data.email);
                localStorage.setItem('userPhone', data.data.phone);
                window.location.href = 'profile.html';
            } else {
                throw new Error(data.message || 'فشل في تسجيل الدخول');
            }
        } catch (error) {
            console.error('⚠️ خطأ:', error);
            alert('❌ ' + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'دخول';
        }
    });
});
