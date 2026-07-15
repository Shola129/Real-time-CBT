
/*    STATE*/
let SUBJECTS  = [];
let user      = null;
let userData  = null;
let max_question;
let score_per_question;
const idEmail = localStorage.getItem('cbt_session_email');
 const org_code = localStorage.getItem('cbt_session_org_code');
 if(!org_code || !idEmail){
    window.location.href="/cbt/ansofra/user/login";
 }
document.getElementById("organization-code").textContent=org_code;
let examState = {
  currentSubject:  0,
  currentQuestion: 0,
  answers:   [],
  flagged:   [],
  questions: [],
  subjects:  [],
  totalSubjects: 0,
  timerSeconds:   0,
  timerInterval:  null,
  started: false,
  answerDetails: [],
};

/*    INIT*/
window.addEventListener('load', () => {
  const raw = localStorage.getItem('cbt_session_email') || "sholadanielek@gmail.com";
  if (!raw) { window.location.href = '/cbt/ansofra/user/login'; return; }
  user = raw;
  populateUI();
});

/*    FETCH — candidate profile*/
async function populateUI() {
  const e = { email: user, organization_code:org_code}
  // console.log(e);
    const res    = await fetch('/cbt/ansofra/api/details', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e),
    });
    const result = await res.json();
    if (result.status !== 'success' || !result.response?.[0]) {
             window.location.href="/cbt/ansofra/user/login";
              return;
            //  console.error('Profile error:', result); return; 
    }
    const p  = result.response[0];
    userData = p;
    const initials = p.fullname.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    document.getElementById('nav-avatar').textContent      = initials;
    document.getElementById('nav-name').textContent        = p.firstName || p.fullname.split(' ')[0];
    document.getElementById('sidebar-avatar').textContent  = initials;
    document.getElementById('sidebar-name').textContent    = p.fullname;
    document.getElementById('sidebar-reg').textContent     = p.regNum;
    document.getElementById('sb-state').textContent        = p.state      || '—';
    document.getElementById('sb-year').textContent         = p.year       || '—';
    document.getElementById('sb-course').textContent       = p.department || '—';
    document.getElementById('sb-gender').textContent       = p.gender     || '—';
    document.getElementById('sb-phone').textContent        = p.phone      || '—';
    document.getElementById('ic-reg').textContent          = p.regNum;
    document.getElementById('sidebar-email').textContent = p.email;
    document.getElementById('hero-name').innerHTML =
      `Welcome, <span>${p.firstName || p.fullname.split(' ')[0]}</span>`;

    await Promise.all([
      fetchSubjectList(p.department, org_code),
      fetchExamDetails(p.department, org_code),
      fetchSubjectCount(p.department, org_code),
    ]);
}

/*    FETCH — subject list (sidebar + table)*/
async function fetchSubjectList(department, org_code) {
  try {
    const res    = await fetch('/cbt/ansofra/api/getAllSebject', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department:department, organization_code: org_code}),
    });
    const result = await res.json();
    const list   = result.response || [];
    const palette = ['#3498db','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c'];

    document.getElementById('subject-list-side').innerHTML = list.map((s, i) => `
      <div class="subject-list-item">
        <span class="subject-dot" style="background:${palette[i % palette.length]}"></span>${s.subject}
      </div>`).join('');

    const tbody = document.getElementById('subject-table-body');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-m);padding:20px">No subjects configured yet.</td></tr>`;
    } else {
      tbody.innerHTML = list.map((s, i) => `
        <tr>
          <td>${i+1}</td>
          <td><span class="subj-color" style="background:${palette[i%palette.length]}"></span>${s.subject}</td>
          <td>${s.numQuestion ?? s.totalQuestions ?? '—'}</td>
          <td>${s.maxScore   ?? s.scorePerQuestion    ?? '—'}</td>
          <td>${parseFloat(s.totalQuestions) * parseFloat(s.scorePerQuestion)}</td>
        </tr>`).join('');

        let output = 0;
        let q = 0;
        let s = 0;
        for(let i=0; i<list.length; i++){
          output +=parseFloat(list[i].totalQuestions);
          q += parseFloat(list[i].totalQuestions) * parseFloat(list[i].scorePerQuestion);
        }
        document.getElementById("total-score").textContent=q;
      const totalQ = list.reduce((t, s) => t + (parseInt(s.numQuestion ?? s.num_question) || 0), 0);
      document.getElementById('subj-table-meta').textContent =
        `${list.length} subject${list.length !== 1 ? 's' : ''} · ${output} total questions`;
    }
  } catch (err) { console.error('fetchSubjectList:', err); }
}

