  /* 
     HELPERS
   */
  window.addEventListener("load", async function(){
    await GetAvailableOrg();
  })
  function showAlert(id, msg, type) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.className = `alert ${type} show`;
    if (type === 'error') setTimeout(() => el.classList.remove('show'), 5000);
  }

  async function ConfirmOrgCode(){
      const org_code = document.getElementById("inp-org-code").value.trim();
      const org_name = document.getElementById("inp-org-name").value.trim();
      if(!org_code || !org_name){
        alert("Orgamization code or name must not be empty");
        return;
      }
      const e = {organization_code:org_code, organization_name:org_name};

      const api = await fetch("/cbt/ansofra/apiadmin/checkOrgCode", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
      });

      const result = await api.json();
      const response = result.response;
      console.log(response);
      if(result.status=="failed"){
          document.getElementById("continue-1").disabled=true;
          showAlert('reg-alert','Organization code not found or not exist','error'); return;
      }
      getDepartment();
      document.getElementById("continue-1").disabled=false;
  }

  /* 
     DEPARTMENT LIST
   */
  async function getDepartment(){
    const org_code = document.getElementById("inp-org-code").value.trim();
    const select = document.getElementById('inp-course');

    if (!org_code) {
      select.disabled = true;
      select.innerHTML = '<option value="">Enter Organization Code first</option>';
      return;
    }

    select.disabled = true;
    select.innerHTML = '<option value="">Loading departments…</option>';

    // try {
      const e = { role: 'set', organization_code: org_code };
      const api = await fetch("/cbt/ansofra/api/get/department/set/list", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(e)
      });

      const result = await api.json();
      const response = result.response;
      console.log(result);
      if (!response || response.length === 0 || result.status=="failed") {
        select.innerHTML = '<option value="">No departments available for this organization</option>';
        return;
      }

      let output = '<option value="">Select Department</option>';
      for (let index = 0; index < response.length; index++) {
        output += `<option value="${response[index].department}">${response[index].department}</option>`;
      }

      select.innerHTML = output;
      select.disabled = false;
    // } catch (err) {
    //   select.innerHTML = '<option value="">Failed to load departments — check the code and try again</option>';
    // }
  }

  async function verifyEmail(){
    const org_code = document.getElementById("inp-org-code").value.trim();
    const email = document.getElementById("inp-email").value.trim();
    const e = {
      "role":"USER", email:email, organization_code:org_code
    }

    const api = await fetch("/cbt/ansofra/api/verify", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
    });

    const result = await api.json();
    if(result.status=="success"){
        document.getElementById("continue-1").disabled=true;
        showAlert('reg-alert','Email already exist or already used to register on this platform.','error'); return;  
    }else{
        document.getElementById("continue-1").disabled=false;
    }
    // document.getElementById("continue-1").disabled=true;
    // showAlert('reg-alert','Email already exist or already used to register on this platform.','error'); return;

  }

  async function GetAvailableOrg(){
    e = {
        role:"ADMIN",
        visibility:"public"
    }
    const api = await fetch("/cbt/ansofra/api/get/available/org", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(e)
    });

    const result = await api.json();
    // console.log(result);
    const response = result.response;
    if(result.status=="success"){
        let output = '';
        for(let i = 0; i < response.length; i++){
            output+=`
                <div class="org-card-top">
                    <span>${1+ i} .</span>
                    <span class="org-card-name">${response[i].organization_name}</span>
                    <span class="org-card-code">${response[i].organization_code}</span>
                    </div>
                    <div class="org-card-desc">${response[i].organization_description ?? 'null'}</div>
                </div>
            `;
        }
        document.getElementById("org-directory").innerHTML=output;
    }else{
     document.getElementById("org-directory").textContent="No public organization found";   
    }
  }

  /* 
     STEP NAVIGATION (Registration form)
   */
  function nextStep(from) {
    document.getElementById('reg-alert').classList.remove('show');
    if (from === 1) {
      const orgName = document.getElementById('inp-org-name').value.trim();
      const orgCode = document.getElementById('inp-org-code').value.trim();
      const email = document.getElementById('inp-email').value.trim();
      const fn  = document.getElementById('inp-firstname').value.trim();
      const ln  = document.getElementById('inp-lastname').value.trim();
      const dob = document.getElementById('inp-dob').value;
      const g   = document.getElementById('inp-gender').value;
      const ph  = document.getElementById('inp-phone').value.trim();
      if (!orgName || !orgCode) {
        showAlert('reg-alert','Please enter your organization name and code.','error'); return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert('reg-alert','Please enter a valid email address.','error'); return;
      }
      if (!fn||!ln||!dob||!g||!ph) { showAlert('reg-alert','Please complete all personal information fields.','error'); return; }
    }
    if (from === 2) {
      const st  = document.getElementById('inp-state').value;
      const co  = document.getElementById('inp-course').value.trim();
      if (!st||!co) { showAlert('reg-alert','Please complete all academic information fields.','error'); return; }
    }
    document.getElementById(`section-${from}`).classList.remove('active');
    document.getElementById(`section-${from+1}`).classList.add('active');
    document.getElementById(`step-${from}`).classList.remove('active');
    document.getElementById(`step-${from}`).classList.add('done');
    document.getElementById(`step-${from+1}`).classList.add('active');
    document.getElementById(`line-${from}`).classList.add('done');
  }

  function prevStep(from) {
    document.getElementById('reg-alert').classList.remove('show');
    document.getElementById(`section-${from}`).classList.remove('active');
    document.getElementById(`section-${from-1}`).classList.add('active');
    document.getElementById(`step-${from}`).classList.remove('active');
    document.getElementById(`step-${from-1}`).classList.remove('done');
    document.getElementById(`step-${from-1}`).classList.add('active');
    document.getElementById(`line-${from-1}`).classList.remove('done');
  }

  /* 
     PASSWORD STRENGTH
   */
  function checkStrength(val) {
    const bar = document.getElementById('strength-bar');
    const lbl = document.getElementById('strength-label');
    let score = 0;
    if (val.length>=6) score++; if (val.length>=10) score++;
    if (/[A-Z]/.test(val)) score++; if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
      {w:'0%',  bg:'var(--border)',  t:'Enter a password'},
      {w:'25%', bg:'var(--danger)',  t:'Weak'},
      {w:'50%', bg:'var(--warning)', t:'Fair'},
      {w:'75%', bg:'var(--primary)', t:'Good'},
      {w:'100%',bg:'var(--success)', t:'Strong ✓'},
    ];
    const lvl = levels[Math.min(score,4)];
    bar.style.width = lvl.w; bar.style.background = lvl.bg; lbl.textContent = lvl.t;
  }

  /* 
     FINAL REGISTRATION SUBMIT
   */
  async function doRegister() {
    document.getElementById('reg-alert').classList.remove('show');
    const pass  = document.getElementById('inp-pass').value;
    const pass2 = document.getElementById('inp-pass2').value;
    const terms = document.getElementById('inp-terms').checked;
    if (pass.length<6)  { showAlert('reg-alert','Password must be at least 6 characters.','error'); return; }
    if (pass!==pass2)   { showAlert('reg-alert','Passwords do not match.','error'); return; }
    if (!terms)         { showAlert('reg-alert','You must agree to the terms to continue.','error'); return; }

    const orgName   = document.getElementById('inp-org-name').value.trim();
    const orgCode   = document.getElementById('inp-org-code').value.trim();
    const email     = document.getElementById('inp-email').value.trim();
    const firstName = document.getElementById('inp-firstname').value.trim();
    const lastName  = document.getElementById('inp-lastname').value.trim();
    const midName = document.getElementById('inp-midname').value.trim();
    // const user = {
    //   organizationName: orgName, organizationCode: orgCode,
    //   email, firstName, lastName,
    //   fullname: `${firstName} ${lastName}`,
    //   dob:    document.getElementById('inp-dob').value,
    //   gender: document.getElementById('inp-gender').value,
    //   phone:  document.getElementById('inp-phone').value.trim(),
    //   state:  document.getElementById('inp-state').value,
    //   year:   document.getElementById('inp-year').value,
    //   department: document.getElementById('inp-course').value.trim(),
    //   password: pass,
    //   date_created: new Date().toLocaleTimeString() + '  ' + new Date().toLocaleDateString() 
    // };

    const data = document.getElementById("formData");
    const fullname = lastName + " " + midName + " " + firstName;
    const form = new FormData(data);
    form.append("fullname", fullname);
    form.append("date_created", new Date().toLocaleTimeString() + '  ' + new Date().toLocaleDateString());
    const api = await fetch("/cbt/ansofra/api/Enter/Data", {
        method:"POST",
        body:form
        // headers:{'Content-type':'application/json'},
        // body:JSON.stringify(user)
    });

    const result = await api.json();
    console.log(result);
    if(result.status==="success"){
      showAlert('reg-success','Account created successfully! Redirecting to login…','success');
      setTimeout(() => window.location.href = '/cbt/ansofra/user/login', 5000);
    }
    else if(result.status==="fail"){
        showAlert('reg-alert','The department is not available.','error'); return;
    }
    else{
      showAlert('reg-alert','Error occur while trying to login try agan later','error'); return;
    }
  }