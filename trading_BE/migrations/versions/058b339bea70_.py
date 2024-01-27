"""empty message

Revision ID: 058b339bea70
Revises: 982e3baafefb
Create Date: 2024-01-25 12:10:47.759197

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '058b339bea70'
down_revision: Union[str, None] = '982e3baafefb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