// async function getMaxQScoreQ(){
//    const org_code = document.getElementById("organization-code").textContent.trim();
//    const department = document.getElementById("sb-course").textContent.trim();

//    const e = {
//     organization_code:org_code,
//     department:department
//    };

//    const api = await fetct("/cbt/ansofra/api/get/max/q/score/q",{
//         method:"POST",
//         headers:{'Content-Tpye':'application/json'},
//         body:JSON.stringify(e),
//     });

//     const result = await api.json();
//     const response = result.response;
//     max_question=response.total_question;
//     score_per_question=response.mark_per_score;

// }

/*    FETCH — exam details*/
async function fetchExamDetails(department, org_code) {
  const btn    = document.getElementById('start-btn');
  const btnTxt = document.getElementById('start-btn-text');
  const badge  = document.getElementById('exam-status-badge');
  const fullname = document.getElementById("sidebar-name").textContent.trim();
  const regNum = document.getElementById("sidebar-reg").textContent.trim();
  const e = {
    fullname:fullname,
    department:department,
    regNum:regNum,
    organization_code:org_code,
  };
  const setStatus = (cls, dot, dotStyle, text) => {
    badge.className = `exam-status-badge ${cls}`;
    badge.innerHTML = `<span class="status-dot ${dot}" style="${dotStyle}"></span>${text}`;
  };
    const res    = await fetch('/cbt/ansofra/api/getExamdetails', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e),
    });
    const result = await res.json();

    if (result.status === 'failed' || !result.response?.[0]) {
      setStatus('ended','','background:var(--text-muted)','No exam scheduled yet. You will be notified by email.');
      btnTxt.textContent = 'Exam Not Scheduled'; btn.disabled = true; return;
    }
    
    else if(result.status === 'fail'){
      setStatus('ended','','background:var(--text-muted)','You have attempted or sitting for exam.');
      btnTxt.textContent = 'Exam Attempted already'; btn.disabled = true; return;
    }

    const exam         = result.response[0];
    const durationMins = parseInt(exam.duration) || 120;
    const startDT      = buildDatetime(exam.date, exam.start);
    const endDT        = buildDatetime(exam.date, exam.end);
    const now          = new Date();
    // getMaxQScoreQ();
    document.getElementById('ic-dura').textContent     = `${durationMins} mins`;
    document.getElementById('ic-dura-sub').textContent = formatDuration(durationMins);
    document.getElementById('next-date').textContent   = niceDate(exam.date);
    document.getElementById('next-time').textContent   = `${niceTime(exam.start)} — ${niceTime(exam.end)}`;

    examState.timerSeconds = durationMins * 60;

    if (now < startDT) {
      const diff  = startDT - now;
      const hh    = Math.floor(diff / 3_600_000);
      const mm    = Math.floor((diff % 3_600_000) / 60_000);
      const label = hh > 0 ? `${hh}h ${mm}m` : `${mm} min${mm !== 1 ? 's' : ''}`;
      setStatus('pending','','background:var(--gold)',
        `Exam starts in <strong style="margin-left:4px">${label}</strong>`);
      btnTxt.textContent = 'Exam Not Started Yet'; btn.disabled = true;
      const msLeft = startDT - now;
      if (msLeft < 86_400_000) {
        setTimeout(() => {
          if (new Date() < endDT) {
            btn.disabled = false; btnTxt.textContent = 'Start Examination';
            setStatus('live','pulse','background:#2ecc71','Exam is live — you may begin now');
          }
        }, msLeft);
      }
    } else if (now >= startDT && now < endDT) {
      setStatus('live','pulse','background:#2ecc71','Exam is live — you may begin now');
      btnTxt.textContent = 'Start Examination'; btn.disabled = false;
    } else {
      setStatus('ended','','background:var(--red)','This examination window has closed.');
      btnTxt.textContent = 'Exam Has Ended'; btn.disabled = true;
    }
}

