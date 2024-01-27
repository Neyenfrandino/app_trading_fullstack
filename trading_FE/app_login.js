
export async function login(auth) {
    try {
        let formData = new FormData();
        formData.append('username', auth.username);
        formData.append('password', auth.password);

        let response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud' + response.statusText);
        }

        let data = await response.json();
        let access_token = data['access token'];
        let usuario = data['user_id']
        
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('user_id', usuario);
        if (response.ok) {
            window.location.href = 'http://127.0.0.1:5500/trading_FE/index.html';
        }
    } catch (error) {
        console.error('Algo salió mal al crear el registro: ', error);
        let username_login = document.getElementById('username_login');
        let password_login = document.getElementById('password_login');
        let mensaje_error_usuario = document.getElementById('mensaje_error_usuario');

        mensaje_error_usuario.style.display = 'block';
        username_login.classList.add('empty');
        password_login.classList.add('empty');
        setTimeout(()=>{
            mensaje_error_usuario.style.display = 'none'
            username_login.classList.remove('empty');
            password_login.classList.remove('empty');
        }, 3000)
    }
    
}

  
//   // la asignamos la funcion de peticion a una variavle.
//  let promesa = login();
//  promesa.then(function(data) {
//  console.log(data)
// })

export function datos_login(){
    let username_login = document.getElementById('username_login');
    let password_login = document.getElementById('password_login');
    // console.log(username_login, password_login);

    if(username_login.value.trim() === '' && password_login.value.trim() === ''){
        username_login.classList.add('empty');
        password_login.classList.add('empty');
        setTimeout(()=>{
            username_login.classList.remove('empty');
            password_login.classList.remove('empty');
        }, 3000)

    }else if(username_login.value.trim() === ''){
        username_login.classList.add('empty');
        setTimeout(()=>{
            username_login.classList.remove('empty');
        }, 3000)
        
    }else if (password_login.value.trim() === ''){
        password_login.classList.add('empty');
        setTimeout(()=>{
            password_login.classList.remove('empty');
        }, 3000)
    }

    let auth = {
        username: username_login.value,
        password: password_login.value
    };

    return auth
}


document.addEventListener('DOMContentLoaded', () => {
    
    let btn_login = document.getElementById('btn_login');
    btn_login.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        let auth = datos_login();
        await login(auth);
    } catch (error) {
        console.error('Error en el evento click del botón de login: ', error);
    }
});

    let btn_create_new_account = document.getElementById("create-account");
    btn_create_new_account.addEventListener('click', async (event) => {
        event.preventDefault();
        try{
            window.location.href = 'http://127.0.0.1:5500/trading_FE/creacion_usuario.html';
        } catch (error){
            console.log('Error al intentar crear usuario', error)
        }
    })
});





