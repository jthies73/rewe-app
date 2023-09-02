import datetime

import sqlalchemy
import sqlalchemy.orm

from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

engine = sqlalchemy.create_engine("sqlite:///data/expenses.db", echo=True)


class Base(sqlalchemy.orm.DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]


class Bill(Base):
    __tablename__ = "bills"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    datetime: Mapped[datetime.datetime]
    value: Mapped[float]


class Expense(Base):
    __tablename__ = "expenses"
    expense_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    bill_id: Mapped[int] = mapped_column(ForeignKey("bills.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str]
    value: Mapped[float]
    quantity: Mapped[int] = mapped_column(default=1)
    price_per_item: Mapped[Optional[float]]
    weight: Mapped[Optional[float]]
    price_per_kg: Mapped[Optional[float]]
    tags: Mapped[Optional[str]]
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
    from sqlalchemy.orm import Session
    with Session(engine) as session:
        mock = User(name="mock")
        session.add(mock)
        session.flush()
        session.commit()


def clean():
    Base.metadata.drop_all(engine)


def orm_object_to_dict(expense):
    d = expense.__dict__
    d.pop("_sa_instance_state")
    return d
