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
        console.log(data, 'Data')
        return data
    }catch (error) {
        console.error('Algo salió mal al intentar obtener entradas:', error.message);
    }
}

// Asignamos la función de petición a una variable.
let promesa = get_estadisticas_db();
promesa.then((listaDatos) => {
  console.log(listaDatos['estadisticas_ganadoras']);

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
        'rgba(0, 255, 255, 0.8)',
        'rgba(0, 0, 0, 0.8)',
        'rgb(241, 196, 15)'
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
          color: 'rgb(0, 0, 0)' // Cambia el color de los labels aquí
        },
        font: {
          weight: 'bold' // Hace que el título sea audaz
        }
      },

      title: {
        display: true,
        text: 'Resultados de Trading',
        color: 'rgb(0, 0, 0)', // Cambia el color del título aquí
        font: {
          weight: 'bold' // Hace que el título sea audaz
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
