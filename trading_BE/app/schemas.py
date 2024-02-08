from pydantic import BaseModel
from typing import Optional, Union
from datetime import datetime, date

#Estos van a ser lo parametros que va a requerir nuestra api cuando creemos un nuevo usuario
#clase Usuario
class User(BaseModel):
    nombre: str
    apellido: str
    username: str
    password: str
    fecha_nacimiento: date 
    correo: str
    nacionalidad: Optional[str]
    creacion_user: datetime=datetime.now() 


class Capital(BaseModel):
    usuario_id:int
    capital_usdt:float
    fecha_creacion:datetime=datetime.now()


class Nota_personal(BaseModel):
    usuario_id: int
    nota:str
    fecha_creacion:datetime=datetime.now()


class Objetivo_plan(BaseModel):
    usuario_id:int
    objetivo_principal:str
    plan:str
    creacion_user: datetime=datetime.now() 

      
class Entrada(BaseModel):
    objetivos_plan_id:int
    moneda_id:int
    punto_entrada:float
    stop_loss:float
    take_profit: float
    riesgo_beneficio: float
    lotage: float
    resultado_usdt: float
    compra_venta: float
    fecha_creacion:datetime=datetime.now()


class Usuario_moneda(BaseModel):
    usuario_id:int
    moneda_id:int
    cantidad:float

class Moneda(BaseModel):
    nombre:str
    codigo:str
    ruta_img:str

class Consejos_diarios(BaseModel):
    consejo:str
    fecha_creacion:datetime=datetime.now()

class User_id(BaseModel):
    id: int 
      

class UpdateUser(BaseModel):
    nombre: str = None
    apellido: str = None
    username: str = None
    password: str = None
    fecha_nacimiento: datetime = None 
    correo: str = None
    nacionalidad: Optional[str] = None


class upDateCapital(BaseModel):
    capital_usdt : float = None

class UpdateNota_personal(BaseModel):
    nota:str = None


class UpdateObjetivoPlan(BaseModel):
    objetivo_principal: str = None
    plan: str = None


class UpdateEntrada(BaseModel):
    punto_entrada: float = None
    stop_loss: float = None
    take_profit: float = None
    riesgo_beneficio: float = None
    lotage: float = None
    compra_venta : bool = None 
    moneda_id : int = None
    resultado_usdt: int = None
    fecha_creacion: datetime=datetime.now()

class UpdateCantidadMoneda(BaseModel):
    cantidad: float = None
    moneda_id: int = None
class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None 



