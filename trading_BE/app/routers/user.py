from fastapi import APIRouter, Depends, status
from app.schemas import User, User_id, UpdateUser
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import user
from app.oauth import get_current_user


router = APIRouter(prefix='/user',
                   tags=['Users'])


@router.get('/get_user', status_code=status.HTTP_200_OK)
def get_user(user_id:int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = user.get_user(user_id, db)
    return response

	# 'Actualizar un usuario'
@router.patch('/update_user')
def update_user(user_id: int, upDateUser:UpdateUser, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = user.update_user(user_id, upDateUser, db)
    return response


#Creamos una api donde vamos a agregar por el momento los usuarios a una lista 
@router.post('/create_user', status_code=status.HTTP_201_CREATED)
def create_user(usuario:User, db:Session = Depends(get_db)):
    response = user.create_user(usuario, db)
    return response


