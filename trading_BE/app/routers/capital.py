from fastapi import APIRouter, Depends, status
from app.schemas import Capital, upDateCapital, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import capital
from app.oauth import get_current_user



router = APIRouter(prefix='/capital',
                   tags=['Capital'])

#Api de inicio de un nuevo lenguaje
# @router.get('/')
# def ruta1():
#     return {'Hola Mundo'}

@router.get('/')
def obtener_capital(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    data = capital.obtener_capital(db)
    return data

	# 'Actualizar un capital'
@router.patch('/user_id')
def actualizar_capital(user_id: int, upDateCapital: upDateCapital, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    respuesta = capital.actualizar_capital(user_id, upDateCapital, db)
    return respuesta


#Creamos una api donde vamos a agregar por el momento los usuarios a una lista 
@router.post('/user_id', status_code=status.HTTP_201_CREATED)
def add_capital(capital_usdt:Capital, user_id:int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta= capital.add_capital(capital_usdt, user_id, db)
    return respuesta


