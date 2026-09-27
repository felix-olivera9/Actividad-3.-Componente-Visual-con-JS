/*Librería UI Minecraft Health Bar - Componente Visual Reutilizable*/

class MinecraftHealthBar {
  constructor(contenedorId, rutaImagenMuerte) {
    this.contenedor = document.getElementById(contenedorId);
    this.maxCorazones = 10;
    this.corazonesActuales = 10;
    this.envenenado = false;
    this.intervaloVeneno = null;
    this.rutaImagenMuerte = rutaImagenMuerte;
    
    if (this.contenedor) {
      this.inicializarComponente();
    }
  }

  inicializarComponente() {
    this.contenedor.innerHTML = `
      <div id="mcWrapper" class="mc-health-wrapper">
        <!-- Pantalla de Muerte con imagen dinámica -->
        <div id="mcDeathScreen" class="mc-death-screen" style="background-image: url('${this.rutaImagenMuerte}');">
          <div class="mc-death-title">¡Has muerto!</div>
          <div id="mcDeathReason" class="mc-death-sub">Te has muerto.</div>
          <button class="mc-btn" id="btnRespawn">Reaparecer</button>
        </div>

        <h3>Estado del Jugador</h3>
        <div id="mcHearts" class="mc-hearts-container"></div>
        <div id="mcStatus" class="mc-status-msg" style="color: #ccc;">Estado: Normal</div>
        
        <div class="mc-controls">
          <button class="mc-btn mc-btn-poison" id="btnVeneno">Poción de Veneno ☠️</button>
          <button class="mc-btn mc-btn-apple" id="btnManzana">Manzana Encantada 🍎</button>
          <button class="mc-btn mc-btn-kill" id="btnKill">Comando /kill 💀</button>
        </div>
      </div>
    `;

    this.actualizarCorazonesVisuales();
    this.vincularEventos();
  }

  vincularEventos() {
    document.getElementById('btnVeneno').addEventListener('click', () => this.aplicarVeneno());
    document.getElementById('btnManzana').addEventListener('click', () => this.comerManzana());
    document.getElementById('btnKill').addEventListener('click', () => this.ejecutarKill());
    document.getElementById('btnRespawn').addEventListener('click', () => this.reaparecer());
  }

  actualizarCorazonesVisuales() {
    const contenedorCorazones = document.getElementById('mcHearts');
    let htmlCorazones = '';
    
    for (let i = 1; i <= this.maxCorazones; i++) {
      if (i <= this.corazonesActuales) {
        htmlCorazones += '<span style="color: #ff2222;">❤️</span>';
      } else {
        htmlCorazones += '<span style="color: #555;">🖤</span>';
      }
    }
    contenedorCorazones.innerHTML = htmlCorazones;
  }

  efectoDaño() {
    const wrapper = document.getElementById('mcWrapper');
    wrapper.classList.add('mc-shake', 'mc-red-flash');
    setTimeout(() => {
      wrapper.classList.remove('mc-shake', 'mc-red-flash');
    }, 300);
  }

  aplicarVeneno() {
    if (this.envenenado || this.corazonesActuales <= 0) return;
    this.envenenado = true;
    
    document.getElementById('mcStatus').innerText = 'Efecto: ¡Envenenado! ☠️';
    document.getElementById('mcStatus').style.color = '#aa55ff';

    this.intervaloVeneno = setInterval(() => {
      if (this.corazonesActuales > 0) {
        this.corazonesActuales--;
        this.efectoDaño();
        this.actualizarCorazonesVisuales();
      }
      
      if (this.corazonesActuales === 0) {
        clearInterval(this.intervaloVeneno);
        this.mostrarPantallaMuerte('envenenado');
      }
    }, 800);
  }

  comerManzana() {
    if (this.corazonesActuales <= 0) return;
    
    if (this.envenenado) {
      clearInterval(this.intervaloVeneno);
      this.envenenado = false;
    }

    this.corazonesActuales = this.maxCorazones;
    this.actualizarCorazonesVisuales();
    
    document.getElementById('mcStatus').innerText = 'Estado: Curado (Regeneración) ✨';
    document.getElementById('mcStatus').style.color = '#55ff55';
  }

  ejecutarKill() {
    if (this.envenenado) {
      clearInterval(this.intervaloVeneno);
      this.envenenado = false;
    }
    this.corazonesActuales = 0;
    this.actualizarCorazonesVisuales();
    this.efectoDaño();
    this.mostrarPantallaMuerte('utilizó /kill');
  }

  mostrarPantallaMuerte(razon) {
    document.getElementById('mcDeathReason').innerText = `Te has muerto porque ${razon}.`;
    document.getElementById('mcDeathScreen').style.display = 'flex';
    document.getElementById('mcStatus').innerText = 'Estado: Muerto 💀';
    document.getElementById('mcStatus').style.color = '#ff5555';
  }

  reaparecer() {
    this.corazonesActuales = this.maxCorazones;
    this.actualizarCorazonesVisuales();
    document.getElementById('mcDeathScreen').style.display = 'none';
    document.getElementById('mcStatus').innerText = 'Estado: Normal (Respawn)';
    document.getElementById('mcStatus').style.color = '#ccc';
  }
}