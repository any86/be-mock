const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User schema
 */

const UserSchema = new Schema({
  name: { type: String, default: '',isRequired:true },
  email: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

UserSchema.method({

});

/**
 * Statics
 */

UserSchema.static({});

/**
 * Register
 */

const User = mongoose.model('User', UserSchema);


// User.create({ name: 'Ning' }, function (err, name) {
//   if (err) return handleError(err);
//   // saved!
// })


// User.find({name:'Ning'}).then(data=>{
//   console.log(data);
// })