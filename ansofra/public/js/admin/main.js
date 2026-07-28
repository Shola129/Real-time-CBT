
  let totalStudents = 0;
  let ResultsCompleted = 0;
  let _currentStudentReg = null;
const getID = localStorage.getItem('cbt-admin-ID');
const getEmail = localStorage.getItem('cbt-admin-email');
const getAuthCode = localStorage.getItem('cbt-admin-auth-code');
if(!getID && !getEmail && !getAuthCode){
  //  window.location.href="/cbt/ansofra/";
}
async function getDetail(){
  const email =  getEmail.trim()|| 'sholadanielek@gmail.com';
  const ID = getID.trim() || 'ADMIN/00CBT/104131';
  const e = {email:email, ID:ID};
  // console.log(e);
  const api = await fetch('/cbt/ansofra/apiadmin/Details', {
      method:'POST',
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
  });
  const result = await api.json();
  // console.log(result);
  const response = result.response[0];
  if(result.status==="success"){
    // console.log(result);
    document.getElementById("profile-id").textContent=response.ID;
    document.getElementById("profile-email").textContent=response.email;
    document.getElementById("profile-name").textContent=response.fullname;
    document.getElementById("organization-name").textContent=response.organization_name;
    document.getElementById("organization-code").textContent=response.organization_code;
    await getTotalStudent();
    await getTotalSubject();
    // await getOutStanding();
    await  totalDepartment();
    await totalActive();
    await totalInActive();
  }
  else{
    document.location.href="/cbt/ansofra/";
  }
}

async function totalDepartment(){
  const org_code = document.getElementById("organization-code").textContent;
  const e = {role:'set', organization_code:org_code};
  const api = await fetch("/cbt/ansofra/apiadmin/total/department", {
      method:'POST',
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
  });
  const result = await api.json();
  const response = result.response;
  // console.log(result);
  if(result.status==="success"){
    document.getElementById('deptHODCount').textContent=response || '00';
    document.getElementById('deptTotalCount').textContent=response || '00'; 
    if(response=="0" || response=="1"){  
        document.getElementById('stat-depts').textContent= response;
        document.getElementById('total-dep').textContent="Department";
    }else{
        document.getElementById('stat-depts').textContent= response;
        document.getElementById('total-dep').textContent="Departments";
    }
}else{
    document.getElementById('stat-depts').textContent="0";
    document.getElementById('total-dep').textContent="Department";
  }
}

async function getTotalStudent(){
  const org_code = document.getElementById("organization-code").textContent;
  const e ={role:'user', organization_code:org_code};
  // console.log(e);
  const api = await fetch('/cbt/ansofra/apiadmin/TotalStudents', {
      method:'POST', 
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
  });
  const result = await api.json();
  const response = result.response;
  //  console.log(response);
  if(result.status === "success"){
    if(response=="0" || response=="1"){
      document.getElementById("stat-students").textContent=response;
      document.getElementById("total-stu").textContent="Student";
      document.getElementById("resultsStatTotalStudents").textContent=response;
      totalStudents=parseFloat(response);
      resultsStatCompleted(response);
    }
    else{
      document.getElementById("stat-students").textContent=response;
      document.getElementById("total-stu").textContent="Students";
      document.getElementById("resultsStatTotalStudents").textContent=response;
      totalStudents=0;
      resultsStatCompleted(response);
    }
  } else {
    document.getElementById("stat-students").textContent= "00";
    document.getElementById("total-stu").textContent="Student";
    document.getElementById("resultsStatTotalStudents").textContent="0";
  }
}

async function getTotalSubject(){
  const org_code = document.getElementById("organization-code").textContent;
  const e = {role:'set', organization_code:org_code};
  const api = await fetch('/cbt/ansofra/apiadmin/TotalSubjects', {
      method:'POST', 
      body:JSON.stringify(e)
  });
  const result = await api.json();
    // console.log(result);
  const response = result.response;
  if(result.status==="success"){
    // document.getElementById("stat-subjects").textContent=response;
    if(response=="0" || response=="1"){
      document.getElementById("stat-subjects").textContent=response;
      document.getElementById("total-sub").textContent="Subject";
    }
    else{
      document.getElementById("stat-subjects").textContent=response;
      document.getElementById("total-sub").textContent="Subjects";
    }
  } else {
    document.getElementById("stat-subjects").textContent="00:";
  }
}

async function getLastLogin(){
  const e = {email:getEmail, ID:getID};
  const api = await fetch("/cbt/ansofra/apiadmin/Get/LastLogin", {
      method:"POST", 
      body:JSON.stringify(e)
  });
  const result = await api.json();
  const response = result.response;
  if(result.status==="success"){
    document.getElementById('last-seen-display').textContent=response.last_seen || '00:00';
    document.getElementById('last-login').textContent=response.last_login || '00:00';
  }
   else{
    // window.location.href="/cbt/ansofra/ilease";
  }
}

function setTimeLogin(){
  setTimeout(setLastLogin(), 2000);
}

async function setLastLogin(){
  const time = new Date().toLocaleTimeString();
  const e = {email:getEmail, ID:getID, lastLogin:time};
  const api = await fetch("/cbt/ansofra/apiadmin/Set/LastLogin", {
      method:"POST",
       body:JSON.stringify(e)
  });
  const result = await api.json();
  // console.log(result);
}

async function setLastSeen(){
  const time = new Date().toLocaleTimeString();
  const e = {email:getEmail, ID:getID, lastSeen:time};
  const api = await fetch("/cbt/ansofra/apiadmin/Set/LastSeen", {
      method:"POST",
      body:JSON.stringify(e)
  });
  const result = await api.json();
}

function renderDSB() {
  const gridEl = document.getElementById('dsbDeptGrid');
  const badgeEl = document.getElementById('dsbTotalBadge');
}

window.closeDsbDrawer = function() {
  document.getElementById('dsbDrawerBackdrop').classList.remove('open');
  document.body.style.overflow = '';
};

window.closeEditModal1 = function() {
  document.getElementById('editModal3').classList.remove('open');
  document.body.style.overflow = '';
  editingIndex = -1;
};

window.closeEditModal = function() {
  document.getElementById('editModal2').classList.remove('open');
  document.body.style.overflow = '';
  editingIndex = -1;
};

window.closeEditQuestionModal = function(){
  document.getElementById("editQuestionModal").classList.remove('open');
  document.body.style.overflow ='';
  editingIndex = -1;
} 

window.closeEditDepartmentModal = function(){
  document.getElementById('editDepartmentModal').classList.remove('open');
  document.body.style.overflow = '';
  editingIndex = -1;
}

// function renderSubjectsByName(searchName) {
//   const container = document.getElementById('subjectNameSearchResults');
//   if (!container) return;
//   if (!searchName.trim()) {
//     container.innerHTML = '<div class="notice"><i class="fas fa-info-circle"></i> Enter a subject name above to search.</div>';
//     return;
//   }
//   const filtered = subjectsList.filter(s => s.name.toLowerCase().includes(searchName.toLowerCase()));
//   if (!filtered.length) { container.innerHTML = '<div class="notice"><i class="fas fa-search"></i> No subjects match that name.</div>'; return; }
//   container.innerHTML = filtered.map(sub => {
//     const meta = DEPT_META[sub.dept]||{};
//     return `<div class="subject-card">
//                 <div class="subject-card-top">
//                   <span class="badge badge-dept">
//                     <i class="${meta.icon||'fas fa-building'}"></i> 
//                     ${sub.dept}
//                   </span>
//                   <span class="badge badge-duration">
//                     <i class="far fa-clock"></i> ${sub.duration} min
//                   </span></div><div class="subject-card-name">${sub.name}
//                 </div>
//               </div>`;
//   }).join('');
// }

async function seacrhSubj(searchName){
  const container = document.getElementById('subjectNameSearchResults');
  const org_code = document.getElementById("organization-code").textContent.trim();
  if (!searchName.trim()) {
    container.innerHTML = '<div class="notice"><i class="fas fa-info-circle"></i> Enter a subject name above to search.</div>';
    return;
  }
  const api = await fetch("/cbt/ansofra/apiadmin/search/subject", {
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify({subject:searchName.trim(), organization_code:org_code})
  });

  const result = await api.json();
  const response = result.response;
  if(result.status=="success"){
    let output = '';
    for(let index = 0; index < response.length; index++){
        output += `<div class="subject-card">
                <div class="subject-card-top">
                  <span class="badge badge-dept">
                    ${response[index].department}
                  </span>
                  <span class="badge badge-duration">
                    <i class="far fa-clock"></i> ${response[index].subject} min
                  </span></div><div class="subject-card-name">${response[index].subjectCode}
                </div>
              </div>`;
    }
    container.innerHTML=output;
  }else{
    container.innerHTML = '<div class="notice"><i class="fas fa-search"></i> No subjects match that name.</div>'; return; 
  }
}

function renderSubjects(filter) {
  const container = document.getElementById('subjectCardsContainer');
  const noMsg = document.getElementById('noSubjectsMsg');
  if (!container) return;
  // const filtered = filter.trim() ? subjectsList.filter(s=>s.dept.toLowerCase().includes(filter.toLowerCase())) : subjectsList;
  // if (!filtered.length) { container.innerHTML=''; if(noMsg) noMsg.style.display='block'; return; }
  // if (noMsg) noMsg.style.display='none';
  // container.innerHTML = filtered.map(sub => {
  //   const idx = subjectsList.indexOf(sub);
  //   return `<div class="subject-card"><div class="subject-card-top"><span class="badge badge-dept">${sub.dept}</span><span class="badge badge-duration"><i class="far fa-clock"></i> ${sub.duration} min</span></div><div class="subject-card-name">${sub.name}</div><div class="subject-card-meta"><span><i class="fas fa-circle-question"></i> ${sub.totalQs||0} Questions</span><span><i class="fas fa-calendar"></i> ${sub.created?sub.created.toLocaleDateString():'—'}</span></div><div class="subject-card-actions"><button class="btn btn-sm" onclick="openEditModal(${idx})"><i class="fas fa-pen"></i> Edit</button><button class="btn btn-sm btn-danger" onclick="deleteSubject(${idx})"><i class="fas fa-trash"></i></button></div></div>`;
  // }).join('');
}

