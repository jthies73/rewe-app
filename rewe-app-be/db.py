import datetime
from typing import Optional

import sqlalchemy
import sqlalchemy.orm
from passlib.hash import bcrypt
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

engine = sqlalchemy.create_engine("sqlite:///data/expenses.db", echo=True)


class Base(sqlalchemy.orm.DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]
    password: Mapped[str]


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


def clean():
    Base.metadata.drop_all(engine)


def orm_object_to_dict(expense):
    d = expense.__dict__
    d.pop("_sa_instance_state")
    return d


def register(user_name, password):
    hash_ = bcrypt.hash(password)
    with sqlalchemy.orm.Session(engine) as session:
        user = User(name=user_name, password=hash_)
        session.add(user)
        session.commit()


def find_user(user_name, password=None):
    with sqlalchemy.orm.Session(engine) as session:
        results = session.query(User).filter(User.name == user_name).all()
        if not results:
            return None
        assert len(results) == 1
        user = results[0]
        if password is not None and not bcrypt.verify(password, user.password):
            return None
        return user
