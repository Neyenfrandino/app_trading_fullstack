#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from app.schemas import Usuario_moneda
from fastapi import HTTPException, status

def obtener_cantidad_moneda(db:Session):
    data  = db.query(models.UsuarioMoneda).all()
    return data
    
def add_cantidad_moneda(user_id, modelo, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Usuario no encontrado"})
    
    add_cant_moneda = dict(modelo)
    count_moneda = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.usuario_id == usuario.id,
                                                         models.UsuarioMoneda.moneda_id == add_cant_moneda['moneda_id']).count()
    if count_moneda < 1:
        nuevo_valor = models.UsuarioMoneda(
            usuario_id = usuario.id,
            moneda_id = 1,
            cantidad = add_cant_moneda['cantidad']
        )
        db.add(nuevo_valor)
        db.commit()
        db.refresh(nuevo_valor)
        return{'Message': 'Se ha agregado correctamente'}  
    return{'Message': 'Solo se puede agragar una ves cada moneda'}  


def actualizar_cantidad_moneda(user_id, num_moneda, UpdateCantidadMoneda, db: Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Usuario no encontrado"})
    
    moneda = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.id == num_moneda).first()
  
    if moneda:
        moneda.cantidad = UpdateCantidadMoneda.cantidad
        db.commit()
        return {"message": "actualizacion exitosa"}
        
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Moneda no encontrada para el usuario"})

    