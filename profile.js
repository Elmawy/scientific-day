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
    if (attendanceStatus === 'true') {
        document.getElementById('attendanceBtn').disabled = true;
        document.getElementById('attendanceBtn').textContent = 'تم تسجيل الحضور';
    }
}

// تسجيل الحضور
async function markAttendance() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        const url = new URL('https://script.google.com/macros/s/AKfycbzbbaeUOVFqELbDs9oyIlg2V_Si1qxaSuCaWJlZ18j471_le-Y-Ci6DutDQI_8kYaWB/exec');
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
        } else {
            alert(data.message || 'حدث خطأ في تسجيل الحضور');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تسجيل الحضور');
    }
}

// تحميل الشهادة
async function downloadCertificate() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        const url = new URL('https://script.google.com/macros/s/AKfycbzbbaeUOVFqELbDs9oyIlg2V_Si1qxaSuCaWJlZ18j471_le-Y-Ci6DutDQI_8kYaWB/exec');
        url.searchParams.append('action', 'getCertificate');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        const response = await fetch(url);
        const data = await response.json();

        console.log('Response data:', data); // للتأكد من البيانات المستلمة

        if (data.success) {
            window.open(data.certificateUrl, '_blank');
        } else {
            alert(data.message || 'لم يتم العثور على الشهادة');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تحميل الشهادة');
    }
}

