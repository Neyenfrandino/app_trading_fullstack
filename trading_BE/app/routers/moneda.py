#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Moneda, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import moneda
from app.oauth import get_current_user



router = APIRouter(prefix='/moneda', 
                   tags=['Moneda'])


@router.get('/get_money_all', status_code=status.HTTP_200_OK) 
def get_money_all(db:Session = Depends(get_db)):
    response = moneda.get_money_all(db)
    return response 


@router.post('/add_money', status_code=status.HTTP_201_CREATED)
def add_money(modelo:Moneda, user_id: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = moneda.add_money(user_id, modelo, db)
    return response

@router.patch('/update_money', status_code=status.HTTP_200_OK)
def update_money(codigo_moneda:str, user_id: int, modelo:Moneda, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = moneda.update_money(codigo_moneda, user_id, modelo, db)
    return response

@router.delete('/delete_money', status_code=status.HTTP_200_OK)
def delete_money(codigo_moneda: str, user_id: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = moneda.delete_money(codigo_moneda, user_id, db)
    return response