/*    FETCH — subject count*/
async function fetchSubjectCount(department, org_code) {
  try {
    const res    = await fetch('/cbt/ansofra/api/countSubject', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department: department, organization_code:org_code}),
    });
    const result = await res.json();
    document.getElementById('count-ub').textContent = result.response ?? '—';
  } catch (err) { console.error('fetchSubjectCount:', err); }
}

/*    LAUNCH EXAM*/
async function launchExam() {
  const org_code = document.getElementById("organization-code").textContent;
  const btn    = document.getElementById('start-btn');
  const btnTxt = document.getElementById('start-btn-text');
  btn.disabled = true; btnTxt.textContent = 'Verifying…';

  const department = userData?.department
    || document.getElementById('sb-course').textContent.trim();

  const res    = await fetch('/cbt/ansofra/api/getExamdetails', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ department, organization_code:org_code}),
  });
  const result = await res.json();

  if (result.status !== 'success' || !result.response?.[0]) {
    setLaunchError('No exam has been scheduled for your department yet.');
    btn.disabled = false; btnTxt.textContent = 'Exam Not Scheduled'; return;
  }
  else if(result.status === 'fail'){
    setStatus('ended','','background:var(--text-muted)','You have attempted or sitting for exam.');
    btnTxt.textContent = 'Exam Attempted already'; btn.disabled = true; return;
  }

  const exam         = result.response[0];
  const durationMins = parseInt(exam.duration) || 120;
  const startDT      = buildDatetime(exam.date, exam.start);
  const endDT        = buildDatetime(exam.date, exam.end);
  const now          = new Date();

  if (now < startDT) {
    const diff  = startDT - now;
    const hh    = Math.floor(diff / 3_600_000);
    const mm    = Math.floor((diff % 3_600_000) / 60_000);
    setLaunchError(`The exam has not started yet. It begins in ${hh > 0 ? hh+'h '+mm+'m' : mm+' min'}.`);
    btn.disabled = false; btnTxt.textContent = 'Exam Not Started Yet'; return;
  }
  if (now >= endDT) {
    setLaunchError('The examination window has closed.');
    btnTxt.textContent = 'Exam Has Ended'; return;
  }

  const windowMs   = endDT - now;
  const durationMs = durationMins * 60_000;
  examState.timerSeconds  = Math.floor(Math.min(durationMs, windowMs) / 1_000);
  examState.currentSubject  = 0;
  examState.currentQuestion = 0;
  examState.started         = true;
  examState.questions       = [];
  examState.answers         = [];
  examState.flagged         = [];
  examState.answerDetails   = [];

  document.getElementById('welcome-screen').style.display    = 'none';
  document.getElementById('exam-screen').style.display       = 'flex';
  document.getElementById('timer-wrap').style.display        = 'block';
  document.getElementById('top-session-label').textContent   = 'Exam In Progress';
  document.getElementById('subjects-side').style.display     = 'none';
  document.getElementById('instructions-side').style.display = 'none';
  document.getElementById('progress-side').style.display     = 'block';
  document.getElementById('q-panel').style.display           = 'block';

  await buildSubjectTabs(department);
  startTimer();
}

/*    BUILD SUBJECT TABS*/
async function buildSubjectTabs(department, org_code1) {
  const dept = department || document.getElementById('sb-course').textContent.trim();
  const e = { department: dept , organization_code:org_code};
  // console.log(e);
  const res    = await fetch('/cbt/ansofra/api/getAllSebject', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(e),
  });
  const result = await res.json();
  const list   = result.response || [];

  examState.totalSubjects = list.length;
  // console.log(list);
  let output = '';
  // let totalQuestions = '';
  for (let i = 0; i < list.length; i++) {
    const safeSubject = list[i].subject.replace(/'/g, "\\'");
    output += `<div class="subject-tab ${i === 0 ? 'active' : ''}" id="tab-${i}"
                    onclick="switchSubject('${dept}', '${safeSubject}', ${i}, '${list[i].totalQuestions}', '${list[i].scorePerQuestion}')">
                 ${list[i].subject}<span class="q-count" id="qcount-${i}"></span>
               </div>`;
    // totalQuestions +=list[i].totalQuestions;
  }
  document.getElementById('subject-nav').innerHTML = output;
  // console.log("get Total question ", + list[0].totalQuestions);
  if (list.length > 0) {
    await switchSubject(dept, list[0].subject, 0, list[0].totalQuestions, list[0].scorePerQuestion);
  }
}

