// تحميل بيانات المستخدم من localStorage
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
    document.getElementById('userGender').textContent = localStorage.getItem('userGender') || '-';
    document.getElementById('userType').textContent = localStorage.getItem('userType') || '-';
    document.getElementById('userCountry').textContent = localStorage.getItem('userCountry') || '-';

    const attendanceStatus = localStorage.getItem('attendanceStatus');

    if (attendanceStatus === 'true') {
        document.getElementById('attendanceBtn').disabled = true;
        document.getElementById('attendanceBtn').textContent = 'تم تسجيل الحضور';
        document.getElementById('certificateBtn').disabled = false;
        checkCertificate(); // ✅ التحقق من وجود رابط الشهادة عند تحميل الصفحة
    }
}

// تسجيل الحضور
async function markAttendance() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'markAttendance');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            localStorage.setItem('attendanceStatus', 'true');
            document.getElementById('attendanceBtn').disabled = true;
            document.getElementById('attendanceBtn').textContent = 'تم تسجيل الحضور';
            document.getElementById('certificateBtn').disabled = false;
            alert('تم تسجيل حضورك بنجاح');
            checkCertificate(); // ✅ التحقق من الشهادة بعد تسجيل الحضور
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
        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'getCertificate');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.certificateUrl) {
            document.getElementById('certificateBtn').onclick = function () {
                window.open(data.certificateUrl, '_blank');
            };
            document.getElementById('certificateBtn').textContent = 'تحميل الشهادة'; // ✅ تحديث الزر عند توفر الشهادة
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
