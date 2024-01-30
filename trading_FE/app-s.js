// Esta funcion lo trae los datos de la base de datos directamente cuando hacemos login de las entradas...
// async function informacion_directa_login() {
//     // let token = localStorage.getItem('accessToken');
//     // let usuario = localStorage.getItem('user_id');
//     let datos_entrada = localStorage.getItem('entradas');
//     // Parsea la cadena JSON para obtener el array original
    
  
//     try {
//       if (!datos_entrada) {
//         throw new Error('No se pudo completar la solicitud');
//       }
//       if(datos_entrada){
//         let listaEntradas = JSON.parse(datos_entrada);
//         // console.log('Información obtenida:', datos_entrada);
        
//         return listaEntradas
//       }
//     } catch (error) {
//       console.error('Ocurrió un error al obtener la información:', error);
//     }
//   }
 

async function get_informacion_entrada_db(){
    try{
        let token = localStorage.getItem('accessToken');
        let usuario = localStorage.getItem('user_id');
        if (!token) {
            throw new Error('No se encontró un token de acceso');
        }

        let response = await fetch(`http://127.0.0.1:8000/entrada/user_id/${usuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            let errorBody = await respuesta.json();
            throw new Error(`Error en la solicitud (${respuesta.status}): ${respuesta.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
          }
        let data = await response.json();
        console.log('datos entradas', data);
        return data
    }catch (error) {
        console.error('Algo salió mal al intentar obtener entradas:', error.message);
    }
}

 // // la asignamos la funcion de peticion a una variavle.
 let promesa = get_informacion_entrada_db();
 promesa.then(function(listaDatos) {
   console.log(listaDatos,)
 })


// Esta funcion cierra la la seccion de usuario actual
function logout() {
    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem('accessToken');
  
      console.log('Token de acceso eliminado correctamente.');
  } else {
      console.log('No hay token de acceso para eliminar.');
  }
  
    window.location.href = 'http://127.0.0.1:5500/trading_FE/Index_login.html';  
  }
window.document.getElementById('btnLogout').addEventListener('click', logout);