window.deleteSubject = function(i) {
  if (confirm('Remove subject: '+subjectsList[i].name+'?')) {
    subjectsList.splice(i,1);
    renderDSB();
    renderSubjects(document.getElementById('deptSearchInput')?.value||'');
    renderSubjectsByName(document.getElementById('subjectNameSearchInput')?.value||'');
  }
};

function populateSchDeptDropdown(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">— Select Department —</option>';
}

function openScheduleModal() {
  populateSchDeptDropdown('schDept');
  openGenericModal('scheduleModal');
}

 function saveScheduledExam() {
  event.preventDefault();
    const depart = document.getElementById('schedule-department').value;
    const departCode =  document.getElementById('schedule-department-code').value.trim();
    const date =  document.getElementById('schedule-date').value.trim();
    const startTime =  document.getElementById('schedule-time-start').value.trim();
    const endtime =  document.getElementById('schedule-time-end').value.trim();
    const dura =  document.getElementById('schedule-duration').value.trim();
    // const session = document.getElementById('session').value.trim();
    const subject = document.getElementById("schedule-subject").value.trim();
    const subjectCode = document.getElementById("schedule-subject-code").value.trim();
    if(!depart || !departCode || !date || !startTime || !endtime || !dura || !subjectCode || !subject){
        alert("All field require");
    }else{
      processScheduledData();
    }
}


async function processScheduledData(){
    const data =  document.getElementById("formdata");
    const org_code = document.getElementById("organization-code").textContent.trim();
    const form = new FormData(data);
    form.append("organization_code", org_code);
    const obj = {};
    form.forEach((val, key)=>{
      obj[key]=val;
    })
    // console.log(obj);
    const api = await fetch("/cbt/ansofra/apiadmin/schedule/exam/time", {
        method:"POST",
        body:form
    });
    const result = await api.json();
    // console.log(result);
    if(result.status=="success"){
      alert(result.response);
        displayScheduledTime();
        document.getElementById('schedule-department').value="";
        document.getElementById('schedule-department-code').value="";
        document.getElementById('schedule-date').value="";
        document.getElementById('schedule-time-start').value="";
        document.getElementById('schedule-time-end').value="";
        document.getElementById('schedule-duration').value="";
        // document.getElementById('session').value="";
        document.getElementById('schedule-subject').value="";
        document.getElementById('schedule-subject-code').value="";
        await closeGenericModal('scheduleModal');
        // await displayScheduledTime();
        await totalexamSche();
    }
    else{
      alert(result.response);
    }
}

async function displayScheduledTime(){
  const org_code = document.getElementById("organization-code").textContent;
   const e = {role:'set', organization_code:org_code};
   const api = await fetch("/cbt/ansofra/apiadmin/list/time/sets", {
      method:"POST",
      headers:{'Content-type':'application/json'},
      body:JSON.stringify(e)
   });
   const result = await api.json();
   if(result.status==="success"){
    const response = result.response;
      let output = '';
      for (let index = 0; index < response.length; index++) {
          output +=`
              <tr>
                <td style="font-weight:600;">${index+1}</td>
                <td style="font-weight:700;">${response[index].department}</td>
                <td><span class="badge badge-dept">${response[index].DepartmentCode}</span></td>
                <td>${response[index].subject}</td>
                <td>${response[index].subjectCode}</td>
                <td style="font-size:11px;">${response[index].timeID}</td>
                <td>${response[index].date}</td>
                <td>${response[index].start}</td>
                <td>${response[index].end}</td>
                <td>${response[index].duration}</td>
                <td style="display:flex;gap:6px;">
                  <button class="btn btn-sm btn-info" onclick="openEditScheduleModal('${response[index].timeID}', '${response[index].department}', '${response[index].DepartmentCode}', '${response[index].start}', '${response[index].end}', '${response[index].duration}', '${response[index].session}', '${response[index].organization_code}', '${response[index].date}', '${response[index].status}', '${response[index].exam_time_table_id}', '${response[index].subject}', '${response[index].subjectCode}')">
                    <i class="fas fa-pen"></i>
                    </button>
                </td>
                <td>
                  <button class="btn btn-sm btn-danger" onclick="sendTimeOut('${response[index].department}', '${response[index].DepartmentCode}','${response[index].start}', '${response[index].end}', '${response[index].duration}', '${response[index].date}', '${response[index].session}')">
                   Send Out
                  </button>  
                </td>
                <td>${response[index].status}</td>
                <td>
                <button onclick="DelSch(
                '${response[index].exam_time_table_id}',
                )">Del<button/>
                <td/>
              </tr>
          `;  
      }
      document.getElementById('scheduleTableBody').innerHTML=output;
      document.getElementById('noScheduleMsg').style.display="none";
   }
   else{
       document.getElementById('scheduleTableBody').style.display="none";
       document.getElementById('noScheduleMsg').style.display="block";
   }
}

async function totalexamSche(){
  const org_code = document.getElementById("organization-code").textContent.trim();
   const e = {role:'user', organization_code:org_code};
   const api = await fetch('/cbt/ansofra/apiadmin/count/shedule', {
    method:'POST',
    headers:{'Content-type':'application/json'},
    body:JSON.stringify(e)
   });
   const result = await api.json();
  //  console.log(result);
   document.getElementById("schStatTotal").textContent=result.response;
}

