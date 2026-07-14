  const email = localStorage.getItem('cbt-email').trim();
  const fullname = localStorage.getItem('cbt-name').trim();
  let userEmail = localStorage.getItem('cbt-email').trim();

  const otpInput = document.getElementById('otpCode');
  const verifyBtn = document.getElementById('verifyBtn');
  const resendLink = document.getElementById('resendLink');
  const backLink = document.getElementById('backLink');
  const generalError = document.getElementById('generalError');
  const otpError = document.getElementById('otpError');
  const countdownDisplay = document.getElementById('countdownDisplay');
  const statusBadge = document.getElementById('statusBadge');

  let timeLeftSeconds = 120;
  let timerInterval = null;
  let isTimerActive = true;
  let resendInProgress = false;

  if (userEmail) document.getElementById('otpEmailDisplay').innerText = userEmail;
  else document.getElementById('otpEmailDisplay').innerText = 'your email';

  function showError(message) {
    generalError.textContent = message; generalError.classList.add('visible');
    setTimeout(() => generalError.classList.remove('visible'), 4000);
  }
  function hideError() { generalError.classList.remove('visible'); generalError.textContent = ''; }

  function showSuccessToast(message) {
    const existing = document.querySelector('.success-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.querySelector('.otp-container').insertBefore(toast, document.querySelector('.form-group'));
    setTimeout(() => { if (toast) toast.remove(); }, 3000);
  }

  function updateTimerUI() {
    const m = Math.floor(timeLeftSeconds / 60);
    const s = timeLeftSeconds % 60;
    countdownDisplay.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (timeLeftSeconds <= 0) {
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      isTimerActive = false;
      statusBadge.textContent = 'Expired'; statusBadge.classList.add('expired');
      resendLink.classList.remove('resend-disabled');
      resendLink.style.pointerEvents = 'auto'; resendLink.style.opacity = '1';
      if (!generalError.textContent.includes('expired')) showError("OTP has expired. Please request a new code.");
      deleteOTPFromBackend();
    } else {
      isTimerActive = true; statusBadge.textContent = 'Active'; statusBadge.classList.remove('expired');
      resendLink.classList.add('resend-disabled');
      resendLink.style.pointerEvents = 'none'; resendLink.style.opacity = '0.4';
    }
  }

  function startCountdown(secs = 120) {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timeLeftSeconds = secs; isTimerActive = true; updateTimerUI();
    timerInterval = setInterval(() => {
      if (timeLeftSeconds > 0) { timeLeftSeconds--; updateTimerUI(); if (timeLeftSeconds === 0) deleteOTPFromBackend(); }
      else { clearInterval(timerInterval); timerInterval = null; updateTimerUI(); }
    }, 1000);
  }

  async function deleteOTPFromBackend() {
    if (!userEmail) return;
    try {
      const r = await fetch('/cbt/ansofra/apiadmin/delete/otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      // console.log("OTP cleanup:", await r.json());
    } catch(e) { console.error(e); }
  }

  function validateOtpInput() {
    const otp = otpInput.value.trim();
    if (!otp) {
      otpInput.classList.add('input-error'); otpInput.classList.remove('input-success');
      otpError.textContent = 'Verification code is required'; otpError.classList.add('visible'); return false;
    } else if (!/^\d{6}$/.test(otp)) {
      otpInput.classList.add('input-error'); otpInput.classList.remove('input-success');
      otpError.textContent = 'Please enter a valid 6-digit numeric code'; otpError.classList.add('visible'); return false;
    } else {
      otpInput.classList.remove('input-error'); otpInput.classList.add('input-success');
      otpError.classList.remove('visible'); return true;
    }
  }

  async function processOtp() {
    if (!validateOtpInput()) return;
    if (!isTimerActive || timeLeftSeconds <= 0) { showError("OTP has expired. Please request a new code."); return; }
    if (!userEmail) { showError("Session expired. Please login again."); setTimeout(() => window.location.href = '/cbt/ansofra/ilease/login', 1500); return; }
    verifyBtn.disabled = true; verifyBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Verifying…';
    try {
      const api = await fetch('/cbt/ansofra/apiadmin/process/otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpCode: otpInput.value.trim(), email: userEmail, })
      });
      const response = await api.json();
      console.log(response);
      if (response.status === 'success') {
        if (timerInterval) clearInterval(timerInterval);
        localStorage.setItem('cbt-email-otp', email);
        deleteOTPFromBackend();
        window.location.href = '/cbt/ansofra/admin/register';
      } else {
        showError(response.response || "Invalid verification code.");
        verifyBtn.disabled = false; verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify Code';
        otpInput.value = ''; otpInput.classList.remove('input-success'); otpInput.classList.add('input-error');
        otpError.textContent = 'Invalid code. Please try again.'; otpError.classList.add('visible');
        otpInput.focus();
      }
    } catch(e) { showError("Network error. Please try again."); verifyBtn.disabled = false; verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify Code'; }
  }

  async function resendOTP() {
    if (isTimerActive && timeLeftSeconds > 0) { showError(`Please wait ${timeLeftSeconds}s before requesting a new code.`); return; }
    if (resendInProgress) return;
    if (!userEmail) { showError("Session expired."); return; }
    resendInProgress = true; resendLink.style.pointerEvents = 'none'; resendLink.textContent = "Sending…";
    try {
      const api = await fetch('/cbt/ansofra/apiadmin/validateEmail', {
        method: "POST", headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      const response = await api.json();
      if (response.status === 'failed') {
        showSuccessToast("New verification code sent! Check your email.");
        otpInput.value = ''; otpInput.classList.remove('input-success','input-error');
        otpError.classList.remove('visible'); hideError(); startCountdown(120);
        verifyBtn.disabled = false; verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify Code'; otpInput.focus();
      } else { showError(response.response || "Failed to resend code."); }
    } catch(e) { showError("Network error. Please try again."); }
    finally {
      resendInProgress = false; resendLink.textContent = "Resend code";
      if (timeLeftSeconds <= 0) { resendLink.classList.remove('resend-disabled'); resendLink.style.pointerEvents = 'auto'; resendLink.style.opacity = '1'; }
      else { resendLink.classList.add('resend-disabled'); resendLink.style.pointerEvents = 'none'; resendLink.style.opacity = '0.4'; }
    }
  }

  otpInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^\d]/g,'').slice(0,6);
    validateOtpInput(); hideError();
  });
  otpInput.addEventListener('blur', validateOtpInput);
  otpInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); processOtp(); } });
  verifyBtn.addEventListener('click', (e) => { e.preventDefault(); processOtp(); });
  resendLink.addEventListener('click', (e) => { e.preventDefault(); resendOTP(); });
  backLink.addEventListener('click', (e) => {
    e.preventDefault(); if (timerInterval) clearInterval(timerInterval);
    localStorage.removeItem('cbt-email-otp'); window.location.href = '/cbt/ansofra/ilease/login';
  });

  document.addEventListener("DOMContentLoaded", () => {
    startCountdown(120); otpInput.focus();
  });
  window.addEventListener('beforeunload', () => { if (timerInterval) clearInterval(timerInterval); });