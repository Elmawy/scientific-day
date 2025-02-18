document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // منع إرسال النموذج بالطريقة التقليدية
    
    let attendanceCode = document.getElementById("attendanceCode")?.value;
    let email = document.getElementById("email")?.value;
    let phone = document.getElementById("phone")?.value;

    let url = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // استبدل YOUR_SCRIPT_ID بمعرف Google Script
    let params = new URLSearchParams();

    // تحديد طريقة تسجيل الدخول
    if (attendanceCode) {
        params.append("attendanceCode", attendanceCode);
    } else if (email && phone) {
        params.append("email", email);
        params.append("phone", phone);
    } else {
        alert("يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الهاتف.");
        return;
    }

    fetch(url + "?" + params.toString())
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // حفظ بيانات المستخدم في localStorage
                localStorage.setItem("userData", JSON.stringify(data.data));

                // إعادة توجيه المستخدم إلى صفحة البيانات الشخصية
                window.location.href = "profile.html";
            } else {
                // عرض رسالة خطأ دون إعادة التوجيه
                alert("خطأ: المستخدم غير موجود. يرجى التحقق من البيانات المدخلة.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
        });
});
