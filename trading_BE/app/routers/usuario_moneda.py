#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Usuario_moneda, UpdateCantidadMoneda, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.db import models
from app.routers.repository import usuario_moneda
from app.oauth import get_current_user



router = APIRouter(prefix='/usuario_moneda',
                   tags=['Usuario_moneda'])


# #Api de inicio de un nuevo lenguaje
# @router.get('/ruta1')
# def ruta1():
#     return {'Hola Mundo'}


@router.get('/')
def obtener_cantidad_moneda(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = usuario_moneda.obtener_cantidad_moneda(db)
    return data

#Creamos una api donde vamos a agregar por el momento los usuarios a una lista 
@router.post('/crear_usuario', status_code=status.HTTP_201_CREATED)
def add_cantidad_moneda(user_id, modelo: Usuario_moneda, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = usuario_moneda.add_cantidad_moneda(user_id, modelo, db)
    return respuesta

@router.patch('/user_id /num_moneda')
def actualizar_cantidad_moneda(user_id: int, num_moneda:int, UpdateCantidadMoneda:UpdateCantidadMoneda, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = usuario_moneda.actualizar_cantidad_moneda(user_id, num_moneda, UpdateCantidadMoneda, db)
    return respuesta

