//------------------------------------Elementos constantes del DOM-----------------------------------------

const btnToTop = document.getElementById("btnToTop");
const btnGuardar = document.getElementById("guardar");
const toast = document.getElementById('toast');
const toastTitle = document.getElementById("title");
const toastMessage = document.getElementById("message");
const listSection = document.getElementById("lista");
const ListaEstudiantes = document.getElementById("estudiantes").getElementsByTagName("tbody")[0];
const promedio = document.getElementById("promedio");
const detallesSection = document.getElementById("detalles");
let estudiantes = [];


//--------------------------------------------Eventos-------------------------------------------------------

onscroll = () => {
    scrollTop();
}

btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();
})


addEventListener("beforeunload", () => {
    sessionStorage.setItem("estudiantes", JSON.stringify(estudiantes));
});

onload = () => {
    estudiantes = JSON.parse(sessionStorage.getItem("estudiantes"));
    mostrarSeccionLista(true);
    agregarEstudiantesALista();
    mostrarPromedio();
}

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

    constructor(id, nombres, apellidos, matricula, calificacion, descripcion){
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.matricula = matricula;
        this.calificacion = calificacion;
        this.descripcion = descripcion;
    }
}

// ----------------------------------Funciones CRUD principales----------------------------------------

const saveStudent = (id) => {
    const formulario = document.getElementById('formulario');
    const formData = new FormData(formulario);

    const nombres = formData.get("nombres");
    const apellidos = formData.get("apellidos");
    const matricula = formData.get("matricula"); 
    let calificacion = formData.get("calificacion"); 

    if(nombres === "" || apellidos === "" || matricula === "" || calificacion === ""){
        mostrarToast("error", "Datos incompletos", "Todos los campos deben ser completados.")
        return;
    }
    calificacion = Number(calificacion);
    if(calificacion < 0 || calificacion > 100){
        mostrarToast("warning", "Dato incorrecto", "Se debe ingresar un numero entre 1 y 100 como calificación.")
        return;
    }

    if(id){
        editarEstudiante(id, {nombres: nombres, apellidos: apellidos, matricula: matricula, calificacion: calificacion, descripcion: descripcionEstudiante(calificacion)})
    }
    else{
        let newId = estudiantes.length === 0 ? 1 : estudiantes[estudiantes.length - 1].id + 1;
        estudiantes.push(new Estudiante(newId, nombres, apellidos, matricula, calificacion, descripcionEstudiante(calificacion)));
    }
    let titulo = id ? 'Editado' : 'Agregado';
    let mensaje = `El estudiante <span id="estudiante">${nombres + " " + apellidos}</span> fue ${titulo.toLowerCase()} con exito.`
    mostrarToast("success", `¡${titulo}!`, mensaje);
    agregarEstudiantesALista();
    mostrarPromedio();

    if(id){
        cancelarEditEstudiante();
    }
    else{
        mostrarSeccionLista(true)
        resetForm();
    }
}

const editarEstudiante = (id, estudianteNewInfo) => {
    estudiantes.map(estudiante => {
        if(estudiante.id === id){
            estudiante.nombres = estudianteNewInfo.nombres;
            estudiante.apellidos = estudianteNewInfo.apellidos;
            estudiante.matricula = estudianteNewInfo.matricula;
            estudiante.calificacion = estudianteNewInfo.calificacion;
            estudiante.descripcion = estudianteNewInfo.descripcion;
        }
    })
}

const borrarEstudiante = (id) => {
    const index = estudiantes.findIndex(estudiante => estudiante.id === id);
    estudiantes.splice(index, 1);

    if(estudiantes.length === 0){
        mostrarSeccionLista(false);
    }
    else{
        agregarEstudiantesALista();
        mostrarPromedio();
    }
    
    mensaje = `El estudiante fue eliminado con exito.`;
    mostrarToast("success", "¡Eliminado!", mensaje);
}