// Esta funcion es para agregar datos de entradas.
async function insertarDatos(datos) {
    let datos_format = {};

    // let promesa = obtener_objetivo_plan_db();
    // promesa.then(function(info) {
    // for (let i = 0; i < info.length; i++) {
    //     if (info[i]['usuario_id'] == usuario){
    //         // console.log(info[i]['objetivo_principal']);
    //         FormData['usuario_id']=info[i]['id']
    //     }
    // }
    // });

    Object.assign(datos_format, datos);


    try {
      let token = localStorage.getItem('accessToken');
      let usuario = localStorage.getItem('user_id');

      datos_format['objetivos_plan_id'] = usuario;

      console.log(datos_format)
      if (!token) {
        throw new Error('No se encontró un token de acceso. Inicia sesión para obtener uno.');
      }
  
      
      let respuesta = await fetch(`http://127.0.0.1:8000/entrada/add/user_id/${usuario}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos_format)
      });
  
      if (!respuesta.ok) {
        const errorBody = await respuesta.json();
        throw new Error(`Error en la solicitud (${respuesta.status}): ${respuesta.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
      }
  
      let data = await respuesta.json();
      console.log('Registro creado:', data);
      // Ejemplo de cómo podrías disparar un evento de cambio
      document.dispatchEvent(new Event('datosCambiaron'));


    } catch (error) {
      console.error('Algo salió mal al crear el registro:', error.message);
    }
  }

//Esta funcion nos trae las monedas disponibles en la base de datos para pasar la informacion para las entradas 
async function obtener_modenas_disponibles_db() {
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

// Esta funcion nos trae el plan y los objetivos disponibles de la base de datos.
async function obtener_objetivo_plan_db(){
    try{
      let token = localStorage.getItem('accessToken');
      let usuario = localStorage.getItem('user_id');
      // datos_bd += { ...datos_bd, 'usuario_id': usuario };
      // datos_bd += {'usuario_id': usuario} 
  
      
      if(!token){
        throw new Error('Error en el token');
      }
  
      let response = await fetch('http://127.0.0.1:8000/objetivo_plan/',{
        method: 'GET',
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        let errorBody = await response.json();
        throw new Error(`Error en la solicitud ${response.status}`, errorBody);
      }
      
      let data = await response.json();
      console.log('plan objetio:', data);
      return data
    }catch (error) {
      console.error('Algo salió mal al obtener las objetivos planes:', error.message);
    }
  }



class Tabla {
    constructor(promesa) {
        this.promesa = promesa;
        this.elementosNecesariosTabla = {
        contenedorTabla: document.getElementById('contenedorDivTabla'),
        tabla: document.getElementById('table')
        }
    }
    datosRequeridosInsetTabla = {
      'punto_entrada': '',
      'stop_loss': '',
      'take_profit': '',
      'riesgo_beneficio': '',
      'lotage': '',
      'resultado_usdt': '',
      'compra_venta': '',
      'fecha_creacion': '',
      'moneda_id': '',
      'btn': ''
    };
   
  
    tituloEncabezados() {
      // Esta funcion se encarga de imprimir los encabezados correspondientes 
      let filaEncabezado = document.createElement('tr');
      filaEncabezado.id = 'filaEncabezado';
      filaEncabezado.className = 'filaEncabezado';
      let contador = 0;
  
      let titulo = {
        punto_entrada: 'PuntoEntrada',
        stop_loss: 'StopLoss',
        take_profit: 'TakeProfit',
        riesgo_beneficio: 'RatioRB',
        lotage: 'Lotage',
        resultado_usdt: 'Resultado',
        compra_venta: 'Compra O venta',
        fecha_creacion: 'fecha creacion',
        moneda_cryto : 'Moneda',
        boton_agregar_fila : 'encabezado_btn',
        
      }
  
      for (let nombreEncabezado in titulo) {
        if (nombreEncabezado == 'boton_agregar_fila') {
          let btn_agregas_nueva_entrada = document.createElement('button');
          btn_agregas_nueva_entrada.id = 'btn_agregas_nueva_entrada';
          btn_agregas_nueva_entrada.className = 'btn_agregas_nueva_entrada'
          btn_agregas_nueva_entrada.textContent = '+';
        
            btn_agregas_nueva_entrada.addEventListener('click', () => {
                let agregacion_info = new Add_info_tabla()

                agregacion_info.nueva_entrada()
            });
          
          filaEncabezado.appendChild(btn_agregas_nueva_entrada);
  
        } else if (nombreEncabezado) {
          let celdaEncabezado = document.createElement('th');
          celdaEncabezado.id = 'celdaEncabezado' + contador;
          celdaEncabezado.className = 'celdaEncabezado' + contador;
          filaEncabezado.id = 'filaEncabezado' + contador;
          filaEncabezado.className = 'filaEncabezado' + contador;
          celdaEncabezado.textContent = titulo[nombreEncabezado];
          filaEncabezado.appendChild(celdaEncabezado);
          contador += 1;
        }
      }
      this.elementosNecesariosTabla.tabla.appendChild(filaEncabezado);
      return this.elementosNecesariosTabla.tabla;
    }
  
    agregandoInformacionTablaDesdeBaseDeDatos() {    
      this.promesa.then((listaDatos) => {
        for(let i in listaDatos){                       
          if(listaDatos[i]){
            // console.log(listaDatos[i])
            let contador = 0;
            // Crea una nueva fila para el último dato
            let fila = document.createElement('tr');
      
            for (let campo in this.datosRequeridosInsetTabla) {
              let celda = document.createElement('td');
              if (contador >= 0 && contador <= 9) {
                console.log(celda.id)
                celda.id = 'celdaCorrespondiente' + contador;
              } else {
                contador = 0;
              }
              if (campo == 'btn') {
                // let modificar_elemento_base_de_datos = this.botonModificarElementosEnbaseDeDatos();
                // let btneliminar = this.btnEliminar();
                // fila.appendChild(modificar_elemento_base_de_datos);
                // fila.appendChild(btneliminar);
              } else {
                // Actualiza el contenido de la celda con los datos del último dato
                celda.textContent = listaDatos[i][campo];
                fila.appendChild(celda);
              }
              contador += 1;
            }
            // Agrega la fila a la tabla
            this.elementosNecesariosTabla.tabla.appendChild(fila);
          }
        }
        // // Agrega la tabla al contenedor
        this.elementosNecesariosTabla.contenedorTabla.appendChild(this.elementosNecesariosTabla.tabla);
        // return this.datosRequeridosInsetTabla;
      });
    }
}
  
class Add_info_tabla{
    constructor(){
        contenedor: this.elementos_tabla = {
            contenedorTabla: document.getElementById('contenedorDivTabla'),
            tabla: document.getElementById('table')
            }
    }
    datosRequeridosInsetTabla = {
        'punto_entrada': '',
        'stop_loss': '',
        'take_profit': '',
        'riesgo_beneficio': '',
        'lotage': '',
        'resultado_usdt': '',
        'compra_venta': '',
        'fecha_creacion': '',
        'moneda_id': '',
        'btn': ''
      };
     

    nueva_entrada(){
        let fila = document.createElement('tr');
        let contador = 0 

        for(let campo in this.datosRequeridosInsetTabla){
            let celda = document.createElement('td')
            console.log(campo)
            if(campo != 'btn' && campo != 'compra_venta' && campo != 'fecha_creacion' && campo != 'moneda_id'){
                    celda.contentEditable = true;
                    celda.id = 'celda_nueva' + contador;
                }else{
                    if(campo == 'compra_venta'){
                        celda.id = 'celda_nueva' + contador;
                        let btn_compra_o_venta = document.createElement('select');
                        btn_compra_o_venta.className = 'btn_compra_o_venta'
                        btn_compra_o_venta.id = 'btn_compra_o_venta'
                        // Crear las opciones
                        let opcionGanada = document.createElement('option');
                        opcionGanada.value = true;
                        opcionGanada.text = 'Compra';

                        let opcionPerdida = document.createElement('option');
                        opcionPerdida.value = false;
                        opcionPerdida.text = 'Venta';

                        // Agregar las opciones al select
                        btn_compra_o_venta.add(opcionGanada);
                        btn_compra_o_venta.add(opcionPerdida);

                        celda.appendChild(btn_compra_o_venta);

                    }else if (campo === 'moneda_id'){
                        celda.id = 'celda_nueva' + contador;
                        let btn_moneda_cryto = document.createElement('select');
                        btn_moneda_cryto.id = 'btn_moneda_cryto';
                        btn_moneda_cryto.className = 'btn_moneda_cryto';
            
                        let promesa =  obtener_modenas_disponibles_db();  
                        promesa.then(function(monedas) {
                        console.log(monedas)
                        monedas.forEach(moneda => {
                            let option = document.createElement('option');
                            option.value = moneda.id;
                            option.text = moneda.codigo;
                            btn_moneda_cryto.add(option);
                        });
                       
                        celda.appendChild(btn_moneda_cryto);
                        })
                        }else if (campo != 'fecha_creacion'){
                            celda.id = 'celda_nueva' + contador;

                            let btn_guardar = document.createElement('button');

                            btn_guardar.id = 'btnInsertNuevaFila'
                            btn_guardar.classList = 'btnGuardar'
        
                            btn_guardar.addEventListener('click', () => {
                                for (let i = 0; i < fila.cells.length; i++) {
                                    let propiedad = Object.keys(this.datosRequeridosInsetTabla)[i];
                                    if ((fila.cells[i].textContent == '' || isNaN(fila.cells[i].textContent)) 
                                        && fila.cells[i].id !== "celda_nueva10" 
                                        && fila.cells[i].id !== "celda_nueva6"
                                        && fila.cells[i].id !== "celda_nueva7" 
                                        && fila.cells[i].id !== "celda_nueva8" 
                                        && fila.cells[i].id !== "celda_nueva9"){
                                        
                                        fila.cells[i].classList.add('error_ingresar_dato');
                                        fila.cells[i].focus()
                                        setTimeout(() => {
                                        fila.cells[i].classList.remove('error_ingresar_dato');
                                        }, 2000);
                                    }else{
                                        this.datosRequeridosInsetTabla[propiedad] = fila.cells[i].textContent;
                                        let compraVentaBoolean = btn_compra_o_venta.value === 'true';
                                        this.datosRequeridosInsetTabla['compra_venta'] = compraVentaBoolean
                                        this.datosRequeridosInsetTabla['moneda_id'] = btn_moneda_cryto.value
                                    }
                                    if(this.datosRequeridosInsetTabla['btn'] == false && this.datosRequeridosInsetTabla[propiedad]){
                                        console.log(this.datosRequeridosInsetTabla[propiedad])
                                        
                                    }

                                }
                                // insertarDatos(this.datosRequeridosInsetTabla) 
                                
                            })
                        celda.appendChild(btn_guardar)
                        }else if(campo == 'fecha_creacion'){  
                            celda.id = 'celda_nueva' + contador;
                            let fechaActual = new Date();
                            let fechaFormateada = fechaActual.toISOString();
                            celda.textContent = fechaFormateada
                            
                        }
                    }
                    fila.appendChild(celda);
                    this.elementos_tabla.tabla.appendChild(fila);
                    this.elementos_tabla.contenedorTabla.appendChild(this.elementos_tabla.tabla);
                    contador += 1
        }
    }
}


let tabla = new Tabla(promesa);
tabla.tituloEncabezados();
tabla.agregandoInformacionTablaDesdeBaseDeDatos()