async function seacrhDepSch(){
    const org_code = document.getElementById("organization-code").textContent;
    const department = document.getElementById("schSearchInput").value.trim();
    if(!department){
        alert("department feld must not left empty");
    }
    else{
      const e = {department:department, organization_code:org_code};
      const api = await fetch('/cbt/ansofra/apiadmin/Search/Dep/Sch', {
          method:"POST",
          headers:{"Content-type":'application/json'},
          body:JSON.stringify(e)
      });
    const result = await api.json();
    console.log(result);
    if(result.status==="success"){
    const response = result.response;
      let output = '';
      for (let index = 0; index < response.length; index++) {
          output +=`
              <tr>
                <td style="font-weight:600;">${index+1}</td>
                <td style="font-weight:700;">${response[index].department}</td>
                <td><span class="badge badge-dept">${response[index].DepartmentCode}</span></td>
                <td style="font-size:11px;">${response[index].timeID}</td>
                <td>${response[index].subject}</td>
                <td>${response[index].subjectCode}</td>
                <td>${response[index].date}</td>
                <td>${response[index].start}</td>
                <td>${response[index].end}</td>
                <td>${response[index].duration}</td>
                <td style="display:flex;gap:6px;">
                  <button class="btn btn-sm btn-info" onclick="openEditScheduleModal('${response[index].timeID}', '${response[index].department}', '${response[index].DepartmentCode}', '${response[index].start}', '${response[index].end}', '${response[index].duration}', '${response[index].session}', '${response[index].organization_code}', '${response[index].date}', '${response[index].status}''${response[index].exam_time_table_id}', '${response[index].subject}', '${response[index].subjectCode}')">
                    <i class="fas fa-pen"></i>
                    </button>
                </td>
                <td>
                  <button class="btn btn-sm btn-danger" onclick="sendTimeOut('${response[index].department}', '${response[index].DepartmentCode}','${response[index].start}', '${response[index].end}', '${response[index].duration}', '${response[index].date}', '${response[index].session}', '${response[index].status}', '${response[index].timeID}')">
                    <i class="fas fa-trash"></i>
                  </button>  
                </td>
                <td>${response[index].status}</td>
                <td>
                <button onclick="DelSch(
                '${response[index].exam_time_table_id}',
                )">Del<button/>
                <td/>
              </tr>
          `;  
      }
      document.getElementById('scheduleTableBody').innerHTML=output;
      document.getElementById('noScheduleMsg').style.display="none";
   }
   else{
       document.getElementById('scheduleTableBody').style.display="none";
       document.getElementById('noScheduleMsg').style.display="block";
   }
    }
  }

  async function DelSch(id){
    const e = {id:id};
    // console.log(e);
    const api = await fetch("/cbt/ansofra/apiadmin/del/schedule/exam", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
    });

    const result = await api.json();
    // console.log(result);
    if(result.status === "success"){
      alert("Exam TimeTable Delete successful");
      await displayScheduledTime();
    }else{
      alert("something went wrong");
    }
  }

  async function saveSubject2(){
    const dept = document.getElementById("add-dept").value.trim();
    const deptCode = document.getElementById("add-deptCode").value.trim();
    const subject = document.getElementById("add-subject").value.trim();
    const subCode = document.getElementById("add-subject-code").value.trim();
    const org_code = document.getElementById("organization-code").textContent.trim();
    const question = document.getElementById("add-subject-TotalQuestions").value.trim();
    const score_per_question = document.getElementById("add-subject-ScorePerQuestion").value.trim();
    const desc = "";
    const HeadOfDepartment = "";
    const ID = "";
    if(!dept || !deptCode || !subject || !subCode){
      alert("All field required");
      return;
    }else{
       const e = {
            department:dept,
            DepartmentCode:deptCode,
            subject:subject,
            subjectCode:subCode,
            date_created: new Date().toLocaleTimeString() +" " + new Date().toLocaleDateString(),
            organization_code:org_code,
            totalQuestions:question,
            scorePerQuestion:score_per_question
          }
        const api = await fetch("/cbt/ansofra/apiadmin/save/subject",{
              method:"POST",
              headers:{"Content-type":"application/json"},
              body:JSON.stringify(e)
        });
        const result = await api.json();
        // console.log(result);
        if(result.status==="success"){
          alert("subject created successfully");
            // document.getElementById("newDeptSelect").value="";
            // document.getElementById("depCode").value="";
            document.getElementById("add-subject").value="";
            document.getElementById("add-subject-code").value="";
            openDsbDrawer(dept, deptCode, ID, HeadOfDepartment, desc, org_code);
            closeEditModal();
        }
        else{
          alert(result.response);
        }
    }
  }

  async function ResendUserDetails() {
      const org_code = document.getElementById("organization-code").textContent.trim();
      const api = await fetch("/cbt/ansofra/apiadmin/resend/user/details", {
          method:"POST",
          headers:{"Content-type":"application/json"},
          body:JSON.stringify({organization_code:org_code})
      });

      const result = await api.json();
      if(result.status === "success"){
          alert("All user details have resend successfully");
      }else{
        alert("Error occur");
        console.log(result.response);
      }
  }

  async function EditScheduleExam() {
    event.preventDefault();
    // const data =  document.getElementById("formdata2");
    //  const form = new FormData(data);
     const org_code1 = document.getElementById("organization-code").textContent;
     const status = document.getElementById("edit-schedule-status").textContent;
     const timeID = document.getElementById("timeID").textContent;
     const id = document.getElementById('id-sch').textContent;
    //  form.append("organization_code", org_code,);
    //  form.append("timeID",timeID);
    //  form.append("status", status);
    //  form.append('id-sch',id);
     const department = document.getElementById("edit-schedule-department").value.trim();
     const depCode = document.getElementById("edit-schedule-department-code").value.trim();
     const subject = document.getElementById("edit-schedule-subject").value.trim();
     const subjectCode = document.getElementById("edit-schedule-subject-code").value.trim();
     const date  = document.getElementById("edit-schedule-date").value.trim();
     const start  = document.getElementById("edit-schedule-time-start").value.trim();
     const end = document.getElementById("edit-schedule-time-end").value.trim();
    const dur  = document.getElementById("edit-schedule-duration").value.trim();
    const status1 = document.getElementById("edit-schedule-status-2").value.trim();
    //  const  = document.getElementById("").value.trim();
    if( !department||!depCode||!date||!status1||!dur||!start||!end||!subjectCode||!subject||!depCode){
      alert("All field require");
    }
    const e ={
           department:department, 
          start:start, 
          end:end, 
          date:date, 
          DepartmentCode:depCode, 
          // session:session, 
          duration:dur,
          organization_code:org_code1,
          // organization_name:org_name,
          status:status1,
          timeID:timeID,
          subject:subject,
          subjectCode:subjectCode
    }
    // const obj = {};
    //  form.forEach((key, val)=>{
    //   obj[key]=val;
    //  })
    //  console.log(obj);
    const api = await fetch("/cbt/ansofra/apiadmin/EditSchedule", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
    });
    const result = await api.json();
          //  console.log(result);
    if(result.status==="success"){
      alert("Edit done");
      displayScheduledTime();
      document.getElementById('editScheduleModal').style.display="none";
          department.value = "";
          depCode.value = "";
          subject.value = "";
          subjectCode.value = "";
          date.value = "";
          end.value = "";
          start.value = "";
          dur.value = "";
          status.value = "";
    }
    else{
      alert("Error occur try again later");
    }
  }

  async function sendTimeOut(dep, departCode, start, end, duration, date, session, status, timeID){
    const org_code = document.getElementById("organization-code").textContent;
    const org_name = document.getElementById("organization-name").textContent;
    const e = {
          department:dep, 
          start:start, 
          end:end, 
          date:date, 
          DepartmentCode:departCode, 
          session:session, 
          duration:duration,
          organization_code:org_code,
          organization_name:org_name,
          status:status,
          timeID:timeID
        };
        // console.log(e);
    const api = await fetch("/cbt/ansofra/apiadmin/notify/user/of/Exam", {
        method:"POST",
        headers:{"Content-type":'application/json'},
        body:JSON.stringify(e)
    });
    const result = await api.json();
    // console.log(result);
    if(result.status=="success"){
      alert("Information passed successfully");
      displayScheduledTime();
      totalActive();
      totalInActive();
    }
    else{
      alert(result.response);
    }
  }

function openEditScheduleModal(timeid, department, DepartmentCode, start, end, duration, session, organization_code, date, status, id, subject, subCode){
      document.getElementById("timeID").value=timeid;
      document.getElementById('editScheduleModal').classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('edit-schedule-department').value=department;
      document.getElementById('edit-schedule-department-code').value=DepartmentCode;
      document.getElementById('edit-schedule-date').value=date;
      document.getElementById('edit-schedule-time-start').value=start;
      document.getElementById('edit-schedule-time-end').value=end;
      document.getElementById('edit-schedule-duration').value=duration;
      document.getElementById('edit-schedule-subject').value=subject;
      document.getElementById('edit-schedule-subject-code').value=subCode;
      document.getElementById('timeID').textContent=timeid;
      document.getElementById('edit-schedule-status').textContent=status;
      document.getElementById('id-sch').textContent=id;
      // console.log(subject, subCode);
};

window.closeEditScheduleModal = function() {
  document.getElementById('editScheduleModal').classList.remove('open');
  document.body.style.overflow = '';
  editingScheduleId = null;
};

window.saveEditScheduleExam = function() {
};

function renderScheduleTable(filter) {
}

function openGenericModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeGenericModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('scheduleModal')?.addEventListener('click', function(e){ if(e.target === this) closeGenericModal('scheduleModal'); });
document.getElementById('editScheduleModal')?.addEventListener('click', function(e){ if(e.target === this) closeEditScheduleModal(); });

async function getStudentList() {
  const tbody = document.getElementById('studentTableBody');
  const org_code = document.getElementById('organization-code').textContent;
  const e = {role:'user', organization_code:org_code};
  const api = await fetch('/cbt/ansofra/apiadmin/GET/students', {
      method:"POST", 
      headers:{'Content-type':'application/json'},
      body:JSON.stringify(e)
  });
  const result = await api.json();
  const response = result.response;
  // console.log(result);
  if(result.status==="success"){
      let display = '';
      for(let i=0; i<response.length; i++){
          display+=`<tr>
                      <td>${i + 1}</td>
                      <td style="font-weight:600">${response[i].regNum}</td>
                      <td>${response[i].fullname}</td>
                      <td><span class="badge badge-dept">${response[i].department}</span></td>
                      <td>${response[i].email}</td>
                      <td>${response[i].role}</td>
                      <td><button style="background-color:blue; color:white; border: none; padding: 8px; border-raidus: 5px;" onclick="viewStudentDetails(
                      '${response[i].organization_code}',
                      '${response[i].users_id}',
                      '${response[i].regNum}',
                      '${response[i].fullname}',
                      '${response[i].phone}',
                      '${response[i].date_created}',
                      '${response[i].dob}',
                      '${response[i].gender}',
                      '${response[i].state}',
                      '${response[i].organization_name}',
                      '${response[i].email}',
                      '${response[i].department}',
                      )">View</button></td>
                    </tr>`;
      }
      tbody.innerHTML = display;
  } else {
      document.getElementById("studentCount").textContent="No Active user yet";
      document.getElementById("table-wrap").style.display="none";
  }
}

document.getElementById("searchStudentRegNo").addEventListener("click", async function(){
  const tbody = document.getElementById('studentTableBody');
  const regNo = document.getElementById('regSearch').value.trim();
  const org_code = document.getElementById('organization-code').textContent.trim();
  if(regNo===''){
    alert("you have not entered reg number of the student");
  } else {
    const e = {regNum:regNo, organization_code:org_code};
    const api = await fetch('/cbt/ansofra/apiadmin/search/regNum', {
        method:"POST",
        headers:{'Content-type':'application/json'},
        body:JSON.stringify(e)
    });
    const result = await api.json();
    const response = result.response;
    console.log(result);
    if(result.status==="success"){
        let output ='';
        for(let i=0; i<response.length; i++){
          output+=`<tr>
                    <td>${i + 1}</td>
                    <td style="font-weight:600">${response[i].regNum}</td>
                    <td>${response[i].fullname}</td>
                    <td><span class="badge badge-dept">${response[i].department}</span></td>
                    <td>${response[i].email}</td>
                    <td>${response[i].role}</td>
                    <td><button style="background-color:blue; color:white; border: none; padding: 8px; border-raidus: 5px;" onclick="viewStudentDetails(
                    '${response[i].organization_code}',
                    '${response[i].users_id}',
                    '${response[i].regNum}',
                    '${response[i].fullname}',
                    '${response[i].phone}',
                    '${response[i].date_created}',
                    '${response[i].dob}',
                    '${response[i].gender}',
                    '${response[i].state}',
                    '${response[i].organization_name}',
                    '${response[i].email}',
                    '${response[i].department}',
                    )">View</button></td>
                  </tr>`;
        }
        tbody.innerHTML = output;
        console.log(output);
    } else {
      document.getElementById("studentCount").textContent="Registriation number not found";
      document.getElementById("table-wrap").style.display="none";
      document.getElementById('regSearch').value="";
    }
  }
});

