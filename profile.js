async function downloadCertificate() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        const url = new URL('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec');
        url.searchParams.append('action', 'getCertificate');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        const response = await fetch(url, { method: 'GET' });
        const certificateUrl = await response.text(); // ✅ استرجاع الرابط مباشرة

        if (certificateUrl.startsWith("http")) {
            window.location.href = certificateUrl; // ✅ فتح رابط الشهادة مباشرة
        } else {
            alert(certificateUrl); // عرض أي رسالة خطأ إذا لم يتم العثور على الشهادة
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تحميل الشهادة');
    }
}
