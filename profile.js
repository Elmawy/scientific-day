// تحميل بيانات المستخدم عند فتح الصفحة
window.onload = function () {
    if (!localStorage.getItem('userEmail')) {
        window.location.href = 'login.html';
        return;
    }
    loadUserData();
};

// تحميل بيانات المستخدم
function loadUserData() {
    document.getElementById('userName').textContent = localStorage.getItem('userName') || '-';
    document.getElementById('userEmail').textContent = localStorage.getItem('userEmail') || '-';
    document.getElementById('userPhone').textContent = localStorage.getItem('userPhone') || '-';

    if (localStorage.getItem('attendanceStatus') === 'true') {
        document.getElementById('attendanceBtn').disabled = true;
        document.getElementById('attendanceBtn').textContent = 'تم تسجيل الحضور';
        checkCertificate(); // ✅ تحميل الشهادة مباشرة عند تحميل الصفحة
    }
}

// تسجيل الحضور
async function markAttendance() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        const url = new URL('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec');
        url.searchParams.append('action', 'markAttendance');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            localStorage.setItem('attendanceStatus', 'true');
            document.getElementById('attendanceBtn').disabled = true;
            document.getElementById('attendanceBtn').textContent = 'تم تسجيل الحضور';
            alert('تم تسجيل حضورك بنجاح');
            checkCertificate();
        } else {
            alert(data.message || 'حدث خطأ في تسجيل الحضور');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تسجيل الحضور');
    }
}

// ✅ التحقق من توفر رابط الشهادة
async function checkCertificate() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        const url = new URL('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec');
        url.searchParams.append('action', 'getCertificate');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.certificateUrl) {
            document.getElementById('certificateBtn').onclick = function () {
                window.open(data.certificateUrl, '_blank');
            };
            document.getElementById('certificateBtn').textContent = 'تحميل الشهادة';
            document.getElementById('certificateBtn').disabled = false;
        } else {
            document.getElementById('certificateBtn').textContent = 'الشهادة غير متوفرة بعد';
            document.getElementById('certificateBtn').disabled = true;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تحميل الشهادة');
    }
}

// تسجيل الخروج والعودة إلى الصفحة الرئيسية
function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
