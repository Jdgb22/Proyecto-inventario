import{g as A,a as H}from"./auth.B1nicQET.js";import{g as k}from"./workers.Bpi7GeXx.js";import"./empresas.DJ8cCqCm.js";let r=[],c=null,i=null;const b=document.getElementById("rep-trab-msg"),h=document.getElementById("rep-trab-negocio"),y=document.getElementById("rep-trab-mes-desde"),f=document.getElementById("rep-trab-mes-hasta"),S=document.getElementById("rep-trab-val-extra"),M=document.getElementById("rep-trab-deduccion"),O=document.getElementById("btn-trab-aplicar"),g=document.getElementById("tabla-trab-mensual"),E=a=>String(a??"").trim()||"",v=a=>(a?.negocio||"General").trim();async function _(){const a=await A();return a?await H(a.user.id)!=="admin"?(window.location.replace("/init"),!1):!0:(window.location.replace("/"),!1)}async function D(){if(r=await k(),!r||r.length===0){b.textContent="No hay registros de trabajadores todavía.",b.style.display="block";return}const a=Array.from(new Set(r.map(v))).sort();h.innerHTML='<option value="GLOBAL">Todos los Negocios (Global)</option>'+a.map(e=>`<option value="${e}">${e}</option>`).join("");const s=r.map(e=>E(e.mes||e.created_at)).filter(e=>e).sort();s.length>0&&(y.value=s[0].slice(0,7),f.value=s[s.length-1].slice(0,7)),await B()}async function B(){if(!r.length)return;c&&c.destroy(),i&&i.destroy();const a=h.value,s=y.value,e=f.value,I=parseFloat(S.value)||0,T=parseFloat(M.value)||0,o={},d=e?e+"-31":"";r.forEach(t=>{if(a!=="GLOBAL"&&v(t)!==a)return;const n=E(t.mes||t.created_at);if(!n||n<s||d&&n>d)return;const N=Number(t.salario_base||0),j=Number(t.horas_trabajadas||0),C=Number(t.horas_extras||0),L=Number(t.deuda||0),p=N/240*j,x=C*I,$=p*(T/100),w=p+x-L-$;o[n]||(o[n]={cantidad:0,salarioTotal:0}),o[n].cantidad+=1,o[n].salarioTotal+=w});const l=Object.keys(o).sort();if(!l.length){g.innerHTML='<p class="msg">No hay datos para esta selección.</p>';return}g.innerHTML=`
          <table>
            <thead>
              <tr>
                <th>Periodo (Mes)</th>
                <th>Personal Activo</th>
                <th>Costo Total Nómina</th>
              </tr>
            </thead>
            <tbody>
              ${l.map(t=>`
                <tr>
                  <td><span class="badge-mes">${t}</span></td>
                  <td><strong>${o[t].cantidad}</strong> colaboradores</td>
                  <td class="payroll-val">$${o[t].salarioTotal.toLocaleString("es-CO",{maximumFractionDigits:0})}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `;const m=window.Chart,u={responsive:!0,maintainAspectRatio:!1};c=new m(document.getElementById("chart-trab-salario"),{type:"line",data:{labels:l,datasets:[{label:"Nómina ($)",data:l.map(t=>o[t].salarioTotal),borderColor:"#f59e0b",backgroundColor:"rgba(245, 158, 11, 0.1)",fill:!0,tension:.3}]},options:u}),i=new m(document.getElementById("chart-trab-cantidad"),{type:"bar",data:{labels:l,datasets:[{label:"Empleados",data:l.map(t=>o[t].cantidad),backgroundColor:"#10b981",borderRadius:8}]},options:u})}O?.addEventListener("click",B);_().then(a=>{a&&D()});
