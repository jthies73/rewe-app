import datetime
import sqlalchemy
import sqlalchemy.orm

from sqlalchemy.orm import Mapped
from sqlalchemy.schema import Column
from sqlalchemy.orm import mapped_column

engine = sqlalchemy.create_engine("sqlite:///expenses.db", echo=True)


class Base(sqlalchemy.orm.DeclarativeBase):
    pass


class Expense(Base):
    __tablename__ = "expenses"
    expense_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    # bill_id: Mapped[int]
    # user_id: Mapped[int]
    name: Mapped[str]
    value: Mapped[float]
    # quantity: Mapped[int]
    # price_per_item: Mapped[float]
    # weight: Mapped[float]
    # price_per_kg: Mapped[float]
    # tags: Mapped[str]
    datetime: Mapped[datetime.datetime]

    def __repr__(self):
        return (
                "Expense("
                f"id={self.expense_id}, "
                f"bill_id={self.bill_id}, "
                f"name={self.name},"
                f"quantity={self.quantity},"
                f"value={self.value}"
                ")"
        )


def create_database():
    Base.metadata.create_all(engine)


def clean():
    Base.metadata.drop_all(engine)
