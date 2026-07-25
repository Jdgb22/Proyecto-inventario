import{g as E,a as $}from"./auth.CZfUohym.js";import{g as w,b as v}from"./inventory.C9Dxuz58.js";import{g as C}from"./negocios.CJsdwGT-.js";import"./supabase.ywjuSTR4.js";import"./empresas.fLsMLf0D.js";let m=null,p=null,b=[];const u=document.getElementById("report-negocio"),y=document.getElementById("report-mes");async function S(){const o=await E();if(!o){window.location.replace("/");return}const r=await $(o.user.id);if(r!=="admin"&&r!=="superadmin"){window.location.replace("/init");return}const e=new Date;y.value=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`;try{b=await v();const n=await C();u&&(u.innerHTML='<option value="GLOBAL">Todos los Negocios (Global)</option>'+n.map(a=>`<option value="${a.nombre}">${a.nombre}</option>`).join(""))}catch{}}async function I(){const o=u.value,r=y.value,e=document.getElementById("no-data-msg"),n=document.getElementById("report-content");if(!(!o||!r))try{const a=await w(o,r);if(a.length===0){e.innerHTML=`No se encontraron datos para <strong>${o}</strong> en <strong>${r}</strong>.`,e.style.display="block",n.style.display="none";return}e.style.display="none",n.style.display="block";const c=new Map;a.forEach(t=>{const s=b.find(l=>l.codigo===t.codigo),g=s?Number(s.precio):0,h=s?s.nombre:t.nombre,f=s?s.categoria||"Sin Categoría":"S/C",i=Number(t.cantidad)||0;if(c.has(t.codigo)){const l=c.get(t.codigo);l.cantidad+=i,l.total+=i*g}else c.set(t.codigo,{codigo:t.codigo,nombre:h,categoria:f,precio:g,cantidad:i,total:i*g})});const d=Array.from(c.values());B(d)}catch(a){e.textContent="Error: "+a.message}}function B(o){m&&m.destroy(),p&&p.destroy();let r=0,e=0;const n={};o.forEach(t=>{r+=t.total,e+=t.cantidad,n[t.categoria]=(n[t.categoria]||0)+t.total}),document.getElementById("val-total-prods").textContent=o.length.toLocaleString(),document.getElementById("val-total-units").textContent=e.toLocaleString(),document.getElementById("val-total-money").textContent=`$${r.toLocaleString("es-CO")}`;const a=window.Chart;m=new a(document.getElementById("chart-pie-cats"),{type:"doughnut",data:{labels:Object.keys(n),datasets:[{data:Object.values(n),backgroundColor:["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#64748b"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}});const c=[...o].sort((t,s)=>s.total-t.total).slice(0,5);p=new a(document.getElementById("chart-bar-top"),{type:"bar",data:{labels:c.map(t=>t.nombre),datasets:[{label:"Valor en Pesos",data:c.map(t=>t.total),backgroundColor:"#3b82f6",borderRadius:8}]},options:{responsive:!0,maintainAspectRatio:!1,indexAxis:"y",plugins:{legend:{display:!1}}}});const d=document.getElementById("report-table-div");d.innerHTML=`
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Unidades</th>
                <th>Costo Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${o.map(t=>`
                <tr>
                  <td><span class="badge-code">${t.codigo}</span></td>
                  <td><strong>${t.nombre}</strong><br/><small style="color:#64748b;">${t.categoria}</small></td>
                  <td>${t.cantidad.toLocaleString()} und.</td>
                  <td>$${Number(t.precio).toLocaleString()}</td>
                  <td><strong>$${t.total.toLocaleString("es-CO")}</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `}document.getElementById("btn-generate")?.addEventListener("click",I);S();
