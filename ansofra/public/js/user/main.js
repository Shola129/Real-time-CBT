
/*    STATE*/
let SUBJECTS  = [];
let user      = null;
let userData  = null;
let totalQuestions = [];
let scorePerQuestion = [];
let currentScorePerQuestion;
const idEmail = localStorage.getItem('cbt_session_email');
 const org_code = localStorage.getItem('cbt_session_org_code');
  const regNum = localStorage.getItem('cbt_session_reg_num');
   const id = localStorage.getItem("cbt_session_id");
 if(!org_code || !id || !regNum){
    // window.location.href="/cbt/ansofra/user/login";
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
    const e = {
        organization_code: org_code,
        regNum: regNum,
        ID: id
    };
    
    const res = await fetch('/cbt/ansofra/api/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e),
    });
    const result = await res.json();
    
    if (result.status !== 'success' || !result.response?.[0]) {
        // window.location.href="/cbt/ansofra/user/login";
        return;
    }
    
    const p = result.response[0];
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
    // document.getElementById('ic-reg').textContent          = p.regNum;
    document.getElementById('sidebar-org-code').textContent = p.organization_code;
    document.getElementById('hero-name').innerHTML =
      `Welcome, <span>${p.firstName || p.fullname.split(' ')[0]}</span>`;    
    // ✅ NEW: Fetch course timetables
    await fetchCourseTimetables(p.department, org_code);
    
    // ✅ NEW: Start auto-refresh for time remaining
    startTimetableAutoRefresh(p.department, org_code);
    
    // ✅ Continue with existing functions
    await Promise.all([
        fetchSubjectList(p.department, org_code),
        fetchExamDetails(p.department, org_code),
        // fetchSubjectCount(p.department, org_code),
    ]);
}
// async function populateUI() {
//   const e = {
//      organization_code:org_code, 
//      regNum:regNum,
//      ID:id
//     };
//   // console.log(e);
//     const res    = await fetch('/cbt/ansofra/api/details', {
//       method: 'POST', headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(e),
//     });
//     const result = await res.json();
//     // console.log(result);
//     if (result.status !== 'success' || !result.response?.[0]) {
//             //  window.location.href="/cbt/ansofra/user/login";
//               return;
//             //  console.error('Profile error:', result); return; 
//     }
//     const p  = result.response[0];
//     userData = p;
//     const initials = p.fullname.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

//     document.getElementById('nav-avatar').textContent      = initials;
//     document.getElementById('nav-name').textContent        = p.firstName || p.fullname.split(' ')[0];
//     document.getElementById('sidebar-avatar').textContent  = initials;
//     document.getElementById('sidebar-name').textContent    = p.fullname;
//     document.getElementById('sidebar-reg').textContent     = p.regNum;
//     document.getElementById('sb-state').textContent        = p.state      || '—';
//     document.getElementById('sb-year').textContent         = p.year       || '—';
//     document.getElementById('sb-course').textContent       = p.department || '—';
//     document.getElementById('sb-gender').textContent       = p.gender     || '—';
//     document.getElementById('sb-phone').textContent        = p.phone      || '—';
//     document.getElementById('ic-reg').textContent          = p.regNum;
//     document.getElementById('sidebar-email').textContent = p.email;
//     document.getElementById('hero-name').innerHTML =
//       `Welcome, <span>${p.firstName || p.fullname.split(' ')[0]}</span>`;

