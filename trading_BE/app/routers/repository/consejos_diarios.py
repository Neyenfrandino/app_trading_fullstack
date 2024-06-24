#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from fastapi import HTTPException, status


def get_daily_items(user_id ,db:Session):
    user_true = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_true:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={"message": "Usuario no encontrado"})
    
    all_data= db.query(models.ConsejosDiarios).all()

    if all_data:
        data = []
        for item in all_data:
            data.append(item.consejo)

    return data

def add_daily_items(user_id, modelo, db:Session):  
    user_true = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_true:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={"message": "Usuario no encontrado"})
    
    nuevo_consejo= models.ConsejosDiarios(
        consejo = modelo.consejo
    )
    db.add(nuevo_consejo)
    db.commit()
    db.refresh(nuevo_consejo)
    return{'Message': 'Consejo agregado correctamente'}


def update_daily_items(user_id: int, id_consejo: int, modelo, db: Session):   
    user_true = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_true:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail={"message": "Usuario no encontrado"}
        )
    
    consejo_true = db.query(models.ConsejosDiarios).filter(models.ConsejosDiarios.id == id_consejo).first()
    if not consejo_true:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail={"message": "Consejo no encontrado"}
        )

    consejo_true.consejo = modelo.consejo
    db.commit()
    return {"message": "Consejo actualizado exitosamente"}


def eliminar_consejo( user_id, id_consejo: int, db:Session):
    user_true = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_true:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={"message": "Usuario no encontrado"})
    
    consejo = db.query(models.ConsejosDiarios).filter(models.ConsejosDiarios.id == id_consejo).first()

    if not consejo:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "Consejo no encontrado"} ) 
    
   
    db.delete(consejo)
    db.commit()  

    return {'Message': 'Consejo eliminado correctamente'}

        





