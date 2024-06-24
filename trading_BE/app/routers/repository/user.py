from sqlalchemy.orm import Session	
from app.db import models
from fastapi  import HTTPException, status
from app.hashing import Hash


def create_user(usuario, db:Session):
    usuario = dict(usuario)
    try:
        nuevo_usuario = models.User(
            nombre=usuario['nombre'],
            apellido=usuario['apellido'],
            username=usuario['username'],
            password=Hash.hash_password(usuario['password']),
            fecha_nacimiento=usuario['fecha_nacimiento'],
            correo=usuario['correo'],
    )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return nuevo_usuario
       
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error al crear el usuario en la base de datos"
        )

def update_user(user_id, updateUser, db:Session):
    user_true = db.query(models.User).filter(models.User.id == user_id)

    if not user_true.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
				            detail=f'El usuario con el id {user_id} no ha sido encontrado')
    
    nuevo_valor = {}

    for i, e in dict(updateUser).items():
        if e != None:
            nuevo_valor[i] = e 

    user_true.update(nuevo_valor)
    db.commit()
    return {'Respuesta': 'El usuario ha sido modificado correctamente'}


# def eliminar_usuario(user_id, db:Session):
#     usuario = db.query(models.User).filter(models.User.id == user_id)
#     if not usuario.first():
#         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f'No existe el usuario {user_id}')

    # usuario.delete(synchronize_session=False)
    # db.commit()    
    # return 'El usuario se ha eliminado correctamente'

def get_user(user_id, db:Session):
    user_true = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_true:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f'No existe el usuario {user_id}')
    
    return user_true
