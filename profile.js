document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    form.classList.add('loading');
    
    const attendanceCode = document.getElementById('attendanceCode').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    try {
        console.log('Attempting login...');
        const url = new URL('https://script.google.com/macros/s/AKfycbzfpP-NyL-k3jbc8j_B9KNiRVuKe54nAIWA-UWcC7ZUlHCRxH3M9-RvyZc4npFUpmv-/exec');
        url.searchParams.append('action', 'verifyUser');
        
        if (attendanceCode) {
            url.searchParams.append('attendanceCode', attendanceCode);
        } else if (email && phone) {
            url.searchParams.append('email', email);
            url.searchParams.append('phone', phone);
        } else {
            throw new Error('يرجى إدخال رمز الحضور أو البريد الإلكتروني ورقم الجوال');
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log('Server response:', data);

        if (data && data.success) {
            console.log('Login successful, storing data...');
            localStorage.setItem('userEmail', data.data.email);
            localStorage.setItem('userPhone', data.data.phone);
            localStorage.setItem('userName', data.data.name);
            localStorage.setItem('userGender', data.data.gender);
            localStorage.setItem('userType', data.data.type);
            localStorage.setItem('userCountry', data.data.country);
            localStorage.setItem('attendanceStatus', data.data.attendanceStatus || 'false');
            
            console.log('Data stored, redirecting...');
            window.location.replace('./profile.html');
        } else {
            throw new Error(data.message || 'لم يتم العثور على المستخدم');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    } finally {
        form.classList.remove('loading');
    }
});
