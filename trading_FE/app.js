let datos_bd;
// async function obtenerInformacion() {
//   // let token = localStorage.getItem('accessToken');
//   // let usuario = localStorage.getItem('user_id');
//   let datos_entrada = localStorage.getItem('entradas');
//   // Parsea la cadena JSON para obtener el array original
  

//   try {
//     if (!datos_entrada) {
//       throw new Error('No se pudo completar la solicitud');
//     }
//     if(datos_entrada){
//       let listaEntradas = JSON.parse(datos_entrada);
//       // console.log('Información obtenida:', datos_entrada);
//       return listaEntradas
//     }
//   } catch (error) {
//     console.error('Ocurrió un error al obtener la información:', error);
//   }
// }

// // // la asignamos la funcion de peticion a una variavle.
// let promesa = obtenerInformacion();
// promesa.then(function(listaDatos) {
//   console.log(listaDatos)
// })



// function logout() {
//   if (localStorage.getItem('accessToken')) {
//     localStorage.removeItem('accessToken');

//     console.log('Token de acceso eliminado correctamente.');
// } else {
//     console.log('No hay token de acceso para eliminar.');
// }

//   window.location.href = 'http://127.0.0.1:5500/trading_FE/Index_login.html';  
// }

// window.document.getElementById('btnLogout').addEventListener('click', logout);

// async function insertarDatos(datos) {
//   console.log(datos,' datos')
//   try {
//     let token = localStorage.getItem('accessToken');
//     let usuario = localStorage.getItem('user_id');
//     if (!token) {
//       throw new Error('No se encontró un token de acceso. Inicia sesión para obtener uno.');
//     }

    
//     let respuesta = await fetch(`http://127.0.0.1:8000/entrada/add/user_id/${usuario}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(datos)
//     });

//     if (!respuesta.ok) {
//       const errorBody = await respuesta.json();
//       throw new Error(`Error en la solicitud (${respuesta.status}): ${respuesta.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
//     }

//     let data = await respuesta.json();
//     console.log('Registro creado:', data);
//   } catch (error) {
//     console.error('Algo salió mal al crear el registro:', error.message);
//   }
// }


// async function obtener_modenas_disponibles_db() {
//   try {
//     let token = localStorage.getItem('accessToken');
//     if (!token) {
//       throw new Error('Error en el token');
//     }

//     let response = await fetch('http://127.0.0.1:8000/moneda/', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!response.ok) {
//       let errorBody = await response.json();
//       throw new Error(`Error en la solicitud ${response.status}`, errorBody);
//     }

