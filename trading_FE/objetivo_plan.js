// read objetivos
export async function read_objetivos_db(){
    try{
        let token = localStorage.getItem('accessToken');
        let usuario = localStorage.getItem('user_id');

        if(!token){
            throw new console.error('No se encontro el token de acceso');
        }

        let response = await fetch(`http://127.0.0.1:8000/objetivo_plan/${usuario}`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`

            }
        })

        if(!response.ok){
            let error_body = await response.json();
            throw new console.error(`Error en la solicitud (${response.status}): ${response.statusText}. Detalles: ${JSON.stringify(error_body)}`);
        }

        let data = await response.json();
        // console.log('readme:', data);
        return data
    }catch(error){
        console.error('Algo salio mal al intentar obtener los datos')
    }
}

let promesa = read_objetivos_db();

async function create_objetivo(datos_input){

    try{
        let token = localStorage.getItem('accessToken');
        let usuario = localStorage.getItem('user_id');

        let datos_objetivo = {
            usuario_id: usuario,  // Reemplaza con el valor correcto
            plan: "",  // Reemplaza con el valor correcto
            objetivo_principal: datos_input
        }
        

        if(!token){
            throw new Error('No se encontró un token de acceso')
        };

        let response = await fetch(`http://127.0.0.1:8000/objetivo_plan/add_objetivo/${usuario}`, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datos_objetivo)
        });

        if(!response.ok){
            let error_body = await response.json()
            throw new Error(`Error en la solicitud (${response.status}): ${response.statusText}. Detalles: ${JSON.stringify(error_body)}`);
        }

        let data = await response.json();
        console.log('Registro creado:', data)
    }catch(error){
        console.log('Algo salió mal al crear el registro:', error.message)
    }
}

