from sqlalchemy.orm import Session	
from app.db import models
from fastapi  import HTTPException, status
from app.hashing import Hash


def crear_usuario(usuario, db:Session):
    usuario = dict(usuario)
    try:
        nuevo_usuario = models.User(
            nombre=usuario['nombre'],
            apellido=usuario['apellido'],
            username=usuario['username'],
            password=Hash.hash_password(usuario['password']),
            fecha_nacimiento=usuario['fecha_nacimiento'],
            correo=usuario['correo'],
            nacionalidad=usuario['nacionalidad']
    )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return nuevo_usuario
       
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error al crear el usuario en la base de datos"
        )

def actualizar_usuario(user_id, updateUser, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id)

    if not usuario.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
				            detail=f'El usuario con el id {user_id} no ha sido encontrado')
    
    nuevo_valor = {}

    for i, e in dict(updateUser).items():
        if e != None:
            nuevo_valor[i] = e 

    usuario.update(nuevo_valor)
    db.commit()
    return {'Respuesta': 'El usuario ha sido modificado correctamente'}


def eliminar_usuario(user_id, db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id)
    if not usuario.first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f'No existe el usuario {user_id}')

    usuario.delete(synchronize_session=False)
    db.commit()    
    return 'El usuario se ha eliminado correctamente'

def obtener_usuario_por_id(user_id, db):
    usuario = db.query(models.User).filter(models.User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f'No existe el usuario {user_id}')
    return usuario

def obtener_user(db):
    data = db.query(models.User).all()
    return data