from server.database import db
from server.models import User, Loan, Payment, Notification, Message
from server.app import app  # Import the app object to get access to app context
from datetime import datetime
import uuid

def create_users():
    users = []
    # Create 5 borrowers and 5 lenders
    for i in range(1, 6):
        borrower = User(
            id=str(uuid.uuid4()),
            name=f"Borrower {i}",
            email=f"borrower{i}@example.com",
            phone_number=f"25471234567{i+10}",  # Ensure unique phone numbers
            role="borrower"
        )
        borrower.set_password(f"BorrowerPass{i}!")
        users.append(borrower)

        lender = User(
            id=str(uuid.uuid4()),
            name=f"Lender {i}",
            email=f"lender{i}@example.com",
            phone_number=f"25471234567{i+20}",  # Ensure unique phone numbers
            role="lender"
        )
        lender.set_password(f"LenderPass{i}!")
        users.append(lender)

    db.session.add_all(users)
    db.session.commit()

def create_loans():
    loans = []
    borrowers = User.query.filter_by(role='borrower').all()
    lenders = User.query.filter_by(role='lender').all()

    for i, borrower in enumerate(borrowers):
        loan = Loan(
            id=str(uuid.uuid4()),
            borrower_id=borrower.id,
            lender_id=lenders[i].id,
            amount=1000 * (i + 1),
            interest_rate=5.0 + i,
            duration_months=12,
            status='pending',
            outstanding_balance=1000 * (i + 1)
        )
        loans.append(loan)

    db.session.add_all(loans)
    db.session.commit()

def create_payments():
    payments = []
    loans = Loan.query.all()

    for i, loan in enumerate(loans):
        payment = Payment(
            id=str(uuid.uuid4()),
            loan_id=loan.id,
            amount=loan.amount / 2,  # Half the loan amount paid
            mpesa_receipt_number=f"MPESA{i}12345",
            phone_number=loan.borrower.phone_number,
            payment_date=datetime.utcnow()
        )
        payments.append(payment)

    db.session.add_all(payments)
    db.session.commit()

def create_notifications():
    notifications = []
    users = User.query.all()

    for i, user in enumerate(users):
        notification = Notification(
            id=str(uuid.uuid4()),
            user_id=user.id,
            message=f"Notification {i} for {user.name}",
            is_read=False
        )
        notifications.append(notification)

    db.session.add_all(notifications)
    db.session.commit()

def create_messages():
    messages = []
    users = User.query.all()

    for i in range(5):
        sender = users[i]
        receiver = users[i + 5]

        message = Message(
            id=str(uuid.uuid4()),
            sender_id=sender.id,
            receiver_id=receiver.id,
            content=f"Message from {sender.name} to {receiver.name}",
        )
        messages.append(message)

    db.session.add_all(messages)
    db.session.commit()

# Seeding function
def seed_data():
    with app.app_context():  # Use the app context to access the database
        print("Seeding database...")
        create_users()
        create_loans()
        create_payments()
        create_notifications()
        create_messages()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
