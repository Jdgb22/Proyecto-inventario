import{g as E,a as $}from"./auth.CZfUohym.js";import{b as w,c as v}from"./inventory.DcRkva8j.js";import{g as C}from"./negocios.CJsdwGT-.js";import"./supabase.ywjuSTR4.js";import"./empresas.fLsMLf0D.js";let m=null,p=null,b=[];const u=document.getElementById("report-negocio"),y=document.getElementById("report-mes");async function S(){const o=await E();if(!o){window.location.replace("/");return}if(await $(o.user.id)!=="admin"){window.location.replace("/init");return}const n=new Date;y.value=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`;try{b=await v();const e=await C();u&&(u.innerHTML='<option value="GLOBAL">Todos los Negocios (Global)</option>'+e.map(a=>`<option value="${a.nombre}">${a.nombre}</option>`).join(""))}catch(e){console.error(e)}}async function I(){const o=u.value,s=y.value,n=document.getElementById("no-data-msg"),e=document.getElementById("report-content");if(!(!o||!s))try{const a=await w(o,s);if(a.length===0){n.innerHTML=`No se encontraron datos para <strong>${o}</strong> en <strong>${s}</strong>.`,n.style.display="block",e.style.display="none";return}n.style.display="none",e.style.display="block";const c=new Map;a.forEach(t=>{const r=b.find(i=>i.codigo===t.codigo),g=r?Number(r.precio):0,h=r?r.nombre:t.nombre,f=r?r.categoria||"Sin Categoría":"S/C",l=Number(t.cantidad)||0;if(c.has(t.codigo)){const i=c.get(t.codigo);i.cantidad+=l,i.total+=l*g}else c.set(t.codigo,{codigo:t.codigo,nombre:h,categoria:f,precio:g,cantidad:l,total:l*g})});const d=Array.from(c.values());B(d)}catch(a){n.textContent="Error: "+a.message}}function B(o){m&&m.destroy(),p&&p.destroy();let s=0,n=0;const e={};o.forEach(t=>{s+=t.total,n+=t.cantidad,e[t.categoria]=(e[t.categoria]||0)+t.total}),document.getElementById("val-total-prods").textContent=o.length.toLocaleString(),document.getElementById("val-total-units").textContent=n.toLocaleString(),document.getElementById("val-total-money").textContent=`$${s.toLocaleString("es-CO")}`;const a=window.Chart;m=new a(document.getElementById("chart-pie-cats"),{type:"doughnut",data:{labels:Object.keys(e),datasets:[{data:Object.values(e),backgroundColor:["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#64748b"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}});const c=[...o].sort((t,r)=>r.total-t.total).slice(0,5);p=new a(document.getElementById("chart-bar-top"),{type:"bar",data:{labels:c.map(t=>t.nombre),datasets:[{label:"Valor en Pesos",data:c.map(t=>t.total),backgroundColor:"#3b82f6",borderRadius:8}]},options:{responsive:!0,maintainAspectRatio:!1,indexAxis:"y",plugins:{legend:{display:!1}}}});const d=document.getElementById("report-table-div");d.innerHTML=`
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
