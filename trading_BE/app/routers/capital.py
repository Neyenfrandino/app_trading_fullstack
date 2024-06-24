from fastapi import APIRouter, Depends, status
from app.schemas import Capital, upDateCapital, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.routers.repository import capital
from app.oauth import get_current_user



router = APIRouter(prefix='/capital',
                   tags=['Capital'])


@router.get('/get_capital', status_code=status.HTTP_200_OK)
def get_capital(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print(db, user_id)
    response = capital.get_capital(user_id, db)
    return response

	# 'Actualizar un capital'
@router.patch('/update_capital', status_code=status.HTTP_200_OK)
def update_capital(user_id: int, upDateCapital: upDateCapital, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    response = capital.update_capital(user_id, upDateCapital, db)
    return response


@router.post('/add_capital', status_code=status.HTTP_201_CREATED)
def add_capital(capital_usdt:Capital, user_id:int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    response = capital.add_capital(capital_usdt, user_id, db)
    return response


