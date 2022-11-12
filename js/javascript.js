//BASE DE DATO CREADA PARA EL LOGIN
const usuarios = [
    { nombre: "Ivan", mail: "peralta@hotmail.com", pass: "1234" },
    { nombre: "Lionel", mail: "messi@hotmail.com", pass: "argentina" },
    { nombre: "Florencia", mail: "hendel@hotmail.com", pass: "holamundo" },
    { nombre: "Aldana", mail: "ludueña@hotmail.com", pass: "lala" }]
//BASE DE DATOS FAKE CON LAS CUENTAS DEL USUARIO LOGUEADO
const cuentasUsuarioIngresado = [
    { tipo: 'pesos', simbolo: '$', numero: '1', saldo: 50000 },
    { tipo: 'pesos', simbolo: '$', numero: '3', saldo: 100000 },
    { tipo: 'dolares', simbolo: 'u$s', numero: '2', saldo: 5000 },
    { tipo: 'dolares', simbolo: 'u$s', numero: '4', saldo: 10000 }]

//ELEMENTOS DEL DOM QUE VOY A NECESITAR CONSUMIR
const mailLogin = document.getElementById('emailLogin'),
    passLogin = document.getElementById('passwordLogin'),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    modal = new bootstrap.Modal(modalEl),
    toggles = document.querySelectorAll('.toggles'),

    btnSiguiente = document.getElementById('btnSiguiente'),
    btnCancelar = document.getElementById('btnCancelar'),
    btnUltima = document.getElementById('btnUltima'),
    btnVolver = document.getElementById('btnVolver'),
    formDatos = document.getElementById('ingresoDatosPF'),
    monto = document.getElementById('monto'),
    dias = document.getElementById('dias'),
    cuentas = document.getElementById('cuentas'),
    tipoPF = document.getElementById('tipoPF'),
    checkDatos = document.getElementById('guardarDatos'),
    cardIngreso = document.querySelector('.cardIngreso'),
    confirmacion = document.querySelector('.confirmacion');

//LLAME A LA API DE BCRA PERO NO PUDO CONECTARME POR LO QUE HARDCODIE LAS TASAS.
/*fetch("https://api.estadisticasbcra.com/plazo_fijo",{
    headers:{
        authorization:"BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTk3MzgyNDksInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJpdmFuX2xwMjJAaG90bWFpbC5jb20ifQ.28XXv6OhxXU0XN680aJ_O8_d8It98hOMVmNhvLilhn8Ji9u6fTIfsLWmsEdDDyflQVEEllvtrgKLKcfvO6sXZw"
    },
})
.then((respone)=>response.JSON())
.then((data)=>{
    console.log(data)
})*/
let tasaPesos = 0.75;
let tasaDorales = 0.01;
function validarUsuario(usersDB, user, pass) {
    let encontrado = usersDB.find(userDB => userDB.mail == user);
    if (typeof encontrado === 'undefined') {
        return false;
    } else {
        if (encontrado.pass != pass) {
        return false;
        } else {
            return encontrado;
        }
    }
}
function guardarDatos(usuarioDB, storege) {
    const usuario = {
        'name': usuarioDB.nombre,
        'user': usuarioDB.mail,
        'pass': usuarioDB.pass,
    }
    storege.setItem('usuario', JSON.stringify(usuario));
}

function saludar(usuario) {
    nombreUsuario.innerHTML = `Bienvenido/a <span>${usuario.name} </span>`
}
function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}
function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
    return usuarioEnStorage;
}
function estaLogeado(usuario) {
    if (usuario) {
        saludar(usuario);
        presentarInfo(toggles, 'd-none');
    }
}
function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    if (!mailLogin.value || !passLogin.value) {
        Swal.fire({
            icon: 'error',
            title: 'Ocurrio un error',
            text: 'Todos los campos son requeridos',
          });
    } else {
        let data = validarUsuario(usuarios, mailLogin.value, passLogin.value);
        if (!data) {
            Swal.fire({
                icon: 'error',
                title: 'Usuario y/o contraseña incorrecto',
                text: 'Por favor verifique los datos ingresados.',
              });;
        } else {
            if (recordar.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarUsuario(sessionStorage));

            }
        }
        modal.hide();
        presentarInfo(toggles, 'd-none');
    }
})

btnLogout.addEventListener('click', () => {
    borrarDatos();
    presentarInfo(toggles, 'd-none');
})

