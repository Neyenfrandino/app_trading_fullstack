async function get_estadisticas_db(){
    try{
        let token = localStorage.getItem('accessToken');
        let usuario = localStorage.getItem('user_id');

        if(!token){
            throw new Error('No se encontró un token de acceso')
        }
        let response = await fetch(`http://127.0.0.1:8000/estadisticas/get_estadisticas/${usuario}`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        if(!response.ok){
            let errorBody = await response.json();
            throw new Error(`Error en la solicitud (${response.status}): ${response.statusText}. Detalles: ${JSON.stringify(errorBody)}`);
        }
        let data = await response.json()
        // console.log(data, 'Data')
        return data
    }catch (error) {
        console.error('Algo salió mal al intentar obtener entradas:', error.message);
    }
}

// Asignamos la función de petición a una variable.
let promesa = get_estadisticas_db();
promesa.then((listaDatos) => {
  // console.log(listaDatos['estadisticas_ganadoras']);

  const data = {
    labels: ['Ganadoras', 'Perdedoras', 'En Cero'],
    datasets: [{
      label: 'Resultados de Trading',
      data: [
        listaDatos['estadisticas_ganadoras'].ganadas.length,
        listaDatos['estadisticas_ganadoras'].perdidas.length,
        listaDatos['estadisticas_ganadoras'].breakeven.length
      ],
      backgroundColor: [
        'rgba(0, 255, 255, 0.5)',
        'rgba(231, 76, 60, 0.5)',
        'rgb(243, 156, 18)'
      ],
      hoverOffset: 4
    }]
  };

  const ctx = document.getElementById('grafico').getContext('2d');

  const options = {
    responsive: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color:'rgb(255, 255, 255)' // Cambia el color de los labels aquí
        },
        font: {
          weight: 'bold' // Hace que el título sea audaz
        }
      },

      title: {
        display: true,
        text: 'Resultados de Trading',
        color: 'rgb(255, 255, 255)', // Cambia el color del título aquí
        font: {
          weight: 'bolder' // Hace que el título sea audaz
        }
      }
    }
  };

  const myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options
  });

})


function insert_data_estadisticas_card(){
  let card = document.querySelectorAll('#card_id');
  promesa.then((data) => {  
    // Crea un título para la lista
    let titulo_card_ganadas = document.createElement('h5');
    titulo_card_ganadas.textContent = 'Ganadas';

    let titulo_card_perdidas = document.createElement('h5');
    titulo_card_perdidas.textContent ='Perdidas'
  
    // Crea una lista desordenada (ul)
    let lista_ganadas = document.createElement('ul');
    let lista_perdidad = document.createElement('ul');
  
    // Recorre los elementos de tu arreglo y crea un elemento de lista (li) para cada uno
    
    data['estadisticas_ganadoras']['ganadas'].forEach(item => {
        let listItem = document.createElement('li');
        listItem.textContent ='$'+ item + ' USDT';
        lista_ganadas.appendChild(listItem);
    });

    data['estadisticas_ganadoras']['perdidas'].forEach(item => {
        let listItem = document.createElement('li');
        listItem.textContent = '$ '+ item + ' USDT';
        lista_perdidad.appendChild(listItem);
    });

    // Agrega el título y la lista al contenedor
    card[0].appendChild(titulo_card_ganadas);
    card[0].appendChild(lista_ganadas);
    card[0].appendChild(titulo_card_perdidas);
    card[0].appendChild(lista_perdidad);
  });
  
  promesa.then((data) => {
    console.log(data)

    let titulo_ganancias_totales = document.createElement('h5');
    titulo_ganancias_totales.textContent = 'Gagancias';

    let titulo_promedio = document.createElement('h5');
    titulo_promedio.textContent = 'Promedio'


    let lista_ganancias = document.createElement('ul')
    let lista_promedio = document.createElement('ul')

      let listItem = document.createElement('li')
      listItem.textContent = `$${data.total_resultados_usdt_db}USDT`
      lista_ganancias.appendChild(listItem)

      let listaItem = document.createElement('li')
      listaItem.textContent = `$${data.promedio_resultados_usdt_db}USDT`
      lista_promedio.appendChild(listaItem)

      card[1].appendChild(titulo_ganancias_totales)
      card[1].appendChild(lista_ganancias)
      
      card[1].appendChild(titulo_promedio)
      card[1].appendChild(lista_promedio)


    })


}

insert_data_estadisticas_card()