const mostrarEstudianteDetalles = (id) => {
    detallesSection.style.display = "flex"
    const estudiante = estudiantes.find(estudiante => estudiante.id === id);
    const contenido = detallesSection.getElementsByClassName("detalles-content")[0];
    contenido.innerHTML = `
    <p><span>Nombres:</span> ${estudiante.nombres}</p> 
    <p><span>Apelidos:</span> ${estudiante.apellidos}</p>
    <p><span>Matrícula:</span> ${estudiante.matricula}</p>
    <p><span>Calificación:</span> <span style='color: ${estudiante.calificacion >= 69 ? 'rgb(2, 163, 2)' : 'red'} !important'>${estudiante.calificacion} puntos</span></p>
    <p><span>Descripción:</span> ${estudiante.descripcion}</p>`;
}

const cerrarSectionDetalles = () => {
    detallesSection.style.display = "none";
}

//-------Agregar una descripción------//
const descripcionEstudiante = (calificacion) => {
    let descripcion = "";

    if(calificacion > 85 && calificacion < 101)
        descripcion = "Este e' uno o una de lo' lambone'. Que vaya al colmado a comprar con esa nota, pa' que tu vea."
    else if(calificacion > 70 && calificacion < 86)
        descripcion = "Este ta más o menos. Ta pasao.";
    else if(calificacion === 70)
        descripcion = "Este muchacho ta' con Dio', eso fue que el profesor le regaló el punto que le faltaba pa' pasar.";
    else if(calificacion > 59 && calificacion < 70)
        descripcion = "A este el profesor le tenía tirria, ya que ni si quiera le regaló do' o tre' puntos pa' pasar.";
    else if(calificacion < 60)
        descripcion = "Bueeeenoooo manito... ¡Usted se la acaba de beber usted solo! Deja que la mai vea esa nota, van a tene que depegalo del suelo. XD"

    return descripcion;
}
//------------------------------------//

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

    let estudiante = estudiantes.find(estudiante => estudiante.id === id);

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
const agregarEstudiantesALista = () => {
    ListaEstudiantes.textContent = '';
    for(let i = 0; i < estudiantes.length; i++) 
    {
        const fila = ListaEstudiantes.insertRow(i);
        const numeroRegistro = fila.insertCell(0);
        const nombresFila = fila.insertCell(1);
        const apellidosFila = fila.insertCell(2);
        const matriculaFila = fila.insertCell(3);
        const calificaionFila = fila.insertCell(4);
        const accionFila = fila.insertCell(5);
        fila.id = estudiantes[i].id;

        numeroRegistro.innerText = i + 1;
        nombresFila.innerText = estudiantes[i].nombres;
        apellidosFila.innerText = estudiantes[i].apellidos;
        matriculaFila.innerText = estudiantes[i].matricula;
        calificaionFila.innerText = estudiantes[i].calificacion;
        calificaionFila.style.color = estudiantes[i].calificacion >= 70 ? "rgb(2, 163, 2)" : "red"; 

        accionFila.innerHTML = `<button class="btn btn-accion editar" onclick="setEstudiante(${estudiantes[i].id})"><i class="fad fa-pencil-alt"></i></button>
        <button class="btn btn-accion borrar" onclick="borrarEstudiante(${estudiantes[i].id})"><i class="fad fa-trash-alt"></i></button>
        <button class="btn btn-accion detalle" onclick="mostrarEstudianteDetalles(${estudiantes[i].id})"><i class="fad fa-file-alt"></i></button>`
    }
}

// ----------------------------------Manejo del promedio--------------------------------------------

const mostrarPromedio = () => {
    promedio.innerText = conseguirPromedio().toFixed(1);
}

const conseguirPromedio = () => {
    let promedio = 0;

    estudiantes.forEach(estudiante => {
        promedio += estudiante.calificacion;
    })

    promedio /= estudiantes.length;
    
    return promedio;
}