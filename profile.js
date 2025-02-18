async function downloadCertificate() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        // 1. بناء الرابط
        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'getCertificate');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        // 2. إرسال الطلب
        const response = await fetch(url);
        const data = await response.json(); // تحويل الاستجابة إلى JSON

        // 3. التحقق من النجاح
        if (data.success) {
            // 4. فتح رابط الشهادة في نافذة جديدة
            window.open(data.certificateUrl, '_blank');
        } else {
            // 5. عرض رسالة الخطأ
            alert(data.message || 'لم يتم العثور على الشهادة');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تحميل الشهادة');
    }
}
