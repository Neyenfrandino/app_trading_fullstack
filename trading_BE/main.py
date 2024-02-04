from fastapi import FastAPI
import uvicorn
from app.db.database import Base, engine
from app.routers import user, capital, nota_personal, objetivo_plan, entrada, usuario_moneda, moneda, consejos_diarios
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware

# def create_tables():
#     Base.metadata.create_all(bind=engine)
    
# create_tables()


app = FastAPI()

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes cambiar esto a tu origen específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(capital.router)
app.include_router(nota_personal.router)
app.include_router(objetivo_plan.router)
app.include_router(entrada.router)
app.include_router(usuario_moneda.router)
app.include_router(moneda.router)
app.include_router(consejos_diarios.router)
app.include_router(auth.router)


if __name__ == '__main__':
    uvicorn.run('main:app', port=8000, reload=True)