from fastapi import APIRouter, Depends, status
from app.schemas import User, User_id, UpdateUser
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import user
from app.oauth import get_current_user


router = APIRouter(prefix='/user',
                   tags=['Users'])

# #Api de inicio de un nuevo lenguaje
# @app.get('/ruta1')
# def ruta1():
#     return {'Hola Mundo'}

@router.get('/', status_code=status.HTTP_200_OK)
def obtener_user(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = user.obtener_user(db)
    return data

@router.post('/')
def obtener_usuario_por_id(user_id:int, db:Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    usuario = user.obtener_usuario_por_id(user_id, db)
    return usuario


#		'Eliminar un usuario'
@router.delete('/{user_id}')
def eliminar_usuario(user_id: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = user.eliminar_usuario(user_id, db )
    return respuesta

	# 'Actualizar un usuario'
@router.patch('/user_id')
def actualizar_usuario(user_id: int, upDateUser:UpdateUser, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta =user.actualizar_usuario(user_id, upDateUser, db)
    return respuesta


#Creamos una api donde vamos a agregar por el momento los usuarios a una lista 
@router.post('/crear_usuario', status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario:User, db:Session = Depends(get_db)):
    respuesta= user.crear_usuario(usuario, db)
    return respuesta


