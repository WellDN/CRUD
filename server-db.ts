import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();

const port = process.env.PORT || 3000;

const db = new sqlite3.Database('./li.db');

db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');

app.get('/', (req, res) => {
    res.send("testy");
})

app.get('/add', (req,res) => {
  db.serialize(() => {
    db.run('INSERT INTO emp(id,name) VALUES(?,?)', (req.params), (err)  => {
      if (err) {
        return console.log(err.message);
      }
      console.log("New employee has been added");
      res.send(req.params);
    });
});
});


app.get('/view', (req,res) => {
  db.serialize(() => {
    db.each('SELECT id ID, name NAME FROM emp WHERE id =?', [req.params.id], (err,row) => {     
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID},    Name: ${row.NAME}`);
      console.log("Entry displayed successfully");
    });
  });
});

app.get('/update', (req,res) => {
  db.serialize(() => {
    db.run('UPDATE emp SET name = ? WHERE id = ?', [req.params.name,req.params.id], (err) => {
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("Entry updated successfully");
      console.log("Entry updated successfully");
    });
  });
});

app.get('/del', (req,res) => {
  db.serialize(() => {
    db.run('DELETE FROM emp WHERE id = ?', req.params.id, (err) => {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entry deleted");
      console.log("Entry deleted");
    });
  });
});

app.get('/close', (req,res) => {
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });
});


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
