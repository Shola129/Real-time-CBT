/*  SIDEBAR NAV SWITCHING  */

  const org_code = localStorage.getItem("cbt_session_org_code");
  const id = localStorage.getItem("cbt_session_id");
  const regNum = localStorage.getItem("cbt_session_reg_num");
  if(!org_code || !id || !regNum ){
    // window.location.href="/cbt/ansofra/";
    // return;
  }
  document.addEventListener("DOMContentLoaded", async ()=>{
        await getDetails();
  });

  async function getDetails(){
    const e = {
        regNum:regNum,
        organization_code:org_code,
        ID:id.substring(8,9)
    };
    // console.log(e);

    const api = await fetch("/cbt/ansofra/api/details", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
    });

    const response = await api.json();
    const res = response.response[0];
    // console.log(response);
    if(response.status=="success"){
        document.getElementById("profile-name").textContent=res.fullname;
        document.getElementById("profile-reg").textContent=res.regNum;
        document.getElementById("profile-email").textContent=res.email;
        document.getElementById("profile-phone").textContent=res.phone;
        document.getElementById("profile-organization-name").textContent=res.organization_name;
        document.getElementById("profile-organization-code").textContent=res.organization_code;
        document.getElementById("profile-department").textContent=res.department;
        document.getElementById("profile-state").textContent=res.state;
        document.getElementById("profile-gender").textContent=res.gender;
        document.getElementById("profile-dob").textContent=res.dob;
        document.getElementById("profile-date-created").textContent=res.date_created;
        document.getElementById("studentNameDisplay").textContent=res.fullname;
        document.getElementById("org-name").textContent=res.organization_name;
        // document.getElementById("").textContent=res.;
        // document.getElementById("").textContent=res.;
        document.getElementById("edit-email").value=res.email;
        document.getElementById("edit-name").value=res.fullname;
        document.getElementById("edit-phone").value=res.phone;
        // document.getElementById("edit-").value=;
        // document.getElementById("").value=;
    }else{
        // window.location.href="/cbt/ansofra/";
    }
    avater();
  }

  function avater(){
    const getName = document.getElementById("profile-name").textContent.trim();
    const str = getName.substring(0, 1);
    const toUpperStr = str.toUpperCase();
    document.getElementById("avatar-img").textContent=toUpperStr;
    document.getElementById("profile-photo").textContent=toUpperStr;
  }
