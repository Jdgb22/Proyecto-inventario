import{g as v,a as w}from"./auth.CaIV8qIb.js";import{g as I}from"./workers.DlH9FwVb.js";import"./supabase.DhieRUgU.js";let r=[],i=null,c=null;const u=document.getElementById("rep-trab-msg"),b=document.getElementById("rep-trab-negocio"),g=document.getElementById("rep-trab-mes-desde"),f=document.getElementById("rep-trab-mes-hasta"),C=document.getElementById("btn-trab-aplicar"),p=document.getElementById("tabla-trab-mensual"),h=t=>{const e=String(t??"").trim();return e?/^\d{4}-\d{2}$/.test(e)?e:e.slice(0,7):""},y=t=>(t?.negocio||"General").trim();async function T(){const t=await v();return t?await w(t.user.id)!=="admin"?(window.location.replace("/init"),!1):!0:(window.location.replace("/"),!1)}async function $(){if(r=await I(),!r||r.length===0){u.textContent="No hay registros de trabajadores todavía.",u.style.display="block";return}const t=Array.from(new Set(r.map(y))).sort();b.innerHTML=t.map(o=>`<option value="${o}">${o}</option>`).join("");const e=r.map(o=>h(o.mes||o.created_at)).filter(o=>o).sort();e.length>0&&(g.value=e[0],f.value=e[e.length-1]),await E()}async function E(){if(!r.length)return;i&&i.destroy(),c&&c.destroy();const t=b.value,e=g.value,o=f.value,n={};r.forEach(a=>{if(y(a)!==t)return;const s=h(a.mes||a.created_at);!s||s<e||s>o||(n[s]||(n[s]={cantidad:0,salarioTotal:0}),n[s].cantidad+=1,n[s].salarioTotal+=Number(a.salario_base||0))});const l=Object.keys(n).sort();if(!l.length){p.innerHTML='<p class="msg">No hay datos para esta selección.</p>';return}p.innerHTML=`
          <table>
            <thead>
              <tr>
                <th>Periodo (Mes)</th>
                <th>Personal Activo</th>
                <th>Costo Total Nómina</th>
              </tr>
            </thead>
            <tbody>
              ${l.map(a=>`
                <tr>
                  <td><span class="badge-mes">${a}</span></td>
                  <td><strong>${n[a].cantidad}</strong> colaboradores</td>
                  <td class="payroll-val">$${n[a].salarioTotal.toLocaleString("es-CO")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `;const d=window.Chart,m={responsive:!0,maintainAspectRatio:!1};i=new d(document.getElementById("chart-trab-salario"),{type:"line",data:{labels:l,datasets:[{label:"Nómina ($)",data:l.map(a=>n[a].salarioTotal),borderColor:"#f59e0b",backgroundColor:"rgba(245, 158, 11, 0.1)",fill:!0,tension:.3}]},options:m}),c=new d(document.getElementById("chart-trab-cantidad"),{type:"bar",data:{labels:l,datasets:[{label:"Empleados",data:l.map(a=>n[a].cantidad),backgroundColor:"#10b981",borderRadius:8}]},options:m})}C?.addEventListener("click",E);T().then(t=>{t&&$()});
