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


@router.get('/get_data_wallet')
def get_data_wallet(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = usuario_moneda.get_data_wallet(user_id, db)
    return response

@router.post('/add_coin_wallet_user')
def add_coin_wallet_user(user_id: int, id_modey:int, UpdateCantidadMoneda: UpdateCantidadMoneda, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = usuario_moneda.add_coin_wallet_user(user_id, id_modey, UpdateCantidadMoneda, db)
    return response


@router.patch('/add_moneda')
def add_moneda(user_id: int, id_modey:int, UpdateCantidadMoneda: UpdateCantidadMoneda, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = usuario_moneda.add_moneda(user_id, id_modey, UpdateCantidadMoneda, db)
    return response

@router.patch('/subtract_coin')
def subtract_coin(user_id: int, id_modey:int, UpdateCantidadMoneda: UpdateCantidadMoneda, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = usuario_moneda.subtract_coin(user_id, id_modey, UpdateCantidadMoneda, db)
    return response
    