//     await Promise.all([
//       fetchSubjectList(p.department, org_code),
//       fetchExamDetails(p.department, org_code),
//       fetchSubjectCount(p.department, org_code),
//     ]);
// }

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
    const response = result.response[0];
    // console.log(response);
    if (result.status === 'failed' || !result.response?.[0]) {
      setStatus('ended','','background:var(--text-muted)','No exam scheduled yet. You will be notified by email.');
      btnTxt.textContent = 'Exam Not Scheduled'; btn.disabled = true; return;
    }
    
    else if(result.status === 'fail'){
      setStatus('ended','','background:var(--text-muted)','You have attempted or sitting for exam.');
      btnTxt.textContent = 'Exam Attempted already'; btn.disabled = true; return;
    }

    else if(response.status === "inactive"){
        setStatus('ended','','background:var(--text-muted)','Examination not available.');
      btnTxt.textContent = 'Exam Not Available'; btn.disabled = true; return;
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
// async function fetchSubjectCount(department, org_code) {
//   try {
//     const res    = await fetch('/cbt/ansofra/api/countSubject', {
//       method: 'POST', headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ department: department, organization_code:org_code}),
//     });
//     const result = await res.json();
//     document.getElementById('count-ub').textContent = result.response ?? '—';
//   } catch (err) { console.error('fetchSubjectCount:', err); }
// }

/*    LAUNCH EXAM*/
// async function launchExam() {
//   const org_code = document.getElementById("organization-code").textContent;
//   const btn    = document.getElementById('start-btn');
//   const btnTxt = document.getElementById('start-btn-text');
//   btn.disabled = true; btnTxt.textContent = 'Verifying…';

//   const department = userData?.department
//     || document.getElementById('sb-course').textContent.trim();

//   const res    = await fetch('/cbt/ansofra/api/getExamdetails', {
//     method: 'POST', headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ department, organization_code:org_code}),
//   });
//   const result = await res.json();

//   if (result.status !== 'success' || !result.response?.[0]) {
//     setLaunchError('No exam has been scheduled for your department yet.');
//     btn.disabled = false; btnTxt.textContent = 'Exam Not Scheduled'; return;
//   }
//   else if(result.status === 'fail'){
//     setStatus('ended','','background:var(--text-muted)','You have attempted or sitting for exam.');
//     btnTxt.textContent = 'Exam Attempted already'; btn.disabled = true; return;
//   }

//   const exam         = result.response[0];
//   const durationMins = parseInt(exam.duration) || 120;
//   const startDT      = buildDatetime(exam.date, exam.start);
//   const endDT        = buildDatetime(exam.date, exam.end);
//   const now          = new Date();

//   if (now < startDT) {
//     const diff  = startDT - now;
//     const hh    = Math.floor(diff / 3_600_000);
//     const mm    = Math.floor((diff % 3_600_000) / 60_000);
//     setLaunchError(`The exam has not started yet. It begins in ${hh > 0 ? hh+'h '+mm+'m' : mm+' min'}.`);
//     btn.disabled = false; btnTxt.textContent = 'Exam Not Started Yet'; return;
//   }
//   if (now >= endDT) {
//     setLaunchError('The examination window has closed.');
//     btnTxt.textContent = 'Exam Has Ended'; return;
//   }

//   const windowMs   = endDT - now;
//   const durationMs = durationMins * 60_000;
//   examState.timerSeconds  = Math.floor(Math.min(durationMs, windowMs) / 1_000);
//   examState.currentSubject  = 0;
//   examState.currentQuestion = 0;
//   examState.started         = true;
//   examState.questions       = [];
//   examState.answers         = [];
//   examState.flagged         = [];
//   examState.answerDetails   = [];

//   document.getElementById('welcome-screen').style.display    = 'none';
//   document.getElementById('exam-screen').style.display       = 'flex';
//   document.getElementById('timer-wrap').style.display        = 'block';
//   document.getElementById('top-session-label').textContent   = 'Exam In Progress';
//   document.getElementById('subjects-side').style.display     = 'none';
//   document.getElementById('instructions-side').style.display = 'none';
//   document.getElementById('progress-side').style.display     = 'block';
//   document.getElementById('q-panel').style.display           = 'block';

//    buildSubjectTabs(department);
//   startTimer();
// }
async function launchExam() {
    const org_code = document.getElementById("organization-code").textContent;
    const btn = document.getElementById('start-btn');
    const btnTxt = document.getElementById('start-btn-text');
    btn.disabled = true;
    btnTxt.textContent = 'Verifying…';

    const department = userData?.department || document.getElementById('sb-course').textContent.trim();

    const res = await fetch('/cbt/ansofra/api/getExamdetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department, organization_code: org_code }),
    });
    const result = await res.json();

    if (result.status !== 'success' || !result.response?.[0]) {
        setLaunchError('No exam has been scheduled for your department yet.');
        btn.disabled = false;
        btnTxt.textContent = 'Exam Not Scheduled';
        return;
    } else if (result.status === 'fail') {
        setStatus('ended', '', 'background:var(--text-muted)', 'You have attempted or sitting for exam.');
        btnTxt.textContent = 'Exam Attempted already';
        btn.disabled = true;
        return;
    }

    const exam = result.response[0];
    const durationMins = parseInt(exam.duration) || 120;
    const startDT = buildDatetime(exam.date, exam.start);
    const endDT = buildDatetime(exam.date, exam.end);
    const now = new Date();

    if (now < startDT) {
        const diff = startDT - now;
        const hh = Math.floor(diff / 3_600_000);
        const mm = Math.floor((diff % 3_600_000) / 60_000);
        setLaunchError(`The exam has not started yet. It begins in ${hh > 0 ? hh + 'h ' + mm + 'm' : mm + ' min'}.`);
        btn.disabled = false;
        btnTxt.textContent = 'Exam Not Started Yet';
        return;
    }
    if (now >= endDT) {
        setLaunchError('The examination window has closed.');
        btnTxt.textContent = 'Exam Has Ended';
        return;
    }

    const windowMs = endDT - now;
    const durationMs = durationMins * 60_000;
    examState.timerSeconds = Math.floor(Math.min(durationMs, windowMs) / 1_000);
    examState.currentSubject = 0;
    examState.currentQuestion = 0;
    examState.started = true;
    examState.questions = [];
    examState.answers = [];
    examState.flagged = [];
    examState.answerDetails = [];

    // ✅ FIX: Hide timetable section when exam starts
    const timetableSection = document.querySelector('.timetable-section');
    if (timetableSection) {
        timetableSection.style.display = 'none';
    }

    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('exam-screen').style.display = 'flex';
    document.getElementById('timer-wrap').style.display = 'block';
    document.getElementById('top-session-label').textContent = 'Exam In Progress';
    document.getElementById('subjects-side').style.display = 'none';
    document.getElementById('instructions-side').style.display = 'none';
    document.getElementById('progress-side').style.display = 'block';
    document.getElementById('q-panel').style.display = 'block';

    buildSubjectTabs(department);
    startTimer();
}
console.log('📊 Exam Duration:', durationMins, 'minutes');
console.log('⏱️ Timer Seconds:', examState.timerSeconds);
console.log('🕐 Start:', startDT.toLocaleString());
console.log('🕐 End:', endDT.toLocaleString());
console.log('🕐 Now:', now.toLocaleString());
/*    BUILD SUBJECT TABS*/
// async function buildSubjectTabs(department, org_code1) {
//   const dept = department || document.getElementById('sb-course').textContent.trim();
//   const e = { department: dept , organization_code:org_code};
//   // console.log(e);
//   const res    = await fetch('/cbt/ansofra/api/getAllSebject', {
//     method: 'POST', headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(e),
//   });
//   const result = await res.json();
//   const list   = result.response || [];

//   examState.totalSubjects = list.length;
//   // console.log(list);
//   let output = '';
//   // let totalQuestions = '';
//   for (let i = 0; i < list.length; i++) {
//     const safeSubject = list[i].subject.replace(/'/g, "\\'");
//     output += `<div class="subject-tab ${i === 0 ? 'active' : ''}" id="tab-${i}"
//                     onclick="switchSubject('${dept}', '${safeSubject}', ${i}, '${list[i].totalQuestions}', '${list[i].scorePerQuestion}')">
//                  ${list[i].subject}<span class="q-count" id="qcount-${i}"></span>
//                </div>`;
//     // totalQuestions +=list[i].totalQuestions;
//   }
//   document.getElementById('subject-nav').innerHTML = output;
//   // console.log("get Total question ", + list[0].totalQuestions);
//   if (list.length > 0) {
//     await switchSubject(dept, list[0].subject, 0, list[0].totalQuestions, list[0].scorePerQuestion);
//   }
// }
/*    BUILD SUBJECT TABS - MODIFIED */
async function buildSubjectTabs(department, specificSubject = null) {
    const dept = department || document.getElementById('sb-course').textContent.trim();
    const e = { 
        department: dept, 
        organization_code: org_code 
    };
    
    const res = await fetch('/cbt/ansofra/api/getAllSebject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e),
    });
    const result = await res.json();
    let list = result.response || [];
    
    // If a specific subject is provided, filter to only that subject
    if (specificSubject) {
        list = list.filter(item => item.subject === specificSubject);
    }
    
    examState.totalSubjects = list.length;
    
    let output = '';
    for (let i = 0; i < list.length; i++) {
        const safeSubject = list[i].subject.replace(/'/g, "\\'");
        output += `<div class="subject-tab ${i === 0 ? 'active' : ''}" id="tab-${i}"
                        onclick="switchSubject('${dept}', '${safeSubject}', ${i}, '${list[i].totalQuestions}', '${list[i].scorePerQuestion}')">
                     ${list[i].subject}<span class="q-count" id="qcount-${i}"></span>
                   </div>`;
    }
    document.getElementById('subject-nav').innerHTML = output;
    
    if (list.length > 0) {
        await switchSubject(dept, list[0].subject, 0, list[0].totalQuestions, list[0].scorePerQuestion);
    }
}

