const express = require('express');
const app = express();

const port = process.env.PORT || 5005;

app.listen(port, () => console.log(`Node server started at port ${port}`));
