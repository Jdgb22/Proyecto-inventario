import{g as d,a as m}from"./auth.B1nicQET.js";import{c as g,g as u,t as v,u as p}from"./empresas.DJ8cCqCm.js";async function E(){const e=await d();return e?await m(e.user.id)!=="superadmin"?(window.location.replace("/init"),!1):!0:(window.location.replace("/"),!1)}function c(e,t=!1){const a=document.getElementById("toast");a.textContent=e,a.className=`toast${t?" error":""}`,requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>a.classList.remove("show"),3500)}function y(e,t){return[{key:"modulo_inventario",label:"📦 Inventario"},{key:"modulo_trabajadores",label:"👷 Nómina"},{key:"modulo_personal",label:"🧑‍💼 Personal"},{key:"modulo_reportes",label:"📊 Reportes"},{key:"modulo_pagos",label:"💳 Pagos"},{key:"modulo_subida_masiva",label:"📤 Subida Masiva"}].map(({key:s,label:n})=>{const o=!!e[s];return`<span
            class="toggle-item${o?" active":""}"
            data-empresa="${t}"
            data-flag="${s}"
            data-active="${o}"
            title="${o?"Desactivar":"Activar"} módulo"
          >${n}</span>`}).join("")}function f(e){const t=e.planes_empresa?.[0],a=`plan-${e.plan}`,s=e.plan.charAt(0).toUpperCase()+e.plan.slice(1),n=new Date(e.created_at).toLocaleDateString("es-CO");return`
          <div class="empresa-card${e.activo?"":" card-inactive"}" id="card-${e.id}">
            <div class="card-header">
              <div>
                <div class="card-title">${e.nombre}</div>
                <div class="card-email">${e.email_contacto||"Sin correo"} · Desde ${n}</div>
              </div>
              <span class="plan-badge ${a}">${s}</span>
            </div>

            ${t?`
              <div class="toggle-row" id="flags-${e.id}">
                ${y(t,e.id)}
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
          </div>
        `}function b(e){document.getElementById("stat-total").textContent=String(e.length),document.getElementById("stat-activas").textContent=String(e.filter(t=>t.activo).length),document.getElementById("stat-enterprise").textContent=String(e.filter(t=>t.plan==="enterprise").length),document.getElementById("stat-pro").textContent=String(e.filter(t=>t.plan==="pro").length)}async function i(){const e=document.getElementById("empresas-grid");try{const t=await u();if(b(t),!t.length){e.innerHTML='<div class="center-msg">No hay empresas registradas aún.<br>Crea una con el botón "+ Nueva Empresa".</div>';return}e.innerHTML=t.map(f).join(""),h()}catch(t){e.innerHTML=`<div class="center-msg" style="color:#f87171;">Error al cargar empresas: ${t.message}</div>`}}function h(){document.querySelectorAll(".empresa-toggle").forEach(e=>{e.addEventListener("change",async t=>{const a=t.target,s=a.dataset.empresaId;try{await v(s,a.checked);const n=document.getElementById(`card-${s}`);n&&n.classList.toggle("card-inactive",!a.checked);const r=a.closest(".main-toggle-row")?.querySelector(".main-toggle-label");r&&(r.textContent=a.checked?"✅ Empresa activa":"⛔ Empresa inactiva"),c(a.checked?"✅ Empresa activada":"⛔ Empresa desactivada")}catch(n){c("Error: "+n.message,!0),a.checked=!a.checked}})}),document.querySelectorAll(".toggle-item").forEach(e=>{e.addEventListener("click",async()=>{const t=e,a=t.dataset.empresa,s=t.dataset.flag,n=t.dataset.active==="true",o=!n;t.dataset.active=String(o),t.classList.toggle("active",o),t.title=o?"Desactivar módulo":"Activar módulo";try{await p(a,{[s]:o}),c(o?"✅ Módulo activado":"🔒 Módulo desactivado")}catch(r){t.dataset.active=String(n),t.classList.toggle("active",n),c("Error: "+r.message,!0)}})})}function w(){const e=document.getElementById("modal-overlay"),t=document.getElementById("btn-nueva-empresa"),a=document.getElementById("btn-cancelar"),s=document.getElementById("btn-crear");t.addEventListener("click",()=>e.classList.add("open")),a.addEventListener("click",()=>e.classList.remove("open")),e.addEventListener("click",n=>{n.target===e&&e.classList.remove("open")}),s.addEventListener("click",async()=>{const n=document.getElementById("inp-nombre").value.trim(),o=document.getElementById("inp-email").value.trim(),r=document.getElementById("sel-plan").value;if(!n){c("⚠️ El nombre es obligatorio",!0);return}s.disabled=!0,s.textContent="Creando...";try{await g(n,o,r),e.classList.remove("open"),document.getElementById("inp-nombre").value="",document.getElementById("inp-email").value="",c("🎉 Empresa creada exitosamente"),await i()}catch(l){c("Error: "+l.message,!0)}finally{s.disabled=!1,s.textContent="Crear Empresa"}})}async function $(){await E()&&(w(),await i())}$();