/*    SWITCH SUBJECT*/
async function switchSubject(department, subject, idx, totalQuestions, scorePerQuestion) {
  document.querySelectorAll('.subject-tab')
    .forEach((t, i) => t.classList.toggle('active', i === idx));

  examState.currentSubject  = idx;
  examState.currentQuestion = 0;

  document.getElementById('question-area').innerHTML = `
    <div style="padding:48px;text-align:center;color:var(--text-m);font-size:14px;">
      <i class="fas fa-circle-notch fa-spin" style="font-size:22px;color:var(--blue);display:block;margin-bottom:12px"></i>
      Loading ${subject} questions…
    </div>`;

  const regNum = document.getElementById('sidebar-reg').textContent.trim();
  const e = { department:department, subject:subject, regNum:regNum, organization_code:org_code, limit:totalQuestions, scorePerQuestion, scorePerQuestion};
  console.log(e);
  const api = await fetch('/cbt/ansofra/api/display/qesution', {
    method: 'POST', headers: {'Content-Type': 'application/json' },
    body: JSON.stringify(e),
  });
  const result = await api.json();
  // console.log(result);
  if(result.status != "success"){
      document.getElementById('question-area').innerHTML = `
        <div style="padding:48px;text-align:center;color:var(--text-m);font-size:14px;">
          <i class="fas fa-circle-notch fa-spin" style="font-size:22px;color:var(--blue);display:block;margin-bottom:12px"></i>
         No questions found 
        </div>`; 
  }
  const rawData      = result.response[0];
  const questionList = typeof rawData.question === 'string'
    ? JSON.parse(rawData.question)
    : rawData.question;

  examState.questions[idx] = questionList;

  if (!examState.answers[idx] || examState.answers[idx].length !== questionList.length) {
    examState.answers[idx]       = Array(questionList).fill(-1);
    examState.flagged[idx]       = Array(questionList).fill(false);
    examState.answerDetails[idx] = Array(questionList).fill(null);
  }

  const qCountEl = document.getElementById(`qcount-${idx}`);

  renderCurrentQuestion();
}

