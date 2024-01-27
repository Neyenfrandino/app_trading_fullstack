from app.db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Date
from sqlalchemy.schema import ForeignKey

from sqlalchemy.orm import relationship
from datetime import datetime


# Aquí estamos creando los modelos de las tablas que vamos a agregar luego a la base de datos.
class User(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    correo = Column(String, nullable=False, unique=True)
    nacionalidad = Column(String, nullable=True)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)


    capitales = relationship('Capital', back_populates='usuario')
    nota_personal = relationship('NotaPersonal', back_populates='usuario')
    objetivo_plan = relationship('ObjetivoPlan', back_populates='usuario')
    entradas = relationship('Entrada', back_populates='usuario')
    usuario_monedas = relationship('UsuarioMoneda', back_populates='usuario')  # Corregido el nombre de la relación


class Capital(Base):
    __tablename__ = 'capitales'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    capital_usdt = Column(Float, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    usuario = relationship('User', back_populates='capitales')


class NotaPersonal(Base):
    __tablename__ = 'nota_personal'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    nota = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    usuario = relationship('User', back_populates='nota_personal')


class ObjetivoPlan(Base):
    __tablename__ = 'objetivo_plan'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    objetivo_principal = Column(String, nullable=False)
    plan = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    usuario = relationship('User', back_populates='objetivo_plan')
    entradas = relationship('Entrada', back_populates='objetivo_plan')


class Entrada(Base):
    __tablename__ = 'entrada'
    id = Column(Integer, primary_key=True, autoincrement=True)
    objetivos_plan_id = Column(Integer, ForeignKey('objetivo_plan.id'))
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))  # Asegúrate de agregar esto
    moneda_id = Column(Integer, ForeignKey('moneda.id'))
    punto_entrada = Column(Float, nullable=False)
    stop_loss = Column(Float, nullable=False)
    take_profit = Column(Float, nullable=False)
    riesgo_beneficio = Column(Float, nullable=False)
    lotage = Column(Float, nullable=False)
    resultado_usdt = Column(Float)
    compra_venta = Column(Boolean, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    usuario = relationship('User', back_populates='entradas')
    objetivo_plan = relationship('ObjetivoPlan', back_populates='entradas')


class UsuarioMoneda(Base):
    __tablename__ = 'usuarioMoneda'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    moneda_id = Column(Integer, ForeignKey('moneda.id'), nullable=False)
    cantidad = Column(Float, nullable=False)

    usuario = relationship('User', back_populates='usuario_monedas')
    moneda = relationship("Moneda", back_populates="usuario_monedas")  # Corregido el nombre de la relación

# En la clase Moneda
class Moneda(Base):
    __tablename__ = 'moneda'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    codigo = Column(String, nullable=False)
    ruta_img = Column(String)

    usuario_monedas = relationship("UsuarioMoneda", back_populates="moneda")


class ConsejosDiarios(Base):
    __tablename__ = 'consejos_diarios'
    id = Column(Integer, primary_key=True, autoincrement=True)
    consejo = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)








