#Aqui van los endpoin
from fastapi import APIRouter, Depends, status
from app.schemas import Moneda, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import estadisticas
from app.oauth import get_current_user

router = APIRouter(prefix='/estadisticas', 
                   tags=['Estadisticas'])


@router.get('/get_estadisticas/{user_id}')
def get_estadisticas(user_id: int, db : Session = Depends(get_db)):
    data = estadisticas.get_estadisticas_db_all(user_id, db)
    return data
    