/*    SWITCH SUBJECT*/
async function switchSubject(department, subject, idx, totalQuestions1, scorePerQuestion1) {
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
  const e = { department:department, subject:subject, regNum:regNum, organization_code:org_code, limit:totalQuestions1, scorePerQuestion:scorePerQuestion1};
  // console.log(e);
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
    scorePerQuestion[idx] = parseFloat(rawData.scorePerQuestion);
    totalQuestions[idx] = parseFloat(rawData.totalQuestions);
  // console.log("scorePerQuestion"+scorePerQuestion + "   " + "totalQuestions" + totalQuestions)
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
  // texting();
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

    const subjectPoints = parseFloat(subjectScore) * parseFloat(currentScorePerQuestion);    
     currentScorePerQuestion = scorePerQuestion[si];
     currentTotalQuestions = totalQuestions[si];   
    // console.log("scorePerQuestion2: "+scorePerQuestion + "   " + "totalQuestions2: " + totalQuestions)
    // console.log(
//     "scorePerQuestion2:",
//     currentScorePerQuestion,
//     "totalQuestions2:",
//     currentTotalQuestions
// );

let score = parseFloat(subjectScore) * parseFloat(currentScorePerQuestion);
const actualScore = parseFloat(totalQuestions) * parseFloat(currentScorePerQuestion);
const DivActualScore = parseFloat(actualScore) / 2;
let status ="";
if(DivActualScore > score){
    status = "Fail";
}else if(DivActualScore = score ){
    status = "Pass";
}else if(score > DivActualScore && score <= 65){
    status = "Credit";
}else if(score > DivActualScore && score > 60 && score <=80){
  status = "Good";
}else{
  status = "Excellent";
}
    const subjectScoreObject = {
      regNum: regNum,
      department: dept,
      subject: subjectName,
      fullname: fullname,
      score: parseFloat(subjectScore) * parseFloat(currentScorePerQuestion),
      totalQuestions: currentTotalQuestions,
      correctAnswers: subjectScore,
      expectedScore: parseFloat(currentTotalQuestions) * parseFloat(currentScorePerQuestion),
      organization_code: org_code,
      scorePerQuestion: parseFloat(currentScorePerQuestion),
      status:status
    };
    // console.log(subjectScoreObject);

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
  // console.log(resultApi);
  if (resultApi.status === 'success') {
     backToDash();
  }else{
    alert(resultApi.response);
  }
}

// function backToDash() {
//   document.querySelector('.timetable-section').style.display = 'block';
//   document.getElementById('result-screen').style.display         = 'none';
//   document.getElementById('dashboard-page').style.display        = 'flex';
//   document.getElementById('exam-screen').style.display           = 'none';
//   document.getElementById('welcome-screen').style.display        = 'block';
//   document.getElementById('timer-wrap').style.display            = 'none';
//   document.getElementById('top-session-label').textContent       = 'Candidate Dashboard';
//   document.getElementById('subjects-side').style.display         = 'block';
//   document.getElementById('instructions-side').style.display     = 'block';
//   document.getElementById('progress-side').style.display         = 'none';
//   document.getElementById('q-panel').style.display               = 'none';
//   examState.timerSeconds = 0;
//   examState.started      = false;
// }

function backToDash() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'flex';
    document.getElementById('exam-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
    document.getElementById('timer-wrap').style.display = 'none';
    document.getElementById('top-session-label').textContent = 'Candidate Dashboard';
    document.getElementById('subjects-side').style.display = 'block';
    document.getElementById('instructions-side').style.display = 'block';
    document.getElementById('progress-side').style.display = 'none';
    document.getElementById('q-panel').style.display = 'none';
    
    // ✅ FIX: Show timetable section again
    const timetableSection = document.querySelector('.timetable-section');
    if (timetableSection) {
        timetableSection.style.display = 'block';
    }
    
    examState.timerSeconds = 0;
    examState.started = false;
}

function logout() {
   localStorage.removeItem('cbt_session_email');
   localStorage.removeItem('cbt_session_reg_num');
   localStorage.removeItem('cbt_session_id');
   localStorage.removeItem('cbt_session_org_code');    
   window.location.href = '/cbt/ansofra/examination/auth'; }

/*    DATE / TIME HELPERS*/
// function buildDatetime(dateStr, timeStr) {
//   let d = String(dateStr).trim();
//   if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(d)) {
//     const sep = d.includes('/') ? '/' : '-';
//     const [dd, mm, yyyy] = d.split(sep);
//     d = `${yyyy}-${mm}-${dd}`;
//   }
//   let t = String(timeStr).trim();
//   const ampm = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
//   if (ampm) {
//     let hh = parseInt(ampm[1]);
//     const mm = ampm[2], ss = ampm[3]||'00', p = ampm[4].toUpperCase();
//     if (p==='AM' && hh===12) hh=0;
//     if (p==='PM' && hh!==12) hh+=12;
//     t = `${String(hh).padStart(2,'0')}:${mm}:${ss}`;
//   } else if (/^\d{1,2}:\d{2}$/.test(t)) { t += ':00'; }
//   return new Date(`${d}T${t}`);
// }

