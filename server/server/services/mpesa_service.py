import requests
import base64
from requests.auth import HTTPBasicAuth
from datetime import datetime

class MpesaService:
    def __init__(self):
        self.consumer_key = "mDmaAnuTKmkUXsDAhO2LHQCrhuyQXpqg9huH3M3bS3peBmxV"  
        self.consumer_secret = "gr3AlApp8zegUlPzPrxQYal63mzTdsznIseT8vG2SJcQtAKdN4pAO2UH99ZOsxdf"  
        self.shortcode = "174379"  # Sandbox shortcode
        self.passkey = "OMEgL00rL5yFkOkqbVNUTTRvHK9FGV5Wn2uYJ7gbMr1opbYfFSQ+zKfnxbXPhldvWBRtEQ6Uk9nxcvQwlntP+BXRhF6g/RxZfGYHMuCKrLiIvEKbGRIEwBR6lMKErf/iP/7gqqIOoG4uNGlI6LE7Sn0D/c4YnelXqp6/qIDoMKhWfcJZ5r18PjFj4YMbtxUUqo4VNYlA0qQ5lAfDOe35f6BAarnOp7Ro6WAUVlvEuVFaj/kdaXEF0SyIu1qbrD/LO3m7+mwbYB3atz0NaWnXnJKNS2VRxqh/Rrgx6NP7f3BRK3aAjMKtazmgNe6mCtUppOeqovLnxUF4VcqqbuVkNw=="  # Sandbox passkey (Replace with the correct passkey)
        self.base_url = "https://sandbox.safaricom.co.ke"  # Sandbox URL
    
    def get_access_token(self):
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        try:
            # Send the request to Safaricom
            response = requests.get(url, auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret))

            # Check if the request was successful
            if response.status_code == 200:
                # Extract the access token
                access_token = response.json().get('access_token')
                print("Access Token:", access_token)  # Output the access token for testing
                return access_token
            else:
                # Print any error messages
                print(f"Error fetching access token: {response.content}")
                return None
        except Exception as e:
            print(f"Exception occurred: {str(e)}")
            return None

    def generate_password(self):
        timestamp = self.get_timestamp()
        data_to_encode = f"{self.shortcode}{self.passkey}{timestamp}"
        encoded_password = base64.b64encode(data_to_encode.encode()).decode()
        return encoded_password

    def get_timestamp(self):
        return datetime.now().strftime('%Y%m%d%H%M%S')

    def get_access_token(self):
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(url, auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret))
        access_token = response.json().get('access_token')
        return access_token

    def initiate_stk_push(self, phone_number, amount, callback_url):
        access_token = self.get_access_token()
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": self.generate_password(),
            "Timestamp": self.get_timestamp(),
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,  # The phone number paying (the borrower)
            "PartyB": self.shortcode,  # Your shortcode as the recipient
            "PhoneNumber": phone_number,  # Phone number to receive the STK prompt
            "CallBackURL": callback_url,
            "AccountReference": "Test Payment",
            "TransactionDesc": "Test Transaction"
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.json()