async function seacrhStudentDep(){
// document.getElementById("seacrhStudentDep").addEventListener("change", async ()=>{
  const tbody = document.getElementById('studentTableBody');
  const seletedValue = document.getElementById('deptFilter').value.trim();
  const org_code = document.getElementById('organization-code').textContent.trim();
  if(!seletedValue){
    alert("No department selected");
  } else {
    const e = {
      department:seletedValue,
      organization_code:org_code}
       ;
      //  console.log(e);
    const api = await fetch('/cbt/ansofra/apiadmin/selected/department', {
        method:"POST",
        headers:{'Content-type':'application'}, 
        body:JSON.stringify(e)
    });
    const result = await api.json();
    const response = result.response;
    // console.log(result);
    if(result.status==="success"){
        let output ='';
        for(let i=0; i<response.length; i++){
          output+=`
                  <tr>
                    <td>${i+1}</td>
                    <td style="font-weight:600">${response[i].regNum}</td>
                    <td>${response[i].fullname}</td>
                    <td><span class="badge badge-dept">${response[i].department}</span></td>
                    <td>${response[i].email}</td>
                    <td>${response[i].role}</td>
                    <td><button style="background-color:blue; color:white; border: none; padding: 8px; border-raidus: 5px;" onclick="viewStudentDetails(
                    '${response[i].organization_code}',
                    '${response[i].users_id}',
                    '${response[i].regNum}',
                    '${response[i].fullname}',
                    '${response[i].phone}',
                    '${response[i].date_created}',
                    '${response[i].dob}',
                    '${response[i].gender}',
                    '${response[i].state}',
                    '${response[i].organization_name}',
                    '${response[i].email}',
                    '${response[i].department}',
                    )">View</button></td>
                  </tr>`;
        }
        tbody.innerHTML = output;
        // tbody.style.display="flex";
        document.getElementById("studentCount").style.display="none";
    } else {
      document.getElementById("studentCount").textContent="No record of user found in that department";
      document.getElementById("table-wrap").style.display="none";
      document.getElementById('deptFilter').value="";
    }
  }
};


