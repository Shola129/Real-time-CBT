  const nameInput = document.getElementById('regName');
  const emailInput = document.getElementById('regEmail');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');

  function validateName() {
    const name = nameInput.value.trim();
    if (!name) { nameInput.classList.add('input-error'); nameInput.classList.remove('input-success'); nameError.classList.add('visible'); return false; }
    else if (name.length < 2) { nameInput.classList.add('input-error'); nameInput.classList.remove('input-success'); nameError.textContent = 'Name must be at least 2 characters'; nameError.classList.add('visible'); return false; }
    else { nameInput.classList.remove('input-error'); nameInput.classList.add('input-success'); nameError.classList.remove('visible'); return true; }
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { emailInput.classList.add('input-error'); emailInput.classList.remove('input-success'); emailError.textContent = 'Email is required'; emailError.classList.add('visible'); return false; }
    else if (!re.test(email)) { emailInput.classList.add('input-error'); emailInput.classList.remove('input-success'); emailError.textContent = 'Please enter a valid email address'; emailError.classList.add('visible'); return false; }
    else { emailInput.classList.remove('input-error'); emailInput.classList.add('input-success'); emailError.classList.remove('visible'); return true; }
  }

  nameInput.addEventListener('input', validateName); nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('input', validateEmail); emailInput.addEventListener('blur', validateEmail);

  document.getElementById('registerBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    if (validateName() && validateEmail()) {
      const email = emailInput.value.trim();
      const fullname = nameInput.value.trim();
      const api = await fetch('/cbt/ansofra/apiadmin/validateEmail', {
        method: 'POST', headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email, fullname })
      });
      const result = await api.json();
      if (result.status === 'failed') {
        localStorage.setItem('cbt-email', email);
        localStorage.setItem('cbt-name', fullname);
        window.location.href = "/cbt/ansofra/admin/auth";
      } else { alert('Error: ' + result.response); }
    } else {
      const firstError = document.querySelector('.input-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  document.getElementById('loginLink').addEventListener('click', (e) => { e.preventDefault(); window.location.href = '/cbt/ansofra/ilease/login'; });