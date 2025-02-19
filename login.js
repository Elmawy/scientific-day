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
            alert('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
            form.classList.remove('loading');
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url + '?' + params.toString(), true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
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
                } catch (error) {
                    console.error('⚠️ خطأ في تحليل البيانات:', error);
                    alert('حدث خطأ في معالجة البيانات');
                }
            } else {
                console.error('⚠️ خطأ في الاتصال:', xhr.status);
                alert('حدث خطأ في الاتصال بالخادم');
            }
            form.classList.remove('loading');
        };

        xhr.onerror = function() {
            console.error('⚠️ خطأ في الاتصال');
            alert('حدث خطأ في الاتصال بالخادم');
            form.classList.remove('loading');
        };

        xhr.timeout = 10000; // 10 seconds timeout
        xhr.ontimeout = function() {
            console.error('⚠️ انتهت مهلة الاتصال');
            alert('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.');
            form.classList.remove('loading');
        };

        xhr.send();
    });
});
