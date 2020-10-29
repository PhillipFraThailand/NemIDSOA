import sqlite3

connection =  sqlite3.connect("nemIdDatabase.sqlite")

cursor = connection.cursor()

query = """ INSERT INTO User VALUES (?, ?, ?) """

cursor.execute(query, [1, "1234", "something"])


connection.commit()