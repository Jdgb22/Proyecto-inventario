import{b as C,u as z,a as B}from"./workers.D6-2HkML.js";import{g as N}from"./negocios.CJsdwGT-.js";import{g as M}from"./auth.CZfUohym.js";import"./supabase.ywjuSTR4.js";import"./empresas.fLsMLf0D.js";let E=[],i=[],p="",f="";async function A(){try{await M()||window.location.replace("/")}catch{}}A();const D=document.getElementById("file-input"),u=document.getElementById("drop-zone"),y=document.getElementById("loading-msg"),I=document.getElementById("preview-section"),w=document.getElementById("preview-list"),m=document.getElementById("btn-confirm"),c=document.getElementById("result-msg"),_=document.getElementById("worker-negocio"),x=document.getElementById("worker-mes"),H=document.getElementById("worker-corte");async function V(){try{const o=await N(),s=document.getElementById("worker-negocio");s&&(s.innerHTML='<option value="">Selecciona el negocio</option>'+o.map(a=>`<option value="${a.nombre}">${a.nombre}</option>`).join(""))}catch{}}V();u?.addEventListener("dragover",o=>{o.preventDefault(),u.style.borderColor="#3b82f6"});u?.addEventListener("dragleave",()=>{u.style.borderColor="#cbd5e1"});u?.addEventListener("drop",o=>{o.preventDefault(),o.dataTransfer?.files.length&&$(o.dataTransfer.files[0])});D?.addEventListener("change",o=>{o.target.files?.length&&$(o.target.files[0])});async function $(o){p=_.value.trim();const s=H.value;if(f=x.value.trim()?`${x.value.trim()}-${s}`:"",!p||!f){alert("Selecciona Negocio, Mes y Día de Corte.");return}y.style.display="block",I.style.display="none";try{E=await C(p,f);const a=new FileReader;a.onload=d=>{try{const n=window.XLSX;if(!n)throw new Error("Motor de Excel aún cargando. Intenta otra vez.");const r=new Uint8Array(d.target.result),t=n.read(r,{type:"array"}),e=n.utils.sheet_to_json(t.Sheets[t.SheetNames[0]],{defval:""});F(e)}catch(n){alert("Error procesando Excel: "+(n.message||"Archivo corrupto.")),y.style.display="none"}},a.readAsArrayBuffer(o)}catch(a){alert(a.message),y.style.display="none"}}function F(o){w.innerHTML="",i=o.map(t=>{const e={};Object.keys(t).forEach(g=>e[g.toLowerCase().trim()]=t[g]);const l=String(e.nombre||"").trim(),v=String(e.documento||e.cédula||e.cedula||e.doc||"").trim(),T=e.horas_extras??e["horas extras"]??e.extras??e.he??e["hora extra"]??e.ext??0,S=parseFloat(T)||0,j=e.horas_trabajadas??e["horas trabajadas"]??e.horas??e.ht??0,L=parseFloat(j)||0,k=parseFloat(e.deuda||0),b=E.find(g=>String(g.documento).trim()===v),h=l!==""&&v!=="";return{dbId:b?.id,nombre:l||"SIN NOMBRE",documento:v||"SIN CÉDULA",tel:e.teléfono||e.telefono||"",cargo:e.cargo||"",horasTrabajadas:L,extras:S,deuda:k,isValid:h,status:h?b?"status-update":"status-new":"status-error",statusText:h?b?"Existente":"Nuevo":"Omitido"}}),i.forEach(t=>{const e=document.createElement("div");e.className="worker-preview-card",t.isValid?e.innerHTML=`
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
            `),w.appendChild(e)});const s=i.filter(t=>!t.isValid).length,a=i.filter(t=>t.isValid).length,d=i.filter(t=>t.isValid).reduce((t,e)=>t+e.extras,0);i.filter(t=>t.isValid).reduce((t,e)=>t+e.horasTrabajadas,0);const n=i.filter(t=>t.isValid).reduce((t,e)=>t+e.deuda,0),r=document.createElement("div");r.style.background="linear-gradient(135deg, #10b981 0%, #059669 100%)",r.style.color="white",r.style.padding="20px 24px",r.style.borderRadius="16px",r.style.marginTop="24px",r.style.display="flex",r.style.justifyContent="space-between",r.style.alignItems="center",r.innerHTML=`
           <div>
             <h3 style="margin:0; font-size:1.15rem; font-weight:800;">Resumen del Archivo</h3>
             <p style="margin:4px 0 0 0; opacity:0.9; font-size:0.9rem;">${a} trabajadores válidos ${s>0?'<strong style="color:#fee2e2;">('+s+" errores omitidos)</strong>":""}</p>
           </div>
           <div style="display:flex; gap: 24px; text-align:right;">
             <div>
               <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; opacity:0.9;">Total Extras</div>
               <div style="font-size:1.4rem; font-weight:800; letter-spacing:-0.03em;">${d} <span style="font-size:0.9rem; font-weight:600; opacity:0.9;">hrs</span></div>
             </div>
             <div>
               <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; opacity:0.9;">Total Deudas</div>
               <div style="font-size:1.4rem; font-weight:800; letter-spacing:-0.03em;">$${n.toLocaleString("es-CO")}</div>
             </div>
           </div>
        `,w.appendChild(r),y.style.display="none",I.style.display="block"}m?.addEventListener("click",async()=>{m.disabled=!0,c.textContent="Sincronizando nómina...";let o=0,s=0,a="";const d=i.filter(r=>r.isValid);if(d.length===0){c.textContent="No hay ningún trabajador válido para sincronizar. Todos están omitidos.",c.style.color="#ef4444",m.disabled=!1;return}const n=20;for(let r=0;r<d.length;r+=n){const t=d.slice(r,r+n);await Promise.all(t.map(async e=>{try{const l={nombre:e.nombre,documento:e.documento,telefono:e.tel,cargo:e.cargo,horas_trabajadas:e.horasTrabajadas,horas_extras:e.extras,deuda:e.deuda,negocio:p,mes:f};e.dbId?await z(e.dbId,l):await B(l),o++}catch(l){s++,a||(a=l.message||"Error desconocido BD")}}))}if(s>0){c.textContent=`Atención: ${o} guardados, pero fallaron ${s} por error: ${a}`,c.style.color="#ef4444",m.disabled=!1;return}c.textContent=`✓ ¡Sincronizado! ${o} trabajadores procesados.`,c.style.color="#059669",setTimeout(()=>window.location.replace("/reportes_trabajadores"),2e3)});
