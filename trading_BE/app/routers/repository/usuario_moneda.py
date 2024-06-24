#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from fastapi import HTTPException, status


def get_data_wallet(user_id, db:Session):
    data_user_true = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.usuario_id == user_id).all()

    if not data_user_true:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"message": "Usuario no encontrado"})
    
    return data_user_true

def add_coin_wallet_user(user_id, id_money, UpdateCantidadMoneda, db: Session):
    user_true = db.query(models.User).filter(models.User.id == user_id).first()

    if not user_true:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Usuario no encontrado"})
    
    try:
        capital_in_usdt_true = db.query(models.Capital).filter(models.Capital.usuario_id == user_id).first()
        money_true = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.moneda_id == id_money).filter(
            models.UsuarioMoneda.usuario_id == user_id).first()

        if money_true:
            return {'Message': 'Ya existe una moneda en la wallet'} 
        else:
            if capital_in_usdt_true.capital_usdt >= UpdateCantidadMoneda.cantidad:
                    capital_in_usdt_true.capital_usdt -= UpdateCantidadMoneda.cantidad

                    db.commit()
                    db.refresh(capital_in_usdt_true)  # Refresh the instance to get updated data from the database

                    new_money = models.UsuarioMoneda(usuario_id=user_id, moneda_id=id_money, cantidad_moneda=UpdateCantidadMoneda.cantidad)
                    db.add(new_money)
                    db.commit()
                    db.refresh(new_money)
                    
                    money_true.cantidad_moneda += UpdateCantidadMoneda.cantidad
                    db.commit()
                    db.refresh(money_true)
                    return {'Message': 'Se ha actualizado correctamente'}

    except Exception as e:
        return {'Message': str(e)}


def add_moneda(user_id, id_money, UpdateCantidadMoneda, db: Session):
    user_true = db.query(models.User).filter(models.User.id == user_id).first()

    if not user_true:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Usuario no encontrado"})
    

    capital_in_usdt_true = db.query(models.Capital).filter(models.Capital.usuario_id == user_id).first()
    money_true = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.moneda_id == id_money).filter(
        models.UsuarioMoneda.usuario_id == user_id).first()

    if money_true and capital_in_usdt_true.capital_usdt >= UpdateCantidadMoneda.cantidad:

        try:
            capital_in_usdt_true.capital_usdt -= UpdateCantidadMoneda.cantidad

            db.commit()
            db.refresh(capital_in_usdt_true)  # Refresh the instance to get updated data from the database

            if money_true:
                money_true.cantidad_moneda += UpdateCantidadMoneda.cantidad
                db.commit()
                db.refresh(money_true)
                return {'Message': 'Se ha actualizado correctamente'}

     
        except Exception as e:
            return {'Message': str(e)}
    else:
        print('no tiene suficiente capital')
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "La moneda no existe o no tiene suficiente capital"})

def subtract_coin(user_id, id_money, UpdateCantidadMoneda, db: Session):
    user_true = db.query(models.User).filter(models.User.id == user_id).first()

    if not user_true:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Usuario no encontrado"})
    
    capital_in_wallet_true = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.usuario_id == user_id).filter(
        models.UsuarioMoneda.moneda_id == id_money).first()
    
    capital_in_usdt_true = db.query(models.Capital).filter(models.Capital.usuario_id == user_id).first()

    
    if capital_in_wallet_true and capital_in_wallet_true.moneda_id == id_money:
        if capital_in_wallet_true.cantidad_moneda >= UpdateCantidadMoneda.cantidad:
            try:
                capital_in_wallet_true.cantidad_moneda -= UpdateCantidadMoneda.cantidad
                db.commit()
                db.refresh(capital_in_wallet_true)

                capital_in_usdt_true.capital_usdt += UpdateCantidadMoneda.cantidad
                db.commit()
                db.refresh(capital_in_usdt_true)            
            except Exception as e:
                return {'Message': str(e)}

            return {'Message': 'Se ha actualizado correctamente'}
    
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "No una moneda agregada."})
    
