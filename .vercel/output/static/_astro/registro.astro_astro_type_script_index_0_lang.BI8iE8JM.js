import{s as d}from"./supabase.ywjuSTR4.js";const m=document.getElementById("card"),u=new URLSearchParams(window.location.search),o=u.get("empresa"),p=u.get("rol")||"admin",v=p==="trabajador"?"Trabajador":"Administrador";function b(e){m.innerHTML=`
          <div class="badge">✦ Registro de cuenta</div>
          <h1>Bienvenido a tu plataforma</h1>
          <p class="subtitle">
            Estás creando una cuenta de <span class="empresa-name">${v}</span> para
            <span class="empresa-name">${e}</span>.
          </p>

          <div class="field">
            <label for="inp-nombre">Nombre completo</label>
            <input id="inp-nombre" type="text" placeholder="Ej: Juan Pérez" />
          </div>
          <div class="field">
            <label for="inp-email">Correo electrónico</label>
            <input id="inp-email" type="email" placeholder="tu@correo.com" autocomplete="email" />
          </div>
          <div class="field">
            <label for="inp-pass">Contraseña</label>
            <input id="inp-pass" type="password" placeholder="Mínimo 6 caracteres" autocomplete="new-password" />
          </div>
          <div class="field">
            <label for="inp-pass2">Confirmar contraseña</label>
            <input id="inp-pass2" type="password" placeholder="Repite tu contraseña" autocomplete="new-password" />
          </div>

          <button class="btn-submit" id="btn-registrar">Crear mi cuenta →</button>
          <div class="msg" id="msg-result"></div>

          <div class="login-link">
            ¿Ya tienes cuenta? <a href="/">Iniciar sesión</a>
          </div>
        `,document.getElementById("btn-registrar").addEventListener("click",f)}function l(){m.innerHTML=`
          <div class="invalid-card">
            <div class="icon">🔗</div>
            <h2>Enlace inválido o expirado</h2>
            <p>Este enlace de registro no es válido. Por favor contacta a tu proveedor para obtener un enlace correcto.</p>
          </div>
        `}async function f(){const e=document.getElementById("inp-nombre").value.trim(),t=document.getElementById("inp-email").value.trim(),n=document.getElementById("inp-pass").value,g=document.getElementById("inp-pass2").value,r=document.getElementById("btn-registrar"),i=document.getElementById("msg-result");if(i.className="msg",i.textContent="",!e){a("Ingresa tu nombre completo.",!0);return}if(!t){a("Ingresa tu correo electrónico.",!0);return}if(n.length<6){a("La contraseña debe tener al menos 6 caracteres.",!0);return}if(n!==g){a("Las contraseñas no coinciden.",!0);return}r.disabled=!0,r.textContent="Creando cuenta...";try{const{data:s,error:c}=await d.auth.signUp({email:t,password:n,options:{data:{empresa_id:o,role:p,nombre:e}}});if(c)throw c;if(!s.user)throw new Error("No se pudo crear el usuario.");s.session?(a("✅ ¡Cuenta creada! Redirigiendo a tu panel...",!1),r.textContent="¡Listo!",setTimeout(()=>window.location.replace("/init"),1800)):(a("📧 Cuenta creada. Revisa tu correo y confirma tu email para iniciar sesión.",!1),r.textContent="Revisa tu correo")}catch(s){r.disabled=!1,r.textContent="Crear mi cuenta →",a("Error: "+(s.message||"Inténtalo nuevamente."),!0)}}function a(e,t){const n=document.getElementById("msg-result");n.textContent=e,n.className=`msg ${t?"error":"success"}`}async function h(){if(!o){l();return}const{data:e,error:t}=await d.from("empresas").select("nombre, activo").eq("id",o).single();if(t||!e||!e.activo){l();return}b(e.nombre)}h();
