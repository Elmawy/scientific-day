// تحميل بيانات المستخدم عند تحميل الصفحة
window.onload = async function() {
    console.log('🔍 تحميل بيانات المستخدم...');
    
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
        console.log('📡 محاولة جلب البيانات من Google Sheets...');
        await fetchUserDataFromGoogleSheets();
    } else {
        loadUserData(JSON.parse(userDataString));
    }
};

async function fetchUserDataFromGoogleSheets() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    if (!email || !phone) {
        console.warn('⚠️ بيانات تسجيل الدخول غير متوفرة، إعادة التوجيه...');
        window.location.href = 'login.html';
        return;
    }

    try {
        const url = new URL('https://script.google.com/macros/s/AKfycbyb1yluA0phmvMqLrmV-W_N8m4VtIxHuoNyVqEw1QZ_Ol6w-l1wgwggoSLcOlF6R2zE/exec');
        url.searchParams.append('action', 'verifyUser');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            console.log('✅ بيانات المستخدم من Google Sheets:', data.data);
            localStorage.setItem('userData', JSON.stringify(data.data));
            loadUserData(data.data);
        } else {
            console.error('❌ خطأ في جلب البيانات:', data.message);
        }
    } catch (error) {
        console.error('❌ خطأ أثناء جلب البيانات:', error);
    }
}

function loadUserData(userData) {
    console.log('✅ تحميل بيانات المستخدم إلى الصفحة...');
    setElementText('userName', userData.name);
    setElementText('userEmail', userData.email);
    setElementText('userPhone', userData.phone);
    setElementText('userGender', userData.gender);
    setElementText('userType', userData.type);
    setElementText('userCountry', userData.country);
}

function setElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text || 'غير متوفر';
    } else {
        console.error(`❌ العنصر #${id} غير موجود في HTML`);
    }
}

// تسجيل الحضور
async function markAttendance() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        const url = new URL('https://script.google.com/macros/s/AKfycbyb1yluA0phmvMqLrmV-W_N8m4VtIxHuoNyVqEw1QZ_Ol6w-l1wgwggoSLcOlF6R2zE/exec');
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
        const url = new URL('https://script.google.com/macros/s/AKfycbyb1yluA0phmvMqLrmV-W_N8m4VtIxHuoNyVqEw1QZ_Ol6w-l1wgwggoSLcOlF6R2zE/exec');
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
