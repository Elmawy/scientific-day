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
            
            let url = 'https://script.google.com/macros/s/AKfycbxdZ9EgCMEN868q3ZB06dO0ZfzMordQ0KofXH5fV4n1O6qiHGC3MmuM4_wfz5QqMX-6/exec';
            
            const params = new URLSearchParams({
                action: 'verifyUser'
            });

            if (attendanceCode) {
                params.append('attendanceCode', attendanceCode);
            } else if (email && phone) {
                params.append('email', email);
                params.append('phone', phone);
            } else {
                throw new Error('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
            }

            // استخدام CORS Proxy
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const response = await fetch(proxyUrl + url + '?' + params.toString(), {
                method: 'GET',
                headers: {
                    'Origin': window.location.origin
                }
            });

            if (!response.ok) {
                throw new Error('فشل الاتصال بالخادم');
            }

            const data = await response.json();
            console.log('✅ استجابة الخادم:', data);

            if (data.success) {
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
            alert(error.message);
        } finally {
            form.classList.remove('loading');
        }
    });
});
