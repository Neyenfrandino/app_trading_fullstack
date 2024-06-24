#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Entrada, UpdateEntrada, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import entrada
from app.oauth import get_current_user



router = APIRouter(prefix='/entrada', 
                   tags=['Entrada'])



@router.get('/get_entry_user_all/{user_id}', status_code=status.HTTP_200_OK)
def get_entry_user_all(user_id: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = entrada.get_entry_user_all(user_id, db)
    return response 

@router.post('/add_entry', status_code=status.HTTP_201_CREATED)
def add_entry(user_id:int, modelo:Entrada, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = entrada.add_entry(user_id, modelo, db)
    return response


@router.patch('/update_entry', status_code=status.HTTP_200_OK)
def update_entry(user_id: int, id_entry:int, UpdateEntrada: UpdateEntrada, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = entrada.update_entry(user_id, id_entry, UpdateEntrada, db)
    return response

@router.delete('/delete_entry', status_code=status.HTTP_200_OK)
def delete_entry(user_id: int, id_entry : int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = entrada.delete_entry(user_id, id_entry, db)
    return response