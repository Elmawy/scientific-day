// تحميل بيانات المستخدم عند تحميل الصفحة
window.onload = function() {
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
    const attendanceBtn = document.getElementById('attendanceBtn');
    const certificateBtn = document.getElementById('certificateBtn');

    if (attendanceStatus === 'true') {
        attendanceBtn.disabled = true;
        attendanceBtn.innerHTML = '<i class="fas fa-check"></i> تم تسجيل الحضور';
        certificateBtn.disabled = false;
    }
}

// تسجيل الحضور
async function markAttendance() {
    const attendanceBtn = document.getElementById('attendanceBtn');
    const certificateBtn = document.getElementById('certificateBtn');
    
    try {
        attendanceBtn.disabled = true;
        attendanceBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';

        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'markAttendance');
        url.searchParams.append('email', localStorage.getItem('userEmail'));
        url.searchParams.append('phone', localStorage.getItem('userPhone'));

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            localStorage.setItem('attendanceStatus', 'true');
            attendanceBtn.innerHTML = '<i class="fas fa-check"></i> تم تسجيل الحضور';
            certificateBtn.disabled = false;
            alert('تم تسجيل حضورك بنجاح');
        } else {
            throw new Error(data.message || 'حدث خطأ في تسجيل الحضور');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'حدث خطأ في تسجيل الحضور');
        attendanceBtn.disabled = false;
        attendanceBtn.innerHTML = '<i class="fas fa-check-circle"></i> تسجيل الحضور';
    }
}

// تحميل الشهادة
async function downloadCertificate() {
    const certificateBtn = document.getElementById('certificateBtn');
    
    try {
        certificateBtn.disabled = true;
        certificateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';

        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'getCertificate');
        url.searchParams.append('email', localStorage.getItem('userEmail'));
        url.searchParams.append('phone', localStorage.getItem('userPhone'));

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.certificateUrl) {
            window.open(data.certificateUrl, '_blank');
        } else {
            throw new Error(data.message || 'لم يتم العثور على الشهادة');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'حدث خطأ في تحميل الشهادة');
    } finally {
        certificateBtn.disabled = false;
        certificateBtn.innerHTML = '<i class="fas fa-certificate"></i> تحميل الشهادة';
    }
}

// تسجيل الخروج
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}
