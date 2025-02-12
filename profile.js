// التحقق من تسجيل الدخول
if (!localStorage.getItem('userEmail')) {
    window.location.href = 'login.html';
}

// عرض بيانات المستخدم
document.getElementById('userName').textContent = localStorage.getItem('userName');
document.getElementById('userEmail').textContent = localStorage.getItem('userEmail');
document.getElementById('userPhone').textContent = localStorage.getItem('userPhone');
document.getElementById('userType').textContent = localStorage.getItem('userType');
document.getElementById('userCountry').textContent = localStorage.getItem('userCountry');

// التحقق من حالة تسجيل الحضور
if (localStorage.getItem('attendanceStatus') === 'true') {
    document.getElementById('certificateBtn').classList.remove('hidden');
    const attendanceBtn = document.getElementById('attendanceBtn');
    attendanceBtn.disabled = true;
    attendanceBtn.textContent = 'تم تسجيل الحضور';
}

// تسجيل الحضور
document.getElementById('attendanceBtn').addEventListener('click', async function() {
    try {
        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'markAttendance');
        url.searchParams.append('email', localStorage.getItem('userEmail'));
        url.searchParams.append('phone', localStorage.getItem('userPhone'));

        const response = await fetch(url, {
            method: 'GET'
        });

        const data = await response.json();
        
        if (data.success) {
            alert('تم تسجيل حضورك بنجاح');
            localStorage.setItem('attendanceStatus', 'true');
            document.getElementById('certificateBtn').classList.remove('hidden');
            this.disabled = true;
            this.textContent = 'تم تسجيل الحضور';
        } else {
            if (data.message === 'تم تسجيل الحضور مسبقاً') {
                localStorage.setItem('attendanceStatus', 'true');
                document.getElementById('certificateBtn').classList.remove('hidden');
                this.disabled = true;
                this.textContent = 'تم تسجيل الحضور';
            }
            alert(data.message || 'حدث خطأ في تسجيل الحضور. الرجاء المحاولة مرة أخرى');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تسجيل الحضور. الرجاء المحاولة مرة أخرى');
    }
});

// تحميل الشهادة
document.getElementById('certificateBtn').addEventListener('click', async function() {
    try {
        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'getCertificate');
        url.searchParams.append('email', localStorage.getItem('userEmail'));
        url.searchParams.append('phone', localStorage.getItem('userPhone'));

        const response = await fetch(url, {
            method: 'GET'
        });

        const data = await response.json();
        
        if (data.success && data.certificateUrl) {
            window.open(data.certificateUrl, '_blank');
        } else {
            alert(data.message || 'الشهادة غير متوفرة بعد');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تحميل الشهادة. الرجاء المحاولة مرة أخرى');
    }
});

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'login.html';
}); 