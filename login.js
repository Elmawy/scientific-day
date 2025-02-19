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
            
            // بناء URL مع المعلمات
            let url = `${baseUrl}?action=verifyUser`;
            if (attendanceCode) {
                url += `&attendanceCode=${encodeURIComponent(attendanceCode)}`;
            } else if (email && phone) {
                url += `&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
            } else {
                throw new Error('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
            }

            // استخدام JSONP لتجاوز قيود CORS
            const callbackName = 'jsonpCallback_' + Math.random().toString(36).substr(2, 9);
            
            const promise = new Promise((resolve, reject) => {
                window[callbackName] = function(response) {
                    resolve(response);
                    document.head.removeChild(script);
                    delete window[callbackName];
                };

                const script = document.createElement('script');
                script.src = `${url}&callback=${callbackName}`;
                script.onerror = () => {
                    reject(new Error('فشل في الاتصال بالخادم'));
                    document.head.removeChild(script);
                    delete window[callbackName];
                };
                document.head.appendChild(script);
            });

            const data = await promise;
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
