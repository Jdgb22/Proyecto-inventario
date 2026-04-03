import{b as C,u as z,a as N}from"./workers.pyYfWsXO.js";import{g as A}from"./negocios.DD7rLW4X.js";import{g as D}from"./auth.CaIV8qIb.js";import"./supabase.DhieRUgU.js";let I=[],d=[],p="",f="";async function M(){try{await D()||window.location.replace("/")}catch(o){console.warn("Auth check failed:",o)}}M();const _=document.getElementById("file-input"),u=document.getElementById("drop-zone"),y=document.getElementById("loading-msg"),$=document.getElementById("preview-section"),w=document.getElementById("preview-list"),m=document.getElementById("btn-confirm"),c=document.getElementById("result-msg"),H=document.getElementById("worker-negocio"),x=document.getElementById("negocios-list"),E=document.getElementById("worker-mes"),V=document.getElementById("worker-corte");async function F(){try{const o=await A();x&&(x.innerHTML=o.map(a=>`<option value="${a.nombre}">${a.nombre}</option>`).join(""))}catch(o){console.error(o)}}F();u?.addEventListener("dragover",o=>{o.preventDefault(),u.style.borderColor="#3b82f6"});u?.addEventListener("dragleave",()=>{u.style.borderColor="#cbd5e1"});u?.addEventListener("drop",o=>{o.preventDefault(),o.dataTransfer?.files.length&&T(o.dataTransfer.files[0])});_?.addEventListener("change",o=>{o.target.files?.length&&T(o.target.files[0])});async function T(o){p=H.value.trim();const a=V.value;if(f=E.value.trim()?`${E.value.trim()}-${a}`:"",!p||!f){alert("Selecciona Negocio, Mes y Día de Corte.");return}y.style.display="block",$.style.display="none";try{I=await C(p,f);const n=new FileReader;n.onload=l=>{try{const s=window.XLSX;if(!s)throw new Error("Motor de Excel aún cargando. Intenta otra vez.");const r=new Uint8Array(l.target.result),t=s.read(r,{type:"array"}),e=s.utils.sheet_to_json(t.Sheets[t.SheetNames[0]],{defval:""});O(e)}catch(s){console.error(s),alert("Error procesando Excel: "+(s.message||"Archivo corrupto.")),y.style.display="none"}},n.readAsArrayBuffer(o)}catch(n){alert(n.message),y.style.display="none"}}function O(o){w.innerHTML="",d=o.map(t=>{const e={};Object.keys(t).forEach(g=>e[g.toLowerCase().trim()]=t[g]);const i=String(e.nombre||"").trim(),v=String(e.documento||e.cédula||e.cedula||e.doc||"").trim(),j=e.horas_extras??e["horas extras"]??e.extras??e.he??e["hora extra"]??e.ext??0,S=parseFloat(j)||0,L=e.horas_trabajadas??e["horas trabajadas"]??e.horas??e.ht??0,k=parseFloat(L)||0,B=parseFloat(e.deuda||0),b=I.find(g=>String(g.documento).trim()===v),h=i!==""&&v!=="";return{dbId:b?.id,nombre:i||"SIN NOMBRE",documento:v||"SIN CÉDULA",tel:e.teléfono||e.telefono||"",cargo:e.cargo||"",horasTrabajadas:k,extras:S,deuda:B,isValid:h,status:h?b?"status-update":"status-new":"status-error",statusText:h?b?"Existente":"Nuevo":"Omitido"}}),d.forEach(t=>{const e=document.createElement("div");e.className="worker-preview-card",t.isValid?e.innerHTML=`
              <div>
                  <div class="worker-name">${t.nombre}</div>
                  <span class="worker-doc">${t.documento}</span>
              </div>
              <div style="font-size:0.85rem; color:#64748b;">${t.cargo||"-"}</div>
              <div style="font-size:0.85rem;">Horas Trab: <strong>${t.horasTrabajadas}</strong> | Extras: <strong>${t.extras}</strong></div>
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
            `),w.appendChild(e)});const a=d.filter(t=>!t.isValid).length,n=d.filter(t=>t.isValid).length,l=d.filter(t=>t.isValid).reduce((t,e)=>t+e.extras,0);d.filter(t=>t.isValid).reduce((t,e)=>t+e.horasTrabajadas,0);const s=d.filter(t=>t.isValid).reduce((t,e)=>t+e.deuda,0),r=document.createElement("div");r.style.background="linear-gradient(135deg, #10b981 0%, #059669 100%)",r.style.color="white",r.style.padding="20px 24px",r.style.borderRadius="16px",r.style.marginTop="24px",r.style.display="flex",r.style.justifyContent="space-between",r.style.alignItems="center",r.innerHTML=`
           <div>
             <h3 style="margin:0; font-size:1.15rem; font-weight:800;">Resumen del Archivo</h3>
             <p style="margin:4px 0 0 0; opacity:0.9; font-size:0.9rem;">${n} trabajadores válidos ${a>0?'<strong style="color:#fee2e2;">('+a+" errores omitidos)</strong>":""}</p>
           </div>
           <div style="display:flex; gap: 24px; text-align:right;">
             <div>
               <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; opacity:0.9;">Total Extras</div>
               <div style="font-size:1.4rem; font-weight:800; letter-spacing:-0.03em;">${l} <span style="font-size:0.9rem; font-weight:600; opacity:0.9;">hrs</span></div>
             </div>
             <div>
               <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; opacity:0.9;">Total Deudas</div>
               <div style="font-size:1.4rem; font-weight:800; letter-spacing:-0.03em;">$${s.toLocaleString("es-CO")}</div>
             </div>
           </div>
        `,w.appendChild(r),y.style.display="none",$.style.display="block"}m?.addEventListener("click",async()=>{m.disabled=!0,c.textContent="Sincronizando nómina...";let o=0,a=0,n="";const l=d.filter(r=>r.isValid);if(l.length===0){c.textContent="No hay ningún trabajador válido para sincronizar. Todos están omitidos.",c.style.color="#ef4444",m.disabled=!1;return}const s=20;for(let r=0;r<l.length;r+=s){const t=l.slice(r,r+s);await Promise.all(t.map(async e=>{try{const i={nombre:e.nombre,documento:e.documento,telefono:e.tel,cargo:e.cargo,horas_trabajadas:e.horasTrabajadas,horas_extras:e.extras,deuda:e.deuda,negocio:p,mes:f};e.dbId?await z(e.dbId,i):await N(i),o++}catch(i){console.error("Error BD Trabajador:",i),a++,n||(n=i.message||"Error desconocido BD")}}))}if(a>0){c.textContent=`Atención: ${o} guardados, pero fallaron ${a} por error: ${n}`,c.style.color="#ef4444",m.disabled=!1;return}c.textContent=`✓ ¡Sincronizado! ${o} trabajadores procesados.`,c.style.color="#059669",setTimeout(()=>window.location.replace("/reportes_trabajadores"),2e3)});
