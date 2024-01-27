#Aqui van los endpoin
from fastapi import APIRouter, Depends,status
from app.schemas import Nota_personal, UpdateNota_personal, User
from app.db.database import get_db
from sqlalchemy.orm import Session	
from app.db import models
from app.routers.repository import nota_personal
from app.oauth import get_current_user



router = APIRouter(prefix='/nota_personal', 
                   tags=['Nota_personal'])

# # Ruta de ejemplo
# @router.get('/ruta1')
# def ruta1():
#     return {'message': 'Hola Mundo'}

@router.get('/')
def obtener_notas(db: Session = Depends(get_db)):
    data = nota_personal.obtener_notas(db)
    return data


#Creamos una api donde vamos a agregar por el momento los usuarios a una lista 
@router.post('/user_id', status_code=status.HTTP_201_CREATED)
def add_nota(user_id: int, nota:Nota_personal, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta =nota_personal.add_nota(user_id, nota, db)
    return respuesta

	# 'Actualizar un usuario'
@router.patch('/user_id /num_nota')
def actualizar_nota(user_id: int, num_nota:int, UpdateNota_personal:UpdateNota_personal, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = nota_personal.actualizar_nota(user_id, num_nota, UpdateNota_personal, db)
    return respuesta

#		'Eliminar un usuario'
@router.delete('/{user_id} /{num_nota}')
def eliminar_nota(user_id: int,num_nota:int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    respuesta = nota_personal.eliminar_nota(user_id,num_nota, db)
    return respuesta