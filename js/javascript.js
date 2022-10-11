class Usuario {

    constructor(nombre, apellido, contrasenia) {
        this.nombre = nombre.toUpperCase();
        this.apellido = apellido.toUpperCase();
        this.contrasenia = contrasenia;
    }
}
const usuarios= [
    new Usuario('pruebaNombre','pruebaApellido', '1569'),
    new Usuario( 'Ivan', 'Peralta', 'Qwerty123'),
    new Usuario('Lionel', 'Messi', 'Qwerty321'),
    new Usuario('Florencia', 'Hendel','lalala1')];
    console.log(usuarios);


let nombreIngresado = prompt('Ingrese su nombre');
let apellidoIngresado = prompt('Ingrese su apellido');
let contraseniaIngresada = prompt('Ingrese su nueva contraseña');

const usuario = new Usuario(nombreIngresado, apellidoIngresado, contraseniaIngresada);
usuarios.push(usuario);

const filtrado = usuarios.filter((Usuario)=>Usuario.contrasenia.toUpperCase().includes(contraseniaIngresada.toLocaleUpperCase()));

console.log(filtrado);

function login() {
    let ingresar = false;

    for (let i = 2; i >= 0; i--) {
        let userPIN = prompt('Ingresa tu constraseña. Tienes ' + (i + 1) + ' intentos');
        if (userPIN === contraseniaIngresada) {
            alert('hola ' + nombreIngresado + ' bienvenida/o al simulador de plazo fijo.');;
            ingresar = true;
            break;
        }
        else {
            alert('ERROR. TE QUEDAN ' + i + ' intentos')
        }
    }
    return ingresar;
}

let tasa = 75;
if (login()) {
    let opcion = prompt('ingrese una opcion: \n1- Conocé la tasa vigente. \n2- Simulador de plazo fijo. \n3- Politica de inversion. \n Presiona X para finalizar.');
    while (opcion != 'X' && opcion != 'x') {
        switch (opcion) {
            case '1':
                alert('La tasa de interes en nuestros plazos fijos es de ' + tasa + '% anual. Esto es equivalente a un rendimiento diario de ' + tasa / 365 + ' %');
                break;
            case '2':
                let capital = parseFloat(prompt('ingrese la cantidad de dinero a invertir'));
                let dias = parseFloat(prompt('Ingrese la cantidad de dias que desea establecer el plazo fijo'));
                if (capital >= 1000 && dias >= 30) {

                    let resultado = (capital * dias);
                    let resultado1 = (resultado * ((tasa / 100) / 365));
                    alert('En base a su capital, el rendimiento esperado para la cantidad de dias seleccionado es de $ ' + resultado1);
                    alert('Al final de los ' + dias + ' dias seleccionados, se le acreditara $' + capital + resultado1 + ' a su cuenta.');
                }
                else { alert('Por favor revise nuestra politica de inversion.'); }

                break;
            default:
                alert('elegiste una opcion invalida');
                break;
            case '3':
                alert('El monto minimo de inversion es de $1000 y el plazo minimo es de 30 dias.')

        }
        opcion = prompt('ingrese una opcion: \n1- Conocé la tasa vigente. \n2- simulador de plazo fijo. \n3- Politica de inversion.\n Presiona X para finalizar.');
    }
} else { alert('Te enviamos un correo para blanquear tu clave. Revisa tu casilla') };

alert('Muchas gracias por utilizar nuestro simulador. Adios!')
