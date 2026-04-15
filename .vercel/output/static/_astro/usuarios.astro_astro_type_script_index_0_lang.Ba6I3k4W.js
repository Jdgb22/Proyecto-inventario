import{c as y,s as u}from"./supabase.ywjuSTR4.js";import{g as E,a as p}from"./auth.CZfUohym.js";import{b as f}from"./empresas.fLsMLf0D.js";const I="https://dlmisjlycdidktkgqtgt.supabase.co",B="sb_publishable_Eyj9Rjsnw1eOgfrGn8nHOA_81m4U41s",b=y(I,B,{auth:{persistSession:!1,autoRefreshToken:!1}});let l="todos",c=[],i="";async function w(){const e=await E();if(!e)return window.location.replace("/"),!1;const a=await p(e.user.id);return a!=="admin"&&a!=="superadmin"?(window.location.replace("/init"),!1):!0}function s(e,a=!1){const t=document.getElementById("toast");t.textContent=e,t.className=`toast${a?" error":""}`,requestAnimationFrame(()=>t.classList.add("show")),setTimeout(()=>t.classList.remove("show"),3500)}function h(e){document.getElementById("stat-total").textContent=String(e.length),document.getElementById("stat-admins").textContent=String(e.filter(a=>a.role==="admin").length),document.getElementById("stat-workers").textContent=String(e.filter(a=>a.role==="trabajador").length),document.getElementById("stat-activos").textContent=String(e.filter(a=>a.activo!==!1).length)}function g(){const e=document.getElementById("users-grid"),a=l==="todos"?c:c.filter(t=>t.role===l);if(!a.length){e.innerHTML=`<div class="empty-msg">No hay usuarios${l!=="todos"?" con ese rol":""} en tu empresa.</div>`;return}e.innerHTML=a.map(t=>{const o=t.role==="admin",d=t.activo!==!1,n=t.nombre||"Usuario Nuevo",r=n.charAt(0).toUpperCase()||(t.email||"?")[0].toUpperCase(),v=t.email?.length>28?t.email.slice(0,26)+"…":t.email||"Sin email";return`
            <div class="user-card${d?"":" inactive"}" id="ucard-${t.id}">
              <div class="card-top">
                <div class="user-avatar${o?"":" avatar-trabajador"}">${r}</div>
                <span class="role-badge ${o?"badge-admin":"badge-trabajador"}">
                  ${o?"👑 Admin":"👷 Trabajador"}
                </span>
              </div>

              <div class="card-body">
                <div class="user-email" style="font-size:1rem;color:#f1f5f9;margin-bottom:2px;">${n}</div>
                <div class="user-meta" style="margin-top:0;">${v}</div>
                <div class="user-meta">
                  <span class="status-dot ${d?"dot-active":"dot-inactive"}"></span>
                  ${d?"Activo":"Inactivo"}
                </div>
              </div>

              <div class="card-actions">
                <button class="btn-action btn-edit-user"
                  data-id="${t.id}"
                  data-email="${t.email||""}"
                  data-nombre="${t.nombre||""}"
                  data-role="${t.role}"
                  data-activo="${d}"
                  onclick="openEdit(this)"
                >
                  ✏️ Editar
                </button>
                <button class="btn-action btn-delete-user"
                  data-id="${t.id}"
                  onclick="deleteUser(this)"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          `}).join("")}window.deleteUser=async function(e){if(!confirm("⚠️ ¿Seguro que deseas eliminar a este usuario permanentemente? Perderá el acceso y desaparecerá de la lista."))return;const a=e.dataset.id;e.disabled=!0;try{const{error:t}=await u.from("profiles").delete().eq("id",a).eq("empresa_id",i);if(t)throw t;s("🗑️ Usuario eliminado correctamente"),await m()}catch(t){s("Error: "+t.message,!0),e.disabled=!1}};document.getElementById("btn-open-add").addEventListener("click",()=>{document.getElementById("add-nombre").value="",document.getElementById("add-email").value="",document.getElementById("add-password").value="",document.getElementById("modal-add").classList.add("open")});document.getElementById("btn-cancel-add").addEventListener("click",()=>{document.getElementById("modal-add").classList.remove("open")});document.getElementById("modal-add").addEventListener("click",e=>{e.target===document.getElementById("modal-add")&&document.getElementById("modal-add").classList.remove("open")});document.getElementById("btn-save-add").addEventListener("click",async()=>{const e=document.getElementById("add-nombre").value.trim(),a=document.getElementById("add-email").value.trim(),t=document.getElementById("add-password").value,o=document.getElementById("add-role").value,d=document.getElementById("btn-save-add");if(!e||!a||t.length<6){s("⚠️ Revisa los datos (Contraseña mín. 6 caracteres)",!0);return}d.disabled=!0,d.textContent="Creando...";try{const{data:n,error:r}=await b.auth.signUp({email:a,password:t,options:{data:{empresa_id:i,role:o,nombre:e}}});if(r)throw r;document.getElementById("modal-add").classList.remove("open"),s("✅ Usuario creado exitosamente"),await m()}catch(n){s("Error: "+n.message,!0)}finally{d.disabled=!1,d.textContent="Crear Usuario"}});window.openEdit=function(e){document.getElementById("edit-user-id").value=e.dataset.id,document.getElementById("modal-email-display").textContent=e.dataset.email||"Sin email",document.getElementById("edit-nombre").value=e.dataset.nombre||"",document.getElementById("edit-role").value=e.dataset.role,document.getElementById("edit-activo").value=e.dataset.activo,document.getElementById("modal-edit").classList.add("open")};document.getElementById("btn-cancel-modal").addEventListener("click",()=>{document.getElementById("modal-edit").classList.remove("open")});document.getElementById("modal-edit").addEventListener("click",e=>{e.target===document.getElementById("modal-edit")&&document.getElementById("modal-edit").classList.remove("open")});document.getElementById("btn-save-modal").addEventListener("click",async()=>{const e=document.getElementById("edit-user-id").value,a=document.getElementById("edit-nombre").value.trim(),t=document.getElementById("edit-role").value,o=document.getElementById("edit-activo").value==="true",d=document.getElementById("btn-save-modal");d.disabled=!0,d.textContent="Guardando...";try{const{error:n}=await u.from("profiles").update({nombre:a,role:t,activo:o}).eq("id",e).eq("empresa_id",i);if(n)throw n;document.getElementById("modal-edit").classList.remove("open"),s("✅ Usuario actualizado correctamente"),await m()}catch(n){s("Error: "+n.message,!0)}finally{d.disabled=!1,d.textContent="💾 Guardar cambios"}});document.querySelectorAll(".filter-tab").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".filter-tab").forEach(a=>a.classList.remove("active")),e.classList.add("active"),l=e.dataset.filter,g()})});async function m(){const e=document.getElementById("users-grid");try{const{data:a,error:t}=await u.from("profiles").select("id, email, nombre, role, activo").eq("empresa_id",i).order("role");if(t)throw t;c=a||[],h(c),g()}catch(a){e.innerHTML=`<div class="empty-msg" style="color:#f87171;">Error: ${a.message}</div>`}}async function L(){if(!await w())return;const a=await f();if(!a){window.location.replace("/init");return}i=a,await m()}L();
