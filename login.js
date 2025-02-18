document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // منع إرسال النموذج بالطريقة التقليدية

    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    let url = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // ضع رابط Google Apps Script هنا
    let params = new URLSearchParams({ email, phone });

    fetch(url + "?" + params.toString())
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // حفظ بيانات المستخدم في localStorage لاستخدامها في صفحة الملف الشخصي
                localStorage.setItem("userData", JSON.stringify(data.data));

                // إعادة توجيه المستخدم إلى صفحة البيانات الشخصية
                window.location.href = "profile.html";
            } else {
                // عرض رسالة خطأ دون إعادة التوجيه
                alert("خطأ: المستخدم غير موجود. يرجى التحقق من البريد ورقم الهاتف.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
        });
});
