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
            plan: datos['plan'],  // Reemplaza con el valor correcto
            objetivo_principal: datos['objetivo_principal']
        }
        console.log(datos_objetivo)

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

async function delete_objetivos(datos) {
    try {
        let token = localStorage.getItem('accessToken');
        let usuario = localStorage.getItem('user_id');

        console.log(datos);

        if (!token) {
            throw new Error('No se encontró el token de acceso');
        }

        let response = await fetch(`http://127.0.0.1:8000/objetivo_plan/delete/${usuario}/${datos}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            let error_body = await response.json();
            throw new Error(`Error en la solicitud (${response.status}): ${response.statusText}. Detalles: ${JSON.stringify(error_body)}`);
        } else {
            console.log('Se eliminó correctamente el registro');
            // Aquí podrías manejar el éxito de la solicitud, por ejemplo, actualizar la interfaz de usuario.
        }
    } catch (error) {
        console.error('Algo salió mal al eliminar el registro:', error.message);
        // Aquí podrías manejar el error, por ejemplo, mostrar un mensaje de error al usuario en la interfaz de usuario.
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
            let contador = 0
            let contenedor = document.createElement('div');
            contenedor.className = 'contenedor_objetivos'; // Clase para el contenedor
    
            for (let objetivo of listaDatos) {
                let parrafo = document.createElement('p');
                parrafo.className = 'parrafo_objetivo'
                parrafo.id = 'parrafo_read'+ contador
                parrafo.textContent = objetivo.objetivo_principal;
    
                let lineaSeparadora = document.createElement('hr'); // Crear línea separadora
                lineaSeparadora.style.color = 'white'
                contenedor.appendChild(parrafo);
                contenedor.appendChild(lineaSeparadora); // Agregar la línea después del párrafo
                contador++;
            }
            // Agregar el contenedor con todos los párrafos y líneas al elemento contenedor existente
            this.elementos_agregacion.contenedor_objetivos.appendChild(contenedor);
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

        promesa.then((listaDatos) => {
            //  console.log(listaDatos.length)
                // console.log(input.value)
                boton_guardar.addEventListener('click', () => {
                    if(listaDatos.length < 3 && input.value !== ''){
                        let info_agregado_input = input.value
                        // console.log(info_agregado_input)
                        create_objetivo(info_agregado_input)
                        location.reload()
                    }else{
                        let aviso = document.getElementById("aviso");
                        aviso.classList.add("mostrar");
                        input.remove()
                        boton_guardar.remove()

                        // Ocultar el aviso después de 3 segundos (3000 milisegundos)
                        setTimeout(function() {
                          aviso.classList.remove("mostrar");
                          location.reload()

                        }, 3000);
                    }   
                })
           
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
        contenedor_botones.className = 'contenedor_botones'
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

class Delete_objetivo{
    constructor(promesa){
        this.promesa = promesa
        this.elementos_necesarios_delete = {
            boton_delete : document.getElementById('boton_delete'),
            boton_ok : document.createElement('button'),
            boton_agregar_objetivo : document.getElementById('btnObjetivos'),
            contenedor_parrafos : document.getElementById('objetivo_id')
        }
    }

    delete_objetivo(){
        let delete_boton = this.elementos_necesarios_delete.boton_delete;
        let ok_boton = this.elementos_necesarios_delete.boton_ok;
        
        ok_boton.className = 'boton_ok'
        let boton_agregar = this.elementos_necesarios_delete.boton_agregar_objetivo;

        

        delete_boton.addEventListener('click', () => {
            let contenedor_objetivos = this.elementos_necesarios_delete.contenedor_parrafos;
            let elementosHijos = contenedor_objetivos.children;
            let elementosElement = Array.from(elementosHijos).filter(element => element.nodeType === 1);
            

            let contenedor_botones = document.createElement('div');
            contenedor_botones.appendChild(ok_boton);

            let padre = boton_agregar.parentNode;
            padre.replaceChild(ok_boton, boton_agregar);

            for(let i of elementosElement){
                i.addEventListener('click', (event) => {
                    let parrafoClickeado = event.currentTarget;
    
                    parrafoClickeado.className = 'filaClickeada';
                    let indiceFilaClickeada = Array.from(elementosElement).indexOf(parrafoClickeado) -1;

                    promesa.then((listaDatos) => {
                        let info_peticion = listaDatos[indiceFilaClickeada]['id']
                        //  console.log(listaDatos)
                        ok_boton.addEventListener('click', () => {
                            // Lógica para cuando se hace clic en el botón "OK"
                            // console.log(info_peticion);
                            delete_objetivos(info_peticion)
                            location.reload()
                       })
                  
                    });
                })
               
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

let eliminar_objetivos = new Delete_objetivo(promesa)
eliminar_objetivos.delete_objetivo()



class Read_plan{
    constructor(promesa){
        this.promesa = promesa
        this.elementos_necesarios ={
            contenedor_plan : document.getElementById('contenedor_plan'),
            parrafo_plan : document.getElementById("card-text")
        }
    }

    async readme_plan(){
        let tarjetas_contenedor = document.getElementById('tarjetas_contenedor')
    
        // Espera a que la promesa se resuelva para obtener los datos
        let listaDatos = await this.promesa;
    
        listaDatos.forEach((element) => {
            let contenedorTarjetas = document.createElement('div');
            contenedorTarjetas.className = 'contenedor_plan'
            if (element.plan != '') {
                let tarjeta = document.createElement('div');
                tarjeta.id = 'contenedor_plan'
                tarjeta.classList.add('card', 'mb-3');
                tarjeta.style.maxWidth = '600px';
    
                let row = document.createElement('div');
                row.classList.add('row', 'g-0');
    
                let colImg = document.createElement('div');
                colImg.classList.add('col-md-4');
    
                let img = document.createElement('img');
                img.src = 'img/stickies-2852375_1920.jpg';
                img.classList.add('img-fluid', 'rounded-start');
                img.alt = '...';
    
                colImg.appendChild(img);
                row.appendChild(colImg);
    
                let colContent = document.createElement('div');
                colContent.classList.add('col-md-8');
    
                let cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
    
                let cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = 'Plan de acción...';
    
                let cardText = document.createElement('p');
                cardText.classList.add('card-text');
                cardText.textContent = element.plan;
    
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                colContent.appendChild(cardBody);
                row.appendChild(colContent);
    
                tarjeta.appendChild(row);
                contenedorTarjetas.appendChild(tarjeta);
                tarjetas_contenedor.appendChild(contenedorTarjetas)
            }
        });
    }
    
    
}

let read_plan = new Read_plan(promesa)
read_plan.readme_plan() 


class Add_plan{
    constructor(promesa){
        this.promesa = promesa;
        this.elementos_necesarios = {
            boton_add_plan : document.getElementById('boton_add_plan'),
            contenedor_plan : document.getElementById('contenedor_plan_add'),
            parrafo_plan : document.getElementById("card-text")
            
        }
    }

    add_plan(){
        let boton_plan = this.elementos_necesarios.boton_add_plan; 
        
        boton_plan.addEventListener('click', () =>{
            console.log('ffucina ')
            let parrafos_objetivo = document.querySelectorAll(".parrafo_objetivo")
            let update_plan_object = {}
            let id_update;
    
            parrafos_objetivo.forEach((element) =>{
                element.addEventListener('click', async (event) => {
                    let parrafoClickeado = event.currentTarget;
                    let indiceFilaClickeada = Array.from(parrafos_objetivo).indexOf(parrafoClickeado);
                    console.log(parrafoClickeado.textContent)
    
                    let listaDatos = await this.promesa; // Esperar a que la promesa se resuelva
                    let id_update_data = listaDatos[indiceFilaClickeada].id;
                    id_update = id_update_data
                    update_plan_object['objetivo_principal'] = parrafoClickeado.textContent
    
                    let contenedor_plan = this.elementos_necesarios.contenedor_plan;
                    contenedor_plan.className = 'contenedor_plan'
                    let parrafo_plan = this.elementos_necesarios.parrafo_plan
                    parrafo_plan.contentEditable = true
                    contenedor_plan.style.display = 'block'
    
                    let boton_guardar_plan = document.createElement('button')
                    boton_guardar_plan.textContent = 'guardar'
                    boton_guardar_plan.addEventListener('click',async () =>{
                        console.log(parrafo_plan.textContent)
                        update_plan_object['plan'] = parrafo_plan.textContent
    
                        await update_objetivos(update_plan_object, id_update);                
    
                    })
    
                    contenedor_plan.appendChild(boton_guardar_plan)
                })
            })            
        })
    }
    
}

let plan_add = new Add_plan(promesa)
plan_add.add_plan()
