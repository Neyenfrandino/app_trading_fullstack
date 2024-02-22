import { read_objetivos_db } from "./objetivo_plan.js";
import { obtener_monedas_disponibles_db } from "./wallet.js";


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
        // console.log('datos entradas', data);
        return data
    }catch (error) {
        console.error('Algo salió mal al intentar obtener entradas:', error.message);
    }
}

 // // la asignamos la funcion de peticion a una variavle.
let promesa = get_informacion_entrada_db();
//  promesa.then(function(listaDatos) {
//   //  console.log(listaDatos)
//  })

 
async function eliminar_entrada(id_entrada){

  try{
    let token = localStorage.getItem('accessToken');
    let usuario = localStorage.getItem('user_id');


    if (!token) {
      throw new Error('No se encontró un token de acceso');
    }

    let response = await fetch(`http://127.0.0.1:8000/entrada/eliminar_entrada/${usuario}/${id_entrada}`,{
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      let errorBody = await respuesta.json();
      throw new Error(`Error en la solicitud (${respuesta.status}): ${respuesta.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
    }

    let data = await response.json();
        console.log('Entrada eliminada  correctamente', data);
        return data;

  }catch (error) {
    console.error('Algo salió mal al intentar eliminar entrada:', error.message);
  }
}


async function modificar_entrada(datos, num_entrada) {

  try {
    let token = localStorage.getItem('accessToken');
    let usuario = localStorage.getItem('user_id');

    if (!token) {
      throw new Error('No se encontró un token de acceso. Inicia sesión para obtener uno.');
    }

    
    let respuesta = await fetch(`http://127.0.0.1:8000/entrada/modificar_entradas/${usuario}/${num_entrada}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      const errorBody = await respuesta.json();
      throw new Error(`Error en la solicitud (${respuesta.status}): ${respuesta.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
    }

    let data = await respuesta.json();
    console.log('Registro creado:', data);

  } catch (error) {
    console.error('Algo salió mal al crear el registro:', error.message);
  }
}

// Esta funcion es para agregar datos de entradas.
async function insertarDatos(datos) {
    let datos_format = {};

    Object.assign(datos_format, datos);
    try {
      let token = localStorage.getItem('accessToken');
      let usuario = localStorage.getItem('user_id');

      datos_format['objetivos_plan_id'] = usuario;
      console.log(datos_format, 'dadada')


      // console.log(datos_format)
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

    } catch (error) {
      console.error('Algo salió mal al crear el registro:', error.message);
    }
}

const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'IOTAUSDT'];  // Ejemplos de símbolos
// URL base de la API de Binance
const base_url = 'https://api.binance.com/api/v3/ticker/price';
async function getPrice(symbol) {
  const url = `${base_url}?symbol=${symbol}`;
  
  return fetch(await url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return { symbol: symbol, price: data.price };
    })
    .catch(error => {
      console.error(`Error al obtener el precio de ${symbol}:`, error);
      return { symbol: symbol, price: null };
    });
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
    'btn': '',
    'botones_crud': '',
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
            if (contador >= 0 && contador <= 10) {
              // console.log(celda.id)
              celda.id = 'celdaCorrespondiente' + contador;
            } else {
              contador = 0;
            }
            if (campo == 'botones_crud') {
              // let modificar_elemento_base_de_datos = this.botonModificarElementosEnbaseDeDatos();
              // let btneliminar = this.btnEliminar();
              // fila.appendChild(modificar_elemento_base_de_datos);
              // fila.appendChild(btneliminar);

                let boton_eliminar = document.createElement('button')
                boton_eliminar.className = 'btnEliminar'
                boton_eliminar.id ='btnEliminar'

                boton_eliminar.addEventListener('click', (Event) =>{
                  let tablaClickeada = Event.target.closest('table');
                  let filas = tablaClickeada.querySelectorAll('tr');
                  // filas.className = 'filaClickeada'

                  // Convertir NodeList a un array
                  let filasArray = Array.from(filas);

                  // Obtener el índice de la fila clickeada
                  let indiceFilaClickeada = filasArray.indexOf(Event.target.closest('tr'));

                  // console.log(listaDatos[indiceFilaClickeada -1 ]['id'])
                  eliminar_entrada(listaDatos[indiceFilaClickeada -1]['id'])
                  location.reload()
                  
              })

              fila.appendChild(boton_eliminar)
            }else if (celda.id == 'celdaCorrespondiente9'){

              let boton_momdificar = document.createElement('button')
              boton_momdificar.className = 'btn_modificar'
              boton_momdificar.id = 'btn_modificar'

              boton_momdificar.addEventListener('click', () => {
                fila.contentEditable = true
                fila.focus()
                let btn_guardar = document.createElement('button');
                btn_guardar.id = 'btnInsertNuevaFila';
                btn_guardar.classList = 'btnGuardar';

                let padre = boton_momdificar.parentNode
                padre.replaceChild(btn_guardar, boton_momdificar)

                btn_guardar.addEventListener('click', (Event) => {

                  let tablaClickeada = Event.target.closest('table');
                  let filas = tablaClickeada.querySelectorAll('tr');
                  fila.className = 'filaClickeada'
                  fila.contentEditable = true
                  fila.focus()
                
                  // Convertir NodeList a un array
                  let filasArray = Array.from(filas);

                  let indiceFilaClickeada = filasArray.indexOf(Event.target.closest('tr'));
                  // console.log (indiceFilaClickeada)

                  let id_entrada = listaDatos[indiceFilaClickeada -1]['id']

                  let datos = boton_guardar_datos(filasArray[indiceFilaClickeada], this.datosRequeridosInsetTabla, 'celdaCorrespondiente')
                  if(datos){

                    let datos_peticion = {
                      'punto_entrada': this.datosRequeridosInsetTabla['punto_entrada'],
                      'stop_loss': this.datosRequeridosInsetTabla['stop_loss'],
                      'take_profit': this.datosRequeridosInsetTabla['take_profit'],
                      'riesgo_beneficio': this.datosRequeridosInsetTabla['riesgo_beneficio'],
                      'lotage': this.datosRequeridosInsetTabla['lotage'],
                      'resultado_usdt': this.datosRequeridosInsetTabla['resultado_usdt'],
                      'compra_venta': this.datosRequeridosInsetTabla['compra_venta'],
                      'moneda_id': this.datosRequeridosInsetTabla['moneda_id'],
                      // "fecha_creacion": this.datosRequeridosInsetTabla['fecha_creacion']
                      
                  };
                    modificar_entrada(datos_peticion, id_entrada)
                    // location.reload()
                  }
                })                
            })
              fila.appendChild(boton_momdificar)

              // console.log(this.datosRequeridosInsetTabla)

            }else{
              // Actualiza el contenido de la celda con los datos del último dato
              celda.textContent = listaDatos[i][campo];
              fila.appendChild(celda);
            }
            contador ++;
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
     

    
  nueva_entrada() {
    let fila = document.createElement('tr');
    let contador = 0;

    for (let campo in this.datosRequeridosInsetTabla) {
      let celda = document.createElement('td');

      if (campo != 'btn' && campo != 'compra_venta' && campo != 'fecha_creacion' && campo != 'moneda_id') {
          celda.contentEditable = true;
          celda.id = 'celda_nueva' + contador;
      } else {
          if (campo == 'compra_venta') {
              celda.id = 'celda_nueva' + contador;
              let btn_compra_o_venta = document.createElement('select');
              btn_compra_o_venta.className = 'btn_compra_o_venta'
              btn_compra_o_venta.id = 'btn_compra_o_venta';

              let opcionGanada = document.createElement('option');
              opcionGanada.value = true;
              opcionGanada.text = 'Compra';

              let opcionPerdida = document.createElement('option');
              opcionPerdida.value = false;
              opcionPerdida.text = 'Venta';

              btn_compra_o_venta.add(opcionGanada);
              btn_compra_o_venta.add(opcionPerdida);

              celda.appendChild(btn_compra_o_venta);

          }else if (campo === 'moneda_id') {
            celda.id = 'celda_nueva' + contador;
            let btn_moneda_cryto = document.createElement('select');
            btn_moneda_cryto.id = 'btn_moneda_cryto';
            btn_moneda_cryto.className = 'btn_moneda_cryto';

            let promesa = obtener_monedas_disponibles_db();
            promesa.then(function (monedas) {
                monedas.forEach(moneda => {
                    let option = document.createElement('option');
                    option.value = moneda.id;
                    option.text = moneda.codigo;
                    btn_moneda_cryto.add(option);
                });

                celda.appendChild(btn_moneda_cryto);
              });
            } else if (campo != 'fecha_creacion') {
                celda.id = 'celda_nueva' + contador;
                let btn_guardar = document.createElement('button');
                btn_guardar.id = 'btnInsertNuevaFila';
                btn_guardar.classList = 'btnGuardar';
                btn_guardar.addEventListener('click', () =>{

                  let datos = boton_guardar_datos(fila, this.datosRequeridosInsetTabla, 'celda_nueva');

                  if (datos) {
                                  
                    let compraVentaBoolean = btn_compra_o_venta.value === 'true';
                    this.datosRequeridosInsetTabla['compra_venta'] = compraVentaBoolean;
                    this.datosRequeridosInsetTabla['moneda_id'] = btn_moneda_cryto.value;
                  
                    console.log(this.datosRequeridosInsetTabla);
                    insertarDatos(this.datosRequeridosInsetTabla);
                    // location.reload()
                    
                  } 
                })
              
                celda.appendChild(btn_guardar)
            } else if (campo == 'fecha_creacion') {
              celda.id = 'celda_nueva' + contador;
              let fechaActual = new Date();
              let fechaFormateada = fechaActual.toISOString();
              celda.textContent = fechaFormateada;
            }
        }
              contador += 1;

      fila.appendChild(celda);
      this.elementos_tabla.tabla.appendChild(fila);
      this.elementos_tabla.contenedorTabla.appendChild(this.elementos_tabla.tabla);
    }
    return this.datosRequeridosInsetTabla;
  }
}

class TablaPrice {
  constructor(symbols) {
    this.symbols = symbols;
    this.elementosNecesariosTabla = {
      contenedor: document.getElementById('contenedor_tabla_valores_monedas_binance'),
      tabla: document.createElement('table'),
    };
    this.addEncabezadosTablaMoneda();
    this.actualizarPrecios(); // Actualizar los precios una vez al inicio
    setInterval(() => this.actualizarPrecios(), 1000); // Actualizar los precios cada 5 segundos
  }

  async addEncabezadosTablaMoneda() {
    this.elementosNecesariosTabla.tabla.className = 'tabla_monedas'

    let tituloEncabezado = document.createElement('tr');
    tituloEncabezado.className = 'tituloEncabezado'
    for (let symbol of this.symbols) {
      let celdaEncabezado = document.createElement('th');
      celdaEncabezado.className = 'celdaEncabezado'
      celdaEncabezado.textContent = symbol;
      tituloEncabezado.appendChild(celdaEncabezado);
    }
    this.elementosNecesariosTabla.tabla.appendChild(tituloEncabezado);
    this.elementosNecesariosTabla.contenedor.appendChild(this.elementosNecesariosTabla.tabla);
  }

  async actualizarPrecios() {
    let filaDatos = document.createElement('tr');
    filaDatos.className = 'filaDatos'
    for (let symbol of this.symbols) {
      try {
        const data = await getPrice(symbol);
        // console.log(`Precio actual de ${data.symbol}: ${data.price}`);
        let celda = document.createElement('td');
        celda.textContent =` $ ${parseFloat(data.price).toFixed(2)}`;
        filaDatos.appendChild(celda);
      } catch (error) {
        console.error(`Error al obtener el precio de ${symbol}:`, error);
        let celda = document.createElement('td');
        celda.textContent = 'Error';
        filaDatos.appendChild(celda);
      }
    }
    // Reemplazar la fila existente con los nuevos precios
    let filaExistente = this.elementosNecesariosTabla.tabla.querySelector('tr:last-child');
    if (filaExistente) {
      this.elementosNecesariosTabla.tabla.replaceChild(filaDatos, filaExistente);
    } else {
      this.elementosNecesariosTabla.tabla.appendChild(filaDatos);
    }
  }
}


let tabla = new Tabla(promesa);
tabla.tituloEncabezados();
tabla.agregandoInformacionTablaDesdeBaseDeDatos()

const tabla_price = new TablaPrice(symbols);
tabla_price.addEncabezadosTablaMoneda();
tabla_price.actualizarPrecios();

function boton_guardar_datos(fila, objeto_datos, valor_id_celda) {
  let datosCorrectos = true;  // Inicializamos el flag
  for (let i = 0; i < fila.cells.length; i++) {
      let propiedad = Object.keys(objeto_datos)[i];
      let valorCelda = fila.cells[i].textContent.trim();

      if ((valorCelda === '' || isNaN(valorCelda))
          && fila.cells[i].id !== valor_id_celda+ "10"
          && fila.cells[i].id !== valor_id_celda+"6"
          && fila.cells[i].id !== valor_id_celda+"7"
          && fila.cells[i].id !== valor_id_celda+"8"
          && fila.cells[i].id !== valor_id_celda+"9") {

          datosCorrectos = false;
          fila.cells[i].classList.add('error_ingresar_dato');
          fila.cells[i].focus();
          setTimeout(() => {
              fila.cells[i].classList.remove('error_ingresar_dato');
          }, 2000);
      } else if (datosCorrectos) {
        console.log('jajaja')
          objeto_datos[propiedad] = valorCelda;
      }
  }

  return datosCorrectos;
}


