window.onload = () => {
    estaLogeado(recuperarUsuario(localStorage));
    mostrarCuentas(elegirTipoCuenta(cuentasUsuarioIngresado,tipoPF.value));
}
tipoPF.onchange =()=>{
    cuentas.innerHTML='';
    mostrarCuentas(elegirTipoCuenta(cuentasUsuarioIngresado,tipoPF.value))
}

class PlazoFijo {
    constructor(monto, dias, numeroCuenta, tipoPF) {
        this.monto = parseFloat(monto);
        this.dias = parseInt(dias);
        this.numeroCuenta = numeroCuenta;
        this.tipoPF = tipoPF}}

function elegirTipoCuenta(cuentasUsuario, tipo) {
    return cuentasUsuario.filter(cuenta => cuenta.tipo == tipo)
}
function mostrarCuentas(cuentasUsuario) {
    for (const cuenta of cuentasUsuario) {
        let option = `<option value="${cuenta.numero}" id="cuenta${cuenta.numero}">CA ${cuenta.simbolo} Nº ${cuenta.numero} - ${cuenta.simbolo} ${cuenta.saldo}</option>`
        cuentas.innerHTML+=option;    }}
function crearObjetoPF(){
    return new PlazoFijo(monto.value, dias.value, cuentas.value, tipoPF.value);
}
function guardarPFenStorage(pf){
    localStorage.setItem('plazoFijo', JSON.stringify(pf));
}

function recuperarPFDeStorage(pf){
    let plazoFijo = JSON.parse(localStorage.getItem(pf));
    if(plazoFijo==null){
        return false;
    }else{
        return plazoFijo;
    }
}
function calcularIntereses(pf,tasaPesos,tasaDolares){
    let intereses;
    if(pf.tipoPF =='pesos'){
        intereses = (pf.monto*(tasaPesos / 365 * pf.dias));
        intereses = parseFloat(intereses.toFixed(2));
    }
    return intereses;
}
function calcularGananciaBruta(intereses,capital){
    return intereses + capital;
}
function calcularFechaAcreditacion(pf){
    let acreditacion = new Date();
    acreditacion.setDate(acreditacion.getDate()+pf.dias)
    return acreditacion.toLocaleDateString();
}
function mostrarCalculado(pf){
    const fecha= calcularFechaAcreditacion(pf);
    const intereses = calcularIntereses(pf, tasaPesos, tasaDorales);
    const total = calcularGananciaBruta(intereses,pf.monto);
    return resultado = {
        'acreditacion': fecha,
        'intereses': intereses,
        'total': total
    }
}

function crearHTMLinfoUsuario(pf,calculo){
    let lista = confirmacion.querySelector('ul');
    let items= [];
    for (const dato in pf){
        let li =  ` <li>${dato}: ${pf[dato]}</li>`;
        items.push(li);}
    for (const dato in calculo) {
    let li = ` <li>${dato}: ${calculo[dato]}</li>`;
    items.push(li);}
    for (const item of items) {
        lista.insertAdjacentHTML('beforeend', item);
    }
}


btnSiguiente.addEventListener('click',()=>
{
    const datosPF = crearObjetoPF();
    if(checkDatos.checked){
        guardarPFenStorage(datosPF);
    }
    cardIngreso.classList.replace('visible','oculta');
    confirmacion.classList.replace('oculta','visible');
    crearHTMLinfoUsuario(datosPF,mostrarCalculado(datosPF));
    formDatos.reset();
});
btnCancelar.addEventListener('click', () => {
    formDatos.reset();
});
btnUltima.addEventListener('click',()=>{
    let guardado = recuperarPFDeStorage('plazoFijo');
    if(!guardado){
        Swal.fire({
            icon: 'error',
            title: 'Ocurrio un error',
            text: 'No se encontraron simulaciones anteriores.',
          });
    }else{
        cardIngreso.classList.replace('visible','oculta');
        confirmacion.classList.replace('oculta','visible');
        crearHTMLinfoUsuario(guardado, mostrarCalculado(guardado));
        formDatos.reset();
    }
})
btnVolver.addEventListener('click', () => {
    cardIngreso.classList.replace('oculta', 'visible');
    confirmacion.classList.replace('visible', 'oculta');
    confirmacion.querySelector('ul').innerHTML = '';
})
