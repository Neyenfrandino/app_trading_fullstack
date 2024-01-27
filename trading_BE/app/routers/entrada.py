#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Entrada, UpdateEntrada, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import entrada
from app.oauth import get_current_user



router = APIRouter(prefix='/entrada', 
                   tags=['Entrada'])

# Ruta de ejemplo
# @router.get('/ruta1')
# def ruta1():
#     return {'message': 'Hola Mundo'}

@router.get('/user_id/{user_id}')
def obtener_entradas_id(user_id: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = entrada.obtener_entradas_por_id(user_id, db)
    return data 

@router.post('/user_id', status_code=status.HTTP_201_CREATED)
def add_entrada(user_id:int, modelo:Entrada, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = entrada.add_entrada(user_id, modelo, db)
    return respuesta


@router.patch('/user_id /num_entrada')
def actualizar_entrada(user_id: int, num_entrada:int, UpdateEntrada: UpdateEntrada, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = entrada.actualizar_entrada(user_id, num_entrada, UpdateEntrada, db)
    return respuesta

@router.delete('/{user_id}/{num_entrada}')
def eliminar_entrada(user_id: int, num_entrada: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = entrada.eliminar_entrada(user_id,num_entrada, db)
    return respuesta