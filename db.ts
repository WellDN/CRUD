import sqlite3 from 'sqlite3'

let db = new sqlite3.Database('./li.db', (err) => {
    if(err) {
    return console.error(err.message);
    }
    console.log('Connected to the db');
})
  

    db.exec(`
    CREATE TABLE IF NOT EXISTS users
    (
     ID INTEGER PRIMARY KEY AUTOINCREMENT,
     name VARCHAR(15) NOT NULL,
     pwd VARCHAR(25) NOT NULL,
     auth INTEGER NOT NULL
    );
`)




db.close((err) => {
    if(err) {
    console.error(err.message);
    }
    console.log('Close the database connection.');
});

