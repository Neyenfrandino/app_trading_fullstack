#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from fastapi import HTTPException, status

def obtener_objetivo_plan(user_id, db):
    # data  = db.query(models.ObjetivoPlan).all()
    data  = db.query(models.ObjetivoPlan).filter(models.ObjetivoPlan.usuario_id == user_id).all()

    return data
    

def add_objetivo(user_id, modelos, db:Session):
    usuario= db.query(models.User).filter(models.User.id == user_id).first()
    count_objetivo = db.query(models.ObjetivoPlan).filter(models.ObjetivoPlan.usuario_id == user_id).count()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Usuario no encontrado"})
        
    if  count_objetivo < 3:   
        dict_objetivo = dict(modelos)
        nuevo_objetivo  = models.ObjetivoPlan(
            usuario_id = user_id,
            plan = dict_objetivo['plan'],
            objetivo_principal = dict_objetivo['objetivo_principal'],
        )
        nuevo_objetivo.usuario = usuario
        db.add(nuevo_objetivo)
        db.commit()
        db.refresh(nuevo_objetivo)
        return {'Objetivo_nota': 'Agregado exitosamente'}
    
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                        detail={"message": "Se ha superado el numero de agregacion"})



def actualizar_objetivo_plan(user_id, num_objetivo_plan, UpdateObjetivoPlan, db: Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Usuario no encontrado"})

    
    nota = db.query(models.ObjetivoPlan).filter(models.ObjetivoPlan.id == num_objetivo_plan).first()
  
    if nota:
        nota.plan = UpdateObjetivoPlan.plan
        nota.objetivo_principal = UpdateObjetivoPlan.objetivo_principal
        db.commit()
        return {"message": "actualizacion exitosa"}
    
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                        detail={"message": "Nota no encontrada para el usuario"} )
    
   
    
def eliminar_objetivo_plan(user_id, num_objetivo_delete, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id)

    if not usuario.first():
        return {'Message': 'no encontrada'}
    
    nota = db.query(models.ObjetivoPlan).filter(models.ObjetivoPlan.id == num_objetivo_delete).first()
    print(nota)

    if nota:
        # nota.delete(synchronize_session=False)
        db.delete(nota)
        db.commit() 
        return {'Message': 'Se ha eliminado correctamente'}