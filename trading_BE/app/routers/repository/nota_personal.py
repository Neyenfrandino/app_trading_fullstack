#Aqui van las funciones 
from sqlalchemy.orm import Session
from app.db import models
from fastapi import HTTPException, status

def obtener_notas(db):
    data  = db.query(models.NotaPersonal).all()
    return data
    
def add_nota(user_id, modelo, db:Session):
    usuario= db.query(models.User).filter(models.User.id == user_id).first()
    count_usuario = db.query(models.NotaPersonal).filter(models.NotaPersonal.usuario_id == user_id).count()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"} )        
    if  count_usuario < 3:   
        nota_usuario = dict(modelo)
        nueva_nota  = models.NotaPersonal(
            usuario_id = user_id,
            nota = nota_usuario['nota'],
        )
        db.add(nueva_nota)
        db.commit()
        db.refresh(nueva_nota)

        return {'Respuesta': 'nota agregado exitosamente!!'}
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'message': 'Excede el máximo de notas permitido'})        



def actualizar_nota(user_id, num_nota, UpdateNota_personal, db: Session):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"} )           

    
    nota = db.query(models.NotaPersonal).filter(models.NotaPersonal.id == num_nota).first()

    if not nota:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={'Message': 'Nota no existemte'})        

    if nota:
        nota.nota = UpdateNota_personal.nota

        db.commit()
        return {"message": "Nota actualizada exitosamente"}
 



def eliminar_nota(user_id,num_nota, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id)

    if not usuario.first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail={"message": "El usuario no existe"} )    

    nota = db.query(models.NotaPersonal).filter(models.NotaPersonal.id == num_nota)

    if nota:
        nota.delete(synchronize_session=False)
        db.commit() 
        return {'Message': 'Nota eliminada correctamente'} 
        
              

        
                
