var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

exports.collectData = function(request, cb){
  var data = "";
  request.on("data", function(chunk){
    data += chunk;
  });
  request.on("end", function(){
    cb(null, JSON.parse(data));
  });
};

exports.sendResponse = function(response, obj, status, type, options){
  status = status || 200;
  var headers2 = headers;
  if (options) {
    headers2["Allow"] = "GET, POST, PUT, DELETE, OPTIONS"
  }
  headers2["Content-type"] = type || "application/json";
  response.writeHead(status, headers2);
  if (headers2["Content-type"]==="application/json") {
  var string = JSON.stringify(obj);
  console.log("Sending: %s", string);
  response.end(string);
  } else {
    response.end(obj)
  }
};
