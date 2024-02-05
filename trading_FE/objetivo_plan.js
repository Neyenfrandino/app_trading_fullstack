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


class read_objetivos_FE{
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


class add_objetivos{
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
        })
    }
}

let read_objetivos = new read_objetivos_FE(promesa);
read_objetivos.agregacion_FE()

let addObjetivo = new add_objetivos()
addObjetivo.agregar_nuevo_objetivo()
