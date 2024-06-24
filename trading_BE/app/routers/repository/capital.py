from sqlalchemy.orm import Session
from app.db import models
from fastapi import HTTPException, status

def update_capital(user_id, upDateCapital, db: Session):
    
    usuario = db.query(models.User).filter(models.User.id == user_id).first()
    capital = db.query(models.Capital).filter(models.Capital.usuario_id == user_id).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"} )

    if capital:
        if upDateCapital.capital_usdt is not None:
            capital.capital_usdt = upDateCapital.capital_usdt

        db.commit()
        return {"message": "Capital actualizado exitosamente"}
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "Capital no encontrado para el usuario"})
         

        
def add_capital(capital, user_id, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"} )
    
    count_usuario = db.query(models.Capital).filter(models.Capital.usuario_id == usuario.id).count()

    if count_usuario < 1:
        data = dict(capital)
        nueva_data = models.Capital(
            usuario_id = usuario.id,
            capital_usdt = data['capital_usdt']
        )
        db.add(nueva_data)
        db.commit()
        db.refresh(nueva_data)
        return {'Message': 'capital agregado exitosamente!!'}
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Ya tiene capital agregado, debes editarlo'})


def get_capital(user_id, db: Session):
    user_true = db.query(models.Capital).filter(models.Capital.usuario_id == user_id).first()

    if not user_true:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={"message": "No existe capital para el usuario"})
    return user_true