//     let data = await response.json();
//     // console.log('monedas:', data);
//     return data
//   } catch (error) {
//     console.error('Algo salió mal al obtener las monedas:', error.message);
//   }
// }

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
      tabla: document.createElement('table')
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
    'moneda_cryto': '',
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
            this.botonMasNuevaInfo()
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
              let modificar_elemento_base_de_datos = this.botonModificarElementosEnbaseDeDatos();
              let btneliminar = this.btnEliminar();
              fila.appendChild(modificar_elemento_base_de_datos);
              fila.appendChild(btneliminar);
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
  
  botonMasNuevaInfo() {
    let fila = document.createElement('tr');
    let contador = 0
    for (let campo in this.datosRequeridosInsetTabla) {
      let celda = document.createElement('td');
      if (campo != 'btn') {
        if(campo != 'compra_venta' && 
          campo != 'fecha_creacion' &&
          campo != 'moneda_cryto' ){
            celda.contentEditable = true;
            celda.id = 'celdaCamposNuevos' + contador
        }else{
          if (campo == 'compra_venta'){
              // Aniadimos botones select con las opciones correspondientes
              // Crear el elemento select
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

              // Agregar el select a la celda
              celda.appendChild(btn_compra_o_venta);
              btn_compra_o_venta.addEventListener('change', ()=>{
                console.log('Valor seleccionado:', btn_compra_o_venta.value);
              })
          } else if (campo === 'moneda_cryto'){
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
            // btn_moneda_cryto.addEventListener('change', () =>{
            //   console.log(btn_moneda_cryto, 'jaja')
            // })
           
            celda.appendChild(btn_moneda_cryto);
            })
          }
          celda.id = 'celdaCamposNuevos' + contador
        }
        fila.appendChild(celda);
        contador += 1

      }else{
          let btnInsertNuevaFila = document.createElement('button');
          btnInsertNuevaFila.id = 'btnInsertNuevaFila'
          btnInsertNuevaFila.classList = 'btnGuardar'

          btnInsertNuevaFila.addEventListener('click', () => {

            let datos_entrada = {}

            for (let i = 0; i < fila.cells.length; i++) {
              let propiedad = Object.keys(this.datosRequeridosInsetTabla)[i];
              if (propiedad) {
                this.datosRequeridosInsetTabla[propiedad] = fila.cells[i].textContent;
              }
                if ( fila.cells[i].textContent != ''){
                  // console.log(fila.cells[i], 'jaja')
                  for (let e in this.datosRequeridosInsetTabla) {
                    if (e !== 'btn' && e !== '9' && e !== 'compra_venta') {
                      datos_entrada[e] = this.datosRequeridosInsetTabla[e]
                      fila.cells.textContent = datos_entrada
                    }else{
                      let btn_compra_venta = document.getElementById('btn_compra_o_venta')
                      let btn_moneda = document.getElementById('btn_moneda_cryto')
                      datos_entrada['compra_venta'] = btn_compra_venta.value
                      datos_entrada['moneda_cryto'] = btn_moneda.value
                    
                    }
                  }
              }else if (fila.cells[i].id !== 'celdaCamposNuevos7' ){
                fila.cells[i].classList.add('error_ingresar_dato');
                fila.cells[i].focus()
                setTimeout(() => {
                  fila.cells[i].classList.remove('error_ingresar_dato');
                }, 2000);
              }
            }
            // objetivos_plan_id = Column(Integer, ForeignKey('objetivo_plan.id'))
            // usuario_id = Column(Integer, ForeignKey('usuarios.id')) 
            
              // console.log(datos_entrada)
              let promesa = obtener_objetivo_plan_db()
              promesa.then(function(listaDatos) {
                datos_bd = datos_entrada
                // console.log(listaDatos)
              })
              // insertarDatos(datos_entrada)
            return datos_entrada
          })      
        fila.appendChild(btnInsertNuevaFila)
        }
      }
      this.elementosNecesariosTabla.tabla.appendChild(fila);
      this.elementosNecesariosTabla.contenedorTabla.appendChild(this.elementosNecesariosTabla.tabla);
  }

  btnEliminar(){
    let btnEliminar = document.createElement('button')
    btnEliminar.id = 'btnEliminar'
    btnEliminar.className = 'btnEliminar'
    btnEliminar.addEventListener('click', function(event){
      let filaClickeada = event.target.closest('tr');
      let elementosConId = filaClickeada.querySelector('#celdaCorrespondiente8').textContent;
        // console.log(elementosConId)
        // console.log(filaClickeada)
      eliminarEntrada(elementosConId)


    })
    return btnEliminar

  }
  
  botonModificarElementosEnbaseDeDatos() {

    let camposRequeridos = {
      0: "punto_entrada",
      1: "stop_loss",
      2: "take_profit",
      3: "riesgo_beneficio",
      4: "cantidad_lotaje",
      5: 'entrada_es_compra',
      6: "entrada_ganada",
      7: "id_entrada",
    };
    let botonModificado = false;
  
    let modificar_elemento_base_de_datos = document.createElement('button');
    modificar_elemento_base_de_datos.id = 'modificar_elemento_base_de_datos';
    modificar_elemento_base_de_datos.classList = 'btn-modificar';
  
    modificar_elemento_base_de_datos.addEventListener('click', function (event) {
      let filaClickeada = event.target.closest('tr');
      filaClickeada.className = 'filaClickeada'
      let elementos_modificados_valor = filaClickeada.querySelectorAll('td');
      // console.log(elementos_modificados_valor)
  
      if (!botonModificado) {
        modificar_elemento_base_de_datos.classList.remove('btn-modificar');
        modificar_elemento_base_de_datos.classList.add('btnGuardar');
  
        elementos_modificados_valor.forEach(function (celda) {
          celda.contentEditable = true;
          // Agregar escuchador de eventos de entrada para identificar la celda modificada
          celda.addEventListener('input', function () {
            celda.classList.add('celda-modificada');
          });
        });
  
        botonModificado = true;
      } else {
        // Guardar los cambios realizados en las celdas
        elementos_modificados_valor = Array.from(elementos_modificados_valor);
        let datosValidos = false

        elementos_modificados_valor.forEach(function (element, i) {
          if (element.classList.contains('celda-modificada')) {
            let elementosConId = filaClickeada.querySelector('#celdaCorrespondiente8').textContent;
            // console.log(element.textContent)

            if (!isNaN(parseFloat(element.textContent)) && !/[a-zA-Z]/.test(element.textContent)) {
              datosValidos = true
              let contenido_modificado_y_adaptado = {}

              let nuevoContenido = element.textContent;
              let campoCorrespondiente = camposRequeridos[i]
              contenido_modificado_y_adaptado[campoCorrespondiente] = nuevoContenido
              console.log(contenido_modificado_y_adaptado)

              // Aquí puedes realizar la lógica para guardar los cambios en la base de datos
              modificarDatosEntradas(elementosConId, contenido_modificado_y_adaptado)
            }else {
              element.classList.add('error_ingresar_dato');
              setTimeout(() => {
                element.classList.remove('error_ingresar_dato');
              }, 2000);
              
            }
          }
        });
        if(datosValidos ==  true){
          // Restaurar el botón y deshabilitar la edición de celdas
            modificar_elemento_base_de_datos.classList.remove('btnGuardar');
            modificar_elemento_base_de_datos.classList.add('btn-modificar');
    
            elementos_modificados_valor.forEach(function (celda) {
            celda.contentEditable = false;
            celda.classList.remove('celda-modificada');
          });
          botonModificado = false;

        }

      }
    });
  
    return modificar_elemento_base_de_datos;
  }

}

