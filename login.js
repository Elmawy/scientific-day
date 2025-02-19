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

// إضافة مستمع الحدث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const form = this;
        form.classList.add('loading');

        const attendanceCode = document.getElementById('attendanceCode').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        try {
            console.log('🔄 محاولة تسجيل الدخول...');
            const url = new URL('https://script.google.com/macros/s/AKfycbxdZ9EgCMEN868q3ZB06dO0ZfzMordQ0KofXH5fV4n1O6qiHGC3MmuM4_wfz5QqMX-6/exec');
            url.searchParams.append('action', 'verifyUser');

            if (attendanceCode) {
                url.searchParams.append('attendanceCode', attendanceCode);
            } else if (email && phone) {
                url.searchParams.append('email', email);
                url.searchParams.append('phone', phone);
            } else {
                throw new Error('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
            }

            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`خطأ في الاتصال! الحالة: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ استجابة الخادم:', data);

            if (data && data.success) {
                console.log('🎉 تم تسجيل الدخول بنجاح، جاري حفظ البيانات...');
                localStorage.setItem('userData', JSON.stringify(data.data));
                localStorage.setItem('userEmail', data.data.email);
                localStorage.setItem('userPhone', data.data.phone);
                console.log('💾 تم حفظ البيانات، جاري التحويل...');
                
                // محاولة التحويل مع التحقق من وجود الصفحة
                try {
                    const profilePage = await fetch('profile.html');
                    if (profilePage.ok) {
                        window.location.href = 'profile.html';
                    } else {
                        throw new Error('صفحة الملف الشخصي غير موجودة');
                    }
                } catch (error) {
                    throw new Error('لا يمكن الوصول إلى صفحة الملف الشخصي');
                }
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
