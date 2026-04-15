import{g as v}from"./auth.CZfUohym.js";import{c as p,u as E,g as y,t as b,a as f,d as I}from"./empresas.fLsMLf0D.js";import"./supabase.ywjuSTR4.js";async function h(){const e=await v();return e?e.user.id!=="b5ae7fc1-76e7-4a00-9f68-b50fcfdd9ff3"?(window.location.replace("/init"),!1):!0:(window.location.replace("/"),!1)}function i(e,t=!1){const a=document.getElementById("toast");a.textContent=e,a.className=`toast${t?" error":""}`,requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>a.classList.remove("show"),3500)}function L(e,t){return[{key:"modulo_inventario",label:"📦 Inventario"},{key:"modulo_trabajadores",label:"👷 Nómina"},{key:"modulo_personal",label:"🧑‍💼 Personal"},{key:"modulo_reportes",label:"📊 Reportes"},{key:"modulo_pagos",label:"💳 Pagos"},{key:"modulo_subida_masiva",label:"📤 Subida Masiva"}].map(({key:n,label:o})=>{const c=!!e[n];return`<span
            class="toggle-item${c?" active":""}"
            data-empresa="${t}"
            data-flag="${n}"
            data-active="${c}"
            title="${c?"Desactivar":"Activar"} módulo"
          >${o}</span>`}).join("")}function B(e){const t=e.planes_empresa?.[0],a=`plan-${e.plan}`,n=e.plan.charAt(0).toUpperCase()+e.plan.slice(1),o=new Date(e.created_at).toLocaleDateString("es-CO");return`
          <div class="empresa-card${e.activo?"":" card-inactive"}" id="card-${e.id}">
            <div class="card-header">
              <div>
                <div class="card-title">${e.nombre}</div>
                <div class="card-email">${e.email_contacto||"Sin correo"} · Desde ${o}</div>
              </div>
              <span class="plan-badge ${a}">${n}</span>
            </div>

            ${t?`
              <div class="toggle-row" id="flags-${e.id}">
                ${L(t,e.id)}
              </div>
            `:'<div style="color:#475569;font-size:0.8rem;margin-bottom:16px;">Sin plan configurado</div>'}

            <div class="main-toggle-row">
              <span class="main-toggle-label">${e.activo?"✅ Empresa activa":"⛔ Empresa inactiva"}</span>
              <label class="switch">
                <input
                  type="checkbox"
                  ${e.activo?"checked":""}
                  data-empresa-id="${e.id}"
                  class="empresa-toggle"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="card-actions">
              <button class="btn-edit"
                data-id="${e.id}"
                data-nombre="${e.nombre}"
                data-email="${e.email_contacto||""}"
                data-plan="${e.plan}"
              >
                ✏️ Editar
              </button>
              <button class="btn-copy-link" data-id="${e.id}" title="Copiar enlace de registro para esta empresa">
                🔗 Copiar Acceso
              </button>
              <button class="btn-delete" data-id="${e.id}" data-nombre="${e.nombre}">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        `}function $(e){document.getElementById("stat-total").textContent=String(e.length),document.getElementById("stat-activas").textContent=String(e.filter(t=>t.activo).length),document.getElementById("stat-enterprise").textContent=String(e.filter(t=>t.plan==="enterprise").length),document.getElementById("stat-pro").textContent=String(e.filter(t=>t.plan==="pro").length)}async function r(){const e=document.getElementById("empresas-grid");try{const t=await y();if($(t),!t.length){e.innerHTML='<div class="center-msg">No hay empresas registradas aún.<br>Crea una con el botón "+ Nueva Empresa".</div>';return}e.innerHTML=t.map(B).join(""),k()}catch(t){e.innerHTML=`<div class="center-msg" style="color:#f87171;">Error al cargar empresas: ${t.message}</div>`}}function k(){document.querySelectorAll(".empresa-toggle").forEach(t=>{t.addEventListener("change",async a=>{const n=a.target,o=n.dataset.empresaId;try{await b(o,n.checked);const c=document.getElementById(`card-${o}`);c&&c.classList.toggle("card-inactive",!n.checked);const s=n.closest(".main-toggle-row")?.querySelector(".main-toggle-label");s&&(s.textContent=n.checked?"✅ Empresa activa":"⛔ Empresa inactiva"),i(n.checked?"✅ Empresa activada":"⛔ Empresa desactivada")}catch(c){i("Error: "+c.message,!0),n.checked=!n.checked}})}),document.querySelectorAll(".toggle-item").forEach(t=>{t.addEventListener("click",async()=>{const a=t,n=a.dataset.empresa,o=a.dataset.flag,c=a.dataset.active==="true",d=!c;a.dataset.active=String(d),a.classList.toggle("active",d),a.title=d?"Desactivar módulo":"Activar módulo";try{await f(n,{[o]:d}),i(d?"✅ Módulo activado":"🔒 Módulo desactivado")}catch(s){a.dataset.active=String(c),a.classList.toggle("active",c),i("Error: "+s.message,!0)}})}),document.querySelectorAll(".btn-copy-link").forEach(t=>{t.addEventListener("click",async()=>{const n=t.dataset.id,o=`${window.location.origin}/registro?empresa=${n}`;try{await navigator.clipboard.writeText(o),i("🔗 Enlace copiado al portapapeles")}catch{prompt("Copia este enlace y envíalo al cliente:",o)}})}),document.querySelectorAll(".btn-edit").forEach(t=>{t.addEventListener("click",()=>{const a=t;document.getElementById("edit-empresa-id").value=a.dataset.id,document.getElementById("edit-nombre").value=a.dataset.nombre,document.getElementById("edit-email").value=a.dataset.email;const n=document.getElementById("edit-plan");n.value=a.dataset.plan,document.getElementById("modal-edit-overlay").classList.add("open")})});let e="";document.querySelectorAll(".btn-delete").forEach(t=>{t.addEventListener("click",()=>{const a=t;e=a.dataset.id,document.getElementById("confirm-msg").textContent=`¿Eliminar "${a.dataset.nombre}"? Esta acción es permanente y borrará todos sus datos.`,document.getElementById("confirm-overlay").classList.add("open")})}),document.getElementById("btn-confirm-cancel").addEventListener("click",()=>{document.getElementById("confirm-overlay").classList.remove("open")}),document.getElementById("btn-confirm-delete").addEventListener("click",async()=>{if(e)try{await I(e),document.getElementById("confirm-overlay").classList.remove("open"),i("🗑️ Empresa eliminada"),await r()}catch(t){i("Error: "+t.message,!0)}})}function w(){const e=document.getElementById("modal-overlay"),t=document.getElementById("btn-nueva-empresa"),a=document.getElementById("btn-cancelar"),n=document.getElementById("btn-crear");t.addEventListener("click",()=>e.classList.add("open")),a.addEventListener("click",()=>e.classList.remove("open")),e.addEventListener("click",s=>{s.target===e&&e.classList.remove("open")}),n.addEventListener("click",async()=>{const s=document.getElementById("inp-nombre").value.trim(),l=document.getElementById("inp-email").value.trim(),m=document.getElementById("sel-plan").value;if(!s){i("⚠️ El nombre es obligatorio",!0);return}n.disabled=!0,n.textContent="Creando...";try{await p(s,l,m),e.classList.remove("open"),document.getElementById("inp-nombre").value="",document.getElementById("inp-email").value="",i("🎉 Empresa creada exitosamente"),await r()}catch(u){i("Error: "+u.message,!0)}finally{n.disabled=!1,n.textContent="Crear Empresa"}});const o=document.getElementById("modal-edit-overlay"),c=document.getElementById("btn-edit-cancelar"),d=document.getElementById("btn-edit-guardar");c.addEventListener("click",()=>o.classList.remove("open")),o.addEventListener("click",s=>{s.target===o&&o.classList.remove("open")}),d.addEventListener("click",async()=>{const s=document.getElementById("edit-empresa-id").value,l=document.getElementById("edit-nombre").value.trim(),m=document.getElementById("edit-email").value.trim(),u=document.getElementById("edit-plan").value;if(!l){i("⚠️ El nombre es obligatorio",!0);return}d.disabled=!0,d.textContent="Guardando...";try{await E(s,{nombre:l,email_contacto:m,plan:u}),o.classList.remove("open"),i("✅ Empresa actualizada"),await r()}catch(g){i("Error: "+g.message,!0)}finally{d.disabled=!1,d.textContent="Guardar Cambios"}})}async function C(){await h()&&(w(),await r())}C();
