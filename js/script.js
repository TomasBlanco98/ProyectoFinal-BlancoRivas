// CONSTANTES Y VARIABLES
const botones = document.querySelectorAll(".boton");
const mensaje = document.querySelector(".mensaje");
const puntos = document.getElementById("puntaje");
const ataque = document.getElementById("ataque");
const pc = document.getElementById("pc");
const peleas = document.getElementById("divPeleas");
const mejoresPuntos = document.getElementById("mejorPuntaje");
const miForm = document.getElementById("form")
const tabla = document.getElementById("tablaPosiciones");
const contenedorPosiciones = document.getElementById("contenedorPosiciones")

let computadora;
let resultadoParcial;
let mejorResultado;
let inactivo;
// FUNCIONES

function igualQue(x) {
    return (m) => m == x
}
let igualQueCero = igualQue(0);
let igualQueDos = igualQue(2);

function maquina() {
    computadora = Math.round(Math.random() * 2);
    pc.innerHTML = ataqueComputadora[computadora];
}

function player(jugador) {
    if (jugador < computadora) {
        if ( igualQueCero(jugador) && igualQueDos(computadora)) {
            verResultado("Ganaste", "verde");
            sumarResultado();
        } else {
            verResultado("Perdiste", "rojo");
            restartResultado();
        }
    } else if (jugador > computadora) {
        if (igualQueDos(jugador) && igualQueCero(computadora)) {
            verResultado("Perdiste", "rojo");
            restartResultado();
        } else {
            verResultado("Ganaste", "verde");
            sumarResultado();
        }
    } else {
        verResultado("Empate", "azul");
    }
    Toastify({
        text: `${nombre} ATACÓ`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right", 
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #FF5858, #ff9494)",
        },
        onClick: function(){}
    }).showToast();
}

function verResultado (resultado, color) {
    peleas.innerHTML=`<p id='resultado' class='${color}'>${resultado}</p>`;
}

function sumarResultado() {
    resultadoParcial ++;
}

function restartResultado() {
    posiciones.push(new Posicion(nombre, resultadoParcial));
    posiciones.sort((a, b) => b.puntaje - a.puntaje);
    localStorage.setItem("posiciones", JSON.stringify(posiciones));
    resultadoParcial = 0;
}

function generarMejorResultado() {
    mejorResultado <= resultadoParcial ? mejorResultado = resultadoParcial : mejorResultado = mejorResultado; 
    localStorage.setItem("mejoresResultados", mejorResultado);
    mejoresPuntos.innerHTML = `Mejor resultado: ${mejorResultado}`;
}

function cargarPosiciones() {
    contenedorPosiciones.innerHTML = '';
    posiciones.forEach(posicion => {
        const ul = document.createElement("ul");
        ul.innerHTML = `<li>${posicion.nombre}</li><a>${posicion.puntaje}</a>`;
        contenedorPosiciones.append(ul);
    })
}

function mostrarMensaje() {
    inactivo = Swal.fire({
        title: '¿Estas ahi?',
        text: 'Vemos que hace 10 segundos no mueves el mouse',
        icon: 'question',
        showCancelButton: false,
        showConfirmButton: false
    })
}
function cerrarMensaje() {
    inactivo != undefined && inactivo.close()
}
function reiniciarContador() {
    cerrarMensaje()
    clearTimeout(myTimeout);
    myTimeout = setTimeout(mostrarMensaje, 10000);
}

// CLASES

class Posicion {
    constructor(nombre, puntaje) {
        this.nombre = nombre;
        this.puntaje = puntaje;
    }
}
let posiciones = [];
const posicionesRequest = async () => {
    const resp = await fetch("./js/posiciones.json");
    const data = await resp.json();
    posiciones = data;
    posiciones.sort((a, b) => b.puntaje - a.puntaje);
    cargarPosiciones(posiciones);
}

localStorage.getItem("mejoresResultados") == null ? mejorResultado = 0 : mejorResultado = localStorage.getItem("mejoresResultados");

localStorage.getItem("puntos") == null ? resultadoParcial = 0 : resultadoParcial = localStorage.getItem("puntos");

const ataqueJugador = ['<img class="eleccionJugador" src="img/piedra.jpg" alt="Piedra">', '<img class="eleccionJugador" src="img/papel.jpg" alt="Papel">', '<img class="eleccionJugador" src="img/tijera.jpg" alt="Tijera">']
const ataqueComputadora = ['<img class="eleccionComputadora" src="img/piedra.jpg" alt="Piedra">', '<img class="eleccionComputadora" src="img/papel.jpg" alt="Papel">', '<img class="eleccionComputadora" src="img/tijera.jpg" alt="Tijera">']

// INICIO DE JUEGO 
posicionesRequest();
let myTimeout = setTimeout(mostrarMensaje, 10000);
document.addEventListener("mousemove", reiniciarContador);
mejoresPuntos.innerHTML=`Mejor resultado: ${mejorResultado}`;
puntos.innerHTML=`Resultado: ${resultadoParcial}`;

miForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formulario = e.target;
    nombre = document.getElementById("nombre").value.toUpperCase();
    mensaje.innerText = nombre;
    localStorage.setItem("nombre", nombre);
});
botones.forEach(boton => {
    boton.addEventListener("click", seleccionarAtaque);
    function seleccionarAtaque() {
        if(nombre != mensaje.innerText) {
            Swal.fire({
                title: "Error",
                text: "Ingrese su nombre",
                icon: "error",
                confirmButtonText: "Aceptar",
                iconColor: "red",
            })
            return false;
        } 
        maquina();
        player(this.dataset.eleccion);
        puntos.innerHTML=`Resultado: ${resultadoParcial}`;
        ataque.innerHTML = ataqueJugador[this.dataset.eleccion];
        localStorage.setItem("puntos", resultadoParcial);
        generarMejorResultado();
        cargarPosiciones();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("nombre") && resultadoParcial != 0) {
        nombre = localStorage.getItem("nombre");
        mensaje.innerText = nombre;
    }
});