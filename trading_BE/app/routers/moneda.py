#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Moneda, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import moneda
from app.oauth import get_current_user



router = APIRouter(prefix='/moneda', 
                   tags=['Moneda'])



# Ruta de ejemplo
# @router.get('/ruta1')
# def ruta1():
#     return {'message': 'Hola Mundo'}


@router.get('/')
def obtener_moneda(db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = moneda.obtener_moneda(db)
    return data 


@router.post('/user_id', status_code=status.HTTP_201_CREATED)
def add_moneda(modelo:Moneda, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = moneda.add_moneda(modelo, db)
    return respuesta

@router.patch('/user_id /codigo_moneda')
def actualizar_moneda(codigo_moneda:str, modelo:Moneda, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = moneda.actualizar_moneda(codigo_moneda, modelo, db)
    return respuesta

@router.delete('/codigo_moneda')
def eliminar_moneda(codigo_moneda: str, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = moneda.eliminar_moneda(codigo_moneda, db)
    return respuesta