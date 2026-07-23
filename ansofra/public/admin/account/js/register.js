document.addEventListener("DOMContentLoaded", function(){
      const getEmail = localStorage.getItem("cbt-email-otp");
      document.getElementById("verified-email-display").textContent=getEmail;
      // console.log(getEmail);
      if(!getEmail){
        window.location.href="/cbt/ansofra/";
        return;
      }
  })
  function checkAll(){
    // event.preventDefault();
    const pwd = document.getElementById("f-pass").value;
    const com_pwd = document.getElementById("f-confirm").value;
    const email = document.getElementById("verified-email-display").textContent;
    const portal_name = document.getElementById("f-portal").value;
    const organization_type= document.getElementById("t-portal").value;
    const organization_description = document.getElementById("des-portal").value;
    // const username = document.getElementById("f-user").value;
    const phone_num = document.getElementById("phone-num").value;
    const fullname =  document.getElementById("f-name").value;
  //   console.log({
  //     fullname:fullname,
  //     pwd:pwd,
  //     email:email,
  //     org: portal_name,
  //     org_type :organization_type,
  //     phone:phone_num,
  //     com_pwd:com_pwd,
  // })
    if(!pwd || !com_pwd || !email || !portal_name || !organization_type || !phone_num || !fullname || !organization_description){
        alert("All fields required");
    }else if(pwd!=com_pwd){
        document.getElementById("e-confirm").style.display="block";
    }else{
       processData();
    }
  }

  async function processData(){
    const email = document.getElementById("verified-email-display").textContent;
    event.preventDefault();
    const data = document.getElementById("reg-form");
    const form = new FormData(data);
    form.append("email", email);
    form.append("date_created", new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString())
    const api = await fetch("/cbt/ansofra/apiadmin/register", {
      method:"POST",
      body:form
    });

    const response = await api.json();
    if(response.status==="failed"){
      // console.log(response);
      alert("Error occur try again later");
    }else{
      // alert("account created successfully");
      setTimeout(()=>{
        // window.location.href="/cbt/ansofra/admin/login";
        document.getElementById("s-success").style.display="flex";
        document.getElementById("s-reg").style.display="none";
        localStorage.clear();
      }, 1500)
    }
  }