import{g as b,a as y}from"./auth.CaIV8qIb.js";import{g as h,b as f}from"./inventory.hhiGff1d.js";import{g as $}from"./negocios.DD7rLW4X.js";import"./supabase.DhieRUgU.js";let i=null,d=null,m=[];const g=document.getElementById("report-negocio"),p=document.getElementById("report-mes");async function E(){const e=await b();if(!e){window.location.replace("/");return}if(await y(e.user.id)!=="admin"){window.location.replace("/init");return}const n=new Date;p.value=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`;try{m=await f();const o=await $();g&&(g.innerHTML=o.map(a=>`<option value="${a.nombre}">${a.nombre}</option>`).join(""))}catch(o){console.error(o)}}async function w(){const e=g.value,r=p.value,n=document.getElementById("no-data-msg"),o=document.getElementById("report-content");if(!(!e||!r))try{const a=await h(e,r);if(a.length===0){n.innerHTML=`No se encontraron datos para <strong>${e}</strong> en <strong>${r}</strong>.`,n.style.display="block",o.style.display="none";return}n.style.display="none",o.style.display="block";const l=a.map(s=>{const t=m.find(u=>u.codigo===s.codigo),c=t?t.precio:0;return{codigo:s.codigo,nombre:t?t.nombre:s.nombre,categoria:t?t.categoria||"Sin Categoría":"S/C",precio:c,cantidad:s.cantidad||0,total:(s.cantidad||0)*c}});C(l)}catch(a){n.textContent="Error: "+a.message}}function C(e){i&&i.destroy(),d&&d.destroy();let r=0,n=0;const o={};e.forEach(t=>{r+=t.total,n+=t.cantidad,o[t.categoria]=(o[t.categoria]||0)+t.total}),document.getElementById("val-total-prods").textContent=e.length.toLocaleString(),document.getElementById("val-total-units").textContent=n.toLocaleString(),document.getElementById("val-total-money").textContent=`$${r.toLocaleString("es-CO")}`;const a=window.Chart;i=new a(document.getElementById("chart-pie-cats"),{type:"doughnut",data:{labels:Object.keys(o),datasets:[{data:Object.values(o),backgroundColor:["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#64748b"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}});const l=[...e].sort((t,c)=>c.total-t.total).slice(0,5);d=new a(document.getElementById("chart-bar-top"),{type:"bar",data:{labels:l.map(t=>t.nombre),datasets:[{label:"Valor en Pesos",data:l.map(t=>t.total),backgroundColor:"#3b82f6",borderRadius:8}]},options:{responsive:!0,maintainAspectRatio:!1,indexAxis:"y",plugins:{legend:{display:!1}}}});const s=document.getElementById("report-table-div");s.innerHTML=`
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
              ${e.map(t=>`
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
        `}document.getElementById("btn-generate")?.addEventListener("click",w);E();
