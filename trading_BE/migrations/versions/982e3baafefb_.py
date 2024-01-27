"""empty message

Revision ID: 982e3baafefb
Revises: 84643f5b3052
Create Date: 2024-01-25 12:09:26.891482

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '982e3baafefb'
down_revision: Union[str, None] = '84643f5b3052'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