// setTimeout(()=>{
//   fetchResult();
// }, 2000);
  async function fetchResult(){
    const regNum = document.getElementById("profile-reg").textContent.trim();
    const org_code = document.getElementById("profile-organization-code").textContent.trim();
    const e = {
        regNum:regNum,
        organization_code:org_code
    };
    // console.log(e);

    const api = await fetch("/cbt/ansofra/api/fetch/result", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
    });
    
    const response = await api.json();
    // console.log(response);
    if(response.status=="success"){
        const res = response.response;
        let output="";
        let scorePerQuestions= "";
        let totalQuestions = "";
        for(let i=0; i<res.length; i++){
           totalQuestions+=res[i].totalQuestions;
           scorePerQuestions+=res[i].scorePerQuestion;
            output+=`
                <tr>
                    <td>${1+i}</td>
                    <td>${res[i].subject}</td>
                    <td>${res[i].saveAt}</td>
                    <td>${res[i].score}</td>
                    <td>${res[i].totalQuestions}</td>
                    <td>${res[i].status}</td>
                  </tr>
            `;
            // await cal(scorePerQuestions, totalQuestions);
        }
        document.getElementById("resultBody").innerHTML=output;
    }else{
        document.getElementById("resultBody").textContent="No result";
    }
  }

  // setTimeout(()=>{
  //   subject();
  // },3000);

  async function subject(){
    const dept = document.getElementById("profile-department").textContent.trim();
    const organization_code = document.getElementById("profile-organization-code").textContent.trim();
    const e = {
      department :dept,
      organization_code:organization_code
    }
    const api = await fetch("/cbt/ansofra/api/getAllSebject", {
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(e)
    });

    const result = await api.json();
    const response = result.response;
    if(result.status=="success"){
        let output = "";
        for(let i=0; i<response.length; i++){
          output +=`
              <div class="subject-card"s>
                <div class="subject-top">
                  <div><div class="subject-name">${response[i].subject}</div><div class="subject-code">${response[i].DepartmentCode}</div></div>
                  <span class="badge upcoming"></span>
                </div>
                <div class="subject-meta">
                  <span><i class="fas fa-sitemap"></i> ${response[i].department}</span>
                  <span><i class="fas fa-list-ol"></i> ${response[i].totalQuestions} Questions</span>
                  <span><i class="fas fa-clock"></i></span>
                </div>
              </div>
          `;
          document.getElementById("subjectsGrid").innerHTML=output;
        } 
    }else{
      // console.log("all");
    }
  }


  async function updateProfile(){
    const org_code = document.getElementById("profile-organization-code").textContent.trim();
    const edit_name = document.getElementById("edit-name").value.trim();
    const edit_email = document.getElementById("edit-email").value.trim();
    const edit_phone = document.getElementById("edit-phone").value.trim();
    if(!org_code||!edit_email||!edit_name||!edit_phone){
        alert("All field require");
    }else{
      const e = {
        fullname:edit_name,
        email:edit_email,
        phone:edit_phone,
        organization_code:org_code,
        organization_name:document.getElementById("profile-organization-name").textContent.trim(),
        gender:document.getElementById("profile-gender").textContent.trim(),
        dob:document.getElementById("profile-dob").textContent.trim(),
        date_created:document.getElementById("profile-date-created").textContent.trim(),
        regNum:document.getElementById("profile-reg").textContent.trim(),
        department:document.getElementById("profile-department").textContent.trim(),
        state:document.getElementById("profile-state").textContent.trim(),
        role:"user",
        ID:id.substring(8, 9)
      }
      // console.log(e);

      const api = await fetch("/cbt/ansofra/api/edit/profile", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
      });

      const result = await api.json();
      if(result.status == "success"){
        alert("Edit success");
        getDetails();
      }else{
        alert("error occur, try again");
        console.log(result);
      }
    }
  }

  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const views = document.querySelectorAll('.view');

  async function switchView(viewName) {
    views.forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewName);
    if (target) target.classList.add('active');
    // if(viewName)

    navItems.forEach(item => item.classList.toggle('active', item.dataset.view === viewName));
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
     if(viewName=="results"){
     await fetchResult();
      // console.log(viewName);
    }else if(viewName=="subjects"){
      await  subject();
        console.log();
    }else if(viewName=="profile"){
        getDetails();
        // console.log("profile");
    }else if(viewName=="settings"){
      // console.log(viewName);
    }else if(viewName=="notifications"){
      // console.log(viewName);
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => switchView(item.dataset.view));
    // if(item.dataset.view=="view-results"){
    //   fetchResult();
    // }else if(item.dataset.view=="view-subjects"){
    //     subject();
    // }else if(item.dataset.view=="view-profile"){
    //     getDetails();
    // }else if(item.dataset.view=="view-settings"){

    // }else if(item.dataset.view=="view-notifications"){

    // }
  });

  document.querySelectorAll('[data-view-link]').forEach(el => {
    el.addEventListener('click', () => switchView(el.dataset.viewLink));
    //  if(el.dataset.viewLink=="results"){
    //   fetchResult();
    // }else if(el.dataset.viewLink=="view-subjects"){
    //     subject();
    // }else if(el.dataset.viewLink=="view-profile"){
    //     getDetails();
    // }else if(el.dataset.viewLink=="view-settings"){

    // }else if(el.dataset.viewLink=="view-notifications"){

    // }
  });

  /*  MOBILE SIDEBAR TOGGLE  */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  function openMobileSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }
  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }
  hamburgerBtn.addEventListener('click', openMobileSidebar);
  overlay.addEventListener('click', closeMobileSidebar);

  /*  SUBJECTS SEARCH + FILTER  */
  const subjectSearch = document.getElementById('subjectSearch');
  const filterDepartment = document.getElementById('filterDepartment');
  const filterStatus = document.getElementById('filterStatus');
  const subjectsGrid = document.getElementById('subjectsGrid');
  const subjectsEmptyState = document.getElementById('subjectsEmptyState');
  const subjectCards = Array.from(document.querySelectorAll('.subject-card'));

  // function applySubjectFilters() {
  //   const q = subjectSearch.value.trim().toLowerCase();
  //   const dept = filterDepartment.value;
  //   const status = filterStatus.value;
  //   let visibleCount = 0;

  //   subjectCards.forEach(card => {
  //     const name = card.querySelector('.subject-name').textContent.toLowerCase();
  //     const code = card.querySelector('.subject-code').textContent.toLowerCase();
  //     const matchesQuery = !q || name.includes(q) || code.includes(q);
  //     const matchesDept = !dept || card.dataset.dept === dept;
  //     const matchesStatus = !status || card.dataset.status === status;
  //     const show = matchesQuery && matchesDept && matchesStatus;
  //     card.style.display = show ? '' : 'none';
  //     if (show) visibleCount++;
  //   });

  //   subjectsEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  //   subjectsGrid.style.display = visibleCount === 0 ? 'none' : 'grid';
  // }

  // subjectSearch.addEventListener('input', applySubjectFilters);
  // filterDepartment.addEventListener('change', applySubjectFilters);
  // filterStatus.addEventListener('change', applySubjectFilters);

  /*  LOGOUT (placeholder)  */
  document.getElementById('logoutBtn').addEventListener('click', () => {
    console.log('Logout clicked — wire this to your real logout endpoint.');
  });