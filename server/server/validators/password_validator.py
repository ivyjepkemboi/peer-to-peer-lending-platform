import re

class PasswordValidator:
    
    def __init__(self, password):
        self.password = password

    def validate(self):
        if len(self.password) < 8:
            return False, "Password must be at least 8 characters long."
        if not re.search(r"[A-Z]", self.password):
            return False, "Password must contain at least one uppercase letter."
        if not re.search(r"[a-z]", self.password):
            return False, "Password must contain at least one lowercase letter."
        if not re.search(r"\d", self.password):
            return False, "Password must contain at least one digit."
        if not re.search(r"\W", self.password):
            return False, "Password must contain at least one special character."
        return True, ""