/*    DATE / TIME HELPERS - FIXED */
function buildDatetime(dateStr, timeStr) {
    // Handle date format: "2026-07-25" or "25/07/2026" or "25-07-2026"
    let d = String(dateStr).trim();
    
    // If date is in DD/MM/YYYY or DD-MM-YYYY format, convert to YYYY-MM-DD
    if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(d)) {
        const sep = d.includes('/') ? '/' : '-';
        const parts = d.split(sep);
        // parts: [DD, MM, YYYY] or [MM, DD, YYYY] depending on format
        // Assuming DD/MM/YYYY format
        if (parts.length === 3) {
            // Check if first part is day (1-31) and second is month (1-12)
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
                d = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            } else {
                // Maybe it's MM/DD/YYYY format
                d = `${year}-${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}`;
            }
        }
    }
    
    // Handle time format: "22:43", "10:30 PM", "10:30:00", "10:30:00 PM"
    let t = String(timeStr).trim();
    
    // Check for AM/PM format
    const ampmMatch = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (ampmMatch) {
        let hours = parseInt(ampmMatch[1]);
        const minutes = ampmMatch[2];
        const seconds = ampmMatch[3] || '00';
        const period = ampmMatch[4].toUpperCase();
        
        // Convert to 24-hour format
        if (period === 'AM' && hours === 12) hours = 0;
        if (period === 'PM' && hours !== 12) hours += 12;
        
        t = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    } 
    // Check for 24-hour format without seconds (HH:MM)
    else if (/^\d{1,2}:\d{2}$/.test(t)) {
        // If it's 24-hour format with hours possibly less than 10
        const parts = t.split(':');
        const hours = parseInt(parts[0]);
        const minutes = parts[1];
        // Ensure hours are 0-23
        if (hours >= 0 && hours <= 23) {
            t = `${String(hours).padStart(2, '0')}:${minutes}:00`;
        } else {
            // If hours > 23, it might be AM/PM without the AM/PM label
            // Try to parse as 12-hour format
            if (hours > 12) {
                // It's PM time
                t = `${String(hours).padStart(2, '0')}:${minutes}:00`;
            } else {
                // Assume it's AM
                t = `${String(hours).padStart(2, '0')}:${minutes}:00`;
            }
        }
    } 
    // If it already has seconds, keep it
    else if (/^\d{1,2}:\d{2}:\d{2}$/.test(t)) {
        // Ensure hours are 0-23
        const parts = t.split(':');
        const hours = parseInt(parts[0]);
        if (hours >= 0 && hours <= 23) {
            t = `${String(hours).padStart(2, '0')}:${parts[1]}:${parts[2]}`;
        }
    } else {
        // Default: add :00 if only HH:MM
        if (/^\d{1,2}:\d{2}$/.test(t)) {
            t += ':00';
        }
    }
    
    // Combine date and time
    const dateTimeStr = `${d}T${t}`;
    const result = new Date(dateTimeStr);
    
    // Check if date is valid
    if (isNaN(result.getTime())) {
        console.warn('Invalid date/time:', dateTimeStr);
        // Try alternative: if date is in YYYY-MM-DD format but time is wrong
        const fallback = new Date(`${d}T00:00:00`);
        if (!isNaN(fallback.getTime())) {
            return fallback;
        }
        return new Date(); // Return current time as fallback
    }
    
    return result;
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

// function texting(){
//   console.log("text");
//   console.log(scorePerQuestion, totalQuestions);
// }


// NEW: Fetch and validate course timetables


// FIXED: Fetch and validate course timetables

async function fetchCourseTimetables(department, org_code) {
    try {
        // Show loading state
        document.getElementById('timetable-body').innerHTML = `
            <tr><td colspan="7" style="text-align:center;color:var(--text-m);padding:20px">
                <i class="fas fa-spinner fa-spin"></i> Loading course timetables...
            </td></tr>
        `;
        
        const response = await fetch('/cbt/ansofra/api/getCourseTimetables', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                department: department, 
                organization_code: org_code 
            })
        });
        
        const result = await response.json();
        
        if (result.status !== 'success' || !result.response) {
            document.getElementById('timetable-body').innerHTML = `
                <tr><td colspan="7" style="text-align:center;color:var(--text-m);padding:20px">
                    No course timetables found for your department.
                </td></tr>
            `;
            return;
        }
        
        const courses = result.response;
        const now = new Date();
        
        // DEBUG: Log the current time to see what's happening
        console.log('🕐 Current Time:', now.toLocaleString());
        console.log('📋 Courses Data:', courses);
        
        // Process each course to determine its status
        const processedCourses = courses.map((course, index) => {
            // IMPORTANT: Use the correct field names from your API response
            // Your API might use 'end_time', 'end', 'endTime', etc.
            const startTime = course.start || course.start_time || course.startTime;
            const endTime = course.end || course.end_time || course.endTime;
            
            // Build date and time objects
            const courseDate = buildDatetime(course.date, startTime);
            const courseEnd = buildDatetime(course.date, endTime);
            
            // DEBUG: Log each course's parsed times
            // console.log(`📚 Course ${index + 1}: ${course.subject}`);
            // console.log(`   Start: ${courseDate.toLocaleString()}`);
            // console.log(`   End:   ${courseEnd.toLocaleString()}`);
            // console.log(`   Now:   ${now.toLocaleString()}`);
            // console.log(`   Is Now >= End? ${now >= courseEnd}`);
            // console.log(`   Is Now < Start? ${now < courseDate}`);
            // console.log(`   Is Now between? ${now >= courseDate && now < courseEnd}`);
            
            // Calculate status with proper time comparison
            let status = 'upcoming';
            let timeRemaining = '';
            let statusColor = '#3498db'; // blue for upcoming
            
            // Check if the exam is active (now is between start and end)
            if (now >= courseDate && now < courseEnd) {
                status = 'active';
                statusColor = '#2ecc71'; // green for active
                
                // Calculate time remaining until end
                const diffMs = courseEnd - now;
                const hours = Math.floor(diffMs / 3600000);
                const minutes = Math.floor((diffMs % 3600000) / 60000);
                const seconds = Math.floor((diffMs % 60000) / 1000);
                
                if (hours > 0) {
                    timeRemaining = `${hours}h ${minutes}m ${seconds}s`;
                } else {
                    timeRemaining = `${minutes}m ${seconds}s`;
                }
                
            } 
            // Check if the exam has expired (now is at or after end time)
            else if (now >= courseEnd) {
                status = 'expired';
                statusColor = '#e74c3c'; // red for expired
                timeRemaining = 'Completed';
            } 
            // Otherwise it's upcoming (now is before start time)
            else {
                status = 'upcoming';
                statusColor = '#3498db'; // blue for upcoming
                
                // Calculate time until start
                const diffMs = courseDate - now;
                const hours = Math.floor(diffMs / 3600000);
                const minutes = Math.floor((diffMs % 3600000) / 60000);
                
                if (hours > 0) {
                    timeRemaining = `Starts in ${hours}h ${minutes}m`;
                } else {
                    timeRemaining = `Starts in ${minutes}m`;
                }
            }
            
            return {
                ...course,
                status: status,
                statusColor: statusColor,
                timeRemaining: timeRemaining,
                startDateTime: courseDate,
                endDateTime: courseEnd
            };
        });
        
        // Sort courses: active first, then upcoming, then expired
        const statusOrder = { active: 0, upcoming: 1, expired: 2 };
        processedCourses.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        
        // Render the timetable
        renderTimetable(processedCourses);
        
        // Update status badges
        updateStatusBadges(processedCourses);
        
    } catch (error) {
        console.error('Error fetching timetables:', error);
        document.getElementById('timetable-body').innerHTML = `
            <tr><td colspan="7" style="text-align:center;color:var(--danger);padding:20px">
                <i class="fas fa-exclamation-circle"></i> Error loading timetables. Please refresh.
            </td></tr>
        `;
    }
}
// async function fetchCourseTimetables(department, org_code) {
//     try {
//         // Show loading state
//         document.getElementById('timetable-body').innerHTML = `
//             <tr><td colspan="6" style="text-align:center;color:var(--text-m);padding:20px">
//                 <i class="fas fa-spinner fa-spin"></i> Loading course timetables...
//             </td></tr>
//         `;
        
