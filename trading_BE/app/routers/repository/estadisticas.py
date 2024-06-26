from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime
from fastapi import HTTPException, status
from app.routers.repository import estadisticas
from sqlalchemy import extract, func
from itertools import zip_longest

def get_estadisticas_db_all(user_id, db: Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()

    if not usuario:
         raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"}) 

    resultados_usdt_db = db.query(models.Entrada).filter(models.Entrada.usuario_id == usuario.id).all()
    total_resultados_usdt_db = sum(entrada.resultado_usdt for entrada in resultados_usdt_db)
    
    if resultados_usdt_db:
        datos_resultados_usdt_db = 0
        all_resultados_entradas = []
        for i in resultados_usdt_db:
            datos_resultados_usdt_db += i.resultado_usdt
            all_resultados_entradas.append(i.resultado_usdt)

        promedio_resultados_usdt_db = datos_resultados_usdt_db / len(resultados_usdt_db)
        # print(datos_resultados_usdt_db, 'data')
        # print( len(resultados_usdt_db), 'largo')
        estadisticas_resultados = estadisticas_entradas_ganadoras(user_id, db)
        porcentaje_total_ganancias = porcentaje_resultados_total_billetera(user_id, db)
        procentaje_ganancias_x_moneda(user_id, db)

        return {
            'total_resultados_usdt_db': total_resultados_usdt_db,
            'promedio_resultados_usdt_db': promedio_resultados_usdt_db,
            'estadisticas_ganadoras': estadisticas_resultados,
            'All_resultados': all_resultados_entradas,
            'porcentaje_total_ganancias': porcentaje_total_ganancias
        }
        
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail={'Message': 'Error en la entrada de datos'})     
    
 

def estadisticas_entradas_ganadoras(user_id, db: Session):
    # '''Aqui podemos pasar la cantidad de entradas ganadores, los puntos de entrada, los resultados, 
    # y sumar el total de lo que llevaria ganado con todas las entradas ganadoras'''      

    usuario = db.query(models.User).filter(models.User.id == user_id).first()

    if not usuario:
         raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"}) 

    # mes = 2

    entradas_ganadoras = db.query(models.Entrada).filter(models.Entrada.usuario_id == user_id)\
                                                .filter(models.Entrada.resultado_usdt > 0).all()

    entradas_perdidas = db.query(models.Entrada).filter(models.Entrada.usuario_id == user_id)\
                                                .filter(models.Entrada.resultado_usdt < 0).all()
    
    entradas_breack_event = db.query(models.Entrada).filter(models.Entrada.usuario_id == user_id)\
                                                .filter(models.Entrada.resultado_usdt == 0).all()
    
    # '''Aqui filtramos por el mes'''
    # entradas_ganadoras = db.query(models.Entrada).filter(models.Entrada.usuario_id == user_id)\
    #                                         .filter(models.Entrada.resultado_usdt > 0)
    #                                         # .filter(extract('month', models.Entrada.fecha_creacion) == mes).all()\
                                                        
    if entradas_ganadoras or entradas_perdidas or entradas_breack_event:
        ganadas = []
        perdidas = []
        punto_de_equilibrio = []

        # '''Con zip_longest, las listas se recorren de forma paralela y, cuando una lista se agota, 
        # se utiliza el valor especificado en fillvalue (en este caso None) en lugar de levantar una excepción por 
        # desbordamiento de índice.'''
        for ganadora, perdida, breackevent in zip_longest(entradas_ganadoras, entradas_perdidas, entradas_breack_event, fillvalue=None):
            if ganadora:
                ganadas.append(ganadora.resultado_usdt)
        
            if perdida:
                perdidas.append(perdida.resultado_usdt)
     
            if  breackevent:
                punto_de_equilibrio.append(breackevent.resultado_usdt)
        # print(ganadas, 'ganadas')
        # print(perdidas, 'perdidas')
        # print(punto_de_equilibrio, 'empate')

        return {
                'ganadas': ganadas,
                'perdidas': perdidas,
                'breakeven': punto_de_equilibrio
                }    
    raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                        detail={"message": "El usuario no existe"})
 

def porcentaje_resultados_total_billetera(user_id, db: Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first();
    
    if not usuario:
           raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"})
  

    # Obtener la lista de cantidades en la billetera del usuario
    billetera_cantidad = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.usuario_id == usuario.id).all()

    # Calcular la suma total de las cantidades en la billetera del usuario
    total_en_billetera_usuario = sum(i.cantidad for i in billetera_cantidad)
    # print(total_en_billetera_usuario, 'asdd')

   # Calcular el porcentaje total de ganancia sobre 500
    total_usdt, porcentaje_total_ganancia = db.query(
        func.sum(models.Entrada.resultado_usdt).label('total_usdt'),
        (func.sum(models.Entrada.resultado_usdt) / func.sum(total_en_billetera_usuario)) * 100
    ).filter(
        models.Entrada.usuario_id == usuario.id
    ).first()

    # print("Total USDT:", total_usdt)
    # print("Porcentaje total de ganancia:", porcentaje_total_ganancia)

    return {"Porcentaje total de ganancias": porcentaje_total_ganancia}

        
def procentaje_ganancias_x_moneda(user_id, db: Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()

    if not usuario:
         raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"}) 

    billetera_cantidad = db.query(models.UsuarioMoneda).filter(models.UsuarioMoneda.usuario_id == usuario.id).all()

   
    for i in billetera_cantidad:
        print(i.moneda_id)
        total_entradas_x_moneda = db.query(
            func.sum(models.Entrada.resultado_usdt)
            ).filter(models.Entrada.usuario_id == usuario.id)\
            .filter(models.Entrada.moneda_id == i.moneda_id).first()
        
        # print(total_entradas_x_moneda, 'asd')

        cantidad_en_billetera = i.cantidad

        porcentaje_resultado = (total_entradas_x_moneda[0] / cantidad_en_billetera) * 100
        print(porcentaje_resultado)
    
     

        