function viewStudentDetails(
  org_code, 
  id, 
  regNum,
  fullname,
  phone,
  date_created,
  dob,
  gender,
  state,
  org_name,
  email,
  department
){
  // console.log(org_code, 
  // id, 
  // regNum,
  // fullname,
  // phone,
  // date_created,
  // dob,
  // gender,
  // state,
  // org_name,
  // email,
  // department);
  document.getElementById('stdDrawerBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  /* Avatar initials */
  const initials = (fullname || '??').split(' ')
    .map(w => w[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('stdAvatar').textContent = initials;

  /* Header */
  document.getElementById('stdDrawerName').textContent = fullname  || '—';
  document.getElementById('stdDrawerReg').textContent  = regNum    || '—';

  /* Status chips */
  document.getElementById('stdChipRole').textContent = "USER"       || 'Student';
  document.getElementById('stdChipDept').textContent = department || '—';

  /* Personal info */
  document.getElementById('stdInfoFullname').textContent = fullname   || '—';
  document.getElementById('stdInfoEmail').textContent    = email      || '—';
  document.getElementById('stdInfoPhone').textContent    = phone      || '—';
  document.getElementById('stdInfoGender').textContent   = gender     || '—';
  document.getElementById('stdInfoDob').textContent      = dob        || '—';
  document.getElementById('stdInfoState').textContent    = state      || '—';

  /* Academic info */
  document.getElementById('stdInfoRegNum').textContent   = regNum     || '—';
  document.getElementById('stdInfoDept').textContent     = department || '—';
  // document.getElementById('stdInfoYear').textContent     = year       || '—';
  document.getElementById('stdInfoRole').textContent     = "USER"       || '—';

  /* Account info */
  document.getElementById('stdInfoCreated').textContent  = date_created   || '—';
  // document.getElementById('stdInfoLastSeen').textContent = lastSeen  || '—';
}

function closeStudentDrawer() {
  document.getElementById('stdDrawerBackdrop').classList.remove('open');
  document.body.style.overflow = '';
  _currentStudentReg = null;
}




 async function getDepartment(){
  const org_code = document.getElementById("organization-code").textContent.trim();
  const e = {role:'set', organization_code:org_code};
  const api = await fetch('/cbt/ansofra/apiadmin/get/department/set/list',{
      method:"POST",
      headers:{'Content-type':'application/json'},
      body:JSON.stringify(e)
  });
  const result = await api.json();
  // console.log(result);
  if(result.status==="success"){
    const response = result.response;
    let output = '';
    for (let index = 0; index < response.length; index++) {
        output +=`
        <div class="dsb-dept-card" onclick="openDsbDrawer('${response[index].department}', '${response[index].DepartmentCode}', '${response[index].departmentID}', '${response[index].HeadOfDepartment}', '${response[index].Description}', '${org_code}')">
           <div class="dsb-dept-icon"><i class="fas fa-building"></i></div>
           <div><div class="dsb-dept-name">${response[index].department}</div><div class="dsb-dept-code">${response[index].DepartmentCode}</div></div>
           <div class="dsb-dept-footer"><div class="dsb-dept-count"><i class="fas fa-book" style="font-size:10px;"></i>&nbsp;</div><i class="fas fa-chevron-right dsb-dept-arrow"></i></div>
        </div>`;
    }
    document.getElementById("dsbDeptGrid").innerHTML=output;
  }
  else{
      document.getElementById("dsbDeptGrid").textContent="No department set yet";
    }
 }

 async function openDsbDrawer(department, DepartmentCode, departmentID, HeadOfDepartment, Description, org_code){
      const e = {
        department:department,
        DepartmentCode:DepartmentCode,
        organization_code:org_code,
        role:'set',
      };
      const api = await fetch("/cbt/ansofra/apiadmin/get/allSubject/Dep", {
          method:"POST",
          headers:{"Content-type":'application/json'},
          body:JSON.stringify(e)
      });
      document.getElementById("add-dept").value=department;
      document.getElementById("add-deptCode").value=DepartmentCode;
      const result = await api.json();
      // console.log(result);
      if(result.status==="success"){
        const  response = result.response;
        let output = '';
        for (let index = 0; index < response.length; index++) {
          output +=`
            <div class="dsb-drawer-meta">
              <span><i class="fas fa-book"></i> ${index + 1 }</span>
              <div class="dsb-subject-info">
                  <div class="dsb-subject-name">${response[index].subject}&nbsp &nbsp <nav>Code:  <strong>${response[index].subjectCode}</strong></nav></div> <div class="dsb-subject-date">Added ${response[index].Date_Created || '—'}</div>
                  <div>Total Questions: <b>${response[index].totalQuestions}</b></div>
                  <div>Score Per Question: <b> ${response[index].scorePerQuestion}</b></div>
              </div>
                <span><i class="fas fa-user-tie"></i> ${ HeadOfDepartment||'—'}</span>
                <span>Depart Code ${response[index].DepartmentCode}</span>
                 <div class="dsb-subject-badges">
                  <button class="btn btn-sm" style="padding:4px 10px;" onclick="openEditModal('${response[index].subjectID}', '${response[index].subject}', '${response[index].subjectCode}', '${response[index].organization_code}', '${response[index].DepartmentCode}', '${response[index].department}', '${response[index].totalQuestions}', '${response[index].scorePerQuestion}', '${response[index].Date_Created}')"><i class="fas fa-pen"></i></button>
                  <button class="btn btn-sm btn-danger" style="padding:4px 10px;" onclick="deleteSubjectFromDrawer('${response[index].subjectID}', '${response[index].subject}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="dsb-subject-list"> 
               <div class="dsb-subject-row">
            </div>
          </div>`;
          // document.getElementById("add-dept").value=response[index].department;
          // document.getElementById("add-deptCode").value=response[index].DepartmentCode;
          // console.log(response[index].department, response[index].DepartmentCode);
          // document.getElementById("add-departmentID").value=response[index].departmentID;
        }
        document.getElementById('dsbDrawerTitle').innerHTML = ` ${department} <span class="badge badge-dept" style="font-size:10px;">${DepartmentCode}</span>`;
        document.getElementById('dsbDrawerBody').innerHTML = output;
        // document.getElementById("add-dept").value=department;
        // document.getElementById("add-deptCode").value=rDepartmentCode;
      }
      else{
        document.getElementById("dsbDrawerBody").innerHTML=`
            <div class="dsb-empty"><i class="fas fa-folder-open"></i>No subjects yet for this department.<br><small>Use the form below to add one.</small></div>
        `;
         document.getElementById('dsbDrawerTitle').innerHTML = ` ${department} <span class="badge badge-dept" style="font-size:10px;">${DepartmentCode}</span>`;
      }
       document.getElementById('dsbDrawerBackdrop').classList.add('open');
      document.body.style.overflow = 'hidden';
 }

 async function openEditModal(subjectID, subject, subCode, org_code, depCode, depart, question, score_per_question, date_created){
    document.getElementById('subjectID').value=subjectID;
    document.getElementById('editModal3').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById("edit-dept").value=depart;
    document.getElementById("edit-deptCode").value=depCode;
    document.getElementById("edit-subject").value=subject;
    document.getElementById("subjectID").value=subjectID;
    document.getElementById("org-code").value=org_code;
    document.getElementById("edit-subject-code").value=subCode;
    document.getElementById("edit-subject-TotalQuestions").value=question;
    document.getElementById("edit-subject-ScorePerQuestion").value = score_per_question;
    document.getElementById("edit-subject-date-created").value=date_created;
 }

 async function openAddSubject2(){
    document.getElementById('editModal2').classList.add('open');
 }

 async function saveEditSubject(){
    // const data = document.getElementById('');
    // const form = new FormData(data);
    const dept =  document.getElementById("edit-dept").value.trim();
    const deptCode =  document.getElementById("edit-deptCode").value.trim();
    const subject  =  document.getElementById("edit-subject").value.trim();
    const subjectID =  document.getElementById("subjectID").value.trim();
    const org_code =  document.getElementById("org-code").value.trim();
    const  subCode=  document.getElementById("edit-subject-code").value.trim();
    const question =  document.getElementById("edit-subject-TotalQuestions").value.trim();
    const score_per_question =   document.getElementById("edit-subject-ScorePerQuestion").value.trim();
    const date_created = document.getElementById("edit-subject-date-created").value.trim();
    const e = {
      department:dept,
      DepartmentCode:deptCode,
      subject:subject,
      subjectID:subjectID,
      organization_code:org_code,
      subjectCode:subCode,
      totalQuestions:question,
      scorePerQuestion:score_per_question,
      date_created:date_created
    };
    console.log(e);
    if(!dept||!deptCode||!subject||!subjectID||!org_code||!subCode||!question||!score_per_question){
      alert("all field require");
      return;
    }
    const api = await fetch('/cbt/ansofra/apiadmin/edit/subject', {
        method:'POST',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
    })
    const result = await api.json();
    if(result.status==="success"){
       alert("save successfully");
       closeEditModal1();
        document.getElementById("edit-dept").value="";
        document.getElementById("edit-deptCode").value="";
        document.getElementById("edit-subject").value="";
        document.getElementById("subjectID").value="";
        document.getElementById("org-code").value="";
        document.getElementById("edit-subject-code").value="";
        document.getElementById("edit-subject-TotalQuestions").value="";
        document.getElementById("edit-subject-ScorePerQuestion").value = "";
    }
    else{
      alert("unable to edit the subject");
    }
 }

async function deleteSubjectFromDrawer(subjectID, subject, subCode, org_code, depCode, depart){
    const org_code2 = document.getElementById("organization-code").textContent.trim();
    const desc = "";
    const HeadOfDepartment = "";
    const ID = "";
      const e = {
      subjectID: subjectID,
    //   subject:subject,
      organization_code:org_code2
    }
    // console.log(e);
    const api = await fetch('/cbt/ansofra/apiadmin/delete/subject', {
        method:'POST',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify(e)
    })
    const result = await api.json();
    if(result.status==="success"){
       alert("subject remove successfull");
      //  openDsbDrawer(depart, depCode, ID, HeadOfDepartment, desc, org_code);
       closeDsbDrawer();
      //  console.log(result.response);
    }
    else{
      alert("unable to delete the subject");
    }
 }

 document.getElementById("saveSubjectBtn").addEventListener("click", ()=>{
    const dep = document.getElementById("newDeptSelect").value.trim();
    const depCode = document.getElementById("depCode").value.trim();
    const subjectName = document.getElementById("subjectName").value.trim();
    const subjectCode = document.getElementById("subjectCode").value.trim();
    const question = document.getElementById("TotalQuestions").value.trim();
    const scorePerQuestion = document.getElementById("ScorePerQuestion").value.trim();
    if(!dep || !depCode || !subjectName || !question || !scorePerQuestion || !question || !scorePerQuestion){
      alert("All field require");
    }else{
      processSubjectData();
    }
    // event.preventDefault();
    // const data = document.getElementById("saveSubject");
    // const form = new FormData(data);
    // const api = await fetch("/cbt/ansofra/apiadmin/save/subject", {
    //     method:"POST",
    //     body:form
    // });
    // const result = await api.json();
    // if(result.status==="success"){
    //   alert(result.response);
    // }
    // else{
    //   alert(result.response);
    // }
 });

 async function processSubjectData(){
    event.preventDefault();
   const dep = document.getElementById("newDeptSelect").value.trim();
    const depCode = document.getElementById("depCode").value.trim();
    const subjectName = document.getElementById("subjectName").value.trim();
    const subjectCode = document.getElementById("subjectCode").value.trim();
    const org_code = document.getElementById("organization-code").textContent.trim();
    const question = document.getElementById("TotalQuestions").value.trim();
    const score_per_question = document.getElementById("ScorePerQuestion").value.trim();
    const e = {
      department:dep,
      DepartmentCode:depCode,
      subject:subjectName,
      subjectCode:subjectCode,
      date_created: new Date().toLocaleTimeString() +" " + new Date().toLocaleDateString(),
      organization_code:org_code,
      totalQuestions:question,
      scorePerQuestion:score_per_question,
    }
    // console.log(e);
    const api = await fetch("/cbt/ansofra/apiadmin/save/subject", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
    });
    const result = await api.json();
    // console.log(result);
    if(result.status==="success"){
      alert("subject created successfully");
        document.getElementById("newDeptSelect").value="";
        document.getElementById("depCode").value="";
        document.getElementById("subjectName").value="";
        document.getElementById("subjectCode").value="";
        document.getElementById("TotalQuestions").value="";
        document.getElementById("ScorePerQuestion").value="";
    }
    else{
      alert(result.response);
    }
 }


//  document.getElementById("searchQuestionSetsBtn").addEventListener("click", async ()=>{
  async function searchQuestionSetsBtn(){
  const dep = document.getElementById("qsSearchDept").value.trim();
  const subject = document.getElementById("qsSearchSubject").value.trim();
  const org_code = document.getElementById("organization-code").textContent.trim();
  if(dep==="" || subject===""){
    alert("all field required");
  }
  else{
    const e = {
      department:dep,
      subject:subject,
      organization_code:org_code,
    };
    // console.log(e);
    const api = await fetch("/cbt/ansofra/apiadmin/seacrh/question",{
      method:"POST",
       headers:{"Content-type":'application/json'},
       body:JSON.stringify(e)
    });
    const result = await api.json();
    // console.log(result);
    if(result.status==="success"){
      const response = result.response;
      let output = '';
      for (let index = 0; index < response.length; index++) {
        output += `
        <div class="panel question-set-card">
          <div class="question-set-header">
            <i class="fas fa-layer-group"></i> 
            ${response[index].department} · ${response[index].subject})
          </div>
          <div class="question-item">
            <strong>Q${index+1}:</strong> ${response[index].questiontext}
            <div style="margin-top:8px;">
              <div>A. ${response[index].optionA}</div>
              <div>B. ${response[index].optionB}</div>
              <div>C. ${response[index].optionC}</div>
              <div>D. ${response[index].optionD}</div>
              <div>E. ${response[index].optionE}</div>
            </div>
            <span class="badge badge-score" style="margin-top:6px;display:inline-flex;">
              ✓ Correct: ${response[index].correctOtp || response[index].correctAss }
            </span>
            <button style="background-color:green;color: white; width:50px;heigh:50px; border:none; padding: 5px;" 
              onclick="openEditQuestion(
              '${response[index].questions_id}',
              '${response[index].department}',
              '${response[index].subject}', 
              '${response[index].questiontext}',
              '${response[index].optionA}', 
              '${response[index].optionB}', 
              '${response[index].optionC}', 
              '${response[index].optionD}', 
              '${response[index].optionE}', 
              '${response[index].correctAss}')">Edit</button>&nbsp&nbsp&nbsp&nbsp&nbsp
            <button style="background-color:red;color:white; width:50px;heigh:50px; border:none; padding: 5px;" onclick="deleteQuesiton("${response[index].questionID}")">Del</button>
          </div>
          <div>QuestionID: ${response[index].questionID}</div>
        </div>
        `;  
        // document.getElementById("editQ-department").value=response[index].department;
        // document.getElementById("editQ-subject").value=response[index].subject;
        // document.getElementById("editQ-questiontext").value=response[index].questiontext;
        // document.getElementById("editQ-optionA").value=response[index].optionA;
        // document.getElementById("editQ-optionB").value=response[index].optionB;
        // document.getElementById("editQ-optionC").value=response[index].optionC;
        // document.getElementById("editQ-optionD").value=response[index].optionD;
        // document.getElementById("editQ-optionE").value=response[index].optionE ?? "NULL";
        // document.getElementById("editQ-correctAss").value=response[index].correctAss;
        // document.getElementById("editQ-ID").value=response[index].questions_id;
      }
      const container = document.getElementById('questionSetsResultsContainer').innerHTML=output;
       document.getElementById('noQsSetsMsg').style.display="none";
    }
    else{
         document.getElementById('noQsSetsMsg').style.display="block";
    }
  }
};

function openEditQuestion(id, depart, subject, questions, optionA, optionB, optionC, optionD, optionE, correctAss){
  document.getElementById('editQuestionModal').classList.add('open');
  document.getElementById("editQ-department").value=depart;
  document.getElementById("editQ-subject").value=subject;
  document.getElementById("editQ-questiontext").value=questions;
  document.getElementById("editQ-optionA").value=optionA;
  document.getElementById("editQ-optionB").value=optionB;
  document.getElementById("editQ-optionC").value=optionC;
  document.getElementById("editQ-optionD").value=optionD;
  document.getElementById("editQ-optionE").value=optionE ?? "NULL";
  document.getElementById("editQ-correctAss").value=correctAss;
  document.getElementById("editQ-ID").value=id;
}

document.getElementById("editQuestionSaveBtn").addEventListener("click", async function(){
      const dept = document.getElementById("editQ-department").value;
      const subj = document.getElementById("editQ-subject").value;
      const questionText = document.getElementById("editQ-questiontext").value;
      const optionA = document.getElementById("editQ-optionA").value;
      const optionB =  document.getElementById("editQ-optionB").value;
      const optionC = document.getElementById("editQ-optionC").value;
      const optionD = document.getElementById("editQ-optionD").value;
      const optionE = document.getElementById("editQ-optionE").value ?? "NULL";
      const correctAss = document.getElementById("editQ-correctAss").value;
      const questionID = document.getElementById("editQ-ID").value;
      

      if (!dept || !subj || !questionText || !optionA || !optionB || !correctAss || !questionID) {
        alert("All field require");
      } else {
       const data = document.getElementById("editQuestionForm");
        const form = new FormData(data);
        
        // const obj = {};
        // form.forEach((key, val)=>{
        //   obj[key]=val;
        // });
        
        // console.log(obj);
        const e = {
          department:dept,
          subject:subj,
          questionstext:questionText,
          optionA:optionA,
          optionB:optionB,
          optionC:optionC,
          optionD:optionD,
          optionE:optionE ?? "none",
          correctAss:correctAss,
          id:questionID
        }

        if(correctAss!=optionA || correctAss!=optionB || correctAss !==optionC || correctAss !== optionD || correctAss !== optionE){
           alert("Answer must be in one of the options");
        }

        console.log(e);
        const api = await fetch("/cbt/ansofra/apiadmin/edit/question", {
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify(e)
        });

        const result = await api.json();
        console.log(result);
        if(result.status=="success"){
          alert("Action perform successful");
          closeEditQuestionModal();
         document.getElementById("editQ-department").value="";
       document.getElementById("editQ-subject").value="";
         document.getElementById("editQ-questiontext").value="";
        document.getElementById("editQ-optionA").value="";
         document.getElementById("editQ-optionB").value="";
      document.getElementById("editQ-optionC").value="";
        document.getElementById("editQ-optionD").value="";
        document.getElementById("editQ-optionE").value="" ?? "NULL";
         document.getElementById("editQ-correctAss").value="";
         document.getElementById("editQ-ID").value="";
         searchQuestionSetsBtn();
        }else{
          alert("error occur, try again later");
          console.log(result.response);
        } 
      }
})

document.getElementById("saveQuestionBtn").addEventListener("click",()=>{
  const dept = document.getElementById("displayDept").textContent;
  const subject = document.getElementById("displaySubject").textContent;
  const question = document.getElementById("questionstext").value.trim();
  const media = document.getElementById("media").value.trim();
  const optionA = document.getElementById("optionA").value.trim();
  const optionB = document.getElementById("optionB").value.trim();
  const optionC = document.getElementById("optionC").value.trim();
  const optionD = document.getElementById("optionD").value.trim();
  const optionE = document.getElementById("optionE").value.trim();
  const corr_option = document.getElementById("correctAss").value.trim();
  // const e = {
  //       q:question, c:correctAss, opA:optionA, optB:optionB
  //     }
  //     console.log(e);
  if(!dept || !subject || !question || !optionA || !optionB  ){
      alert("All field required");
  }else{
    processQuestionData();
  }
})


async function processQuestionData(){
      event.preventDefault();
      const dep = document.getElementById("displayDept").textContent;
      const sub = document.getElementById("displaySubject").textContent;
      const org_code = document.getElementById("organization-code").textContent;
      const data = document.getElementById("saveQuestion");
      const media =  document.getElementById("media").value="";
      const optionA  =     document.getElementById("optionA").value;
      const optionB  =     document.getElementById("optionB").value;
      const optionC  =     document.getElementById("optionC").value;
      const optionD  =     document.getElementById("optionD").value;
      const optionE  =     document.getElementById("optionE").value;
          // document.getElementById("correctAnswer").value="";
      const correctAss  =     document.getElementById("correctAss").value;
      const question  =     document.getElementById("questionstext").value;
      // const e = {
      //   q:question, c:correctAss, opA:optionA, optB:optionB
      // }
      // console.log(e);
      if(!question || !correctAss || !optionA || !optionB ){
        alert("All field require");
      }
      // if(correctAss!=optionA || correctAss!=optionB || correctAss !=optionC || correctAss != optionD || correctAss != optionE){
      //     const e = {
      //             q:question, c:correctAss, opA:optionA, optB:optionB, optc:optionC, optD:optionD, optE:optionE
      //           }
      //           console.log(e);
      //      alert("Answer must be in of the options");
      //   }
        else{
            const form = new FormData(data);
            form.append('department', dep);
            form.append('subject', sub);
            form.append('organization_code', org_code);
            const obj = {};
            form.forEach((key, val)=>{
              obj[key]=val
            })
            // console.log(obj);
            const api = await fetch("/cbt/ansofra/apiadmin/save/questions", {
                method:"POST",
                body:form
            });
            const result = await api.json();
            // console.log(result);
            if(result.status==="success"){
              alert(result.response);
              document.getElementById("media").value="";
              document.getElementById("optionA").value="";
              document.getElementById("optionB").value="";
              document.getElementById("optionC").value="";
              document.getElementById("optionD").value="";
              document.getElementById("optionE").value="";
              // document.getElementById("correctAnswer").value="";
              document.getElementById("correctAss").value="";
              document.getElementById("questionstext").value="";
            }
            else{
              // alert(result.response);
              alert("error occur try again later");
            }
              }
      
  }

   document.getElementById("saveDeptBtn").addEventListener("click", async()=>{
    event.preventDefault();
    const depName = document.getElementById("newDeptName").value.trim();
    const DepCode = document.getElementById("newDeptCode").value.trim();
    const DeptHOD = document.getElementById("newDeptHOD").value.trim();
    const des = document.getElementById("newDeptDesc").value.trim();
    if(!depName && !DepCode && !DeptHOD){
      alert("All field required");
    }
    else{
      processDepDataAll();
    }
  }
)

   async function processDepDataAll(){
    const data = document.getElementById("departmentform");
    const form = new FormData(data);
    const org_code = document.getElementById("organization-code").textContent.trim();
    const role = "set";
    const time = new Date().toLocaleTimeString() +" "+ new Date().toLocaleDateString();
    form.append("date_created", time);
    form.append("role", role);
    form.append("organization_code", org_code);
    
    const api = await fetch('/cbt/ansofra/apiadmin/set/department', {
        method:"POST",
        body:form
    });
    const result = await api.json();
    // console.log(result);
    if(result.status==='success'){
        alert("save successful");
        // renderDeptTable(document.getElementById('deptListSearch')?.value || '');
        await updateDeptStats();
        // await updateDeptStats();
        await totalDepartment();
        // await deptSearchBtn();
        document.getElementById('newDeptName').value  = '';
        document.getElementById('newDeptCode').value  = '';
        document.getElementById('newDeptHOD').value   = '';
        document.getElementById('newDeptDesc').value  = '';
    }
    else{
      alert(`${result.response}`);
    }
}

async function updateDeptStats(){
  const org_code = document.getElementById("organization-code").textContent.trim();
  const e = {role:'set', organization_code:org_code};
  const api = await fetch("/cbt/ansofra/apiadmin/get/department/set/list", {
      method:'POST',
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
  });
  const results = await api.json();
  // console.log(results);
  if(results.status==="success"){
      const response = results.response;
      let output = "";
      for(let i=0; i<response.length; i++){
        output+=`
           <tr>
              <th>${i+1}</th>
              <th>${response[i].department}</th>
              <th>${response[i].DepartmentCode}</th>
              <th>${response[i].HeadOfDepartment}</th>
              <th>${response[i].Description}</th>
              <th>${response[i].Date_Created}</th>
              <th onclick="openEditDepartment('${response[i].department_id}', '${response[i].organization_code}', '${response[i].department}', '${response[i].DepartmentCode}', '${response[i].HeadOfDepartment}', '${response[i].Description}')" style="background-color:green; color:white">Edit</th>
              <th onclick="delDepartment('${response[i].department_id}','${response[i].organization_code}')" style="background-color:red; color:white">Del</th>
            <tr>
        `
      }
      document.getElementById("deptTableBody").innerHTML=output;
  }
  else{
    document.getElementById('displayAnyErr').style.display="none"
    document.getElementById('noDeptMsg').style.display="block";
  }
}

// document.getElementById("deptSearchBtn").addEventListener("click", async ()=>{
async function deptSearchBtn(){
    const type = document.getElementById("deptListSearch").value.trim();
    const org_code = document.getElementById("organization-code").textContent.trim();
    const e = {DepartmentCode:type, organization_code: org_code};
    const api = await fetch('/cbt/ansofra/apiadmin/search/dep/code', {
        method:'POST',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify(e)
    });
    const results = await api.json();
    if(results.status==="success"){
          const response = results.response;
          let output = "";
          for(let i=0; i<response.length; i++){
            output+=`
                <tr>
                  <th>${i+1}</th>
                  <th>${response[i].department}</th>
                  <th>${response[i].DepartmentCode}</th>
                  <th>${response[i].HeadOfDepartment}</th>
                  <th>${response[i].Description}</th>
                  <th>${response[i].Date_Created}</th>
                  <th onclick="openEditDepartment('${response[i].department_id}', '${response[i].organization_code}', '${response[i].department}', '${response[i].DepartmentCode}', '${response[i].HeadOfDepartment}', '${response[i].Description}')" style="background-color:green; color:white">Edit</th>
                  <th onclick="delDepartment('${response[i].department_id}','${response[i].organization_code}')" style="background-color:red; color:white">Del</th>
                <tr>
            `
          }
          // console.log(output);
          document.getElementById("deptTableBody").innerHTML=output;
      }
    else{
      document.getElementById('displayAnyErr').style.display="none"
      document.getElementById('noDeptMsg').style.display="block";
    } 
  };

  function openEditDepartment(id, code, depart, depCode, head, desc){
      document.getElementById('editDepartmentModal').classList.add('open');
      document.getElementById('editDept-name').value=depart;
      document.getElementById('editDept-code').value=depCode;
      document.getElementById('editDept-hod').value=head;
      document.getElementById('editDept-desc').value=desc;
      document.getElementById('edit-id').value=id;
      // console.log(depart, code);
      // alert("features under developing");
  }

  async function editDepartmentSaveBtn(){
    const depart =  document.getElementById('editDept-name').value.trim();
     const departCode = document.getElementById('editDept-code').value.trim();
      const hod = document.getElementById('editDept-hod').value.trim();
     const descr = document.getElementById('editDept-desc').value.trim();
     const id =  document.getElementById('edit-id').value.trim();
     if(!depart || !departCode || !hod || !descr){
      alert("All field require");
     }else{
       const e = {
        department:depart,
        DepartmentCode:departCode,
        id:id,
        Description:descr,
        HeadOfDepartment:hod,
        organization_code:document.getElementById("organization-code").textContent.trim()
       };

       const api = await fetch("/cbt/ansofra/apiadmin/edit/department", {
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify(e)
       });

       const result = await api.json();
       if(result.status === "success"){
        alert("Edit successfull");
        closeEditDepartmentModal();
        updateDeptStats();
        document.getElementById('editDept-name').value="";
        document.getElementById('editDept-code').value="";
        document.getElementById('editDept-hod').value="";
        document.getElementById('editDept-desc').value="";
        document.getElementById('edit-id').value="";
       }else{
        alert("Error occur, try again later");
        console.log(result.response);
       }
     }
  }

  async function delDepartment(id, org_code){
      const e = {
        id:id,
        organization_code:org_code
      };

      const api = await fetch("/cbt/ansofra/apiadmin/del/department", {
          method:"POST",
          headers:{"Content-type":"Application/json"},
          body:JSON.stringify(e)
      });

      const response = await api.json();
      if(response.status == "success"){
        alert("Department deleted successfully");
        await updateDeptStats();
        await totalDepartment();
        await deptSearchBtn();
      }else{
        alert("Error occur, try again later" || response.response);
      }
  }



  // document.getElementById("searchSubjectBtn").addEventListener("click", async ()=>{
  //   const depVal = document.getElementById("deptSearchInput").value.trim();
  //   const org_code = document.getElementById("organization-code").textContent.trim();
  //   const e = {role:"set", organization_code:org_code, department:depVal};

  //   const api = await fetch("/cbt/ansofra/apiadmin/search/dep/name", {
  //     method:"POST",
  //     headers:{"Content-type":"application/json"},
  //     body:JSON.stringify(e)
  //   });

  //   const result = await api.json();
  //   console.log(result);
  // })

window.showSection = function(id, navEl){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if(navEl) navEl.classList.add('active');
  const titles = { dashboard:'Dashboard', students:'Students', subjects:'Subjects', questions:'Questions', results:'Results', departments:'Departments', schedule:'Schedule Exam' };
  document.getElementById('pageTitle').textContent = titles[id] || id;
  if(id === 'students') getStudentList();
  if(id === 'questions'){}
  if(id === 'departments'){updateDeptStats();}
  if(id === 'subjects'){ getDepartment(); }
  if(id === 'schedule'){ displayScheduledTime(); totalexamSche(); }
  if(id === 'results'){ results(); }
  closeSidebar();
};

 async function releaseResult(){
  const org_code = document.getElementById("organization-code").textContent.trim();
  const e = {
          status:"completed", 
          organization_code:org_code};
  const api = await fetch("/cbt/ansofra/apiadmin/release/result", {
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify(e)
  });
  const result = await api.json();
  // console.log(result);
  if(result.status==="success"){
    alert("Publich success");
    releaseResult2();
    results();
  }
  else{
    alert("Error while sending result out");
  }

}
 async function results(){
          const org_code = document.getElementById("organization-code").textContent;
          const e ={status:"completed", organization_code:org_code};
          const api = await fetch("/cbt/ansofra/apiadmin/display/result", {
              method:"POST",
              headers:{"Content-type":"apllication/json"},
              body:JSON.stringify(e)
          });
          const result = await api.json();
          if(result.status=="success"){
            const response = result.response;
            let output = "";
            for (let index = 0; index < response.length; index++) {
              output += `
                <tr>
                  <td>${index + 1}</td>
                  <td>${response[index].fullname || '—'}</td>
                  <td>${response[index].regNum   || '—'}</td>
                  <td><span class="badge badge-dept">${response[index].department || '—'}</span></td>
                  <td><span class="badge badge-score">${response[index].overAll || '—'}</span></td>
                  <td>${response[index].createdAt || '—'}</td>
                  <td>${response[index].publish   || '—'}</td>
                  <td>
                    <button class="btn btn-sm btn-info"onclick="openResultDrawer(
                      '${response[index].regNum}',
                      '${response[index].department}',
                      '${response[index].createdAt}',
                      '${response[index].publish}',
                      '${response[index].fullname}',
                      '${response[index].overAll}'
                      )">
                      <i class="fas fa-eye"></i> View
                    </button>
                  </td>
                </tr>`;
    
    // document.getElementById('display-result').innerHTML = output;
            }
            document.getElementById("display-result").innerHTML=output;
          }
          else{
            document.getElementById("display-error").textContent="No result completed yet";
          }
        }

 async function releaseResult2(){
  const org_code = document.getElementById("organization-code").textContent.trim();
  const e = {
          status:"completed", 
          organization_code:org_code};
  const api = await fetch("/cbt/ansofra/apiadmin/release/result/2", {
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify(e)
  });
  const result = await api.json();
  // console.log(result);
  // if(result.status==="success"){

  // }
  // else{
  //   alert("Error while sending result out");
  // }
}

 document.getElementById("resultsDeptSearchBtn").addEventListener("click", async function(){
  const type = document.getElementById("regSearch-type").value.trim();
  const value = document.getElementById("input-search").value.trim();
  if(!type || !value){
    alert("All fields required");
  }else{
    const org_code = document.getElementById("organization-code").textContent.trim();
    const e  = {
      organization_code:org_code,
      type:type,
      value:value
    };
    const api = await fetch("/cbt/ansofra/apiadmin/search/result", {
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
    });

    const result = await api.json();
    if(result.status == "success"){
        const response = result.response;
        let output = "";
        for(let i=0; i<response.length; i++){
          output+=`<tr>
                    <td>${i+1}</td>
                    <td>${response[i].fullname}</td>
                    <td>${response[i].regNum}</td>
                    <td><span class="badge badge-dept">${response[i].department}</span></td>
                    <td><span class="badge badge-score">${response[i].overAll}</span></td>
                    <td>Mar 2026</td><td>${response[i].publish}</td>
                  </tr>`;
        }
        document.getElementById('display-result').innerHTML=output;
    }else{
      document.getElementById('display-result').textContent="No departmet, fullname or regstration number found";
    }
  }
});

async function resultsStatCompleted(totalStudents){
  const org_code = document.getElementById("organization-code").textContent.trim();
  const e = {
    status:"completed",
    organization_code:org_code
  };

  const api = await fetch("/cbt/ansofra/apiadmin/get/completed/result", {
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
  });

  const result = await api.json();
  const response = result.response;
  if(result.status=="success"){
      document.getElementById("resultsStatCompleted").textContent=response;
      // ResultsCompleted=parseFloat(response);
      getOutStanding(totalStudents, response)
  }else{
    document.getElementById("resultsStatCompleted").textContent="0";
    // ResultsCompleted=0;
    getOutStanding(totalStudents, response)
  }     
}

function getOutStanding(student, completed){
  const out = parseFloat(student) -  parseFloat(completed);
  // console.log("out:" + out);
  document.getElementById("resultsStatOutstanding").textContent=out;
}

window.openSidebar  = function(){ document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('visible'); document.body.style.overflow='hidden'; };
window.closeSidebar = function(){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('visible'); document.body.style.overflow=''; };

document.getElementById('searchSubjectByNameBtn')?.addEventListener('click',()=>renderSubjectsByName(document.getElementById('subjectNameSearchInput')?.value||''));
document.getElementById('searchSubjectBtn')?.addEventListener('click',()=>renderSubjects(document.getElementById('deptSearchInput')?.value||''));

document.getElementById('nextToQuestionBtn')?.addEventListener('click', () => {
  const dept = document.getElementById('questionDept').value.trim();
  const subj = document.getElementById('questionSubject').value.trim();
  if(!dept||!subj){ alert('Complete fields'); return; }
  document.getElementById('displayDept').textContent = dept;
  document.getElementById('displaySubject').textContent = subj;
  document.getElementById('questionStep1').style.display = 'none';
  document.getElementById('questionStep2').style.display = '';
});
document.getElementById('changeDetailsBtn')?.addEventListener('click', () => {
  document.getElementById('questionStep2').style.display = 'none';
  document.getElementById('questionStep1').style.display = '';
});
document.getElementById('addAnotherQuestionBtn')?.addEventListener('click', () => {
  if(!document.getElementById('questionText').value.trim()){ alert('Enter question first'); return; }
  alert('Saved. Add another.');
  ['questionText','optionA','optionB','optionC','optionD'].forEach(id => document.getElementById(id).value='');
  document.getElementById('correctAnswer').value='';
});

async function totalActive(){
  const org_code = document.getElementById("organization-code").textContent.trim();
  const e = {
    organization_code:org_code,
    status:"active"
  }

  const api = await fetch("/cbt/ansofra/apiadmin/get/active/schedule", {
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
  });

  const result = await api.json();
  // console.log(result);
  const response = result.response;
  document.getElementById("schActive").textContent=parseFloat(response);
}
async function totalInActive(){
  const org_code = document.getElementById("organization-code").textContent.trim();
  const e = {
    organization_code:org_code,
    status:"inactive"
  }

  const api = await fetch("/cbt/ansofra/apiadmin/get/in/active/schedule", {
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
  });

  const result = await api.json();
  const response = result.response;
  // console.log(result);
  document.getElementById("schInactive").textContent=parseFloat(response);
}

function logout(){
  localStorage.removeItem("cbt-admin-ID"); 
  localStorage.removeItem('cbt-admin-email'); 
  localStorage.removeItem('cbt-admin-auth-code'); 
  window.location.href="/cbt/ansofra/admin/login"
}

window.addEventListener("load", async ()=>{
  getDetail();
  
  // await getLastLogin();
  // await setTimeLogin();
  totalActive();
  // await resultsStatCompleted();
})


// document.addEventListener('DOMContentLoaded', async () => {
  
// });

//  function renderResultsPage() {
//     // ... existing page-slice logic ...
//     let output = '';
//     for (let i = 0; i < pageItems.length; i++) {
//       const row = pageItems[i];

//       // Escape any single quotes in the row fields
//       const safe = v => String(v || '').replace(/'/g, "\\'");

//       // Build a JS-safe inline object for the onclick
//       const rowJson = JSON.stringify(row).replace(/"/g, '&quot;');

//       output += `
//         <tr>
//           <td>${startIdx + i + 1}</td>
//           <td>${fullname || '—'}</td>
//           <td>${regNum   || '—'}</td>
//           <td><span class="badge badge-dept">${department || '—'}</span></td>
//           <td><span class="badge badge-score">${overAll || '—'}</span></td>
//           <td>${createdAt || '—'}</td>
//           <td>${publish   || '—'}</td>
//           <td>
//             <button
//               class="btn btn-sm btn-info"
//               onclick='openResultDrawer(${rowJson})'
//             >
//               <i class="fas fa-eye"></i> View
//             </button>
//           </td>
//         </tr>`;
//     }
//     document.getElementById('display-result').innerHTML = output;
//   }

  /*  Publish single result  */
async function publishSingleResult() {
  if (!_rsdCurrentRow) return;
  if (_isPublished(_rsdCurrentRow.publish)) return;

  const btn = document.getElementById('rsdPublishBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Publishing…';
  btn.disabled  = true;

  try {
    const res    = await fetch('/cbt/ansofra/apiadmin/publish/single/result', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ regNum: _rsdCurrentRow.regNum })
    });
    const data = await res.json();
    if (data.status === 'success') {
      _rsdCurrentRow.publish = 'yes';
      /* update chip */
      const chip = document.getElementById('rsdChipStatus');
      chip.textContent = '✓ Published';
      chip.className   = 'rsd-chip rsd-chip-status published';
      /* update label */
      document.getElementById('rsdPublishLabel').textContent = 'Published';
      btn.innerHTML   = '<i class="fas fa-check-circle"></i> Already Published';
      btn.className   = 'rsd-publish-btn already-published';
      btn.disabled    = false;
      /* refresh the main result table if it's loaded */
      if (typeof loadResultsDashboard === 'function') loadResultsDashboard();
    } else {
      alert(data.response || 'Could not publish result. Please try again.');
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Result';
      btn.disabled  = false;
    }
  } catch (err) {
    alert('Network error. Please try again.');
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Result';
    btn.disabled  = false;
  }
}

