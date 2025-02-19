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

        let url = 'https://script.google.com/macros/s/AKfycbxdZ9EgCMEN868q3ZB06dO0ZfzMordQ0KofXH5fV4n1O6qiHGC3MmuM4_wfz5QqMX-6/exec?action=verifyUser';
        
        if (attendanceCode) {
            url += `&attendanceCode=${encodeURIComponent(attendanceCode)}`;
        } else if (email && phone) {
            url += `&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
        } else {
            alert('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
            form.classList.remove('loading');
            return;
        }

        // إنشاء عنصر script جديد
        const script = document.createElement('script');
        const callbackName = 'jsonpCallback_' + Date.now();

        // تعريف دالة callback
        window[callbackName] = function(response) {
            console.log('✅ استجابة الخادم:', response);
            
            if (response.success) {
                console.log('🎉 تم تسجيل الدخول بنجاح، جاري حفظ البيانات...');
                localStorage.setItem('userData', JSON.stringify(response.data));
                localStorage.setItem('userEmail', response.data.email);
                localStorage.setItem('userPhone', response.data.phone);
                console.log('💾 تم حفظ البيانات، جاري التحويل...');
                window.location.href = 'profile.html';
            } else {
                alert(response.message || 'لم يتم العثور على المستخدم');
            }

            // تنظيف
            document.body.removeChild(script);
            delete window[callbackName];
            form.classList.remove('loading');
        };

        // إضافة callback إلى URL
        url += `&callback=${callbackName}`;
        
        // إعداد script
        script.src = url;
        script.onerror = function() {
            alert('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
            document.body.removeChild(script);
            delete window[callbackName];
            form.classList.remove('loading');
        };

        // إضافة script إلى الصفحة
        document.body.appendChild(script);

        // معالجة timeout
        setTimeout(function() {
            if (window[callbackName]) {
                alert('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.');
                document.body.removeChild(script);
                delete window[callbackName];
                form.classList.remove('loading');
            }
        }, 10000);
    });
});
