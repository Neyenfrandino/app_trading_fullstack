#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Consejos_diarios, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import consejos_diarios
from app.oauth import get_current_user



router = APIRouter(prefix='/consejos_diarios',
                   tags=['ConsejosDiarios'])

@router.get('/get_daily_items', status_code=status.HTTP_200_OK)
def get_daily_items(user_id:int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = consejos_diarios.get_daily_items(user_id, db)
    return response

@router.post('/add_daily_items', status_code=status.HTTP_201_CREATED)
def add_daily_items(user_id:int, modelo:Consejos_diarios, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = consejos_diarios.add_daily_items(user_id, modelo, db)
    return response

@router.patch('/update_daily_items', status_code=status.HTTP_200_OK)
def update_daily_items(user_id:int, id_consejo:int, modelo:Consejos_diarios, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = consejos_diarios.update_daily_items(user_id, id_consejo, modelo, db)
    return response

@router.delete('/delete_daily_items', status_code=status.HTTP_200_OK)
def delete_daily_items(user_id:int, id_consejo: int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = consejos_diarios.delete_daily_items(user_id ,id_consejo, db)
    return response


