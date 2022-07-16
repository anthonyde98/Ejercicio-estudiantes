//------------------------------------Elementos constantes del DOM-----------------------------------------

const btnToTop = document.getElementById("btnToTop");
const btnGuardar = document.getElementById("guardar");
const toast = document.getElementById('toast');
const toastTitle = document.getElementById("title");
const toastMessage = document.getElementById("message");
const listSection = document.getElementById("lista");
const ListaEstudiantes = document.getElementById("estudiantes").getElementsByTagName("tbody")[0];
const promedio = document.getElementById("promedio");
const estudiantes = [];


//--------------------------------------------Eventos-------------------------------------------------------

window.onscroll = () => {
    scrollTop();
}

btnGuardar.addEventListener("click", (e)=>{
    e.preventDefault();
})

//-----------------------------------------------Scroll----------------------------------------------------

const scrollTop = () => {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        btnToTop.style.display = "block";
    } else {
        btnToTop.style.display = "none";
    }
}

const goTo = (direccionY) => {
    document.body.scrollTop = direccionY; 
    document.documentElement.scrollTop = direccionY;
}

// ---------------------------------------------Clase------------------------------------------------------

class Estudiante {
    id;
    nombres;
    apellidos;
    matricula;
    calificacion;

    constructor(id, nombres, apellidos, matricula, calificacion){
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.matricula = matricula;
        this.calificacion = calificacion;
    }
}

// ----------------------------------Funciones CRUD principales----------------------------------------

const saveStudent = (id) => {
    const formulario = document.getElementById('formulario');
    const formData = new FormData(formulario);
    let mensaje = "";

    const nombres = formData.get("nombres");
    const apellidos = formData.get("apellidos");
    const matricula = formData.get("matricula"); 
    const calificacion = formData.get("calificacion"); 

    if(nombres === "" || apellidos === "" || matricula === "" || calificacion === ""){
        mostrarToast("error", "Datos incompletos", "Todos los campos deben ser completados.")
        return;
    }

    if(Number(calificacion) < 0 || Number(calificacion) > 100){
        mostrarToast("warning", "Dato incorrecto", "Se debe ingresar un numero entre 1 y 100 como calificación.")
        return;
    }

    let estudiante;

    if(id){
        estudiante = new Estudiante(id, nombres, apellidos, matricula, Number(calificacion))
    }
    else{
        let newId = estudiantes.length === 0 ? 1 : estudiantes[estudiantes.length - 1].id + 1;
        estudiante = new Estudiante(newId, nombres, apellidos, matricula, Number(calificacion))
    }

    estudiantes.push(estudiante);
    
    if(id){
        borrarEstudiante(id);
    }

    mensaje = `El estudiante <span id="estudiante">${estudiante.nombres + " " + estudiante.apellidos}</span> fue ${id ? 'editado' : 'agregado'} con exito.`
    mostrarToast("success", `¡${id ? 'Editado' : 'Agregado'}!`, mensaje);
    agregarEstudianteALista(estudiante);
    mostrarPromedio();

    if(id){
        document.getElementById("guardar").innerText = "Guardar";
        document.getElementById("guardar").setAttribute('onclick', `saveStudent()`);
    }
    else{
        mostrarSeccionLista(true)
        resetForm();
    }
}

const borrarEstudiante = (id) => {
    estudiantes.splice(id - 1, 1);
    document.getElementById(id).remove();
    mensaje = `El estudiante fue eliminado con exito.`;
    mostrarToast("success", "¡Eliminado!", mensaje);

    if(estudiantes.length === 0){
        mostrarSeccionLista(false);
    }
    else{
        mostrarPromedio();
    }
}

// ----------------------------------Manejo del formulario--------------------------------------------

const resetForm = () => {
    const formulario = document.getElementById('formulario');
    formulario.reset()
}


const cancelarEditEstudiante = () => {
    document.getElementById("guardar").innerText = "Guardar";
    document.getElementById("guardar").setAttribute('onclick', `saveStudent()`);
    document.getElementById("cancelar").style = "display: none";

    resetForm();
}

const setEstudiante = (id) => {

    let estudiante = estudiantes.find(value => value.id == id);

    document.getElementById("nombres").value = estudiante.nombres;
    document.getElementById("apellidos").value = estudiante.apellidos;
    document.getElementById("matricula").value = estudiante.matricula; 
    document.getElementById("calificacion").value = estudiante.calificacion; 
    
    document.getElementById("guardar").innerText = "Editar";
    document.getElementById("guardar").setAttribute('onclick', `saveStudent(${id})`);

    document.getElementById("cancelar").style = "display: block; text-align: center; margin: 5px auto";

    goTo(0);
}

// ----------------------------------Manejo de las notificaciones--------------------------------------------

const mostrarToast = (tipo, titulo, mensaje) => {
    toast.style.backgroundColor = tipo === "warning" ? "rgb(236, 190, 62)" : tipo === "error" ? "rgb(245, 58, 58)" : "rgb(62, 236, 129)";
    toast.style.animation = "bounceInRight 1s";
    toast.style.display = "block";
    toastTitle.innerText = titulo;
    toastMessage.innerHTML = mensaje;
    ocultarToast();
}

const ocultarToast = () => {
    setTimeout(() => {
        toast.style.animation = "bounceOutRight 1s";
        setTimeout(() => {
            toast.style.display = "none";
        }, 900);
    }, 4000);
}

// ----------------------------------Manejo de la lista--------------------------------------------

const mostrarSeccionLista = (desicion) => {
    listSection.style.display = desicion ? "block" : "none";
}

const agregarEstudianteALista = (estudiante) => {
    const fila = ListaEstudiantes.insertRow(estudiantes.length - 1);

    const numeroFila = fila.insertCell(0);
    const nombresFila = fila.insertCell(1);
    const apellidosFila = fila.insertCell(2);
    const matriculaFila = fila.insertCell(3);
    const calificaionFila = fila.insertCell(4);
    const accionFila = fila.insertCell(5);
    fila.id = estudiante.id;

    numeroFila.innerText = estudiantes.length;
    nombresFila.innerText = estudiante.nombres;
    apellidosFila.innerText = estudiante.apellidos;
    matriculaFila.innerText = estudiante.matricula;
    calificaionFila.innerText = estudiante.calificacion;
    calificaionFila.style.color = estudiante.calificacion >= 70 ? "rgb(2, 163, 2)" : "red"; 

    accionFila.innerHTML = `<button class="btn btn-accion editar" onclick="setEstudiante(${estudiante.id})"><i class="fad fa-pencil-alt"></i></button>
    <button class="btn btn-accion borrar" onclick="borrarEstudiante(${estudiante.id})"><i class="fad fa-trash-alt"></i></button>`
}

// ----------------------------------Manejo del promedio--------------------------------------------

const mostrarPromedio = () => {
    promedio.innerText = conseguirPromedio().toFixed();
}

const conseguirPromedio = () => {
    let promedio = 0;

    estudiantes.forEach(estudiante => {
        promedio += estudiante.calificacion;
    })

    promedio /= estudiantes.length;
    
    return promedio;
}