//         const response = await fetch('/cbt/ansofra/api/getCourseTimetables', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 department: department, 
//                 organization_code: org_code 
//             })
//         });
        
//         const result = await response.json();
        
//         if (result.status !== 'success' || !result.response) {
//             document.getElementById('timetable-body').innerHTML = `
//                 <tr><td colspan="6" style="text-align:center;color:var(--text-m);padding:20px">
//                     No course timetables found for your department.
//                 </td></tr>
//             `;
//             return;
//         }
        
//         const courses = result.response;
//         // const res = courses.response;
//         // console.log(courses["status"]);
//         const now = new Date();
        
//         // Process each course to determine its status
//         const processedCourses = courses.map(course => {
//             // Build date and time objects
//             const courseDate = buildDatetime(course.date, course.start);
//             const courseEnd = buildDatetime(course.date, course.end);
            
//             // Calculate status
//             let status = 'upcoming';
//             let timeRemaining = '';
//             let statusColor = '#3498db'; // blue for upcoming
            
//             if (now >= courseDate && now < courseEnd) {
//                 status = 'active';
//                 statusColor = '#2ecc71'; // green for active
                
//                 // Calculate time remaining
//                 const diff = courseEnd - now;
//                 const hours = Math.floor(diff / 3600000);
//                 const minutes = Math.floor((diff % 3600000) / 60000);
//                 timeRemaining = `${hours}h ${minutes}m`;
                
//             } else if (now >= courseEnd) {
//                 status = 'expired';
//                 statusColor = '#e74c3c'; // red for expired
//                 timeRemaining = 'Completed';
//             }
//             // else if(courses.status == "inactive"){
//             //     status = 'inactive';
//             //     statusColor = '#e74c3c'; // red for expired
//             //     // timeRemaining = 'Completed';
//             //     const diff = courseEnd - now;
//             //     const hours = Math.floor(diff / 3600000);
//             //     const minutes = Math.floor((diff % 3600000) / 60000);
//             //     timeRemaining = `${hours}h ${minutes}m`;
//             // }
//             else {
//                 // Upcoming - calculate time until start
//                 const diff = courseDate - now;
//                 const hours = Math.floor(diff / 3600000);
//                 const minutes = Math.floor((diff % 3600000) / 60000);
//                 timeRemaining = `Starts in ${hours}h ${minutes}m`;
//             }
            
//             return {
//                 ...course,
//                 status: status,
//                 statusColor: statusColor,
//                 timeRemaining: timeRemaining,
//                 startDateTime: courseDate,
//                 endDateTime: courseEnd
//             };
//         });
        
//         // Sort courses: active first, then upcoming, then expired
//         const statusOrder = { active: 0, upcoming: 1, expired: 2 };
//         processedCourses.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        
//         // Render the timetable
//         renderTimetable(processedCourses);
        
//         // Update status badges
//         updateStatusBadges(processedCourses);
        
//     } catch (error) {
//         console.error('Error fetching timetables:', error);
//         document.getElementById('timetable-body').innerHTML = `
//             <tr><td colspan="6" style="text-align:center;color:var(--danger);padding:20px">
//                 <i class="fas fa-exclamation-circle"></i> Error loading timetables. Please refresh.
//             </td></tr>
//         `;
//     }
// }

// 
// // RENDER TIMETABLE IN HTML
// 
// function renderTimetable(courses) {
//     const tbody = document.getElementById('timetable-body');
    
//     if (!courses || courses.length === 0) {
//         tbody.innerHTML = `
//             <tr><td colspan="6" style="text-align:center;color:var(--text-m);padding:20px">
//                 No courses available for your department.
//             </td></tr>
//         `;
//         return;
//     }
    
//     // Define color palette for course codes
//     const palette = ['#3498db','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#1dd1a1'];
    
