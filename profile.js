<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الملف الشخصي - اليوم العلمي</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #005C97;
            --secondary-color: #363795;
            --accent-color: #00BCD4;
            --text-color: #2C3E50;
            --background-color: #F5F7FA;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: var(--background-color);
            font-family: 'Tajawal', sans-serif;
            color: var(--text-color);
            min-height: 100vh;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .profile-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
        }

        .profile-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .profile-header h1 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .info-group {
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(0, 92, 151, 0.03);
            border-radius: 8px;
        }

        .info-group h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .info-item:last-child {
            border-bottom: none;
        }

        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        button {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            font-family: 'Tajawal', sans-serif;
            font-size: 1rem;
        }

        button:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 92, 151, 0.2);
        }

        button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .hidden {
            display: none;
        }

        #logoutBtn {
            background: #e74c3c;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .profile-card {
                padding: 20px;
            }

            .button-group {
                flex-direction: column;
            }

            button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="profile-card">
            <div class="profile-header">
                <h1>الملف الشخصي</h1>
            </div>

            <div class="info-group">
                <h3>البيانات الشخصية</h3>
                <div class="info-item">
                    <span>الاسم:</span>
                    <span id="userName"></span>
                </div>
                <div class="info-item">
                    <span>البريد الإلكتروني:</span>
                    <span id="userEmail"></span>
                </div>
                <div class="info-item">
                    <span>رقم الجوال:</span>
                    <span id="userPhone"></span>
                </div>
                <div class="info-item">
                    <span>نوع المشاركة:</span>
                    <span id="userType"></span>
                </div>
                <div class="info-item">
                    <span>الدولة:</span>
                    <span id="userCountry"></span>
                </div>
                <div class="info-item">
                    <span>رمز الحضور:</span>
                    <span id="attendanceCode"></span>
                </div>
            </div>

            <div class="button-group">
                <button id="attendanceBtn">تسجيل الحضور</button>
                <button id="certificateBtn" class="hidden">تحميل الشهادة</button>
                <button id="logoutBtn">تسجيل الخروج</button>
            </div>
        </div>
    </div>

    <script>
        // التحقق من تسجيل الدخول
        if (!localStorage.getItem('userEmail')) {
            window.location.href = 'login.html';
        }

        // عرض بيانات المستخدم
        document.getElementById('userName').textContent = localStorage.getItem('userName') || "غير متوفر";
        document.getElementById('userEmail').textContent = localStorage.getItem('userEmail') || "غير متوفر";
        document.getElementById('userPhone').textContent = localStorage.getItem('userPhone') || "غير متوفر";
        document.getElementById('userType').textContent = localStorage.getItem('userType') || "غير متوفر";
        document.getElementById('userCountry').textContent = localStorage.getItem('userCountry') || "غير متوفر";
        document.getElementById('attendanceCode').textContent = localStorage.getItem('attendanceCode') || "غير متوفر";

        // التحقق من حالة تسجيل الحضور
        if (localStorage.getItem('attendanceStatus') === 'true') {
            document.getElementById('certificateBtn').classList.remove('hidden');
            const attendanceBtn = document.getElementById('attendanceBtn');
            attendanceBtn.disabled = true;
            attendanceBtn.textContent = 'تم تسجيل الحضور';
        }

        // إضافة مستمعي الأحداث للأزرار
        document.getElementById('attendanceBtn').addEventListener('click', markAttendance);
        document.getElementById('certificateBtn').addEventListener('click', getCertificate);
        document.getElementById('logoutBtn').addEventListener('click', logout);

        // وظائف التحكم
        async function markAttendance() {
            if (localStorage.getItem('attendanceStatus') === 'true') {
                alert('لقد قمت بتسجيل الحضور مسبقاً');
                return;
            }

            try {
                const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
                url.searchParams.append('action', 'markAttendance');
                url.searchParams.append('email', localStorage.getItem('userEmail'));
                url.searchParams.append('phone', localStorage.getItem('userPhone'));

                const response = await fetch(url, { method: 'GET' });
                const data = await response.json();

                if (data.success) {
                    alert('تم تسجيل حضورك بنجاح');
                    localStorage.setItem('attendanceStatus', 'true');
                    localStorage.setItem('attendanceCode', data.attendanceCode || "غير متوفر");
                    document.getElementById('attendanceCode').textContent = data.attendanceCode || "غير متوفر";
                    document.getElementById('certificateBtn').classList.remove('hidden');
                    const attendanceBtn = document.getElementById('attendanceBtn');
                    attendanceBtn.disabled = true;
                    attendanceBtn.textContent = 'تم تسجيل الحضور';
                } else {
                    alert(data.message || 'حدث خطأ في تسجيل الحضور. الرجاء المحاولة مرة أخرى');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('حدث خطأ في تسجيل الحضور. الرجاء المحاولة مرة أخرى');
            }
        }

        async function getCertificate() {
            try {
                const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
                url.searchParams.append('action', 'getCertificate');
                url.searchParams.append('email', localStorage.getItem('userEmail'));
                url.searchParams.append('phone', localStorage.getItem('userPhone'));

                const response = await fetch(url, { method: 'GET' });
                const data = await response.json();

                if (data.success && data.certificateUrl) {
                    window.open(data.certificateUrl, '_blank');
                } else {
                    alert(data.message || 'الشهادة غير متوفرة بعد');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('حدث خطأ في تحميل الشهادة. الرجاء المحاولة مرة أخرى');
            }
        }

        function logout() {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    </script>
</body>
</html>
