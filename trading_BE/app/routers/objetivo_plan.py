#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Objetivo_plan, UpdateObjetivoPlan, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.db import models
from app.routers.repository import objetivo_plan
from app.oauth import get_current_user


router = APIRouter(prefix='/objetivo_plan', 
                   tags=['Objetivo_plan'])


# Ruta de ejemplo
# @router.get('/ruta1')
# def ruta1():
#     return {'message': 'Hola Mundo'}

@router.get('/{user_id}')
def obtener_objetivo_plan(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = objetivo_plan.obtener_objetivo_plan(user_id, db)
    return data

#Creamos una api donde vamos a agregar por el momento los usuarios a una lista 
@router.post('/add_objetivo/{user_id}', status_code= status.HTTP_201_CREATED )
def add_objetivo(user_id: int, models:Objetivo_plan, db:Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    respuesta = objetivo_plan.add_objetivo(user_id, models, db)
    return respuesta

	# 'Actualizar un usuario'
@router.patch('/user_id /num_objetivo_plan')
def actualizar_objetivo_plan(user_id: int,num_objetivo_plan:int, UpdateObjetivoPlan:UpdateObjetivoPlan, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = objetivo_plan.actualizar_objetivo_plan(user_id, num_objetivo_plan, UpdateObjetivoPlan, db)
    return respuesta


# @router.delete('/{user_id}')
# def eliminar_objetivo_plan(user_id: int, db:Session = Depends(get_db)):
#     respuesta = objetivo_plan.eliminar_objetivo_plan(user_id, db)
#     return respuesta