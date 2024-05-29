const mongoose = require('mongoose')

// Define the user schema
const userSchema = new mongoose.Schema({
   
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      validate: {
        validator: function(value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: props => `${props.value} is not a valid email address`
      }
    },
    password: {
      type: String,
      required: true,
    },
    twofasecret:{
      type:String
    }
}); 
  
  // Create the User model
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
  