// function botonInsertarDatos(datosUsuario) {
//   let datosRequeridosInsetTabla = {
//     punto_entrada: 0.1,
//     stop_loss: 0.2,
//     take_profit: 0.3,
//     riesgo_beneficio: 0.4,
//     cantidad_lotaje: 0.5,
//     entrada_es_compra: true,
//     entrada_ganada: true, 
//     cantidad_inicial_usdt: 1000,
//     nota_personal: "nota de prueba",
//     plan_trading_detalle: "detalle de prueba",
//     trading_objetivo: "Objetivo de trading"
//   };

//   for (let requerido in datosRequeridosInsetTabla) {
//     if (datosUsuario.hasOwnProperty(requerido)) {
//       // Ajustar tipos de datos según sea necesario
//       switch (requerido) {
//         case 'punto_entrada':
//         case 'stop_loss':
//         case 'take_profit':
//         case 'riesgo_beneficio':
//         case 'cantidad_lotaje':
//         case 'cantidad_inicial_usdt':
//           datosRequeridosInsetTabla[requerido] = parseFloat(datosUsuario[requerido]);
//           break;

//         case 'entrada_es_compra':
//         case 'entrada_ganada':
//           datosRequeridosInsetTabla[requerido] = (datosUsuario[requerido].toLowerCase() === 'true');
//           break;

