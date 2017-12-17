var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');


// var Link = db.Model.extend({
  //   tableName: 'urls',
  //   hasTimestamps: true,
  //   defaults: {
    //     visits: 0
    //   },
    //   initialize: function() {
      //     this.on('creating', function(model, attrs, options) {
        //       var shasum = crypto.createHash('sha1');
        //       shasum.update(model.get('url'));
        //       model.set('code', shasum.digest('hex').slice(0, 5));
        //     });
        //   }
        // });
        
        // link.increments('id').primary();
        //       link.string('url', 255);
        //       link.string('baseUrl', 255);
        //       link.string('code', 100);
        //       link.string('title', 255);
        //       link.integer('visits');
        //       link.timestamps();
        
const linkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  baseUrl: { type: String, required: true },
  code: { type: String, required: true },
  title: { type: String, required: true },
  visits: { type: Number, required: true }
});

const Link = mongoose.model('Link', linkSchema);

linkSchema.post('save', (newLink) =>{
  let code = crypto.createHash('sha1');
  code.update(newLink.url);
  code = code.digest('hex').slice(0, 5);
  Link.update(newLink, {code: code});
});

module.exports = Link;
