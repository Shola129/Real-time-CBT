 /*  BACKGROUND SLIDESHOW (only JS on this page, as requested)  */
  const slides = document.querySelectorAll('.bg-slide');
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 1500);

  /*  START EXAMINATION (placeholder — wire to your real endpoint)  */
  function startExamination() {
    const alertBox = document.getElementById('entryAlert');
    const btn = document.getElementById('btn-start');
    const regnum = document.getElementById('inp-regnum').value.trim();

    alertBox.classList.remove('show');

    if (!regnum) {
      alertBox.textContent = 'Please enter your registration number.';
      alertBox.classList.add('show');
      return;
    }else{
      const e = {regNum:regnum};

      const api = await fetch("/cbt/ansofra/api/examination/auth", {
          method:"POST",
          headers:{'Content-type':'application/json'},
          body:JSON.stringify(e)
      });


      const result = await api.json();
      const response = result.response[0];
      if(result.status==="success"){
        localStorage.setItem("cbt_session_id", "e32wiu43"+ response.users_id + "34024");
        localStorage.setItem("cbt_session_reg_num", response.regNum);
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
  
    btn.classList.add('loading');
    btn.disabled = true;

    // Placeholder — replace with your real fetch() call to validate the
    // registration number and load the assigned examination.
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.disabled = false;
      console.log('Start examination requested for:', regnum);
    }, 1200);
  }