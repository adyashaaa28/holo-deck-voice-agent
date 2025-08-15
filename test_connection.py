import requests

print("--- Starting Python Connection Test ---")
try:
    # We will try to connect to a reliable server like Google.
    print("Attempting to connect...")
    response = requests.get("https://www.google.com", timeout=10)
    response.raise_for_status()
    print(">>> SUCCESS: Your Python installation can connect to the internet.")

except requests.exceptions.RequestException as e:
    print(">>> FAILED: Your Python installation is being blocked.")
    print(f">>> Error details: {e}")

print("--- Test Finished ---")