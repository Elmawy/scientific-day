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
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const form = this;
        form.classList.add('loading');

        const attendanceCode = document.getElementById('attendanceCode').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        try {
            console.log('🔄 محاولة تسجيل الدخول...');
            const baseUrl = 'https://script.google.com/macros/s/AKfycbwUW_7YEmUAOUt8RUy8o3lSvYNv5WgWyyFYLVlsTFKpSe_GDk8Peh9C5j5P1N_zFhZA/exec';
            
            let url = `${baseUrl}?action=verifyUser`;
            if (attendanceCode) {
                url += `&attendanceCode=${encodeURIComponent(attendanceCode)}`;
            } else if (email && phone) {
                url += `&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
            } else {
                throw new Error('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
            }

            // إنشاء عنصر iframe مؤقت
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // إنشاء نموذج وإرساله داخل الـ iframe
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = url;
            tempForm.target = '_blank';

            // إضافة حقول النموذج
            if (attendanceCode) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'attendanceCode';
                input.value = attendanceCode;
                tempForm.appendChild(input);
            } else {
                const emailInput = document.createElement('input');
                emailInput.type = 'hidden';
                emailInput.name = 'email';
                emailInput.value = email;
                tempForm.appendChild(emailInput);

                const phoneInput = document.createElement('input');
                phoneInput.type = 'hidden';
                phoneInput.name = 'phone';
                phoneInput.value = phone;
                tempForm.appendChild(phoneInput);
            }

            iframe.contentDocument.body.appendChild(tempForm);
            tempForm.submit();

            // إنشاء Promise للانتظار للرد
            const response = await new Promise((resolve, reject) => {
                window.addEventListener('message', function(event) {
                    if (event.origin === 'https://script.google.com') {
                        resolve(event.data);
                    }
                }, false);

                // timeout بعد 10 ثواني
                setTimeout(() => {
                    reject(new Error('انتهت مهلة الاتصال'));
                }, 10000);
            });

            // تنظيف
            document.body.removeChild(iframe);

            const data = JSON.parse(response);
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
        } catch (error) {
            console.error('⚠️ خطأ:', error);
            alert(`❌ حدث خطأ: ${error.message}`);
        } finally {
            form.classList.remove('loading');
        }
    });
});
