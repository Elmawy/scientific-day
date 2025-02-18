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
                window.open(data.certificateUrl, '_blank'); // ✅ يفتح الشهادة في نافذة جديدة
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