async function update_objetivos(datos ,num_objetivo_plan){
    
    try{
        let token = localStorage.getItem('accessToken');
        let usuario = localStorage.getItem('user_id');

        let datos_objetivo = {
            plan: "",  // Reemplaza con el valor correcto
            objetivo_principal: datos['objetivo_principal']
        }

        if(!token){
            throw new Error('No se encontro el token de acceso')
        };
        let response = await fetch(`http://127.0.0.1:8000/objetivo_plan/update_objetivo/${usuario}/${num_objetivo_plan}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datos_objetivo)
        });
        
        if(!response.ok){
            let error_body = await response.json()
            throw new Error(`Error en la solicitud (${response.status}): ${response.statusText}. Detalles: ${JSON.stringify(error_body)}`);
        }
        
        let data = await response.json();
        console.log('Registro creado:', data)
    }catch(error){
        console.log('Algo salió mal al crear el registro:', error.message)
    }
}

class Read_objetivos_FE{
    constructor(promesa){
        this.promesa = promesa;
        this.elementos_agregacion = {
            parrafo_objetivo : document.createElement('p'),
            contenedor_objetivos: document.getElementById('objetivo_id')
        }
        
    }

    agregacion_FE() {
        this.promesa.then((listaDatos) => {
            // console.log(listaDatos);
            let contador = 0
            for (let objetivo of listaDatos) {
                let parrafo = document.createElement('p');
                parrafo.className= 'parrafo_objetivo'
                parrafo.id = 'parrafo_read'+ contador
                parrafo.textContent = objetivo.objetivo_principal;

                this.elementos_agregacion.contenedor_objetivos.appendChild(parrafo);
                contador ++
            }
        });
    }
}

class Add_objetivos{
    constructor(){
        this.elementos_agregacion ={
            boton_agregar : document.getElementById('btnObjetivos'),
            input : document.createElement('input'),
            boton_guardar : document.createElement('button'),
            contenedor_objetivos : document.getElementById('objetivo_id')
        }
    }

    agregar_nuevo_objetivo(){
        let boton_agregar = this.elementos_agregacion.boton_agregar;
        
        let boton_guardar = this.elementos_agregacion.boton_guardar;
        boton_guardar.className = 'boton_guardar_objetivos';
        boton_guardar.id ='boton_guardar_objetivos';

        let input = this.elementos_agregacion.input
        input.className = 'input_agregar_objetivos'
        input.id = 'input_agregar_objetivos'
        input.placeholder = 'Objetivo principal...'

        boton_agregar.addEventListener('click', () =>{        
            let padre = boton_agregar.parentNode
            padre.replaceChild(boton_guardar, this.elementos_agregacion.boton_agregar);


            this.elementos_agregacion.contenedor_objetivos.appendChild(input)
            input.focus()
        })

        boton_guardar.addEventListener('click', () => {
            let info_agregado_input = input.value
            console.log(info_agregado_input)
            create_objetivo(info_agregado_input)
            location.reload()
        })
    }
}

class Update_objetivos{
    constructor(promesa){
        this.promesa = promesa,
        this.elementos_necesarios_update = {
            boton_modificar : document.getElementById('btn_update'),
            boton_guadar : document.createElement('button'),
            contenedor_parrafos : document.getElementById('objetivo_id'),
            boton_a_reemplazar : document.getElementById('btnObjetivos')
        }
    }

    update_objetivos() {
        let btn_modificar = this.elementos_necesarios_update.boton_modificar;
        let boton_guadar = this.elementos_necesarios_update.boton_guadar;
        boton_guadar.className = 'boton_guadar_update'
    
        // Crear el botón de cancelar
        let boton_cancelar = document.createElement('button');
        boton_cancelar.textContent = 'Cancelar';
        boton_cancelar.id = 'btnCancelar'; // Asigna un ID adecuado
        boton_cancelar.className = 'btnCancelar'; // Ajusta la clase según tus estilos
    
        // Contenedor para ambos botones
        let contenedor_botones = document.createElement('div');
        contenedor_botones.appendChild(boton_guadar);
        contenedor_botones.appendChild(boton_cancelar);
    
        boton_guadar.textContent = 'Guardar ';
    
        let edicionActiva = false;
        let contenidoOriginal = {}; // Objeto para almacenar contenido original por párrafo
    
        btn_modificar.addEventListener('click', () => {
            let contenedor_objetivos = this.elementos_necesarios_update.contenedor_parrafos;
            let elementosHijos = contenedor_objetivos.children;
            let elementosElement = Array.from(elementosHijos).filter(element => element.nodeType === 1);
    
            let padre = this.elementos_necesarios_update.boton_a_reemplazar.parentNode;
            padre.replaceChild(contenedor_botones, this.elementos_necesarios_update.boton_a_reemplazar);
    
            for (let i of elementosElement) {
                if (i.id !== 'objetivosLabel') {
                    i.classList.add('resaltar-elemento');
                    i.contentEditable = false;
    
                    i.addEventListener('click', (event) => {
                        if (!edicionActiva) {
                            let parrafoClickeado = event.currentTarget;
                            parrafoClickeado.classList.add('filaClickeada');
                            let indiceFilaClickeada = Array.from(elementosElement).indexOf(parrafoClickeado) -1;
                            // console.log(indiceFilaClickeada)
                            edicionActiva = true;
    
                            contenidoOriginal[i.id] = parrafoClickeado.textContent;
    
                            i.contentEditable = true;
    
                            boton_guadar.addEventListener('click', async () => {
                                let objeto_info_update = {
                                    objetivo_principal: i.textContent.toString()
                                };
                            
                                console.log(objeto_info_update);
                                edicionActiva = false;
                                                        
                                let listaDatos = await promesa; // Esperar a que la promesa se resuelva
                                let id_update_data = listaDatos[indiceFilaClickeada]['id'];
                                console.log(id_update_data)
                                await update_objetivos(objeto_info_update, id_update_data);

                                location.reload()
                            });
    
                            boton_cancelar.addEventListener('click', () => {
                                // Restablecer el contenido original del párrafo
                                parrafoClickeado.textContent = contenidoOriginal[i.id];
                                parrafoClickeado.classList.remove('filaClickeada');
                                edicionActiva = false;
                                i.contentEditable = false;
                            });
                        }
                    });
    
                    setTimeout(() => {
                        i.classList.remove('resaltar-elemento');
                    }, 4000);
                }
            }
        });
    }
}    

function boton_activar_desactivar_vista (){
    // let btn_objetivo_id_desactivado = document.getElementById('btn_objetivo_id_desactivado');
    let btn_vista = document.getElementById('btn_vista');
    let objetivo_id = document.getElementById('objetivo_id');
    

    let vista_activada = true;

    btn_vista.addEventListener('click', () => {
    if (vista_activada) {
        let btn_vista = document.getElementById('btn_vista')

        objetivo_id.classList.remove('objetivo_id_activado');
        objetivo_id.classList.add('objetivo_id_desactivado');
        btn_vista.textContent = 'Vista desactivada'

    } else {
        objetivo_id.classList.remove('objetivo_id_desactivado');
        objetivo_id.classList.add('objetivo_id_activado');
        btn_vista.textContent = 'Vista activada'
    }

    vista_activada = !vista_activada; // Cambia el estado de vista_activada
    });

    

    // if(btn_objetivo_id_activado){
    //     btn_objetivo_id_activado.addEventListener('click', () =>{
    //         objetivo_id.classList.remove('objetivo_id_desactivado')

    //         objetivo_id.classList.add('btn_objetivo_id_activado')
    //     })  
    // }
    
   
}





boton_activar_desactivar_vista()
let read_objetivos = new Read_objetivos_FE(promesa);
read_objetivos.agregacion_FE()

let addObjetivo = new Add_objetivos()
addObjetivo.agregar_nuevo_objetivo()

let objetivos_update = new Update_objetivos(promesa)
objetivos_update.update_objetivos()