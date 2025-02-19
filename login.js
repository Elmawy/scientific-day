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

        try {
            console.log('🔄 محاولة تسجيل الدخول...');
            
            // إنشاء URL مع المعلمات
            let url = 'https://script.google.com/macros/s/AKfycbyb1yluA0phmvMqLrmV-W_N8m4VtIxHuoNyVqEw1QZ_Ol6w-l1wgwggoSLcOlF6R2zE/exec?action=verifyUser';
            
            if (attendanceCode) {
                url += `&attendanceCode=${encodeURIComponent(attendanceCode)}`;
            } else if (email && phone) {
                url += `&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
            } else {
                throw new Error('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
            }

            // إضافة معلمة callback
            const callbackName = 'jsonpCallback_' + Date.now();
            url += `&callback=${callbackName}`;

            // إنشاء عنصر script
            const script = document.createElement('script');
            script.src = url;

            // إنشاء promise للتعامل مع الاستجابة
            const responsePromise = new Promise((resolve, reject) => {
                // تعريف دالة callback
                window[callbackName] = function(response) {
                    resolve(response);
                    cleanup();
                };

                // معالجة الأخطاء
                script.onerror = () => {
                    reject(new Error('فشل في الاتصال بالخادم'));
                    cleanup();
                };

                // دالة التنظيف
                function cleanup() {
                    document.head.removeChild(script);
                    delete window[callbackName];
                }

                // تحديد مهلة زمنية
                setTimeout(() => {
                    reject(new Error('انتهت مهلة الاتصال'));
                    cleanup();
                }, 10000);
            });

            // إضافة script إلى الصفحة
            document.head.appendChild(script);

            // انتظار الاستجابة
            responsePromise.then(data => {
                console.log('✅ استجابة الخادم:', data);

                if (data && data.success) {
                    console.log('🎉 تم تسجيل الدخول بنجاح، جاري حفظ البيانات...');
                    localStorage.setItem('userData', JSON.stringify(data.data));
                    localStorage.setItem('userEmail', data.data.email);
                    localStorage.setItem('userPhone', data.data.phone);
                    console.log('💾 تم حفظ البيانات، جاري التحويل...');
                    window.location.href = 'profile.html';
                } else {
                    throw new Error(data.message || 'لم يتم العثور على المستخدم');
                }
            }).catch(error => {
                console.error('⚠️ خطأ:', error);
                alert(`❌ حدث خطأ: ${error.message}`);
            }).finally(() => {
                form.classList.remove('loading');
            });

        } catch (error) {
            console.error('⚠️ خطأ:', error);
            alert(`❌ حدث خطأ: ${error.message}`);
            form.classList.remove('loading');
        }
    });
});
