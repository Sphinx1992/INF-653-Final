const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true
  },
  funfacts: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.length >= 3; // Ensure at least 3 fun facts are provided
      },
      message: 'At least 3 fun facts are required.'
    }
  }
});

const State = mongoose.model('States', stateSchema);

module.exports = State;
