const express = require('express');
require("dotenv").config();
const client = require('./dbpg.js');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

// TODO set routes and controllers structure

app.get('/reviews', (req, res)=>{

  let getQuery = `Select * from public.reviews
  ORDER BY id ASC LIMIT 100`;

  let getQuery2 = `Select * from public.reviews_photos
  ORDER BY id ASC LIMIT 100`;

  let getQuery3 = `SELECT *, json_agg(json_build_object('id', id, 'url', url)) AS agg
  FROM public.reviews JOIN (
  SELECT * FROM reviews_photos
  ) AS photos ON reviews=public.reviews_photos
  GROUP BY public.reviews`;


  client.query(getQuery, (err, result)=>{
      if(!err){
          res.send(result.rows);
      } else {
        console.log(err.message);
        res.send(err.message);
      }
  });
  client.end;
})

app.get('/reviews/:id', (req, res)=>{
  client.query(`Select * from public.reviews
  where id=${req.params.id}`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      }
  });
  client.end;
})

app.post('/reviews', (req, res)=> {
  const user = req.body;
  let insertQuery = `insert into users(product_id, rating, summary, body, recommend, name, email, photos, characteristics)
                      values(${user.product_id},
                      '${user.rating}',
                      '${user.summary}',
                      '${user.body}'),
                      '${user.recommend}'),
                      '${user.name}'),
                      '${user.email}'),
                      '${user.photos}'),
                      '${user.characteristics}')`

  client.query(insertQuery, (err, result)=>{
      if(!err){
          res.send('review was created');
      }
      else{ console.log(err.message) }
  })
  client.end;
})

app.put('/reviews/:id/helpful', (req, res)=> {
  let review = req.body;
  let updateQuery = `update users
                    set firstname = '${review.firstname}',
                    lastname = '${review.lastname}',
                    location = '${review.location}'
                    where id = ${review.id}`

  client.query(updateQuery, (err, result)=>{
      if(!err){
          res.send('Update was successful')
      }
      else{ console.log(err.message) }
  })
  client.end;
})

app.delete('/reviews/:id', (req, res)=> {
  let insertQuery = `delete from users where id=${req.params.id}`

  client.query(insertQuery, (err, result)=>{
      if(!err){
          res.send('Deletion was successful')
      }
      else{ console.log(err.message) }
  })
  client.end;
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

client.connect();