//         case 'trading_objetivo':
//         case 'plan_trading_detalle':
//         case 'nota_personal':
//           datosRequeridosInsetTabla[requerido] = (datosUsuario[requerido]);
//             break;
//         default:
//           // No se requiere conversión para otras propiedades
//           break;
//       }
//     }
//   }
//   insertarDatos(datosRequeridosInsetTabla);  

  // let valoresActuales = {};
  // for (let datos in datosRequeridosInsetTabla) {
  //   valoresActuales[datos] = datosRequeridosInsetTabla[datos];
    
  // }
  // // Verifica si algún dato ha cambiado
  // let cambiosRealizados = false;
  // for (let datos in datosRequeridosInsetTabla) {
  //   if (valoresActuales.punto_entrada !== datosRequeridosInsetTabla[datos] && 
  //       valoresActuales.stop_loss !== datosRequeridosInsetTabla[datos] && 
  //       valoresActuales.take_profit !== datosRequeridosInsetTabla[datos] && 
  //       valoresActuales.riesgo_beneficio !== datosRequeridosInsetTabla[datos] && 
  //       valoresActuales.cantidad_lotaje !== datosRequeridosInsetTabla[datos] && 
  //       valoresActuales.entrada_es_compra !== datosRequeridosInsetTabla[datos]&& 
  //       valoresActuales.entrada_ganada !== datosRequeridosInsetTabla[datos] )
  //     cambiosRealizados = true;
  //     break;  
  //   }
  

  // // Muestra la luz verde o roja según si hubo cambios
  // if (cambiosRealizados) {
  //   console.log('Luz verde: Hubo cambios en los datos.');
  //   // Aquí puedes realizar la acción correspondiente a los cambios (por ejemplo, luz verde)
  //   insertarDatos(datosRequeridosInsetTabla);  

  // } else {
  //   console.log('Luz roja: No hubo cambios en los datos.');
  //   // Aquí puedes realizar la acción correspondiente a la ausencia de cambios (por ejemplo, luz roja)
  // }

