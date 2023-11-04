import math
import re

from pdfminer.high_level import extract_text
from sqlalchemy.orm import Session

import db

PRODUCT_PATTERN = r"^([\w\s\!\.\-/,%&]+?)\s+(\-?\d+,\d+) \w\s*[\*]*$"
WEIGHT_PATTERN = r"\s+(\d+,\d+) kg x\s+(\d+,\d+) EUR/kg"
WEIGHT_BUTCHER_PATTERN = r"\s*Handeingabe E-Bon\s*([\d,]+) kg"
AMOUNT_PATTERN = r"\s+(\d+) Stk x\s+(\d+,\d+)"
DATE_PATTERN = r"Datum:\s+(\d{2}\.\d{2}\.\d{4})"
TIME_PATTERN = r"Uhrzeit:\s+(\d{2}:\d{2}:\d{2}) Uhr"
TOTAL_PATTERN = r"SUMME\s+EUR\s+(\d+,\d+)"


def __atof(x: str):
    """Convert str to float handling numbers in german locale form"""
    return float(x.replace(",", "."))


def __parse_rewe_ebon_text(text):
    expense = None
    expenses = []
    for line in text.split("\n"):
        # Once we match a new product, the previous one can be saved.
        if m := re.search(PRODUCT_PATTERN, line):
            if expense is not None:
                expenses.append(expense)
            expense = db.Expense()
            expense.name = m.group(1)
            expense.value = __atof(m.group(2))
        elif m := re.search(WEIGHT_PATTERN, line):
            expense.weight = __atof(m.group(1))
            expense.price_per_kg = __atof(m.group(2))
        elif m := re.search(WEIGHT_BUTCHER_PATTERN, line):
            expense.weight = __atof(m.group(1))
        elif m := re.search(AMOUNT_PATTERN, line):
            expense.quantity = int(m.group(1))
            expense.price_per_item = __atof(m.group(2))
        elif m := re.search(DATE_PATTERN, line):
            date = m.group(1)
        elif m := re.search(TIME_PATTERN, line):
            time = m.group(1)
        elif m := re.search(TOTAL_PATTERN, line):
            total = __atof(m.group(1))
        else:
            pass
    expenses.append(expense)
    dt = db.datetime.datetime.strptime(date + time, r"%d.%m.%Y%H:%M:%S")
    for expense in expenses:
        expense.datetime = dt
    assert math.isclose(sum([e.value for e in expenses]), total)
    return expenses, total


def parse_rewe_ebon(ebon, user_id):
    text = extract_text(ebon)
    expenses, total = __parse_rewe_ebon_text(text)
    bill = db.Bill(user_id=user_id, datetime=expenses[0].datetime, value=total)
    # We refresh ORM objects so that autoincremented values are accessible.
    with Session(db.engine) as session:
        session.add(bill)
        session.flush()
        session.refresh(bill)
        bill_id = bill.id

        for expense in expenses:
            expense.user_id = user_id
            expense.bill_id = bill_id
            session.add(expense)
        session.commit()

    # Select expenses from the bill we just added and return as json.
    json = []
    with Session(db.engine) as session:
        stmt = (
            db.sqlalchemy.select(db.Expense)
            .where(db.Expense.user_id == user_id)
            .where(db.Expense.bill_id == bill_id)
        )
        for row in session.execute(stmt):
            json.append(db.orm_object_to_dict(row[0]))
    return json
