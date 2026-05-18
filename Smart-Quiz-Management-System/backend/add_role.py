import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def add_role_column():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('MYSQLHOST', 'localhost'),
            port=int(os.getenv('MYSQLPORT', 3306)),
            user=os.getenv('MYSQLUSER', 'root'),
            password=os.getenv('MYSQLPASSWORD', 'kavya@2006'),
            database=os.getenv('MYSQLDATABASE', 'auth_db')
        )
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'")
        conn.commit()
        print("Column 'role' added successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    add_role_column()
