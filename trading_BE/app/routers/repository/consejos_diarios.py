#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from fastapi import HTTPException, status


def obtener_consejos(db:Session):
    data = db.query(models.ConsejosDiarios).all()
    return data

def add_consejo(modelo, db:Session):    
    dict_modelo_consejo =  dict(modelo) 
    nuevo_consejo= models.ConsejosDiarios(
        consejo = dict_modelo_consejo['consejo']
    )
    db.add(nuevo_consejo)
    db.commit()
    db.refresh(nuevo_consejo)
    return{'Message': 'Consejo agregado correctamente'}


def actualizar_consejo(num_consejo, modelo, db: Session):    
    nota = db.query(models.ConsejosDiarios).filter(models.ConsejosDiarios.id == num_consejo).first()
    if nota:
        dict_modelo_consejo =  dict(modelo) 
        nota.consejo =  dict_modelo_consejo['consejo'] 
        
        db.commit()
        return {"message": "Consejo actualizado exitosamente"}
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "Consejo no encontrado"} ) 



def eliminar_consejo(num_consejo, db:Session):
    consejo = db.query(models.ConsejosDiarios).filter(models.ConsejosDiarios.id == num_consejo).first()

    if not consejo:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "Consejo no encontrado"} ) 
    
   
    db.delete(consejo)
    db.commit()  

    return {'Message': 'Consejo eliminado correctamente'}

        