function openResultDrawer( regNum, depart, createdAt, publish, fullname, overAll) {
  // _rsdCurrentRow = row;
  // _rsdQExpanded  = false;
  // console.log(regNum, depart, createdAt, publish, fullname, over);
  // document.getElementById('rsdToggleQBtn').innerHTML =
  //   '<i class="fas fa-chevron-down" id="rsdToggleIcon"></i> Show Details';
  // document.getElementById('rsdQuestionDetail').style.display = 'none';

  /* Avatar initials */
  const initials = (fullname || '??').split(' ')
    .map(w => w[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('rsdAvatar').textContent = initials;

  /* Header */
  document.getElementById('rsdName').textContent = fullname || '—';
  document.getElementById('rsdReg').textContent  = regNum   || '—';

  /* Chips */
  document.getElementById('rsdChipDept').textContent = depart || '—';
  // console.log(publish);
  if(publish==="pending"){
      document.getElementById('rsdChipStatus').textContent= "Unpublished";
      document.getElementById("rsdPublishLabel").textContent= "Unpublished";
  }else{
    document.getElementById('rsdChipStatus').textContent="Published";
    document.getElementById("rsdPublishLabel").textContent="Published"
  }
  // const isPublished = publish;
  // const chipEl = document.getElementById('rsdChipStatus');
  // chipEl.textContent = isPublished ? '✓ Published' : '⏳ Pending';
  // chipEl.className = 'rsd-chip rsd-chip-status ' + (isPublished ? 'published' : 'unpublished');

  /* Score hero */
  // document.getElementById('rsdScoreBig').textContent   = overAll   || '—';
  document.getElementById('rsdMetaName').textContent   = fullname  || '—';
  document.getElementById('rsdMetaReg').textContent    = regNum    || '—';
  document.getElementById('rsdMetaDept').textContent   = depart|| '—';
  document.getElementById('rsdMetaDate').textContent   = createdAt || '—';

  /* Publish button state */
  // const pubBtn = document.getElementById('rsdPublishBtn');
  // document.getElementById('rsdPublishLabel').textContent = isPublished ? 'Published' : 'Not yet published';
  // if (isPublished=="Pending") {
  //   pubBtn.innerHTML = '<i class="fas fa-check-circle"></i> Already Published';
  //   pubBtn.className = 'rsd-publish-btn already-published';
  // } else {
  //   pubBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Result';
  //   pubBtn.className = 'rsd-publish-btn';
  // }

  /* Parse subjects */
  // let subjects = [];
  // try {
  //   subjects = JSON.parse(subjectAndScore || '[]');
  // } catch (_) { subjects = []; }

  /* Summary pills */
  // const totalQ    = subjects.reduce((s, r) => s + (parseInt(r.totalQuestions)  || 0), 0);
  // const totalCorr = subjects.reduce((s, r) => s + (parseInt(r.correctAnswers)  || 0), 0);
  // const pct       = totalQ > 0 ? Math.round((totalCorr / totalQ) * 100) : 0;
  // document.getElementById('rsdSumSubjects').textContent = subjects.length || '—';
  // document.getElementById('rsdSumTotalQ').textContent   = totalQ  || '—';
  // document.getElementById('rsdSumCorrect').textContent  = totalCorr;
  // document.getElementById('rsdSumPercent').textContent  = totalQ ? pct + '%' : '—';

  /* Render subject cards */
  _renderSubjectCards(depart, regNum);

  /* Open drawer */
  document.getElementById('rsdBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/*  Close  */
function closeResultDrawer() {
  document.getElementById('rsdBackdrop').classList.remove('open');
  document.body.style.overflow = '';
  _rsdCurrentRow = null;
}

/*  Render subject breakdown cards  */ 
async function _renderSubjectCards(depart, regNum) {
  const area = document.getElementById('rsdSubjectArea');
  const e = {
    department:depart,
    regNum:regNum
  }

  const api = await fetch("/cbt/ansofra/api/get/score/subject", {
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify(e)
  });

  const result = await api.json();
  const response = result.response;
  if(result.status=="success"){
      let output = "";
      for (let index = 0; index < response.length; index++) {
          output+=`
            <tr>
                  <td>${index +1}</td>
                  <td>${response[index].subject}</td>
                   <td>${response[index].score}</td>
                  <td>${response[index].expectedScore}</td>
                  <td>${response[index].correctAnswers}</td>
                  <td>${response[index].saveAt}</td>
                  <td>${response[index].totalQuestions}</td>
                  <td>${response[index].scorePerQuestion}</td>
                  <td>${response[index].status}</td>
                </tr>
          `;
      }
      document.getElementById("display-subject").innerHTML=output;

      totalScore = 0;
      for (let index = 0; index < response.length; index++) {
        // const element = array[index];
        totalScore += parseFloat(response[index].score);
      }

      document.getElementById("rsdScoreBig").textContent=totalScore;
  }else{  
    area.innerHTML = `
      <div class="rsd-empty">
        <i class="fas fa-folder-open"></i>
        No subject breakdown available for this result.
      </div>`;
    return;
  }
  

//   area.innerHTML = `<div class="rsd-subj-cards">${subjects.map(s => {
//     const score      = parseFloat(s.score)          || 0;
//     const correct    = parseInt(s.correctAnswers)    || 0;
//     const total      = parseInt(s.totalQuestions)    || 0;
//     const spq        = parseFloat(s.scorePerQuestion || (total > 0 ? score / correct : 0)) || 0;
//     const expected   = parseFloat(s.expectedScore)   || (total * spq);
//     const pct        = expected > 0 ? Math.min(Math.round((score / expected) * 100), 100) : 0;

//     return `
//       <div class="rsd-subj-card">
//         <div>
//           <div class="rsd-subj-name">${s.subject || '—'}</div>
//           <div class="rsd-subj-stats">
//             <span class="rsd-subj-stat">
//               <i class="fas fa-circle-question"></i>
//               ${total} question${total !== 1 ? 's' : ''}
//             </span>
//             <span class="rsd-subj-stat">
//               <i class="fas fa-check"></i>
//               ${correct} correct
//             </span>
//             <span class="rsd-subj-stat">
//               <i class="fas fa-times"></i>
//               ${total - correct} wrong
//             </span>
//             ${spq > 0 ? `
//             <span class="rsd-subj-stat">
//               <i class="fas fa-star-half-stroke"></i>
//               ${spq} pt/question
//             </span>` : ''}
//           </div>
//           <div class="rsd-progress-wrap">
//             <div class="rsd-progress-track">
//               <div class="rsd-progress-fill" style="width:${pct}%"></div>
//             </div>
//             <div class="rsd-progress-label">${pct}% of expected score</div>
//           </div>
//         </div>
//         <div class="rsd-subj-score-box">
//           <div class="rsd-subj-score-num">${score}</div>
//           <div class="rsd-subj-score-label">score</div>
//         </div>
//       </div>`;
//   }).join('')}</div>`;
}