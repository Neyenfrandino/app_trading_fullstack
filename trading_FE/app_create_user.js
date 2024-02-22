async function crear_usuario(campos_not_null) {
    try {
        let usuario = {
            "nombre": campos_not_null.nombre,
            "apellido": campos_not_null.apellido,
            "username": campos_not_null.usuario,
            "password": campos_not_null.password,
            "fecha_nacimiento": campos_not_null.fecha_nacimiento,
            "correo": campos_not_null.email,
            "nacionalidad": campos_not_null.nacionalidad,
        };

        let response = await fetch('http://127.0.0.1:8000/user/crear_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario), 
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        let data = await response.json();
        console.log(data, 'Data');

        if (response.ok) {
            let mensajeUsuarioCreado = document.getElementById('mensaje-exito');
            let formulario_crear_usuario = document.getElementById('formulario_crear_usuario');
            formulario_crear_usuario.style.display = 'none'
            mensajeUsuarioCreado.style.display = 'block';

            setTimeout(function() {
                window.location.href = 'http://127.0.0.1:5501/tradind_FE/Index_login.html';
                // console.log('¡Usuario creado con éxito!', response);
            }, 2000)
          
        }

    } catch (error) {
        console.error('Algo salió mal al crear el usuario: ', error);
    }
}


function data_user() {
    let formulario = document.querySelector('#formulario_crear_usuario');
    let elementosInternos = formulario.querySelectorAll('*');
    let campos_not_null = {}

    elementosInternos.forEach((elemento, index) => {
        if (index == 0 || index == 8) {
            
        } else if (elemento.value.trim() == '') {
            elemento.classList.add('empty');
            setTimeout(() => {
                elemento.classList.remove('empty');
            }, 3000);

        } else if (!elemento.value.trim() == '') {
            let name_campo = document.getElementById(elemento.id)
            // console.log(name_campo.name)
            campos_not_null[name_campo.name] = elemento.value
        }
    });
    let campos_length = Object.keys(campos_not_null).length;
    if(campos_length == 7){
        // console.log(campos_length)
        // console.log(campos_not_null)
        return campos_not_null
    }
};


let btn_registrate = document.getElementById('btn_registrate') 
btn_registrate.addEventListener('click', (event) => {
    event.preventDefault();
    
    console.log('aqui va la funcion para hacer la peticion');
    let datos_not_null = data_user()
    console.log(datos_not_null.email)
    crear_usuario(datos_not_null)
});


function boton_regresar(){
    let boton_regresar = document.getElementById('boton_regresar');
     boton_regresar.addEventListener('click', () => {
        window.location.href = 'http://127.0.0.1:5501/trading_FE/Index_login.html';
     })
}

boton_regresar()