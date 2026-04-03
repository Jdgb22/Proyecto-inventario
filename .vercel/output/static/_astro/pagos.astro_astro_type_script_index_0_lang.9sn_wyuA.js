import{g as N,a as C}from"./auth.CaIV8qIb.js";import{g as j}from"./workers.pyYfWsXO.js";import"./supabase.DhieRUgU.js";let n=[];const E=document.getElementById("pago-msg"),v=document.getElementById("pago-negocio"),x=document.getElementById("pago-mes-desde"),B=document.getElementById("pago-mes-hasta"),H=document.getElementById("pago-val-extra"),O=document.getElementById("pago-deduccion"),F=document.getElementById("btn-aplicar"),$=document.getElementById("tabla-pago-detalle"),I=a=>String(a??"").trim()||"",L=a=>(a?.negocio||"General").trim();async function A(){const a=await N();return a?await C(a.user.id)!=="admin"?(window.location.replace("/init"),!1):!0:(window.location.replace("/"),!1)}async function P(){if(n=await j(),!n||n.length===0){E.textContent="No hay registros de nómina todavía.",E.style.display="block";return}const a=Array.from(new Set(n.map(L))).sort();v.innerHTML='<option value="GLOBAL">Todos los Negocios (Global)</option>'+a.map(e=>`<option value="${e}">${e}</option>`).join("");const o=n.map(e=>I(e.mes||e.created_at)).filter(e=>e).sort();o.length>0&&(x.value=o[0].slice(0,7),B.value=o[o.length-1].slice(0,7)),await D()}async function D(){if(!n.length)return;const a=v.value,o=x.value,e=B.value,S=parseFloat(H.value)||0,T=parseFloat(O.value)||0,r=[];let c=0;const i=e?e+"-31":"";n.forEach(t=>{if(a!=="GLOBAL"&&L(t)!==a)return;const s=I(t.mes||t.created_at);if(!s||s<o||i&&s>i)return;const m=Number(t.salario_base||0),g=Number(t.horas_trabajadas||0),u=Number(t.horas_extras||0),p=Number(t.deuda||0),h=m/240*g,y=u*S,b=h*(T/100),f=h+y-p-b;r.push({nombre:t.nombre||"Sin Nombre",documento:t.documento||"N/A",mes:s,salarioBase:m,horasTrabajadas:g,horasExtras:u,pagoExtras:y,deuda:p,valorDeducciones:b,totalPagar:f}),c+=f});const d=document.getElementById("gran-total-valor"),l=document.getElementById("gran-total-card");if(r.length===0){$.innerHTML='<p class="msg">No hay registros para este filtro.</p>',l&&(l.style.display="none");return}d&&l&&(d.textContent=`$${c.toLocaleString("es-CO",{maximumFractionDigits:0})}`,l.style.display="block"),r.sort((t,s)=>s.totalPagar-t.totalPagar),$.innerHTML=`
          <table>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Corte</th>
                <th>Salario Mensual</th>
                <th>Horas Trab.</th>
                <th>Extras ($)</th>
                <th>Deudas ($)</th>
                <th>Deducciones ($)</th>
                <th>Total a Pagar</th>
              </tr>
            </thead>
            <tbody>
              ${r.map(t=>`
                <tr>
                  <td><strong>${t.nombre}</strong><br/><span style="font-size:0.75rem; color:#64748b; font-family:monospace;">${t.documento}</span></td>
                  <td><span class="badge-mes">${t.mes}</span></td>
                  <td>$${t.salarioBase.toLocaleString("es-CO")}</td>
                  <td><strong>${t.horasTrabajadas}</strong></td>
                  <td style="color:#059669;">+ $${t.pagoExtras.toLocaleString("es-CO",{maximumFractionDigits:0})} <span style="font-size:0.7rem; color:#64748b;">(${t.horasExtras}h)</span></td>
                  <td style="color:#ef4444;">- $${t.deuda.toLocaleString("es-CO",{maximumFractionDigits:0})}</td>
                  <td style="color:#ef4444;">- $${t.valorDeducciones.toLocaleString("es-CO",{maximumFractionDigits:0})}</td>
                  <td class="payroll-val">$${t.totalPagar.toLocaleString("es-CO",{maximumFractionDigits:0})}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `}F?.addEventListener("click",D);async function M(){await A()&&await P()}M();
