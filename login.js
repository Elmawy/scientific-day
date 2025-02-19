// ثوابت
const API_URL = 'https://script.google.com/macros/s/AKfycbxdZ9EgCMEN868q3ZB06dO0ZfzMordQ0KofXH5fV4n1O6qiHGC3MmuM4_wfz5QqMX-6/exec';
let currentLoginMethod = 'code';

// وظيفة تبديل طريقة تسجيل الدخول
function switchLoginMethod(method) {
    currentLoginMethod = method;
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

// دالة للتحقق من صحة المدخلات
function validateInputs(params) {
    if (currentLoginMethod === 'code') {
        if (!params.attendanceCode) {
            throw new Error('الرجاء إدخال رمز الحضور');
        }
    } else {
        if (!params.email) {
            throw new Error('الرجاء إدخال البريد الإلكتروني');
        }
        if (!params.phone) {
            throw new Error('الرجاء إدخال رقم الجوال');
        }
    }
    return true;
}

// دالة الاتصال بالخادم
function fetchData(params) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'jsonpCallback_' + Date.now();
        
        // تعريف دالة callback
        window[callbackName] = function(response) {
            cleanup();
            resolve(response);
        };

        // دالة تنظيف
        const cleanup = () => {
            delete window[callbackName];
            document.body.removeChild(script);
        };

        // إعداد URL
        const url = new URL(API_URL);
        url.searchParams.append('callback', callbackName);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        // إعداد script tag
        script.src = url.toString();
        script.onerror = () => {
            cleanup();
            reject(new Error('فشل في الاتصال بالخادم'));
        };
        
        // إضافة timeout
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error('انتهت مهلة الاتصال'));
        }, 10000);

        // إضافة script للصفحة
        document.body.appendChild(script);
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const loadingMessage = document.getElementById('loadingMessage');
        const errorMessage = document.getElementById('errorMessage');

        try {
            // إخفاء رسائل الخطأ السابقة
            errorMessage.style.display = 'none';
            
            // إظهار حالة التحميل
            submitButton.disabled = true;
            loadingMessage.style.display = 'block';
            loadingMessage.textContent = 'جاري التحقق...';

            // إعداد البيانات
            const params = {
                action: 'verifyUser'
            };

            if (currentLoginMethod === 'code') {
                params.attendanceCode = document.getElementById('attendanceCode').value.trim();
            } else {
                params.email = document.getElementById('email').value.trim();
                params.phone = document.getElementById('phone').value.trim();
            }

            // التحقق من المدخلات
            validateInputs(params);

            // إرسال الطلب
            const response = await fetchData(params);

            if (response.success) {
                // تخزين بيانات المستخدم
                localStorage.setItem('userData', JSON.stringify(response.data));
                window.location.href = 'profile.html';
            } else {
                throw new Error(response.message || 'فشل في تسجيل الدخول');
            }

        } catch (error) {
            // إظهار رسالة الخطأ
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            console.error('⚠️ خطأ:', error);
        } finally {
            // إعادة تفعيل الزر وإخفاء رسالة التحميل
            submitButton.disabled = false;
            loadingMessage.style.display = 'none';
        }
    });
});
