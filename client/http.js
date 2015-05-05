/*
 * dependencies
 */
var options = require('./options'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    util = require('util');

/*
 * class constructor
 */
function HttpWrapper()
{
    var _this = this;
    this.getHttpOptions = function(path) {
          var urlParts = url.parse(options.getApiUrl());
            
          _this.httpOptions = {
                  "hostname": urlParts.hostname,
                  "port": urlParts.port,
                  "path": path
          };
        
        if (options.isAllowSelfSignedCertificates()) {
            _this.httpOptions['rejectUnauthorized'] = false;
        }
        
         return _this.httpOptions;
    };
    this.extendJsonParameters = function(httpOptions) {
        httpOptions['headers'] = {
            'Content-Type': 'application/json'
        };
      
        return httpOptions;
    };
};

HttpWrapper.prototype.getAdapter = function()
{
    if (undefined == this.adapter) {
        // use https library if API URL starts with HTTPS
        this.adapter = 'https' == options.getApiUrl().substring(0, 5) ? https : http;
        
        if (options.isDevelopment()) {
            console.log('Using adapter ' + 'https' == options.getApiUrl().substring(0, 5) ? 'https' : 'http');
        }
    }
    
    return this.adapter;
};

HttpWrapper.prototype.doGet = function (path, callback) {
    var method = "GET";
    
    var httpOptions = this.getHttpOptions(path);
    httpOptions['method'] = method;
    
    var req = this.getAdapter().request(httpOptions, callback);
    req.end();
};

HttpWrapper.prototype.doPost = function (path, json, callback) {
   var method = "POST";

   var httpOptions = this.getHttpOptions(path);
   httpOptions = this.extendJsonParameters(httpOptions);
   httpOptions['method'] = method;

   var req = this.getAdapter().request(httpOptions, callback);
    req.write(json);
    req.end();
    
    if (options.isDevelopment()) {
        console.log("Sending request..."
        + "\n" + util.inspect(req, {showHidden: false, depth: null})
        );
    }
};

HttpWrapper.prototype.doPut = function (path, json, callback) {
   var method = "PUT";

   var httpOptions = this.getHttpOptions(path);
   httpOptions = this.extendJsonParameters(httpOptions);
   httpOptions['method'] = method;

   var req = this.getAdapter().request(httpOptions, callback);
    req.write(json);
    req.end();
};

HttpWrapper.prototype.doDelete = function (path, callback) {
   var method = "DELETE";

   var httpOptions = this.getHttpOptions(path);
   httpOptions['method'] = method;

    this.getAdapter().request(httpOptions, callback);
};

var httpWrapper = new HttpWrapper();
module.exports = httpWrapper;

