 /*  BACKGROUND SLIDESHOW (only JS on this page, as requested)  */
  const slides = document.querySelectorAll('.bg-slide');
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 3000);

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