 /*  BACKGROUND SLIDESHOW (only JS on this page, as requested)  */
  const slides = document.querySelectorAll('.bg-slide');
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 1500);

  /*  START EXAMINATION (placeholder — wire to your real endpoint)  */
   async function startExamination() {
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
      console.log(result);
      if(result.status==="success"){
        localStorage.setItem("cbt_session_id", response.users_id);
        localStorage.setItem("cbt_session_reg_num", response.regNum);
        localStorage.setItem("cbt_session_org_code", response.organization_code);
        localStorage.setItem("cbt_session_email", response.email);
        window.location.href = '/cbt/ansofra/user/examination';
      }
      else if(result.status==="fail"){
          alertBox.textContent = 'Invalid registration number. Please try again.';
          alertBox.classList.add('error', 'show');
          return;
      }
      else{
          alertBox.textContent = 'Invalid registration number. Please try again.';
          alertBox.classList.add('error', 'show');
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