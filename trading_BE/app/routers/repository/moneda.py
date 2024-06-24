#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime
from fastapi import HTTPException, status


def get_money_all(db:Session):
    try:
        data  = db.query(models.Moneda).all()
        if data:
            return data
        else:
            return []
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail={"message": str(e)})


def add_money(user_id, modelo, db: Session):
    uset_true = db.query(models.User).filter(models.User.id == user_id).first()
    if not uset_true:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={"message": "Usuario no encontrado"})
    
    moneda_existente = db.query(models.Moneda).filter(
        (models.Moneda.nombre == modelo.nombre) | (models.Moneda.codigo == modelo.codigo) 
    ).first()

    if moneda_existente:
         raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Moneda ya existente'})  
    

    nueva_moneda = models.Moneda(
        nombre = modelo.nombre,
        codigo = modelo.codigo.upper(),
        # ruta_img = modelo.ruta_img
    )

    db.add(nueva_moneda)
    db.commit()
    db.refresh(nueva_moneda)

    return {'Message': 'Moneda agregada exitosamente!!'}


def update_money(codigo_moneda, user_id, modelo, db: Session):
    user_true = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_true:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={"message": "Usuario no encontrado"})

    moneda_existente = db.query(models.Moneda).filter(models.Moneda.codigo == codigo_moneda).first()

    if not moneda_existente:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "Moneda no encontrada"}) 
    
    moneda_existente.nombre = modelo.nombre
    moneda_existente.codigo = modelo.codigo.upper()
    # moneda_existente.ruta_img = modelo.ruta_img
    db.commit()
    db.refresh(moneda_existente) 
    return {"message": "Moneda actualizada exitosamente"}

def delete_money(codigo_moneda, user_id, db:Session):

    try:
        user_true = db.query(models.User).filter(models.User.id == user_id).first()
        if not user_true:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail={"message": "Usuario no encontrado"})
        
        moneda_existente = db.query(models.Moneda).filter(models.Moneda.codigo == codigo_moneda.upper()).first()

        if not moneda_existente:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                                detail={"message": "Moneda no encontrada"}) 
        
        db.delete(moneda_existente)
        db.commit()  

        return {'Message': 'Entrada eliminada correctamente'}
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail={"message": str(e)})
    
