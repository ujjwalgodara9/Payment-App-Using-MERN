const express = require('express');
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/v1", mainRouter);

app.listen(3000);


// const express = require('express');
// const cors = require("cors");
// const rootRouter = require("./routes/index");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/v1", rootRouter);

// app.listen(3000);



