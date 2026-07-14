  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const IDInput = document.getElementById("ID");
  const generalError = document.getElementById('generalError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const IDError = document.getElementById('IDError');

  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailInput.classList.add('input-error'); emailInput.classList.remove('input-success');
      emailError.textContent = 'Email is required'; emailError.classList.add('visible'); return false;
    } else if (!emailRegex.test(email)) {
      emailInput.classList.add('input-error'); emailInput.classList.remove('input-success');
      emailError.textContent = 'Please enter a valid email address'; emailError.classList.add('visible'); return false;
    } else {
      emailInput.classList.remove('input-error'); emailInput.classList.add('input-success');
      emailError.classList.remove('visible'); return true;
    }
  }

  function validatePassword() {
    const password = passwordInput.value;
    if (!password) {
      passwordInput.classList.add('input-error'); passwordInput.classList.remove('input-success');
      passwordError.textContent = 'Password is required'; passwordError.classList.add('visible'); return false;
    } else if (password.length < 6) {
      passwordInput.classList.add('input-error'); passwordInput.classList.remove('input-success');
      passwordError.textContent = 'Password must be at least 6 characters'; passwordError.classList.add('visible'); return false;
    } else {
      passwordInput.classList.remove('input-error'); passwordInput.classList.add('input-success');
      passwordError.classList.remove('visible'); return true;
    }
  }

  function validateID() {
    const IDIN = IDInput.value;
    if (!IDIN) {
      IDInput.classList.add('input-error'); IDInput.classList.remove('input-success');
      IDError.textContent = 'ID is required'; IDError.classList.add('visible'); return false;
    } else if (!IDIN.startsWith('ADMIN')) {
      IDInput.classList.add('input-error'); IDInput.classList.remove('input-success');
      IDError.textContent = 'ID must start with ADMIN'; IDError.classList.add('visible'); return false;
    } else {
      IDInput.classList.remove('input-error'); IDInput.classList.add('input-success');
      IDError.classList.remove('visible'); return true;
    }
  }

  function clearGeneralError() { generalError.classList.remove('visible'); generalError.textContent = ''; }
  function showGeneralError(msg) { generalError.textContent = msg; generalError.classList.add('visible'); }

  emailInput.addEventListener('input', () => { validateEmail(); clearGeneralError(); });
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('input', () => { validatePassword(); clearGeneralError(); });
  passwordInput.addEventListener('blur', validatePassword);
  IDInput.addEventListener('input', () => { validateID(); clearGeneralError(); });
  IDInput.addEventListener('blur', validateID);

  document.getElementById('loginBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    clearGeneralError();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isID = validateID();
    if (isEmailValid && isPasswordValid && isID) {
      const data = document.getElementById('data');
      const form = new FormData(data);
      const api = await fetch('/cbt/ansofra/apiadmin/login', { method: 'POST', body: form });
      const result = await api.json();
      const response = result.response[0];
      if (result.status === 'success') {
        localStorage.setItem('cbt-admin-email', response.email);
        localStorage.setItem('cbt-admin-ID', response.ID);
        localStorage.setItem('cbt-org-code', response.organization_code);
        localStorage.setItem('cbt-admin-auth-code', result.res)
        window.location.href = "/cbt/ansofra/admin/dashboard";
      } else {
        showGeneralError(result.response || 'Invalid credentials. Please try again.');
        console.log(result);
      }
    }
  });

  document.getElementById('registerLink').addEventListener('click', (e) => {
    e.preventDefault(); window.location.href ='/cbt/ansofra/admin/validateEmail';
  });
  document.getElementById('backLink').addEventListener('click', (e) => {
    e.preventDefault(); window.location.href ='/cbt/ansofra/';
  });