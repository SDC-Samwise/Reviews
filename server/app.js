const express = require('express');
require("dotenv").config();
const client = require('./dbpg.js');
const app = express();
const port = process.env.PORT || 3000;

//import dateFormat from 'dateformat';
//const formattedDate = dateFormat(date, 'dddd, mmmm dS, yyyy');

app.use(express.json());

// TODO set routes and controllers structure
// reviews should not return anything if not passed product_id
app.get('/reviews', (req, res)=>{
  let data = 'Error: invalid product_id provided';
  res.status(422).send(data);
})

app.get('/reviews/:id', (req, res)=>{

  let offset = `
  select az.*, COALESCE(json_agg(json_build_object('id', ap.id, 'url', ap.url))
FILTER (WHERE ap.id IS NOT NULL), '[]') photos
from reviews az
left join reviews_photos ap on ap.review_id=az.id where az.id = ap.review_id
group by az.id
limit 5
OFFSET 3`

  let getQuery = `select az.*, COALESCE(json_agg(json_build_object('id', ap.id, 'url', ap.url))
    FILTER (WHERE ap.id IS NOT NULL), '[]') photos
    from reviews az
    left join reviews_photos ap on ap.review_id=az.id where az.product_id = ${req.params.id}
    group by az.id`;

    let getQuery2 = `select az.*, COALESCE(json_agg(json_build_object('id', ap.id, 'url', ap.url))
    FILTER (WHERE ap.id IS NOT NULL), '[]') photos
      from reviews az
      left join reviews_photos ap on ap.review_id=az.id where az.id = 1
      group by az.id
      limit 5
      OFFSET 3`;

  client.query(getQuery, (err, result)=>{
      if(!err){
        let data = {
          products: parseInt(req.params.id) || 1,
          page: parseInt(req.params.page) || 0,
          count: parseInt(req.params.count) || 5,
          results: result.rows
        };

          res.send(data);
      }
  });
  client.end;
})


app.get('/reviews/meta', (req, res)=>{
  let data = 'Error: invalid meta? provided';
  res.status(422).send(data);
})

app.get('/reviews/meta/:id', (req, res)=>{

    let getQuery = `select az.*, COALESCE(json_agg(json_build_object('id', ap.id, 'url', ap.url))
    FILTER (WHERE ap.id IS NOT NULL), '[]') photos
    from reviews az
    left join reviews_photos ap on ap.review_id=az.id where az.product_id = ${req.params.id}
    group by az.id`;

  client.query(getQuery, (err, result)=>{
    if(!err){
      let data = {
        products: parseInt(req.params.id) || 1,
        results: result.rows
      };
        res.send(data);
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
  let insertQuery = `delete from reviews where id=${req.params.id}`

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