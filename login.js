<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول</title>
    <script src="login.js" defer></script>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            direction: rtl;
        }

        .container {
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }

        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 1.5rem;
        }

        .login-options {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .login-option {
            flex: 1;
            padding: 0.75rem;
            border: none;
            background-color: #f0f0f0;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        .login-option.active {
            background-color: #007bff;
            color: white;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        input {
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }

        input:focus {
            outline: none;
            border-color: #007bff;
        }

        button {
            padding: 0.75rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #0056b3;
        }

        .loading button {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .loading button::after {
            content: "...";
            display: inline-block;
            animation: dots 1s infinite;
        }

        @keyframes dots {
            0%, 20% { content: "."; }
            40%, 60% { content: ".."; }
            80%, 100% { content: "..."; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>تسجيل الدخول</h1>

        <div class="login-options">
            <button type="button" class="login-option active" onclick="switchLoginMethod('code')">
                رمز الحضور
            </button>
            <button type="button" class="login-option" onclick="switchLoginMethod('credentials')">
                البريد والجوال
            </button>
        </div>

        <form id="loginForm">
            <div id="codeLogin">
                <input
                    type="text"
                    id="attendanceCode"
                    name="attendanceCode"
                    placeholder="رمز الحضور"
                    required
                    autocomplete="off"
                >
            </div>

            <div id="credentialsLogin" style="display: none;">
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="البريد الإلكتروني"
                    autocomplete="email"
                >
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="رقم الجوال"
                    autocomplete="tel"
                >
            </div>

            <button type="submit">تسجيل الدخول</button>
        </form>
    </div>
</body>
</html>
