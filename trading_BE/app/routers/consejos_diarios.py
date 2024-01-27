#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Consejos_diarios, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import consejos_diarios
from app.oauth import get_current_user



router = APIRouter(prefix='/consejos_diarios',
                   tags=['ConsejosDiarios'])

#Api de inicio de un nuevo lenguaje
# @router.get('/')
# def ruta1():
#     return {'Hola Mundo'}

@router.get('/')
def obtener_consejos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = consejos_diarios.obtener_consejos(db)
    return data

@router.post('/', status_code=status.HTTP_201_CREATED)
def add_consejo(modelo:Consejos_diarios, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = consejos_diarios.add_consejo(modelo, db)
    return respuesta

@router.patch('/num_consejo')
def actualizar_entrada(num_entrada:int,modelo:Consejos_diarios, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = consejos_diarios.actualizar_consejo(num_entrada,modelo, db)
    return respuesta

@router.delete('/num_entrada')
def eliminar_consejo(num_entrada: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = consejos_diarios.eliminar_consejo(num_entrada, db)
    return respuesta


