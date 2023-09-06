from flask import Flask, jsonify, request
from flask_cors import CORS
from threading import current_thread

import sqlite3
# Custom function
from tools.amazon import get_product_info

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Permet toutes les origines par défaut, vous pouvez spécifier des origines spécifiques si nécessaire.

# Crée une connexion par thread
def get_db_connection():
    connex = getattr(current_thread, 'connex', None)
    if connex is None:
        connex = sqlite3.connect("products.db", check_same_thread=False)
        current_thread.connex = connex
    return connex

# DataBase function
def table_exists(table_name):
    connex = get_db_connection()
    c = connex.cursor()
    c.execute('''SELECT count(name) FROM sqlite_master WHERE TYPE = 'table' AND name = '{}' '''.format(table_name))
    if c.fetchone()[0] == 1:
        return True
    return False

def create_table():
    connex = get_db_connection()
    c = connex.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS product(
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title varchar(500) NOT NULL,
            price REAL NOT NULL,
            score varchar(20) NOT NULL,
            image varchar(500) NOT NULL,
            link varchar(500) NOT NULL
        )
    ''')
    connex.commit()

def get_products_from_db():
    connex = get_db_connection()
    c = connex.cursor()
    c.execute('''SELECT * FROM product''')
    data = []
    for row in c.fetchall():
        data.append(row)
    return data

def insert_product(title, price, score, image, link):
    connex = get_db_connection()
    c = connex.cursor()
    c.execute("INSERT INTO product (title, price, score, image, link) VALUES (?, ?, ?, ?, ?)", (title, price, score, image, link))
    connex.commit()


@app.route('/getproducts', methods=['GET'])
def get_products():
    if not table_exists('product') or len(get_products_from_db()) == 0:
        return jsonify({"message": "No products added yet"})
    
    
    products = get_products_from_db()
    
    # Check if there are no products in the database
    if not products:
        return jsonify({"message": "No products added yet"})

    # You may want to format the data if needed
    formatted_products = []
    for product in products:
        formatted_product = {
            "product_id": product[0],
            "title": product[1],
            "price": product[2],
            "score": product[3],
            "image": product[4],
            "link": product[5]
        }
        formatted_products.append(formatted_product)

    return jsonify({"products": formatted_products})
    

@app.route('/addproduct', methods=['POST'])
def add_product():
    if not table_exists('product'):
        create_table()
        
    link = request.json['value']
    
    product_info = get_product_info(link) # Return : [title, price, score, image, link]
    print(product_info)

    insert_product(product_info[0],product_info[1],product_info[2],product_info[3],product_info[4])

    # Return a success message or the updated product list.
    return jsonify({"message": "Product added successfully"})


if __name__ == '__main__':
    app.run(debug=True)