import re
import math

from sqlalchemy.orm import Session
from pdfminer.high_level import extract_text

import db


PRODUCT_PATTERN = r"^([\w\s\!\.\-/,%&]+?)\s+(\-?\d+,\d+) \w\s*[\*]*$"
WEIGHT_PATTERN = r"\s+(\d+,\d+) kg x\s+(\d+,\d+) EUR/kg"
WEIGHT_BUTCHER_PATTERN = r"\s*Handeingabe E-Bon\s*([\d,]+) kg"
AMOUNT_PATTERN = r"\s+(\d+) Stk x\s+(\d+,\d+)"
DATE_PATTERN = r"Datum:\s+(\d{2}\.\d{2}\.\d{4})"
TIME_PATTERN = r"Uhrzeit:\s+(\d{2}:\d{2}:\d{2}) Uhr"
TOTAL_PATTERN = r"SUMME\s+EUR\s+(\d+,\d+)"


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
            expense.value = float(m.group(2).replace(",", "."))
        elif m := re.search(WEIGHT_PATTERN, line):
            expense.weight = m.group(1)
            expense.price_per_kg = m.group(2)
        elif m := re.search(WEIGHT_BUTCHER_PATTERN, line):
            expense.weight = m.group(1)
        elif m := re.search(AMOUNT_PATTERN, line):
            expense.quantity = m.group(1)
            expense.price_per_item = m.group(2)
        elif m := re.search(DATE_PATTERN, line):
            date = m.group(1)
        elif m := re.search(TIME_PATTERN, line):
            time = m.group(1)
        elif m := re.search(TOTAL_PATTERN, line):
            total = float(m.group(1).replace(",", "."))
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
    bill = db.Bill(
            user_id=user_id,
            datetime=expenses[0].datetime,
            value=total)
    # We refresh ORM objects so that autoincremented values are accessible.
    with Session(db.engine) as session:
        session.add(bill)
        session.flush()
        session.refresh(bill)

        for expense in expenses:
            expense.user_id = user_id
            expense.bill_id = bill.id
            session.add(expense)
            session.flush()
            session.refresh(expense)
        session.commit()

        return [db.orm_object_to_dict(e) for e in expenses]
