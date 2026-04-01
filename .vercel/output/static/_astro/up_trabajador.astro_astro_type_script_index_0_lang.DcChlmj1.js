import{b as T,u as k,a as z}from"./workers.DlH9FwVb.js";import{g as B}from"./negocios.DD7rLW4X.js";import{g as C}from"./auth.CaIV8qIb.js";import"./supabase.DhieRUgU.js";let x=[],l=[],f="",p="";async function j(){try{await C()||window.location.replace("/")}catch(o){console.warn("Auth check failed:",o)}}j();const N=document.getElementById("file-input"),g=document.getElementById("drop-zone"),y=document.getElementById("loading-msg"),I=document.getElementById("preview-section"),w=document.getElementById("preview-list"),m=document.getElementById("btn-confirm"),d=document.getElementById("result-msg"),A=document.getElementById("worker-negocio"),E=document.getElementById("negocios-list"),M=document.getElementById("worker-mes");async function D(){try{const o=await B();E&&(E.innerHTML=o.map(s=>`<option value="${s.nombre}">${s.nombre}</option>`).join(""))}catch(o){console.error(o)}}D();g?.addEventListener("dragover",o=>{o.preventDefault(),g.style.borderColor="#3b82f6"});g?.addEventListener("dragleave",()=>{g.style.borderColor="#cbd5e1"});g?.addEventListener("drop",o=>{o.preventDefault(),o.dataTransfer?.files.length&&$(o.dataTransfer.files[0])});N?.addEventListener("change",o=>{o.target.files?.length&&$(o.target.files[0])});async function $(o){if(f=A.value.trim(),p=M.value.trim(),!f||!p){alert("Selecciona Negocio y Mes.");return}y.style.display="block",I.style.display="none";try{x=await T(f,p);const s=new FileReader;s.onload=i=>{try{const n=window.XLSX;if(!n)throw new Error("Motor de Excel aún cargando. Intenta otra vez.");const c=new Uint8Array(i.target.result),r=n.read(c,{type:"array"}),t=n.utils.sheet_to_json(r.Sheets[r.SheetNames[0]],{defval:""});V(t)}catch(n){console.error(n),alert("Error procesando Excel: "+(n.message||"Archivo corrupto.")),y.style.display="none"}},s.readAsArrayBuffer(o)}catch(s){alert(s.message),y.style.display="none"}}function V(o){w.innerHTML="",l=o.map(t=>{const e={};Object.keys(t).forEach(u=>e[u.toLowerCase().trim()]=t[u]);const a=String(e.nombre||"").trim(),v=String(e.documento||e.cédula||e.cedula||e.doc||"").trim(),S=parseFloat(e.horas_extras||e.extras||0),L=parseFloat(e.deuda||0),b=x.find(u=>String(u.documento).trim()===v),h=a!==""&&v!=="";return{dbId:b?.id,nombre:a||"SIN NOMBRE",documento:v||"SIN CÉDULA",tel:e.teléfono||e.telefono||"",cargo:e.cargo||"",horas:S,deuda:L,isValid:h,status:h?b?"status-update":"status-new":"status-error",statusText:h?b?"Existente":"Nuevo":"Omitido"}}),l.forEach(t=>{const e=document.createElement("div");e.className="worker-preview-card",t.isValid?e.innerHTML=`
              <div>
                  <div class="worker-name">${t.nombre}</div>
                  <span class="worker-doc">${t.documento}</span>
              </div>
              <div style="font-size:0.85rem; color:#64748b;">${t.cargo||"-"}</div>
              <div style="font-size:0.85rem;">Extras: <strong>${t.horas}</strong></div>
              <div style="color:#ef4444; font-weight:700;">Deuda: $${t.deuda.toLocaleString()}</div>
              <div class="status-pill ${t.status}">${t.statusText}</div>
            `:(e.style.backgroundColor="#fef2f2",e.style.borderColor="#fca5a5",e.innerHTML=`
              <div>
                  <div class="worker-name" style="color:#b91c1c;">${t.nombre}</div>
                  <span class="worker-doc" style="background:#fee2e2; color:#991b1b;">${t.documento}</span>
              </div>
              <div style="font-size:0.85rem; color:#b91c1c;">Datos Incompletos</div>
              <div style="font-size:0.85rem;">-</div>
              <div>-</div>
              <div class="status-pill status-error">Omitido</div>
            `),w.appendChild(e)});const s=l.filter(t=>!t.isValid).length,i=l.filter(t=>t.isValid).length,n=l.filter(t=>t.isValid).reduce((t,e)=>t+e.horas,0),c=l.filter(t=>t.isValid).reduce((t,e)=>t+e.deuda,0),r=document.createElement("div");r.style.background="linear-gradient(135deg, #10b981 0%, #059669 100%)",r.style.color="white",r.style.padding="20px 24px",r.style.borderRadius="16px",r.style.marginTop="24px",r.style.display="flex",r.style.justifyContent="space-between",r.style.alignItems="center",r.innerHTML=`
           <div>
             <h3 style="margin:0; font-size:1.15rem; font-weight:800;">Resumen del Archivo</h3>
             <p style="margin:4px 0 0 0; opacity:0.9; font-size:0.9rem;">${i} trabajadores válidos ${s>0?'<strong style="color:#fee2e2;">('+s+" errores omitidos)</strong>":""}</p>
           </div>
           <div style="display:flex; gap: 24px; text-align:right;">
             <div>
               <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; opacity:0.9;">Total Extras</div>
               <div style="font-size:1.4rem; font-weight:800; letter-spacing:-0.03em;">${n} <span style="font-size:0.9rem; font-weight:600; opacity:0.9;">hrs</span></div>
             </div>
             <div>
               <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; opacity:0.9;">Total Deudas</div>
               <div style="font-size:1.4rem; font-weight:800; letter-spacing:-0.03em;">$${c.toLocaleString("es-CO")}</div>
             </div>
           </div>
        `,w.appendChild(r),y.style.display="none",I.style.display="block"}m?.addEventListener("click",async()=>{m.disabled=!0,d.textContent="Sincronizando nómina...";let o=0,s=0,i="";const n=l.filter(r=>r.isValid);if(n.length===0){d.textContent="No hay ningún trabajador válido para sincronizar. Todos están omitidos.",d.style.color="#ef4444",m.disabled=!1;return}const c=20;for(let r=0;r<n.length;r+=c){const t=n.slice(r,r+c);await Promise.all(t.map(async e=>{try{const a={nombre:e.nombre,documento:e.documento,telefono:e.tel,cargo:e.cargo,horas_extras:e.horas,deuda:e.deuda,negocio:f,mes:p};e.dbId?await k(e.dbId,a):await z(a),o++}catch(a){console.error("Error BD Trabajador:",a),s++,i||(i=a.message||"Error desconocido BD")}}))}if(s>0){d.textContent=`Atención: ${o} guardados, pero fallaron ${s} por error: ${i}`,d.style.color="#ef4444",m.disabled=!1;return}d.textContent=`✓ ¡Sincronizado! ${o} trabajadores procesados.`,d.style.color="#059669",setTimeout(()=>window.location.replace("/reportes_trabajadores"),2e3)});
