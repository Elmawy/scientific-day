async function downloadCertificate() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    try {
        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'getCertificate');
        url.searchParams.append('email', email);
        url.searchParams.append('phone', phone);

        const response = await fetch(url);
        const certificateUrl = await response.text();
        
        console.log("Certificate URL:", certificateUrl);

        if (certificateUrl.startsWith("http")) {
            window.open(certificateUrl, '_blank');
        } else {
            alert(certificateUrl); // سيعرض رسالة الخطأ من السيرفر
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في تحميل الشهادة');
    }
}
