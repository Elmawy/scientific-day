window.switchLoginMethod = function(method) {
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

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const form = this;
        form.classList.add('loading');

        const attendanceCode = document.getElementById('attendanceCode').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        console.log('🔄 محاولة تسجيل الدخول...');

        // إنشاء URL مع المعلمات
        let url = 'https://script.google.com/macros/s/AKfycbyb1yluA0phmvMqLrmV-W_N8m4VtIxHuoNyVqEw1QZ_Ol6w-l1wgwggoSLcOlF6R2zE/exec?action=verifyUser';
        
        if (attendanceCode) {
            url += `&attendanceCode=${encodeURIComponent(attendanceCode)}`;
        } else if (email && phone) {
            url += `&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
        } else {
            alert('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
            form.classList.remove('loading');
            return;
        }

        // تنفيذ الطلب باستخدام JSONP
        const callbackName = 'callback_' + Math.random().toString(36).substr(2, 9);
        let scriptElement = null;

        const cleanup = () => {
            if (scriptElement && scriptElement.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement);
            }
            delete window[callbackName];
        };

        const timeoutId = setTimeout(() => {
            cleanup();
            form.classList.remove('loading');
            alert('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.');
        }, 10000);

        window[callbackName] = function(response) {
            clearTimeout(timeoutId);
            cleanup();
            form.classList.remove('loading');

            console.log('✅ استجابة الخادم:', response);

            if (response.success) {
                console.log('🎉 تم تسجيل الدخول بنجاح، جاري حفظ البيانات...');
                localStorage.setItem('userData', JSON.stringify(response.data));
                localStorage.setItem('userEmail', response.data.email);
                localStorage.setItem('userPhone', response.data.phone);
                console.log('💾 تم حفظ البيانات، جاري التحويل...');
                window.location.href = 'profile.html';
            } else {
                alert(response.message || 'حدث خطأ غير معروف');
            }
        };

        // إنشاء وإضافة عنصر السكريبت
        scriptElement = document.createElement('script');
        scriptElement.src = `${url}&callback=${callbackName}`;
        scriptElement.onerror = function() {
            clearTimeout(timeoutId);
            cleanup();
            form.classList.remove('loading');
            alert('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        };
        document.head.appendChild(scriptElement);
    });
});
