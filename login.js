document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = this;
    form.classList.add('loading');

    const attendanceCode = document.getElementById('attendanceCode').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    try {
        console.log('🔄 محاولة تسجيل الدخول...');

        const url = new URL('https://script.google.com/macros/s/AKfycbwUW_7YEmUAOUt8RUy8o3lSvYNv5WgWyyFYLVlsTFKpSe_GDk8Peh9C5j5P1N_zFhZA/exec');
        url.searchParams.append('action', 'verifyUser');

        if (attendanceCode) {
            url.searchParams.append('attendanceCode', attendanceCode);
        } else if (email && phone) {
            url.searchParams.append('email', email);
            url.searchParams.append('phone', phone);
        } else {
            throw new Error('⚠️ يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الهاتف.');
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('❌ فشل الاتصال بالخادم، حاول مرة أخرى.');

        const data = await response.json();
        console.log('📡 استجابة السيرفر:', data);

        if (data && data.success) {
            console.log('✅ تسجيل الدخول ناجح، يتم تخزين البيانات...');
            localStorage.setItem('userData', JSON.stringify(data.data)); // حفظ جميع بيانات المستخدم في `userData`
            console.log('🔀 توجيه المستخدم إلى صفحة البيانات الشخصية...');
            window.location.href = './profile.html';
        } else {
            throw new Error(data.message || '❌ لم يتم العثور على المستخدم.');
        }
    } catch (error) {
        console.error('⚠️ خطأ:', error.message);
        alert(error.message);
    } finally {
        form.classList.remove('loading');
    }
});
