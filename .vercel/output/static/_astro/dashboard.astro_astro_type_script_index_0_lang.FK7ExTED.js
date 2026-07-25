import{g as $,a as B}from"./auth.CZfUohym.js";import{g as x,b as k}from"./inventory.C9Dxuz58.js";import{g as M}from"./negocios.CJsdwGT-.js";import{s as b}from"./supabase.ywjuSTR4.js";import{b as h}from"./empresas.fLsMLf0D.js";async function I(t,n){const e=await h();let s=b.from("costos_operativos").select("*").eq("mes",n).order("tipo",{ascending:!0}).order("descripcion",{ascending:!0});t&&t!=="GLOBAL"&&(s=s.eq("negocio",t)),e&&(s=s.eq("empresa_id",e));const{data:o,error:a}=await s;if(a)throw a;return o||[]}async function L(t){const n=await h(),e={negocio:t.negocio,mes:t.mes,tipo:t.tipo,descripcion:t.descripcion.trim(),valor:t.valor};n&&(e.empresa_id=n);const{data:s,error:o}=await b.from("costos_operativos").insert([e]).select().single();if(o)throw o;return s}async function O(t,n){const{data:e,error:s}=await b.from("costos_operativos").update(n).eq("id",t).select().single();if(s)throw s;return e}async function T(t){const{error:n}=await b.from("costos_operativos").delete().eq("id",t);if(n)throw n}let C=[],y="",f="",m=0;async function S(){const t=await $();if(!t){window.location.replace("/");return}const n=await B(t.user.id);if(n!=="admin"&&n!=="superadmin"){window.location.replace("/init");return}const e=new Date,s=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`;document.getElementById("f-mes").value=s;try{C=await k();const o=await M(),a=document.getElementById("f-negocio");a.innerHTML='<option value="GLOBAL">Todos los Negocios (Global)</option>'+o.map(d=>`<option value="${d.nombre}">${d.nombre}</option>`).join("")}catch{}document.getElementById("btn-generar")?.addEventListener("click",E),document.getElementById("btn-add-costo")?.addEventListener("click",()=>w(null)),document.getElementById("btn-modal-close")?.addEventListener("click",v),document.getElementById("modal-backdrop")?.addEventListener("click",o=>{o.target===document.getElementById("modal-backdrop")&&v()}),document.getElementById("btn-modal-submit")?.addEventListener("click",N)}async function E(){const t=document.getElementById("f-negocio").value,n=document.getElementById("f-mes").value;if(!t||!n)return;y=t,f=n;const e=document.getElementById("empty-state"),s=document.getElementById("dash-content");e.textContent="Cargando datos...",s.style.display="none";try{const[o,a]=await Promise.all([x(t,n),I(t,n)]);if(o.length===0&&a.length===0){e.innerHTML=`No se encontraron datos para <strong>${t}</strong> en <strong>${n}</strong>.`;return}e.style.display="none",s.style.display="block";const d=j(o);F(d),_(d),A(a),H(d,a)}catch(o){e.textContent="Error: "+o.message,e.style.display="block",s.style.display="none"}}function j(t){const n=new Map;return t.forEach(e=>{const s=C.find(c=>c.codigo===e.codigo),o=s?Number(s.precio):0,a=s?.nombre||e.nombre||e.codigo,d=s?.categoria||"Sin Categoría",i=Number(e.cantidad)||0;if(n.has(e.codigo)){const c=n.get(e.codigo);c.cantidad+=i,c.total+=i*o}else n.set(e.codigo,{codigo:e.codigo,nombre:a,categoria:d,precio:o,cantidad:i,total:i*o,unidad:s?.unidad||"und."})}),n}function u(t){return`$${Math.round(t).toLocaleString("es-CO")}`}function g(t,n=""){return`
          <div class="pct-cell">
            <div class="pct-bar-bg">
              <div class="pct-bar-fill ${n}" style="width:${Math.min(t,100).toFixed(1)}%"></div>
            </div>
            <span class="pct-text">${t.toFixed(1)}%</span>
          </div>`}function F(t){const n=Array.from(t.values()).sort((o,a)=>a.total-o.total);m=n.reduce((o,a)=>o+a.total,0);const e=document.getElementById("tbody-compras"),s=document.getElementById("tfoot-compras");if(n.length===0){e.innerHTML='<tr><td colspan="3" style="text-align:center;color:var(--slate-400);padding:32px;">Sin compras en este período</td></tr>',s.innerHTML="";return}e.innerHTML=n.map(o=>{const a=m>0?o.total/m*100:0;return`
            <tr>
              <td><strong style="color:var(--slate-900);font-size:0.87rem;">${o.nombre}</strong>
                  <br/><small style="color:var(--slate-400);font-size:0.7rem;">${o.codigo}</small></td>
              <td class="right"><span class="money money--purple">${u(o.total)}</span></td>
              <td>${g(a,"")}</td>
            </tr>`}).join(""),s.innerHTML=`
          <tr class="tbl-grand-total">
            <td><strong>TOTAL</strong></td>
            <td class="right"><strong>${u(m)}</strong></td>
            <td><span style="font-weight:700;color:var(--purple-700);">100%</span></td>
          </tr>`}function _(t){const n=Array.from(t.values()),e={};n.forEach(a=>{e[a.categoria]||(e[a.categoria]=[]),e[a.categoria].push(a)});const s=document.getElementById("tbody-inventario");let o="";Object.entries(e).sort(([a],[d])=>a.localeCompare(d)).forEach(([a,d])=>{const i=d.reduce((c,l)=>c+l.cantidad,0);o+=`<tr class="tbl-section-header">
              <td colspan="3">
                <span style="font-size:0.65rem;">▶</span>&ensp;${a}
                &ensp;<span style="font-weight:500;color:var(--purple-500);">(${d.length} productos · ${i.toLocaleString("es-CO")} und. total)</span>
              </td>
            </tr>`,d.sort((c,l)=>l.cantidad-c.cantidad).forEach(c=>{o+=`
                <tr>
                  <td style="padding-left:28px;">${c.nombre}</td>
                  <td class="right"><strong style="color:var(--slate-900);">${c.cantidad.toLocaleString("es-CO")}</strong></td>
                  <td><span class="chip chip--unit">${c.unidad}</span></td>
                </tr>`})}),s.innerHTML=o||'<tr><td colspan="3" style="text-align:center;color:var(--slate-400);padding:32px;">Sin stock registrado</td></tr>'}function A(t){const n=document.getElementById("tbody-costos"),e=document.getElementById("tfoot-costos"),s=t.filter(r=>r.tipo==="FIJO"),o=t.filter(r=>r.tipo==="MUERTO"),a=s.reduce((r,p)=>r+p.valor,0),d=o.reduce((r,p)=>r+p.valor,0),i=a+d;let c="";c+=`<tr class="tbl-section-header tbl-section-header--amber">
          <td colspan="5">💼 Gastos Fijos — Arriendos, Contratos y Servicios</td>
        </tr>`,s.length===0?c+='<tr><td colspan="5" style="text-align:center;color:var(--slate-400);padding:18px;font-style:italic;font-size:0.85rem;">Sin gastos fijos registrados en este período</td></tr>':s.forEach(r=>{const p=m>0?r.valor/m*100:0;c+=`
              <tr data-id="${r.id}">
                <td style="padding-left:24px;">${r.descripcion}</td>
                <td><span class="chip chip--fijo">FIJO</span></td>
                <td class="right"><span class="money money--amber">${u(r.valor)}</span></td>
                <td>${g(p,"pct-bar-fill--amber")}</td>
                <td style="white-space:nowrap;">
                  <button class="btn-tbl btn-tbl--edit" onclick="window._editCosto('${r.id}')">✏️ Editar</button>
                  <button class="btn-tbl btn-tbl--del" onclick="window._deleteCosto('${r.id}')">🗑️</button>
                </td>
              </tr>`}),s.length>0&&(c+=`<tr class="tbl-subtotal">
            <td colspan="2" style="padding-left:24px;"><em>Subtotal Fijos</em></td>
            <td class="right">${u(a)}</td>
            <td colspan="2"></td>
          </tr>`),c+=`<tr class="tbl-section-header tbl-section-header--red">
          <td colspan="5">☠️ Gastos Muertos — Mermas, Daños y Desperdicios</td>
        </tr>`,o.length===0?c+='<tr><td colspan="5" style="text-align:center;color:var(--slate-400);padding:18px;font-style:italic;font-size:0.85rem;">Sin gastos muertos registrados en este período</td></tr>':o.forEach(r=>{const p=m>0?r.valor/m*100:0;c+=`
              <tr data-id="${r.id}">
                <td style="padding-left:24px;">${r.descripcion}</td>
                <td><span class="chip chip--muerto">MUERTO</span></td>
                <td class="right"><span class="money money--red">${u(r.valor)}</span></td>
                <td>${g(p,"pct-bar-fill--red")}</td>
                <td style="white-space:nowrap;">
                  <button class="btn-tbl btn-tbl--edit" onclick="window._editCosto('${r.id}')">✏️ Editar</button>
                  <button class="btn-tbl btn-tbl--del" onclick="window._deleteCosto('${r.id}')">🗑️</button>
                </td>
              </tr>`}),o.length>0&&(c+=`<tr class="tbl-subtotal">
            <td colspan="2" style="padding-left:24px;"><em>Subtotal Muertos</em></td>
            <td class="right">${u(d)}</td>
            <td colspan="2"></td>
          </tr>`),n.innerHTML=c;const l=m>0?i/m*100:0;e.innerHTML=`
          <tr class="tbl-grand-total tbl-grand-total--amber">
            <td><strong>TOTAL COSTOS OPERATIVOS</strong></td>
            <td></td>
            <td class="right"><strong>${u(i)}</strong></td>
            <td>${g(l,"pct-bar-fill--amber")}</td>
            <td></td>
          </tr>`}function H(t,n){const e=Array.from(t.values()),s=e.reduce((l,r)=>l+r.total,0),o=e.reduce((l,r)=>l+r.cantidad,0),a=n.filter(l=>l.tipo==="FIJO"),d=n.filter(l=>l.tipo==="MUERTO"),i=a.reduce((l,r)=>l+r.valor,0),c=d.reduce((l,r)=>l+r.valor,0);document.getElementById("kpi-compras").textContent=u(s),document.getElementById("kpi-compras-sub").textContent=`${e.length} productos`,document.getElementById("kpi-stock").textContent=o.toLocaleString("es-CO"),document.getElementById("kpi-stock-sub").textContent=`${t.size} referencias`,document.getElementById("kpi-fijos").textContent=u(i),document.getElementById("kpi-fijos-sub").textContent=`${a.length} ítem${a.length!==1?"s":""}`,document.getElementById("kpi-muertos").textContent=u(c),document.getElementById("kpi-muertos-sub").textContent=`${d.length} ítem${d.length!==1?"s":""}`}function w(t){const n=document.getElementById("modal-backdrop"),e=document.getElementById("modal-title"),s=document.getElementById("modal-edit-id"),o=document.getElementById("m-tipo"),a=document.getElementById("m-desc"),d=document.getElementById("m-valor"),i=document.getElementById("modal-error");i.textContent="",t?(e.textContent="Editar Costo Operativo",s.value=t.id??"",o.value=t.tipo,a.value=t.descripcion,d.value=String(t.valor)):(e.textContent="Agregar Costo Operativo",s.value="",o.value="FIJO",a.value="",d.value=""),n.classList.add("is-open"),setTimeout(()=>a.focus(),60)}function v(){document.getElementById("modal-backdrop").classList.remove("is-open")}async function N(){const t=document.getElementById("modal-edit-id").value,n=document.getElementById("m-tipo").value,e=document.getElementById("m-desc").value.trim(),s=parseFloat(document.getElementById("m-valor").value),o=document.getElementById("modal-error"),a=document.getElementById("btn-modal-submit");if(o.textContent="",!e){o.textContent="La descripción es obligatoria.";return}if(isNaN(s)||s<0){o.textContent="Ingresa un valor válido mayor o igual a 0.";return}if(!y||!f){o.textContent="Primero genera el dashboard con un período.";return}a.disabled=!0,a.textContent="Guardando...";try{t?await O(t,{tipo:n,descripcion:e,valor:s}):await L({negocio:y,mes:f,tipo:n,descripcion:e,valor:s}),v(),await E()}catch(d){o.textContent="Error: "+d.message}finally{a.disabled=!1,a.textContent="Guardar Costo"}}window._editCosto=async t=>{try{const e=(await I(y,f)).find(s=>s.id===t);e&&w(e)}catch{}};window._deleteCosto=async t=>{if(confirm("¿Eliminar este costo operativo? Esta acción no se puede deshacer."))try{await T(t),await E()}catch(n){alert("Error al eliminar: "+n.message)}};S();