/*    RENDER CURRENT QUESTION*/
function renderCurrentQuestion() {
  const regNum = document.getElementById('sidebar-reg').textContent.trim();
  const si = examState.currentSubject;
  const qi = examState.currentQuestion;

  const questionList = examState.questions[si];
  if (!questionList || !questionList.length) return;

  const q     = questionList[qi];
  const total = questionList.length;
  const flag  = examState.flagged[si][qi] || false;

  const sel = examState.answers[si][qi];

  const isLastSubject  = si === examState.totalSubjects - 1;
  const isLastQuestion = qi === total - 1;
  const isLast         = isLastSubject && isLastQuestion;

  const prevDisabled = (si === 0 && qi === 0) ? 'disabled' : '';

  const actionBtn = isLast
    ? `<button class="btn-submit-exam" onclick="openModal()"><i class="fas fa-paper-plane" style="font-size:12px"></i> Submit Exam</button>`
    : `<button class="btn-nav-next" onclick="nextQ()">Next <i class="fas fa-arrow-right" style="font-size:11px"></i></button>`;

  const optKeys   = ['optionA','optionB','optionC','optionD','optionE'];
  const optLabels = ['A','B','C','D','E'];

  const optionsHtml = optKeys.map((k, oi) => {
    const optText = String(q[k] || '').trim();
    if (!optText) return '';

    const isSelected = sel === oi;
    const safe = v => String(v || '').replace(/\\/g, '\\\\').replace(/"/g, '&quot;');

    return `
      <div class="option-item ${isSelected ? 'selected' : ''}"
           data-index="${oi}"
           onclick="selectAnswer(
             '${optLabels[oi]}',
             '${safe(optText)}',
             '${safe(q.subject)}',
             '${safe(q.department)}',
             '${safe(q.questionID)}',
             '${safe(q.correctAss)}',
             '${safe(q.correctOpt)}',
             '${safe(regNum)}',
             ${oi}
           )">
        <div class="option-letter">${optLabels[oi]}</div>
        <div class="option-text">${optText}</div>
      </div>`;
  }).join('');

  document.getElementById('question-area').innerHTML = `
    <div class="subj-header">
      <h2>${q.subject || ''}</h2>
      <div class="prog-info">
        Question <strong>${qi + 1}</strong> of <strong>${total}</strong>
      </div>
    </div>
    <div class="question-card">
      <div class="q-number">Question ${qi + 1}</div>
      <div class="question-text">${q.questiontext}</div>
      <div class="options">${optionsHtml}</div>
    </div>
    <div class="nav-actions">
      <button class="btn-nav-prev" onclick="prevQ()" ${prevDisabled}><i class="fas fa-arrow-left" style="font-size:11px"></i> Previous</button>
      <button class="btn-flag-q ${flag ? 'flagged' : ''}" onclick="toggleFlag()">
        <i class="fas fa-flag" style="font-size:11px"></i> ${flag ? 'Flagged' : 'Flag'}
      </button>
      ${actionBtn}
    </div>`;

  updateGrid();
  updateProgress();
}

/*    ANSWER & FLAG ACTIONS*/
function selectAnswer(optionLabel, answerText, subject, department, questionID, correctAss, correctOpt, regNum, optionIndex) {
  const si = examState.currentSubject;
  const qi = examState.currentQuestion;

  examState.answers[si][qi] = optionIndex;

  examState.answerDetails[si][qi] = {
    regNum:       regNum,
    questionID:   questionID,
    correctOtp:   correctOpt,
    correctAns:   correctAss,
    optionPicked: optionLabel,
    answerPicked: answerText,
    subject:      subject,
    department:   department,
  };

  renderCurrentQuestion();
}

function toggleFlag() {
  const si = examState.currentSubject, qi = examState.currentQuestion;
  examState.flagged[si][qi] = !examState.flagged[si][qi];
  renderCurrentQuestion();
}

function goToQuestion(qi) {
  examState.currentQuestion = qi;
  renderCurrentQuestion();
}

/*    NAVIGATION*/
function nextQ() {
  const si        = examState.currentSubject;
  const questions = examState.questions[si] || [];

  if (examState.currentQuestion < questions.length - 1) {
    examState.currentQuestion++;
    renderCurrentQuestion();
  } else {
    const nextIdx = si + 1;
    if (nextIdx < examState.totalSubjects) {
      const nextTab = document.getElementById(`tab-${nextIdx}`);
      const nextSubject = nextTab
        ? nextTab.textContent.replace(/\(.*\)/, '').trim()
        : '';
      const dept = userData?.department
        || document.getElementById('sb-course').textContent.trim();
      switchSubject(dept, nextSubject, nextIdx);
    }
  }
}

function prevQ() {
  const si = examState.currentSubject;

  if (examState.currentQuestion > 0) {
    examState.currentQuestion--;
    renderCurrentQuestion();
  } else if (si > 0) {
    const prevIdx = si - 1;
    const prevTab = document.getElementById(`tab-${prevIdx}`);
    const prevSubject = prevTab
      ? prevTab.textContent.replace(/\(.*\)/, '').trim()
      : '';
    const dept = userData?.department
      || document.getElementById('sb-course').textContent.trim();
    switchSubject(dept, prevSubject, prevIdx).then(() => {
      const prevQuestions = examState.questions[prevIdx] || [];
      if (prevQuestions.length > 1) {
        examState.currentQuestion = prevQuestions.length - 1;
        renderCurrentQuestion();
      }
    });
  }
}

/*    QUESTION GRID*/
function updateGrid() {
  const si        = examState.currentSubject;
  const questions = examState.questions[si] || [];
  document.getElementById('q-grid').innerHTML = questions.map((_, qi) => {
    let cls = 'q-dot';
    if (qi === examState.currentQuestion)               cls += ' current';
    else if (examState.flagged[si]?.[qi])               cls += ' flagged';
    else if (examState.answers[si]?.[qi] !== -1
          && examState.answers[si]?.[qi] !== undefined) cls += ' answered';
    return `<div class="${cls}" onclick="goToQuestion(${qi})">${qi + 1}</div>`;
  }).join('');
}

/*    PROGRESS PANEL*/
function updateProgress() {
  const rows = [];
  for (let si = 0; si < examState.totalSubjects; si++) {
    const questions = examState.questions[si];
    if (!questions) continue;
    const total   = questions.length;
    const answers = examState.answers[si] || [];
    const done    = answers.filter(a => a !== -1 && a !== undefined).length;
    const pct     = total ? Math.round((done / total) * 100) : 0;
    const tab     = document.getElementById(`tab-${si}`);
    const name    = tab ? tab.textContent.replace(/\(.*\)/, '').trim() : `Subject ${si + 1}`;
    rows.push(`
      <div class="prog-row">
        <span class="pname">${name.split(' ')[0]}</span>
        <span class="pscore">${done}/${total}</span>
      </div>
      <div class="prog-bar">
        <div class="prog-bar-fill" style="width:${pct}%"></div>
      </div>`);
  }
  document.getElementById('progress-list').innerHTML = rows.join('');
}

/*    TIMER*/
function startTimer() {
  renderTimerDisplay();
  examState.timerInterval = setInterval(() => {
    examState.timerSeconds--;
    renderTimerDisplay();
    if (examState.timerSeconds <= 0) {
      clearInterval(examState.timerInterval);
      finalSubmit();
    }
  }, 1000);
}

function renderTimerDisplay() {
  const s  = examState.timerSeconds;
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const el = document.getElementById('timer');
  el.textContent = `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  el.className = 'timer-badge';
  if (s <= 600) el.classList.add('warning');
  if (s <= 120) el.classList.add('danger');
}

/*    MODAL & SUBMIT*/
function openModal()  { document.getElementById('submit-modal').classList.add('open'); }
function closeModal() { document.getElementById('submit-modal').classList.remove('open'); }

async function finalSubmit() {
  clearInterval(examState.timerInterval);
  closeModal();

  const regNum = document.getElementById('sidebar-reg').textContent.trim();
  const dept   = userData?.department || document.getElementById('sb-course').textContent.trim();
  const fullname = document.getElementById("sidebar-name").textContent.trim();

  const questionsAttemptedObject = {};
  let questionCounter = 0;

  for (let si = 0; si < examState.totalSubjects; si++) {
    const questions = examState.questions[si] || [];
    const tab = document.getElementById(`tab-${si}`);
    const subjectName = tab ? tab.textContent.replace(/\(.*\)/, '').trim() : `Subject ${si + 1}`;

    let subjectScore = 0;
    let subjectTotalQuestions = questions.length;

    questions.forEach((q, qi) => {
      const storedDetail = (examState.answerDetails[si] && examState.answerDetails[si][qi])
        ? examState.answerDetails[si][qi]
        : null;

      let questionObj = {
        regNum: regNum,
        questionID: q.questionID || '',
        questiontext: q.questiontext || '',
        correctOtp: q.correctOpt || '',
        correctAns: q.correctAss || '',
        optionPicked: '',
        answerPicked: '',
        subject: q.subject || subjectName,
        department: q.department || dept,
        fullname: fullname,
        attempted: false
      };

      if (storedDetail && examState.answers[si] && examState.answers[si][qi] !== -1) {
        questionObj.optionPicked = storedDetail.optionPicked || '';
        questionObj.answerPicked = storedDetail.answerPicked || '';
        questionObj.attempted = true;
        if (questionObj.answerPicked &&
            questionObj.answerPicked.toUpperCase() === String(questionObj.correctAns).toUpperCase()) {
          subjectScore++;
        }
      }

      const key = `question_${questionCounter}`;
      questionsAttemptedObject[key] = questionObj;
      questionCounter++;
    });

    const subjectPoints = parseFloat(subjectScore) * parseFloat(score_per_question);

    const subjectScoreObject = {
      regNum: regNum,
      department: dept,
      subject: subjectName,
      fullname: fullname,
      score: subjectPoints,
      totalQuestions: subjectTotalQuestions,
      correctAnswers: subjectScore,
      expectedScore: parseFloat(subjectTotalQuestions) * parseFloat(score_per_question),
      organization_code:org_code
    };

    const scoresApi = await fetch('/cbt/ansofra/api/save/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subjectScoreObject),
    });
    const scoresResult = await scoresApi.json();
  }

  const finalQuestionsObject = {
    regNum: regNum,
    fullname: fullname,
    department: dept,
    totalQuestions: questionCounter,
    submittedAt: new Date().toISOString(),
    questionToSave: JSON.stringify(questionsAttemptedObject),
    organization_code:org_code,
  };

  const attemptApi = await fetch('/cbt/ansofra/api/save/questions/attempt', {
    method:'POST',
    headers:{'Content-type':'application/json'},
    body:JSON.stringify(finalQuestionsObject)
  });
  const attemptResult = await attemptApi.json();

  await saveResult();
}

async function saveResult() {
  const regNum     = document.getElementById('sidebar-reg').textContent.trim();
  const fullname   = document.getElementById('sidebar-name').textContent.trim();
  const department = document.getElementById('sb-course').textContent.trim();
  const email = document.getElementById('sidebar-email').textContent.trim();
  const e = {regNum:regNum};
  const api    = await fetch('/cbt/ansofra/api/get/scores/subject', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(e),
  });
  const result = await api.json();
  const response = result.response;

  let overAll = 0;
  for (let index = 0; index < response.length; index++) {
    overAll += parseFloat(response[index].score);
  }

  const d = {
    regNum: regNum,
    fullname: fullname,
    department:department,
    overAll: overAll,
    email: email,
    subjectAndScore: JSON.stringify(response),
    organization_code:org_code,
  };

  const seApi = await fetch('/cbt/ansofra/api/save/result', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(d),
  });
  const resultApi = await seApi.json();
  console.log(resultApi);
  if (resultApi.status === 'success') {
     backToDash();
  }
}

function backToDash() {
  document.getElementById('result-screen').style.display         = 'none';
  document.getElementById('dashboard-page').style.display        = 'flex';
  document.getElementById('exam-screen').style.display           = 'none';
  document.getElementById('welcome-screen').style.display        = 'block';
  document.getElementById('timer-wrap').style.display            = 'none';
  document.getElementById('top-session-label').textContent       = 'Candidate Dashboard';
  document.getElementById('subjects-side').style.display         = 'block';
  document.getElementById('instructions-side').style.display     = 'block';
  document.getElementById('progress-side').style.display         = 'none';
  document.getElementById('q-panel').style.display               = 'none';
  examState.timerSeconds = 0;
  examState.started      = false;
}

function logout() { localStorage.removeItem('cbt_session'); window.location.href = 'login.html'; }

/*    DATE / TIME HELPERS*/
function buildDatetime(dateStr, timeStr) {
  let d = String(dateStr).trim();
  if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(d)) {
    const sep = d.includes('/') ? '/' : '-';
    const [dd, mm, yyyy] = d.split(sep);
    d = `${yyyy}-${mm}-${dd}`;
  }
  let t = String(timeStr).trim();
  const ampm = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (ampm) {
    let hh = parseInt(ampm[1]);
    const mm = ampm[2], ss = ampm[3]||'00', p = ampm[4].toUpperCase();
    if (p==='AM' && hh===12) hh=0;
    if (p==='PM' && hh!==12) hh+=12;
    t = `${String(hh).padStart(2,'0')}:${mm}:${ss}`;
  } else if (/^\d{1,2}:\d{2}$/.test(t)) { t += ':00'; }
  return new Date(`${d}T${t}`);
}

function niceDate(dateStr) {
  try {
    let iso = String(dateStr).trim();
    if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(iso)) {
      const [dd,mm,yyyy] = iso.split(/[\/\-]/); iso = `${yyyy}-${mm}-${dd}`;
    }
    return new Date(iso).toLocaleDateString('en-NG',
      { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  } catch { return dateStr; }
}

function niceTime(timeStr) {
  try {
    let t = String(timeStr).trim();
    if (/^\d{1,2}:\d{2}$/.test(t)) t += ':00';
    return new Date(`1970-01-01T${t}`).toLocaleTimeString('en-NG',
      { hour:'2-digit', minute:'2-digit' });
  } catch { return timeStr; }
}

function formatDuration(mins) {
  const h = Math.floor(mins/60), m = mins%60;
  return h ? `${h} hr${h!==1?'s':''} ${m ? m+'m' : ''}`.trim() : `${m} min${m!==1?'s':''}`;
}

function setLaunchError(msg) {
  const badge = document.getElementById('exam-status-badge');
  badge.className = 'exam-status-badge ended';
  badge.innerHTML = `<span class="status-dot" style="background:var(--red)"></span>${msg}`;
}