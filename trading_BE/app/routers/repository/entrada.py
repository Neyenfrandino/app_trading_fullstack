from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime
from fastapi import HTTPException, status
from app.routers.repository import usuario_moneda
from app.schemas import Usuario_moneda
# from app.schemas import UpdateCantidadMonedaim


def obtener_entradas_por_id(user_id, db:Session):
    data  = db.query(models.Entrada).filter(models.Entrada.usuario_id == user_id).all()
    # usuario  = db.query(models.User).filter(models.User.id == user_id).first()
    return data


def add_entrada(user_id, modelo, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"} ) 
    

    num_entrada_usuario_moneda = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.usuario_id == user_id).all()
    objetivo_plan = db.query(models.ObjetivoPlan).filter(models.ObjetivoPlan.usuario_id == usuario.id).first()

    entrada_data = dict(modelo)

    for i in num_entrada_usuario_moneda:
        # print(i.cantidad, 'jaja')

        if i.moneda_id == entrada_data['moneda_id'] and i.cantidad >= entrada_data['lotage'] :
            print(entrada_data['moneda_id'], 'si estoy man ') 
            if objetivo_plan:
                nueva_entrada = models.Entrada(
                    objetivos_plan_id= objetivo_plan.id,
                    usuario_id= usuario.id,
                    moneda_id= entrada_data['moneda_id'],
                    punto_entrada= entrada_data['punto_entrada'],
                    stop_loss= entrada_data['stop_loss'],
                    take_profit= entrada_data['take_profit'],
                    resultado_usdt= entrada_data['resultado_usdt'],
                    riesgo_beneficio= entrada_data['riesgo_beneficio'],
                    lotage= entrada_data['lotage'],
                    compra_venta= entrada_data['compra_venta'],
                    # fecha_creacion= datetime.now(),
                )
                db.add(nueva_entrada)
                db.commit()
                db.refresh(nueva_entrada)

                if entrada_data['resultado_usdt'] != 0:
                    operecion_cantidad_moneda = i.cantidad + entrada_data['resultado_usdt']
                    print(operecion_cantidad_moneda, 'ajajajaja')
                    usuario_moneda.actualizar_cantidad_moneda(user_id, entrada_data['moneda_id'], operecion_cantidad_moneda, db)
                else:
                    return {'Message': 'No tienes dinero en tu billetera'}    
                    
            
                return {'Message': 'Entrada agregada exitosamente!!'}
                    

            else:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Usuario no aplica a las condiciones para intruducir una entrada'} ) 
      
       
    
    

def actualizar_entrada(user_id, num_entrada, UpdateEntrada, db: Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"}) 
    

    entrada = db.query(models.Entrada).filter(models.Entrada.id == num_entrada).first()
    filtro = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.moneda_id == entrada.moneda_id).first()

    if UpdateEntrada.resultado_usdt <= filtro.cantidad:

        print('aqui')
        print(entrada.resultado_usdt, 'estrada ')

        if UpdateEntrada is not None and entrada:
                
            entrada.punto_entrada = UpdateEntrada.punto_entrada
            entrada.stop_loss = UpdateEntrada.stop_loss
            entrada.take_profit = UpdateEntrada.take_profit
            entrada.riesgo_beneficio = UpdateEntrada.riesgo_beneficio
            entrada.lotage = UpdateEntrada.lotage
            entrada.compra_venta = UpdateEntrada.compra_venta
            entrada.moneda_id = UpdateEntrada.moneda_id
            entrada.resultado_usdt = UpdateEntrada.resultado_usdt
            entrada.fecha_creacion = UpdateEntrada.fecha_creacion

            resultado_update_usuario_moneda = filtro.cantidad + UpdateEntrada.resultado_usdt
            UpdateCantidadMoneda = {
                'cantidad' : resultado_update_usuario_moneda,
                # 'moneda_id' : UpdateEntrada.moneda_id
            }
    
    # if UpdateEntrada.moneda_id != filtro.moneda_id:
    #     print('soy diferente')
    #     print(filtro.cantidad, 'filtreo')
    #     print(entrada.resultado_usdt, 'estrada ')


    #     restablecer_billetera = abs(entrada.resultado_usdt - filtro.cantidad)
    #     UpdateCantidadMoneda = {
    #             'cantidad' : restablecer_billetera,
    #             # 'moneda_id' : UpdateEntrada.moneda_id
    #         }
    #     print('restablesco la billetera ')
    #     usuario_moneda.actualizar_cantidad_moneda(user_id, entrada.moneda_id, UpdateCantidadMoneda, db)

        
        usuario_moneda.actualizar_cantidad_moneda(user_id, UpdateEntrada.moneda_id, UpdateCantidadMoneda, db)
        db.commit()         
        return {"message": "Entrada actualizada exitosamente"}            



    raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                detail={"message": "Entrada no encontrada para el usuario"}) 



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
    
