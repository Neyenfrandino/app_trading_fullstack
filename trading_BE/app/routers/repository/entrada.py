#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime
from fastapi import HTTPException, status


def obtener_entradas_por_id(user_id, db:Session):
    data  = db.query(models.Entrada).filter(models.Entrada.usuario_id == user_id).all()
    # usuario  = db.query(models.User).filter(models.User.id == user_id).first()
    return data


def add_entrada(user_id, modelo, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"} ) 

    
    objetivo_plan = db.query(models.ObjetivoPlan).filter(models.ObjetivoPlan.usuario_id == usuario.id).first()

    # Resto del código...
    if objetivo_plan:   
        entrada_data = dict(modelo)
        nueva_entrada = models.Entrada(
            objetivos_plan_id= objetivo_plan.id,
            usuario_id= usuario.id,
            moneda_id=  entrada_data['moneda_id'],
            punto_entrada= entrada_data['punto_entrada'],
            stop_loss= entrada_data['stop_loss'],
            take_profit= entrada_data['take_profit'],
            riesgo_beneficio= entrada_data['riesgo_beneficio'],
            lotage= entrada_data['lotage'],
            compra_venta= entrada_data['compra_venta'],
            fecha_creacion= datetime.now(),
        )

        db.add(nueva_entrada)
        db.commit()
        db.refresh(nueva_entrada)

        return {'Message': 'Entrada agregada exitosamente!!'}
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Usuario no aplica a las condiciones para intruducir una entrada'} ) 
    
    
    



def actualizar_entrada(user_id,num_entrada, UpdateEntrada, db: Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"}) 
    
    nota = db.query(models.Entrada).filter(models.Entrada.usuario_id == usuario.id).first()

    # print(nota.usuario_id, 'nota ')
    # print(usuario, 'usuario')
    if nota:
        entrada = db.query(models.Entrada).filter(models.Entrada.id == num_entrada).first()
        if UpdateEntrada is not None and entrada:
            entrada.punto_entrada = UpdateEntrada.punto_entrada
            entrada.stop_loss = UpdateEntrada.stop_loss
            entrada.take_profit = UpdateEntrada.take_profit
            entrada.riesgo_beneficio = UpdateEntrada.riesgo_beneficio
            entrada.lotage = UpdateEntrada.lotage
            entrada.compra_venta = UpdateEntrada.compra_venta
        else:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "Entrada no encontrada para el usuario"} ) 
        db.commit()
        return {"message": "Entrada actualizada exitosamente"}

        


def eliminar_entrada(user_id,num_entrada, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id)

    if not usuario.first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"}) 
    
    entrada = db.query(models.Entrada).filter(models.Entrada.id == num_entrada).first()

    if not entrada:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Entrada no encontrada'}) 
    
    db.delete(entrada)
    db.commit()  
    return {'Message': 'Entrada eliminada correctamente'}
    
