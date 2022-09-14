const mongoose = require("mongoose");
mongoose.connect(`mongodb://localhost/${process.env.MG_DB_NAME}`);

let reviewSchema = mongoose.Schema({
  review_id: Number,
  rating: Number,
  summary: String,
  recommend: String,
  response: String,
  body: String,
  date: String,
  reviewer_name: String,
  helpfulness: Number,
  photos: Array,
})

const Review = mongoose.model('Review', reviewSchema);

let save = (rating, summary, body, recommend, name, email, photos, characteristics) => {
    Review.create({
    rating: rating,
    summary: summary,
    body: body,
    recommend: recommend,
    name: name,
    email: email,
    photos: photos,
    characteristics: characteristics,
  })
}

let update = (id, helpfulness) => {

  const filter = { _id: id };
  const update = { helpfulness: helpfulness };

  Review.findOneAndUpdate(filter, update, {
    new: true
  }).then(() => {
    console.log('entry updated');
  })

}

let erase = (id) => {
  Review.deleteOne({id}).then(() => {
    console.log('entry deleted');
  })
}

module.exports.Review = Review;
module.exports.save = save;
module.exports.update = update;
module.exports.erase = erase;
