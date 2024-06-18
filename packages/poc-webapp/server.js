const port    = parseInt(process.env.PORT || '3000');
const express = require('express');
const app     = express();

app.use(express.static(__dirname+'/public'));

app.listen(port, err => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  console.log(`App listening on :${port}`);
});


