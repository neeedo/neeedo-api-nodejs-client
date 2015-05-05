/*
 * dependencies
 */
var options = require('./options'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    util = require('util');

/*
 * Class: HttpWrapper
 * 
 * This adapter class allows to do GET, POST, PUT and DELETE REST operations on the NEEEDO API, on both HTTP and HTTPS layer.
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
        
        if (_this.isHttps() && options.isAllowSelfSignedCertificates()) {
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

HttpWrapper.prototype.isHttps = function()
{
    return 'https' == options.getApiUrl().substring(0, 5);
}

/**
 * Get the underlying adapter (either HTTP or HTTPS, depending on the Neeedo API base URL).
 * @returns {exports|*}
 */
HttpWrapper.prototype.getAdapter = function()
{
    if (undefined == this.adapter) {
        // use https library if API URL starts with HTTPS
        this.adapter = this.isHttps() ? https : http;
        
        console.info('HttpWrapper: Using adapter ' + 'https' == options.getApiUrl().substring(0, 5) ? 'https' : 'http');
    }
    
    return this.adapter;
};

/**
 * Do a simple GET operation.
 * @param path String the Query path that will be appended to the API baseURL.
 * @param callback callback callback method that will be called in each case
 */
HttpWrapper.prototype.doGet = function (path, callback) {
    var method = "GET";
    
    var httpOptions = this.getHttpOptions(path);
    httpOptions['method'] = method;
    
    var req = this.getAdapter().request(httpOptions, callback);
    req.end();
};

/**
 * Do a POST operation.
 *
 * @param path String the Query path that will be appended to the API baseURL.
 * @param json String marshalled JSON that will be sent to the API
 * @param callback callback method that will be called in each case
 */
HttpWrapper.prototype.doPost = function (path, json, callback) {
   var method = "POST";

   var httpOptions = this.getHttpOptions(path);
   httpOptions = this.extendJsonParameters(httpOptions);
   httpOptions['method'] = method;

   var req = this.getAdapter().request(httpOptions, callback);
    req.write(json);
    req.end();
    
    if (options.isDevelopment()) {
        console.info("HttpWrapper: Sending request..."
        + "\n" + util.inspect(req, {showHidden: false, depth: null})
        );
    }
};

/**
 * Do a PUT operation.
 *
 * @param path String the Query path that will be appended to the API baseURL.
 * @param json String marshalled JSON that will be sent to the API
 * @param callback callback method that will be called in each case
 */
HttpWrapper.prototype.doPut = function (path, json, callback) {
   var method = "PUT";

   var httpOptions = this.getHttpOptions(path);
   httpOptions = this.extendJsonParameters(httpOptions);
   httpOptions['method'] = method;

   var req = this.getAdapter().request(httpOptions, callback);
    req.write(json);
    req.end();
};

/**
 * Do a DELETE operation.
 *
 * @param path String the Query path that will be appended to the API baseURL.
 * @param callback callback method that will be called in each case
 */
HttpWrapper.prototype.doDelete = function (path, callback) {
   var method = "DELETE";

   var httpOptions = this.getHttpOptions(path);
   httpOptions['method'] = method;

    this.getAdapter().request(httpOptions, callback);
};

var httpWrapper = new HttpWrapper();
module.exports = httpWrapper;

