import uuid
from datetime import datetime
from server.database import db, bcrypt
from uuid import uuid4

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum('borrower', 'lender', 'admin', name='user_roles'), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False, unique=True)
    credit_score = db.Column(db.Integer, nullable=True)
    reputation_score = db.Column(db.Float, nullable=True, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)

    # Relationships for loans
    loans_borrowed = db.relationship('Loan', foreign_keys='Loan.borrower_id', back_populates='borrower')
    loans_lent = db.relationship('Loan', foreign_keys='Loan.lender_id', back_populates='lender')

    # Relationships for messages
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', back_populates='sender')
    received_messages = db.relationship('Message', foreign_keys='Message.receiver_id', back_populates='receiver')

    # Relationship for notifications
    notifications = db.relationship('Notification', back_populates='user')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.name}>'

class Loan(db.Model):
    __tablename__ = 'loans'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    borrower_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    lender_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    duration_months = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, approved, rejected, funded, repaid
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_at = db.Column(db.DateTime, nullable=True)
    outstanding_balance = db.Column(db.Float, nullable=False)
    is_fully_repaid = db.Column(db.Boolean, default=False)

    # Relationships
    borrower = db.relationship('User', foreign_keys=[borrower_id], back_populates='loans_borrowed')
    lender = db.relationship('User', foreign_keys=[lender_id], back_populates='loans_lent')
    
    payments = db.relationship('Payment', back_populates='loan')

    def __repr__(self):
        return f"<Loan {self.id}, outstanding balance: {self.outstanding_balance}>"

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.String, primary_key=True)
    loan_id = db.Column(db.String, db.ForeignKey('loans.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    mpesa_receipt_number = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    payment_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    
    loan = db.relationship('Loan', back_populates='payments')

    def __repr__(self):
        return f"<Payment {self.id}, Amount: {self.amount}>"

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)

    # Relationships
    user = db.relationship('User', back_populates='notifications')

    def __repr__(self):
        return f"<Notification {self.id}, message: {self.message}>"

class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    sender_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define relationships
    sender = db.relationship('User', foreign_keys=[sender_id], back_populates='sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], back_populates='received_messages')

    def __repr__(self):
        return f'<Message from {self.sender_id} to {self.receiver_id}>'
