#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime
from fastapi import HTTPException, status


def obtener_moneda(db:Session):
    data  = db.query(models.Moneda).all()
    return data


def add_moneda(modelo, db:Session):
    entrada_data = dict(modelo)

    moneda_existente = db.query(models.Moneda).filter(
        (models.Moneda.nombre == entrada_data['nombre']) | (models.Moneda.codigo == entrada_data['codigo'])
    ).first()

    if moneda_existente:
         raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Moneda ya existente'})  
    

    nueva_moneda = models.Moneda(
        nombre = entrada_data['nombre'],
        codigo = entrada_data['codigo'],
        ruta_img = entrada_data['ruta_img']
    )
    db.add(nueva_moneda)
    db.commit()
    db.refresh(nueva_moneda)

    return {'Message': 'Moneda agregada exitosamente!!'}


def actualizar_moneda(codigo_moneda, modelo, db: Session):

    moneda_existente = db.query(models.Moneda).filter(models.Moneda.codigo == codigo_moneda).first()

    if not moneda_existente:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "Moneda no encontrada"}) 
    
    moneda_existente.nombre = modelo.nombre
    moneda_existente.codigo = modelo.codigo
    moneda_existente.ruta_img = modelo.ruta_img
    db.commit()
    db.refresh(moneda_existente) 
    return {"message": "Moneda actualizada exitosamente"}

def eliminar_moneda(codigo_moneda, db:Session):
    moneda_existente = db.query(models.Moneda).filter(models.Moneda.codigo == codigo_moneda).first( )

    if not moneda_existente:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "Moneda no encontrada"}) 
    
    db.delete(moneda_existente)
    db.commit()  

    return {'Message': 'Entrada eliminada correctamente'}
    
