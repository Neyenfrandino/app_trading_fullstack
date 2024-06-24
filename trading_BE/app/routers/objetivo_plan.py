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


@router.get('/get_target', status_code=status.HTTP_200_OK)
def get_target(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = objetivo_plan.get_target(user_id, db)
    return response

#Creamos una api donde vamos a agregar por el momento los usuarios a una lista 
@router.post('/add_objetivo', status_code= status.HTTP_201_CREATED )
def add_objetivo(user_id: int, models:Objetivo_plan, db:Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    response = objetivo_plan.add_objetivo(user_id, models, db)
    return response

	# 'Actualizar un usuario'
@router.patch('/update_target', status_code=status.HTTP_200_OK)
def update_target(user_id: int, id_target_plan:int, UpdateObjetivoPlan:UpdateObjetivoPlan, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = objetivo_plan.update_target(user_id, id_target_plan, UpdateObjetivoPlan, db)
    return response


# @router.delete('/delete/{user_id}/{num_objetivo_delete}')
# def eliminar_objetivo_plan(user_id: int, num_objetivo_delete: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     respuesta = objetivo_plan.eliminar_objetivo_plan(user_id, num_objetivo_delete, db)
#     return respuesta