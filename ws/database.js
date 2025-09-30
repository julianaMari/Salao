require('dotenv').config(); 
const mongoose = require('mongoose');

// A variável URI recebe a string do seu arquivo .env
const URI = process.env.DATABASE_URL; 

mongoose
  .connect(URI)
  .then(() => console.log('DB is Up!'))
  .catch(err => console.log('DB connection error:', err));




//const mongoose = require('mongoose');
//const API_KEY = process.env.DATABASE_URL;
//const URI = API_KEY;
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

//mongoose
//.connect(URI)
//.then(() => console.log('DB is Up!'))
//.catch(() => console.log(err));