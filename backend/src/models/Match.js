const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
    default: 'OPEN'
  },
  creator: {
    type: String,
    required: true
  },
  players: [{
    type: String
  }],
  // results armazena as pontuações em formato chave-valor. Ex: { "email@teste.com": 150.5 }
  results: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Transforma o _id do MongoDB no campo 'id' padrão que o frontend já usa
matchSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Match', matchSchema);