//     tbody.innerHTML = courses.map((course, index) => `
//         <tr class="course-row status-${course.status}">
//             <td>
//                 <span class="course-dot" style="background:${palette[index % palette.length]}"></span>
//                 ${index + 1}
//             </td>
//             <td>
//                 <strong>${course.subject || course.subjectCode || 'N/A'}</strong>
//                 <div class="course-title-small">${course.subject || course.subject || ''}</div>
//             </td>
//             <td>${course.subject || course.course_name || '-'}</td>
//             <td>
//                 <span class="status-badge status-${course.status}" 
//                       style="background:${course.statusColor};color:white;">
//                     ${course.status.toUpperCase()}
//                 </span>
//             </td>
//             <td>
//                 <div class="time-details">
//                     <div><i class="fas fa-calendar"></i> ${niceDate(course.date)}</div>
//                     <div><i class="fas fa-clock"></i> ${niceTime(course.start)} - ${niceTime(course.end)}</div>
//                 </div>
//             </td>
//             <td>
//                 <span class="time-remaining ${course.status === 'active' ? 'pulse' : ''}"
//                       style="${course.status === 'active' ? 'color:#2ecc71;font-weight:bold;' : ''}">
//                     ${course.timeRemaining}
//                     ${course.status === 'active' ? ' ⏳' : ''}
//                 </span>
//             </td>
//         </tr>
//     `).join('');
    
//     // Update total count
//     document.getElementById('course-count').textContent = courses.length;
    
//     // Update stats
//     const active = courses.filter(c => c.status === 'active').length;
//     const upcoming = courses.filter(c => c.status === 'upcoming').length;
//     const expired = courses.filter(c => c.status === 'expired').length;
    
//     document.getElementById('active-count').textContent = active;
//     document.getElementById('upcoming-count').textContent = upcoming;
//     document.getElementById('expired-count').textContent = expired;
// }

// 
// // UPDATE STATUS BADGES ON DASHBOARD
// 
function updateStatusBadges(courses) {
    const active = courses.filter(c => c.status === 'active').length;
    const upcoming = courses.filter(c => c.status === 'upcoming').length;
    const expired = courses.filter(c => c.status === 'expired').length;
    
    document.getElementById('active-count').textContent = active;
    document.getElementById('upcoming-count').textContent = upcoming;
    document.getElementById('expired-count').textContent = expired;
}


// AUTO-REFRESH TIMETABLE (every 60 seconds)

function startTimetableAutoRefresh(department, org_code) {
    // Refresh every 60 seconds to update time remaining
    setInterval(() => {
        fetchCourseTimetables(department, org_code);
    }, 60000); // 60,000 milliseconds = 1 minute
}


// RENDER TIMETABLE IN HTML - WITH START BUTTON


// RENDER TIMETABLE IN HTML - WITH START BUTTON

