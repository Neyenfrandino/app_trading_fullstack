"""initial migration

Revision ID: cc96c14ab443
Revises: 4f6f8a77bd82
Create Date: 2024-06-17 10:37:51.498284

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cc96c14ab443'
down_revision: Union[str, None] = '4f6f8a77bd82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Añade la columna con un valor por defecto temporal
    op.add_column('usuario_moneda', sa.Column('cantidad_moneda', sa.Integer(), nullable=False, server_default="0"))

    # Si deseas cambiar el valor por defecto o eliminarlo, puedes hacerlo en una segunda operación
    op.alter_column('usuario_moneda', 'cantidad_moneda', server_default=None)
