from app.db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime


class User(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    correo = Column(String, nullable=False, unique=True)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    capitales = relationship('Capital', back_populates='usuario')
    objetivo_plan = relationship('ObjetivoPlan', back_populates='usuario')
    entradas = relationship('Entrada', back_populates='usuario')
    monedas_asignadas = relationship('UsuarioMoneda', back_populates='usuario')


class UsuarioMoneda(Base):
    # Esto seria la wallet del usuario. 
    __tablename__ = 'usuario_moneda'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    moneda_id = Column(Integer, ForeignKey('moneda.id'))

    # Aqui se asigna la cantidad de monedas que se le asignaron a un usuario. 
    # ( Es la cantidad de monedas, correspondiente a la cantidad de usdt asignadas a la modena especificada por el usuario)
    cantidad_moneda = Column(Integer) 

    usuario = relationship('User', back_populates='monedas_asignadas')
    moneda = relationship('Moneda', back_populates='usuarios_asignados')


class Capital(Base):
    __tablename__ = 'capitales'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    capital_usdt = Column(Float, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    usuario = relationship('User', back_populates='capitales')


class ObjetivoPlan(Base):
    __tablename__ = 'objetivo_plan'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    objetivo_principal = Column(String, nullable=False)
    plan = Column(String)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    usuario = relationship('User', back_populates='objetivo_plan')


class Entrada(Base):
    __tablename__ = 'entrada'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    moneda_id = Column(Integer, ForeignKey('moneda.id'))
    punto_entrada = Column(Float, nullable=False)
    stop_loss = Column(Float, nullable=False)
    take_profit = Column(Float, nullable=False)
    riesgo_beneficio = Column(Float, nullable=False)
    lotage = Column(Float, nullable=False)
    resultado_usdt = Column(Float, nullable=False)
    compra_venta = Column(Boolean, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    usuario = relationship('User', back_populates='entradas')
    moneda = relationship('Moneda', back_populates='entradas')


class Moneda(Base):
    __tablename__ = 'moneda'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    codigo = Column(String, nullable=False)

    usuarios_asignados = relationship('UsuarioMoneda', back_populates='moneda')
    entradas = relationship('Entrada', back_populates='moneda')  #


class ConsejosDiarios(Base):
    __tablename__ = 'consejos_diarios'
    id = Column(Integer, primary_key=True, autoincrement=True)
    consejo = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)
