from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime
from fastapi import HTTPException, status
from app.routers.repository import usuario_moneda
from app.schemas import Usuario_moneda
# from app.schemas import UpdateCantidadMonedaim


def get_entry_user_all(user_id, db:Session):
    user_true  = db.query(models.Entrada).filter(models.Entrada.usuario_id == user_id).all()

    if not user_true:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={"message": "No existe entrada para el usuario"})
    return user_true


def add_entry(user_id, modelo, db:Session):
    user_true = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user_true:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"} ) 
    



    entrada_data = dict(modelo)

    user_usdt_true = db.query(models.Capital).filter(models.Capital.usuario_id == user_id).first()

    if user_usdt_true.capital_usdt > (entrada_data['punto_entrada'] - entrada_data['stop_loss']) * entrada_data['lotage']:
        # print(user_usdt_true.capital_usdt, (entrada_data['punto_entrada'] - entrada_data['stop_loss']) * entrada_data['lotage'])
        nueva_entrada = models.Entrada(
            usuario_id = user_true.id,
            moneda_id= entrada_data['moneda_id'],
            punto_entrada= entrada_data['punto_entrada'],
            stop_loss= entrada_data['stop_loss'],
            take_profit= entrada_data['take_profit'],
            resultado_usdt= entrada_data['resultado_usdt'],
            riesgo_beneficio= entrada_data['riesgo_beneficio'],
            lotage= entrada_data['lotage'],
            compra_venta= entrada_data['compra_venta'],
        )
        db.add(nueva_entrada)
        db.commit()
        db.refresh(nueva_entrada)

        return {'Message': 'Entrada agregada exitosamente!!'}
                    
    else: 
        print(user_usdt_true.capital_usdt, (entrada_data['punto_entrada'] - entrada_data['stop_loss']) * entrada_data['lotage'])
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                    detail={'Message': 'Not money user'} )  

       
    
def update_entry(user_id, id_entry, UpdateEntrada, db: Session):

    try:
        user_true = db.query(models.User).filter(models.User.id == user_id).first()
        if not user_true:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"}) 
        

        result = db.query(
            models.Entrada,
            models.UsuarioMoneda,
            models.Capital
        ).join(
            models.UsuarioMoneda, models.UsuarioMoneda.moneda_id == models.Entrada.moneda_id
        ).join(
            models.Capital, models.Capital.usuario_id == user_id
        ).filter(
            models.Entrada.id == id_entry
        ).first()
        
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail={'Message': 'Entrada no encontrada'})

        entry_true, filtro, user_usdt_true = result
        if user_usdt_true.capital_usdt > (UpdateEntrada.punto_entrada - UpdateEntrada.stop_loss) * UpdateEntrada.lotage:
    
            entry_true.punto_entrada = UpdateEntrada.punto_entrada 
            entry_true.stop_loss = UpdateEntrada.stop_loss
            entry_true.take_profit = UpdateEntrada.take_profit
            entry_true.riesgo_beneficio = UpdateEntrada.riesgo_beneficio
            entry_true.lotage = UpdateEntrada.lotage
            entry_true.compra_venta = UpdateEntrada.compra_venta
            entry_true.moneda_id = UpdateEntrada.moneda_id
            entry_true.resultado_usdt = UpdateEntrada.resultado_usdt
            entry_true.fecha_creacion = UpdateEntrada.fecha_creacion

            db.commit()         
            return {"message": "Entrada actualizada exitosamente"}       

        else:
            return {"message": "No hay dinero suficiente",
                    'Info': (UpdateEntrada.punto_entrada - UpdateEntrada.stop_loss) * UpdateEntrada.lotage }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Error al buscar la entrada'})
    

def delete_entry(user_id, id_entry, db:Session):
    user_true = db.query(models.User).filter(models.User.id == user_id)

    if not user_true.first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"}) 
    
    entrada = db.query(models.Entrada).filter(models.Entrada.id == id_entry).first()

    if not entrada:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Entrada no encontrada'}) 
    
    db.delete(entrada)
    db.commit()  
    return {'Message': 'Entrada eliminada correctamente'}
    
