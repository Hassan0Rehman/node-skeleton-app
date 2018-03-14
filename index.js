const http          = require('http');
const path          = require("path");
const marko         = require("marko");
const request       = require("request");
const _             = require("lodash");
const parser        = require("./home.parser");
const config        = require("./config");
const { Transform } = require("stream");
const serveStatic   = require('serve-static')
const port          = 31286;

require("marko/node-require").install();
require("marko/compiler").defaultOptions.preserveWhitespace = true;

const template = require("./home.marko");
const articlesTemplate = require("./articles.marko");
const schedulesTemplate = require("./schedule-widget.marko");

function pipeAsyncTemplates(bigPipeCallback, templates, bigPipeInstance) {
  const bigPipe = bigPipeInstance;
  const urL = config.base.prod, apiResponseBuffers = [];
  let flushCount = 0;
  for (let i = 0; i < templates.length; i++) {
      apiResponseBuffers[i] = "";
      const templateName = templates[i].name;
      const api = _.get(config, _.kebabCase(templateName));
      // if (flushCount === templates.length - 1) {
      //     bigPipeInstance.push(null);
      //     bigPipeCallback();                  // End response
      // }
      // flushCount++;
      request.get({
          url: config.base.prod + _.get(api, "url"),
          json: true,
          headers: {
              "Authorization": config.token.prod,
              "content-type" : "application/json; charset=utf-8"
          }
      }).on("error", function() {
          // bigPipe.push("Something went wrong :+)");
          bigPipeCallback();
          return;
      }).pipe(new Transform({
          encoding: "utf8",
          decodeStrings: false,           // Whether or not to decode strings into Buffers before passing them to stream._write()
          highWaterMark: (16384 * 2),     // Buffer level when stream.write() starts returning false. Default = 16384 (16kb)
          transform(chunk, encoding, callback) {
              apiResponseBuffers[i] = apiResponseBuffers[i] += chunk;
              this.push(chunk) && callback();
          },

          flush(callback) {
              flushCount++;
              const apiResponse = parser(apiResponseBuffers[i], templates[i].name);
              return templates[i].template.renderToString(apiResponse, function(err, html) {
                  if (!err) {
                      bigPipeInstance.push(html);             // Push generated HTML on pipe
                      callback();                             // Acknowledge flush for iteration
                      if (flushCount >= templates.length) {
                          bigPipeCallback();                  // End response
                      }
                  }
              });
          }
      }));
  }
}

function finalHandler(request, response) {
  const asyncFragments = [
    {name: "articles", template: articlesTemplate},
    {name: "scheduleWidget", template: schedulesTemplate}
  ];

  if (request.url === "/") {
    template.stream({}).pipe(new Transform({
      encoding: "utf8",       // Specifies encoding in which data is read.
      decodeStrings: false,   // Whether or not to decode strings into Buffers before passing them to stream._write()
      highWaterMark: 16384,   // Buffer level when stream.write() starts returning false. Default = 16384 (16kb)
      // This method will start reading template ReadStream and Push to client if buffer is free
      transform(chunk, encoding, callback) {
          this.push(chunk) && callback();
      },
      flush(bigPipeEndCallBack) {
          // bigPipeEndCallBack(null);
          pipeAsyncTemplates(bigPipeEndCallBack, asyncFragments, this);
      }
    })).pipe(response).on("finish", function() {
      response.end();
    });
  }
  return;
}

// const requestHandler = (request, response) => {
//   serve(request, response, finalHandler(request, response));
// }
// const serve = serveStatic('public', {'index': false});
const server = http.createServer(finalHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
});
