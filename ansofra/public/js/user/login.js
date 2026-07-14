async function doLogin() {
    const email  = document.getElementById('email').value.trim();
    const regNum = document.getElementById('regNum').value;
    const alert = document.getElementById('login-alert');
    alert.className = 'alert';

    if (!email || !regNum) {
      alert.textContent = 'Please enter your email and registration number.';
      alert.classList.add('error', 'show');
      return;
    }

    else{
      const e = {email:email, regNum:regNum};

      const api = await fetch("/cbt/ansofra/api/login", {
          method:"POST",
          headers:{'Content-type':'application/json'},
          body:JSON.stringify(e)
      });

      const result = await api.json();
      const response = result.response;
      // console.log(result);
      if(result.status==="success"){
        localStorage.setItem("cbt_session_email", email);
        localStorage.setItem("cbt_session_org_code", response.organization_code);
        window.location.href = '/cbt/ansofra/user/dashboard';
      }
      else if(result.status==="fail"){
          alert.textContent = 'Invalid registration number. Please try again.';
          alert.classList.add('error', 'show');
          return;
      }
      else{
          alert.textContent = 'Invalid email. Please try again.';
          alert.classList.add('error', 'show');
          return;
      }
    }
  }

document.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });