//Esta funcion nos trae las monedas disponibles en la base de datos para pasar la informacion para las entradas 
export async function obtener_monedas_disponibles_db() {
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Error en el token');
      }
  
      let response = await fetch('http://127.0.0.1:8000/moneda/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        let errorBody = await response.json();
        throw new Error(`Error en la solicitud ${response.status}`, errorBody);
      }
  
      let data = await response.json();
      // console.log('monedas:', data);
      return data
    } catch (error) {
      console.error('Algo salió mal al obtener las monedas:', error.message);
    }
  }

async function get_data_wallet(){
    try{
        let token = localStorage.getItem('accessToken');
        let usuario = localStorage.getItem('user_id');
        if(!token){
            throw new Error('No se encontro el token de acceso')
        }
        let response = await fetch(`http://127.0.0.1:8000/usuario_moneda/get_datos_wallet/${usuario}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if(!response.ok){
            let errorBody = await response.json();
            throw new Error(`Error en la solicitud (${response.status}): ${response.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
        }

        let data = await response.json()
        // console.log('Datos desde la base de datos', data)
        return data 
    }catch (error) {
        console.error('Algo salió mal al intentar obtener entradas:', error.message);
    }
}

async function add_usuario_moneda_wallet(data){

    try{
        let token = localStorage.getItem('accessToken');
        let usuario = localStorage.getItem('user_id')
        if(!token){
            throw new Error('No se encontro token de acceso')
        }

        let response = await fetch(`http://127.0.0.1:8000/usuario_moneda/crear_usuario_moneda/${usuario}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        if(!response.ok){
            let errorBody = await response.json();
            throw new Error(`Error en la solicitud (${response.status}): ${response.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
        }

        let data_promise = response.json()
        console.log('Agregacion exitosa', data_promise)
        return data_promise
    }catch (error) {
        console.error('Algo salió mal al intentar obtener entradas:', error.message);
    }
}

async function update_usuario_moneda_wallet(moneda_id, cantidad){
   
    try{
        let data ={
            'cantidad': cantidad
        }
        let token = localStorage.getItem('accessToken');
        let usuario= localStorage.getItem('user_id')
        if(!token){
            throw new Error('No se encontro token de acceso')
        }

        let response = await fetch(`http://127.0.0.1:8000/usuario_moneda/update_moneda/${usuario}/${moneda_id}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        if(!response.ok){
            let errorBody = await response.json();
            throw new Error(`Error en la solicitud (${response.status}): ${response.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
        }
        let data_promise = response.json()
        console.log('Agregacion exitosa', data_promise)
        return data_promise
    }catch (error) {
        console.error('Algo salió mal al intentar obtener entradas:', error.message);
    }
}

function boton_depositar_moneda(nombre_moneda){
    // Crear el modal
    let modal = document.createElement('div');
    
    modal.classList.add('modal', 'fade');
    modal.setAttribute('id', 'myModal');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'exampleModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    // Crear el diálogo del modal y aplicar las clases necesarias
    let modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-dialog-scrollable');
    modal.appendChild(modalDialog);

    // Crear el contenido del modal
    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalDialog.appendChild(modalContent);

    // Agregar el encabezado del modal
    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalContent.appendChild(modalHeader);

    // Agregar título del modal
    let modalTitle = document.createElement('h5');
    modalTitle.className ='modal_title';
    modalTitle.textContent = 'Deposite la cantidad';
    modalHeader.appendChild(modalTitle);

    // Agregar botón de cerrar modal
    let closeButton = document.createElement('button');
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');
    modalHeader.appendChild(closeButton);

    // Agregar el cuerpo del modal
    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    let input_cantidad_deposito = document.createElement('input')
    input_cantidad_deposito.className = 'input_cantidad_deposito'
    modalContent.appendChild(input_cantidad_deposito)
    modalContent.appendChild(modalBody);

    // Agregar el pie del modal
    let modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    modalContent.appendChild(modalFooter);

    let guardar_modal_button = document.createElement('button');
    guardar_modal_button.classList.add('btn', 'btn-secondary');
    guardar_modal_button.textContent = 'Guardar'

    guardar_modal_button.addEventListener('click', () =>{
        let moneda_nombre = nombre_moneda['nombre'];
        if (typeof moneda_nombre === 'string') { // Verificar que moneda_nombre sea una cadena de texto
            let nuevaCadena = moneda_nombre.replace(/\s*\([^)]*\)/, '').trim();
            // console.log(nuevaCadena); // Resultado: 'Bitcoin'
   
            promesa_moneda.then((listaDatos) => {
                listaDatos.forEach(element => {
                    if (element.nombre == nuevaCadena) {
                        // console.log(element.id);
                        // console.log(input_cantidad_deposito.value)
                        
                            let moneda_id = element.id
                            let cantidad = input_cantidad_deposito.value
                        console.log(moneda_id, cantidad, 'asd')
                        update_usuario_moneda_wallet(moneda_id, cantidad)
                        // location.reload()
                    }

                });            
            })
            moneda_nombre = {}; // Objeto vacío

        } else {
            console.log('El nombre de la moneda no está definido o no es una cadena de texto válida.');
        }  
    })
    
    modalFooter.appendChild(guardar_modal_button);

    // Agregar botones al pie del modal
    let modalFooterButton = document.createElement('button');
    modalFooterButton.classList.add('btn', 'btn-secondary');
    modalFooterButton.setAttribute('type', 'button');
    modalFooterButton.setAttribute('data-bs-dismiss', 'modal');
    modalFooterButton.textContent = 'Cerrar';
    modalFooter.appendChild(modalFooterButton);

    // Agregar el modal al body del documento
    document.body.appendChild(modal);

    // Mostrar el modal
    let myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();

}


let promesa = get_data_wallet();
let promesa_moneda = obtener_monedas_disponibles_db()


class Tabla_wallet {
    constructor(promesa) {
        this.promesa = promesa;
        this.elemetos_necesarios = {
            contenedor_tabla_wallet: document.getElementById('container_wallet'),
            tabla_wallet: document.getElementById('tabla_wallet'),
            filas_wallet: document.createElement('tbody'), // Cambiado 'tr' a 'tbody'
            celdas_wallet: document.createElement('td'),
            botones_wallet: document.createElement('td'), // Cambiado a 'td' para contener botones
        };
    }
    

    construccion_tabla() {
        let contenedor_tabla_wallet = this.elemetos_necesarios.contenedor_tabla_wallet;
        let tabla_wallet = this.elemetos_necesarios.tabla_wallet;
        let filas_wallet = this.elemetos_necesarios.filas_wallet;
        let nombre_moneda_fila_click = {}


        promesa.then((listaDatos) => {
            listaDatos.forEach((lista) => {

                let fila = document.createElement('tr'); // Crear una nueva fila para cada conjunto de datos
                fila.className = 'filas_wallet'
                let celdas_wallet_cantidad = this.elemetos_necesarios.celdas_wallet.cloneNode(); // Clonar la celda para cada dato
                celdas_wallet_cantidad.className = 'td_wallet'

                let celdas_wallet_moneda_id = this.elemetos_necesarios.celdas_wallet.cloneNode(); // Clonar la celda para cada dato
                celdas_wallet_moneda_id.className = 'td_wallet'

                let celdas_wallet_botones = this.elemetos_necesarios.botones_wallet.cloneNode(); // Clonar la celda para los botones
                celdas_wallet_botones.className = 'botones_wallet'

                let boton_deposit = document.createElement('button');
                boton_deposit.addEventListener('click', () => {
                
                    // console.log(nombre_moneda_fila_click)
                    boton_depositar_moneda(nombre_moneda_fila_click)

                });
                
                let boton_withdraw = document.createElement('button');
                boton_withdraw.className = 'boton_wallet'

                promesa_moneda.then((listaDatos) => {
                    listaDatos.forEach(element => {
                        if (lista['moneda_id'] == element['id']) {
                            celdas_wallet_moneda_id.textContent = `${element.nombre} (${element.codigo})`;
                        
                        }
                    });
                
                    celdas_wallet_cantidad.textContent = `${lista['cantidad']} USDT `;
                })
                boton_deposit.textContent = 'Deposit';
                boton_withdraw.textContent = 'Withdraw';

                celdas_wallet_botones.appendChild(boton_deposit);
                celdas_wallet_botones.appendChild(boton_withdraw);

                fila.appendChild(celdas_wallet_moneda_id);
                fila.appendChild(celdas_wallet_cantidad);
                fila.appendChild(celdas_wallet_botones);


                fila.addEventListener('click', (event) =>{
                    let fila = event.target.closest('.filas_wallet');

                    if (fila) {
                        // Acceder a los elementos dentro de la fila para obtener la información
                        let nombreMoneda = fila.querySelector('.td_wallet').textContent;
                        nombre_moneda_fila_click['nombre'] = nombreMoneda
                        nombre_moneda_fila_click = {}


                    } else {
                        console.error('No se pudo encontrar la fila asociada al botón');
                    }
                })

                filas_wallet.appendChild(fila);
            });

            tabla_wallet.appendChild(filas_wallet); // Mover esta línea dentro del 'then' para garantizar que se agreguen las filas
            contenedor_tabla_wallet.appendChild(tabla_wallet);
        });
    }
}


let tabla_wallet = new Tabla_wallet(promesa)
tabla_wallet.construccion_tabla()