// }

  class datos_fuera_tabla{
    constructor(datos_usuario){
      this.datos_usuario = datos_usuario
      this.elementos_necesarios = {
        elementos_li: document.createElement('li'),
        boton_guadar : document.createElement('button'),
        boton_eliminar : document.createElement('button'),
        boton_modificar : document.createElement('button'),
        boton_agregar_info : document.createElement('button'),
      }
    }
    
    mostrar_informacion(id_campo_a_mostrar_info){
      // En esta funcion imprimimos en la interfaz lo que tenemos en la base de datos o lo que se agrega. 
    let datosRequeridosInsetTabla = {
      punto_entrada: 0.1,
      stop_loss: 0.2,
      take_profit: 0.3,
      riesgo_beneficio: 0.4,
      cantidad_lotaje: 0.5,
      entrada_es_compra: true,
      entrada_ganada: true,
      cantidad_inicial_usdt: 1000,
      nota_personal: "nota de prueba",
      plan_trading_detalle: "detalle de prueba",
      trading_objetivo: "Objetivo de trading"
    };

      // la asignamos la funcion de peticion a una variavle.
      let promesa = obtenerInformacion();
      promesa.then((listaDatos) => {
        // console.log(listaDatos)
        for(let i in listaDatos){
          if(listaDatos[i].trading_objetivo != datosRequeridosInsetTabla.trading_objetivo || 
            listaDatos[i].plan_trading_detalle != datosRequeridosInsetTabla.plan_trading_detalle ||
            listaDatos[i].nota_personal != datosRequeridosInsetTabla.nota_personal ||
            listaDatos[i].cantidad_inicial_usdt != datosRequeridosInsetTabla.cantidad_inicial_usdt){
              let id_campo_a_mostrar_info_UL = document.getElementById(id_campo_a_mostrar_info)
              let li = this.elementos_necesarios.elementos_li;
              
              for(let e in listaDatos[i]){
                switch(true){
                  case e == 'trading_objetivo':
                    let frase = listaDatos[i].trading_objetivo;
                    let palabras = frase.split(' }');
                    let contador = 0
                    for(let oracion in palabras){
                      let li = document.createElement('li')
                      li.id = 'li_id' + contador
                      li.textContent = palabras[oracion].trim()
                      id_campo_a_mostrar_info_UL.appendChild(li)
                      // contador += 1
                    }
                    break
  
                  case e == 'plan_trading_detalle':
                    li.textContent = listaDatos[i].plan_trading_detalle
                    id_campo_a_mostrar_info_UL.appendChild(li)
                    break
  
                  case e == 'nota_personal':
                    li.textContent = listaDatos[i].nota_personal
                    id_campo_a_mostrar_info_UL.appendChild(li)
                    break
  
                  case e == 'cantidad_inicial_usdt':
                    li.textContent = listaDatos[i].cantidad_inicial_usdt
                    id_campo_a_mostrar_info_UL.appendChild(li)
                    break
  
                }
              }
             
            }
        }
      })

    }
  
    objetivo_trading(){
      let contenedor = document.getElementById('contenedor')
      let listaObjetivosUl = document.getElementById('listaObjetivos')


      let boton_guadar = this.elementos_necesarios.boton_guadar
      boton_guadar.textContent = 'Guardar';

      let boton_eliminar = this.elementos_necesarios.boton_eliminar
      boton_eliminar.textContent = 'Eliminar';

      let boton_modificar = this.elementos_necesarios.boton_modificar
      boton_modificar.textContent = 'Modificar'
      
      let boton_agregar_info = this.elementos_necesarios.boton_agregar_info
      boton_agregar_info.textContent = '+'
     

      boton_agregar_info.addEventListener('click', ()=> {
        let li = this.elementos_necesarios.elementos_li.cloneNode(true);
        li.id = 'liDatos'
        li.contentEditable = true
        li.textContent = ''
        listaObjetivosUl.appendChild(li)

      })
      let valorCorrecto = false
      boton_guadar.addEventListener('click', () => {
        let liDatos = document.querySelectorAll('#liDatos');
        let datos_usuario = {}
        let datos_en_cadena = []
        liDatos.forEach((li) => {
          let valor = li.textContent;
          if(valor != ''){
            valorCorrecto = true
            datos_en_cadena.push(valor + ' }');
          }else{
            li.focus()
            li.classList.add('error_ingresar_dato');
                setTimeout(() => {
                  li.classList.remove('error_ingresar_dato');
                }, 2000);
                
          }
        });
        if(valorCorrecto){
          datos_usuario['trading_objetivo'] = datos_en_cadena.join(' ')
          // console.log(datos_usuario)
    
        }
  
      });

      boton_modificar.addEventListener('click', () => {      
        // console.log(filaClickeada)
        let obtenerElementos = document.querySelectorAll('#li_id0');
        // la asignamos la funcion de peticion a una variavle.
        let promesa = obtenerInformacion();
        promesa.then(function(listaDatos) {

          obtenerElementos.forEach((element, i) => {
          element.contentEditable = true
            element.addEventListener('click', (event) => {

              let filaClickeada = event.target.closest('li');
              console.log(filaClickeada.textContent + ' }')
              
              for(let i in listaDatos){
              
                if (listaDatos[i].trading_objetivo.includes(filaClickeada.textContent + ' }')) {
                    console.log('Funciona: El contenido está dentro de la base de datos.');
                    console.log(listaDatos[i].id_entrada)
                    break;  // Termina el bucle al encontrar la coincidencia
                }
              }
            })
        });
      })       // modificarDatosEntradas(idEntrada, datosModificados)
    })
    contenedor.appendChild(boton_agregar_info)  
    contenedor.appendChild(boton_guadar)  
    contenedor.appendChild(boton_modificar)
  }
}


console.log(datos_bd)


let btnObjetivos = document.getElementById('btnObjetivos')

let tabla = new Tabla(promesa);
let datos_fuera = new datos_fuera_tabla();


tabla.tituloEncabezados();
tabla.agregandoInformacionTablaDesdeBaseDeDatos()
tabla.btnEliminar()
tabla.botonModificarElementosEnbaseDeDatos()
datos_fuera.mostrar_informacion('listaObjetivos')



btnObjetivos.addEventListener('click', function() {
  datos_fuera.objetivo_trading()
  console.log(datos_bd)

})




