require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const routes = require('src/routes');
const HttpError = require('src/responses/httpError');
const HttpSuccess = require('src/responses/httpSuccess');
const logger = require('src/utilities/loggerUtil');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(fileUpload({
  limits: {fileSize: 50 * 1024 * 1024},
}));

// Routes
app.use('/', routes);

// Success middleware
app.use((req, res, next) => {
  if (res.locals.respObj && res.locals.respObj instanceof HttpSuccess) {
    res
        .status(res.locals.respObj.status)
        .json(res.locals.respObj);
  }
  next();
});


app.use((error, req, res, next)=>{
  if (!(error instanceof HttpError)) {
    const errorObj = new HttpError();
    return res.status(errorObj.status).json(error);
  } else {
    return res.status(error.status).json(error);
  }
});

app.listen(process.env.PORT || 8080, ()=>{
  logger.info(`Listening to port ${process.env.PORT}`);
});