function renderTimetable(courses) {
    const tbody = document.getElementById('timetable-body');
    
    if (!courses || courses.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="7" style="text-align:center;color:var(--text-m);padding:20px">
                No courses available for your department.
            </td></tr>
        `;
        return;
    }
    
    // Define color palette for course codes
    const palette = ['#3498db','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#1dd1a1'];
    
    tbody.innerHTML = courses.map((course, index) => {
        // Determine if Start button should be enabled
        const isActive = course.status === 'active';
        const isUpcoming = course.status === 'upcoming';
        const isExpired = course.status === 'expired';
        
        // Create Start button only for active courses
        let actionButton = '';
        if (isActive) {
            // Get the correct field names from your API
            const subjectName = course.subject || course.course_name || 'N/A';
            const subjectCode = course.subjectCode;
            const department = course.department;
            const departCode = course.DepartmentCode;
            const courseDate = course.date || '';
            const startTime = course.start || course.start_time || '';
            const endTime = course.end || course.end_time || '';
            
            actionButton = `
                <button class="btn-start-course" 
                        onclick="startCourseExam('${subjectName}', '${courseDate}', '${startTime}', '${endTime}', '${subjectCode}','${department}','${departCode}')">
                    <i class="fas fa-play"></i> Start
                </button>
            `;
        } else if (isUpcoming) {
            actionButton = `
                <button class="btn-start-course disabled" disabled>
                    <i class="fas fa-clock"></i> Waiting
                </button>
            `;
        } else {
            actionButton = `
                <button class="btn-start-course completed" disabled>
                    <i class="fas fa-check"></i> Passed
                </button>
            `;
        }
        
        // Get the correct field names
        const courseCode = course.subjectCode ||  'N/A';
        const courseTitle = course.course_title || course.subject || '-';
        const courseName = course.course_name || course.subject || '-';
        
        return `
            <tr class="course-row status-${course.status}">
                <td>
                    <span class="course-dot" style="background:${palette[index % palette.length]}"></span>
                    ${index + 1}
                </td>
                <td>
                    <strong>${courseCode}</strong>
                    <div class="course-title-small">${courseTitle}</div>
                </td>
                <td>${courseName}</td>
                <td>
                    <span class="status-badge status-${course.status}" 
                          style="background:${course.statusColor};color:white;">
                        ${course.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="time-details">
                        <div><i class="fas fa-calendar"></i> ${niceDate(course.date)}</div>
                        <div><i class="fas fa-clock"></i> ${niceTime(course.start)} - ${niceTime(course.end)}</div>
                    </div>
                </td>
                <td>
                    <span class="time-remaining ${course.status === 'active' ? 'pulse' : ''}"
                          style="${course.status === 'active' ? 'color:#2ecc71;font-weight:bold;' : ''}">
                        ${course.timeRemaining}
                        ${course.status === 'active' ? ' ⏳' : ''}
                    </span>
                </td>
                <td>
                    ${actionButton}
                </td>
            </tr>
        `;
    }).join('');
    
    // Update total count
    document.getElementById('course-count').textContent = courses.length;
    
    // Update stats
    const active = courses.filter(c => c.status === 'active').length;
    const upcoming = courses.filter(c => c.status === 'upcoming').length;
    const expired = courses.filter(c => c.status === 'expired').length;
    
    document.getElementById('active-count').textContent = active;
    document.getElementById('upcoming-count').textContent = upcoming;
    document.getElementById('expired-count').textContent = expired;
    
    // Disable the main start button if there are active courses
    // (User should use course-specific buttons)
    const mainStartBtn = document.getElementById('start-btn');
    if (active > 0) {
        mainStartBtn.disabled = true;
        document.getElementById('start-btn-text').textContent = 'Use Timetable to Start';
    } else {
        // If no active courses, re-enable the main button if there are upcoming courses
        if (upcoming > 0) {
            mainStartBtn.disabled = true;
            document.getElementById('start-btn-text').textContent = 'No Active Courses';
        }
    }
}
// function renderTimetable(courses) {
//     const tbody = document.getElementById('timetable-body');
    
//     if (!courses || courses.length === 0) {
//         tbody.innerHTML = `
//             <tr><td colspan="7" style="text-align:center;color:var(--text-m);padding:20px">
//                 No courses available for your department.
//             </td></tr>
//         `;
//         return;
//     }
    
//     // Define color palette for course codes
//     const palette = ['#3498db','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#1dd1a1'];
    
//     tbody.innerHTML = courses.map((course, index) => {
//         // Determine if Start button should be enabled
//         const isActive = course.status === 'active';
//         const isUpcoming = course.status === 'upcoming';
//         const isExpired = course.status === 'expired';
        
//         // Create Start button only for active courses
//         let actionButton = '';
//         if (isActive) {
//             actionButton = `
//                 <button class="btn-start-course" onclick="startCourseExam('${course.subject}', '${course.date}', '${course.start}', '${course.end}')">
//                     <i class="fas fa-play"></i> Start
//                 </button>
//             `;
//         } else if (isUpcoming) {
//             actionButton = `
//                 <button class="btn-start-course disabled" disabled>
//                     <i class="fas fa-clock"></i> Waiting
//                 </button>
//             `;
//         } else {
//             actionButton = `
//                 <button class="btn-start-course completed" disabled>
//                     <i class="fas fa-check"></i> Done
//                 </button>
//             `;
//         }
        
//         return `
//             <tr class="course-row status-${course.status}">
//                 <td>
//                     <span class="course-dot" style="background:${palette[index % palette.length]}"></span>
//                     ${index + 1}
//                 </td>
//                 <td>
//                     <strong>${course.subject || course.course_code || 'N/A'}</strong>
//                     <div class="course-title-small">${course.course_title || course.subject || ''}</div>
//                 </td>
//                 <td>${course.subject || course.course_name || '-'}</td>
//                 <td>
//                     <span class="status-badge status-${course.status}" 
//                           style="background:${course.statusColor};color:white;">
//                         ${course.status.toUpperCase()}
//                     </span>
//                 </td>
//                 <td>
//                     <div class="time-details">
//                         <div><i class="fas fa-calendar"></i> ${niceDate(course.date)}</div>
//                         <div><i class="fas fa-clock"></i> ${niceTime(course.start)} - ${niceTime(course.end)}</div>
//                     </div>
//                 </td>
//                 <td>
//                     <span class="time-remaining ${course.status === 'active' ? 'pulse' : ''}"
//                           style="${course.status === 'active' ? 'color:#2ecc71;font-weight:bold;' : ''}">
//                         ${course.timeRemaining}
//                         ${course.status === 'active' ? ' ⏳' : ''}
//                     </span>
//                 </td>
//                 <td>
//                     ${actionButton}
//                 </td>
//             </tr>
//         `;
//     }).join('');
    
//     // Update total count
//     document.getElementById('course-count').textContent = courses.length;
    
//     // Update stats
//     const active = courses.filter(c => c.status === 'active').length;
//     const upcoming = courses.filter(c => c.status === 'upcoming').length;
//     const expired = courses.filter(c => c.status === 'expired').length;
    
//     document.getElementById('active-count').textContent = active;
//     document.getElementById('upcoming-count').textContent = upcoming;
//     document.getElementById('expired-count').textContent = expired;
    
//     // Disable the main start button if there are active courses
//     // (User should use course-specific buttons)
//     const mainStartBtn = document.getElementById('start-btn');
//     if (active > 0) {
//         mainStartBtn.disabled = true;
//         document.getElementById('start-btn-text').textContent = 'Start from Timetable';
//     }
// }


// START EXAM FOR A SPECIFIC COURSE

// async function startCourseExam(subject, date, startTime, endTime) {
//     const btn = event?.target?.closest?.('.btn-start-course') || document.querySelector('.btn-start-course');
//     document.querySelector('.timetable-section').style.display = 'none';
//     if (btn) {
//         btn.disabled = true;
//         btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
//     }
    
//     try {
//         const department = userData?.department || document.getElementById('sb-course').textContent.trim();
//         const regNum = document.getElementById('sidebar-reg').textContent.trim();
//         const fullname = document.getElementById("sidebar-name").textContent.trim();
        
//         // Get exam details for this specific subject
//         const examData = {
//             fullname: fullname,
//             department: department,
//             regNum: regNum,
//             organization_code: org_code,
//             subject: subject // Add subject filter
//         };
        
//         const res = await fetch('/cbt/ansofra/api/getExamdetails', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(examData),
//         });
//         const result = await res.json();
        
//         if (result.status !== 'success' || !result.response?.[0]) {
//             alert('No exam data found for this course.');
//             if (btn) {
//                 btn.disabled = false;
//                 btn.innerHTML = '<i class="fas fa-play"></i> Start';
//             }
//             return;
//         }
        
//         // Check if exam is already attempted
//         if (result.status === 'fail') {
//             alert('You have already attempted or are currently sitting for this exam.');
//             if (btn) {
//                 btn.disabled = false;
//                 btn.innerHTML = '<i class="fas fa-play"></i> Start';
//             }
//             return;
//         }
        
//         const exam = result.response[0];
        
//         // Check if exam is active
//         const startDT = buildDatetime(exam.date, exam.start);
//         const endDT = buildDatetime(exam.date, exam.end);
//         const now = new Date();
//         const ch = now.toLocaleTimeString();
        
//         if (now < startDT) {
//             alert('This exam has not started yet. Please wait until the scheduled time.');
//             if (btn) {
//                 btn.disabled = false;
//                 btn.innerHTML = '<i class="fas fa-play"></i> Start';
//             }
//             return;
//         }
        
//         if (ch >= exam.end) {
//             alert('This exam has already ended.');
//             if (btn) {
//                 btn.disabled = false;
//                 btn.innerHTML = '<i class="fas fa-play"></i> Start';
//             }
//             return;
//         }
        
//         // Launch the exam for this specific subject
//         const durationMins = parseInt(exam.duration) || 120;
//         const windowMs = endDT - now;
//         const durationMs = durationMins * 60_000;
        
//         examState.timerSeconds = Math.floor(Math.min(durationMs, windowMs) / 1_000);
//         examState.currentSubject = 0;
//         examState.currentQuestion = 0;
//         examState.started = true;
//         examState.questions = [];
//         examState.answers = [];
//         examState.flagged = [];
//         examState.answerDetails = [];
        
//         // Hide welcome screen, show exam screen
//         document.getElementById('welcome-screen').style.display = 'none';
//         document.getElementById('exam-screen').style.display = 'flex';
//         document.getElementById('timer-wrap').style.display = 'block';
//         document.getElementById('top-session-label').textContent = 'Exam In Progress';
//         document.getElementById('subjects-side').style.display = 'none';
//         document.getElementById('instructions-side').style.display = 'none';
//         document.getElementById('progress-side').style.display = 'block';
//         document.getElementById('q-panel').style.display = 'block';
        
//         // Build subject tabs - only for this subject
//         await buildSubjectTabs(department, subject);
//         startTimer();
        
//     } catch (error) {
//         console.error('Error starting course exam:', error);
//         alert('An error occurred while starting the exam. Please try again.');
//         if (btn) {
//             btn.disabled = false;
//             btn.innerHTML = '<i class="fas fa-play"></i> Start';
//         }
//     }
// }


// START EXAM FOR A SPECIFIC COURSE - FIXED

async function startCourseExam(subject, date, startTime, endTime, subCode, depart, depCode) {
  const regNum = document.getElementById("sidebar-reg").textContent.trim();
  const org_code = document.getElementById('sidebar-org-code').textContent.trim();
  //checking whether exam had been done beofre 
  const e = {
    department:depart,
    subject:subject,
    // subjectCode:subCode,
    // DepartmentCode:depCode,
    regNum:regNum,
    organization_code:org_code
  }
  const api = await fetch("/cbt/ansofra/api/verify/user/examination", {
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify(e)
  });

  const result = await api.json();
  const response = result.response;
  // console.log(result);
  if(result.status == "success"){
    console.log(result);
    const btn = event?.target?.closest?.('.btn-start-course') || document.querySelector('.btn-start-course');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
    }

    try {
        const department = userData?.department || document.getElementById('sb-course').textContent.trim();
        const regNum = document.getElementById('sidebar-reg').textContent.trim();
        const fullname = document.getElementById("sidebar-name").textContent.trim();
        
        // Get exam details for this specific subject
        const examData = {
            fullname: fullname,
            department: department,
            regNum: regNum,
            organization_code: org_code,
            subject: subject,
            department:department
        };
        
        const res = await fetch('/cbt/ansofra/api/getExamdetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData),
        });
        const result = await res.json();
        console.log(result);
        if (result.status === 'failed' || !result.response?.[0]) {
            alert('No exam data found for this course.');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-play"></i> Start';
            }
            return;
        }
        
        // Check if exam is already attempted
        if (result.status === 'fail') {
            alert('You have already attempted or completed the exam.');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-play"></i> Start';
            }
            return;
        }
        
        const exam = result.response[0];
        
        // ✅ FIX: Use buildDatetime for proper date/time comparison
        const startDT = buildDatetime(exam.date, exam.start);
        const endDT = buildDatetime(exam.date, exam.end);
        const now = new Date();
        
        // ✅ FIX: Use proper Date objects for comparison
        if (now < startDT) {
            alert('This exam has not started yet. Please wait until the scheduled time.');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-play"></i> Start';
            }
            return;
        }
        
        if (now >= endDT) {
            alert('This exam has already ended.');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-play"></i> Start';
            }
            return;
        }
        
        // ✅ FIX: Calculate duration from the timetable
        // Option 1: Use the duration from the exam data
        let durationMins = parseInt(exam.duration) || 120;
        
        // Option 2: Calculate duration from start and end times
        const durationFromTimetable = Math.floor((endDT - startDT) / 60000);
        if (durationFromTimetable > 0) {
            durationMins = durationFromTimetable;
        }
        
        // Calculate remaining time
        const windowMs = endDT - now;
        const durationMs = durationMins * 60_000;
        
        // Timer should be the MINIMUM of the duration and remaining time
        examState.timerSeconds = Math.floor(Math.min(durationMs, windowMs) / 1_000);
        
        // ✅ FIX: Ensure timer doesn't go negative
        if (examState.timerSeconds < 0) {
            examState.timerSeconds = 0;
        }
        
        // Log for debugging
        console.log('📊 Exam Duration:', durationMins, 'minutes');
        console.log('⏱️ Timer Seconds:', examState.timerSeconds);
        console.log('🕐 Start:', startDT.toLocaleString());
        console.log('🕐 End:', endDT.toLocaleString());
        console.log('🕐 Now:', now.toLocaleString());
        
        // Reset exam state
        examState.currentSubject = 0;
        examState.currentQuestion = 0;
        examState.started = true;
        examState.questions = [];
        examState.answers = [];
        examState.flagged = [];
        examState.answerDetails = [];
        
        // ✅ FIX: Hide timetable section when exam starts
        const timetableSection = document.querySelector('.timetable-section');
        if (timetableSection) {
            timetableSection.style.display = 'none';
        }
        
        // Hide welcome screen, show exam screen
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('exam-screen').style.display = 'flex';
        document.getElementById('timer-wrap').style.display = 'block';
        document.getElementById('top-session-label').textContent = 'Exam In Progress';
        document.getElementById('subjects-side').style.display = 'none';
        document.getElementById('instructions-side').style.display = 'none';
        document.getElementById('progress-side').style.display = 'block';
        document.getElementById('q-panel').style.display = 'block';
        
        // Build subject tabs - only for this subject
        await buildSubjectTabs(department, subject);
        startTimer();
        
    } catch (error) {
        console.error('Error starting course exam:', error);
        alert('An error occurred while starting the exam. Please try again.');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-play"></i> Start';
        }
    }
    // alert("Exam has been done");
  }else{
    alert(response);
  }
    
}