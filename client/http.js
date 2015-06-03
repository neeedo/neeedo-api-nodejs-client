/*
 * dependencies
 */
var globalOptions = require('./options'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    util = require('util'),
    fs = require('fs');

/*
 * Class: HttpAdapter
 *
 * This adapter class allows to do GET, POST, PUT and DELETE REST operations on the NEEEDO API, on both HTTP and HTTPS layer.
 */
function HttpAdapter()
{
    var _this = this;
    this.getHttpOptions = function(path) {
        var urlParts = url.parse(globalOptions.getApiUrl());

        _this.httpOptions = {
            "hostname": urlParts.hostname,
            "port": urlParts.port,
            "path": path
        };

        if (_this.isHttps() && globalOptions.isAllowSelfSignedCertificates()) {
            _this.httpOptions['rejectUnauthorized'] = false;
        }

        return _this.httpOptions;
    };
    this.extendJsonParameters = function(httpOptions) {
        if (!('headers' in httpOptions)) {
            httpOptions['headers'] = {};
        }

        httpOptions['headers']['Content-Type'] = 'application/json';

        return httpOptions;
    };
    this.extendByAdditionalOptions = function(httpOptions, additionalOptions) {
        var authorizationToken = additionalOptions.authorizationToken || undefined;
        var contentType = additionalOptions.contentType || undefined;

        if (!('headers' in httpOptions)) {
            httpOptions['headers'] = {};
        }

        // append Basic authorization token if given
        if (undefined !== authorizationToken) {
            httpOptions['headers']['Authorization'] = 'Basic ' + authorizationToken;
        }

        // append Content type if given
        if (undefined !== authorizationToken) {
            httpOptions['headers']['Content-Type'] = contentType;
        }

        return httpOptions;
    };
};

HttpAdapter.prototype.isHttps = function()
{
    return 'https' == globalOptions.getApiUrl().substring(0, 5);
}

/**
 * Get the underlying adapter (either HTTP or HTTPS, depending on the Neeedo API base URL).
 * @returns {exports|*}
 */
HttpAdapter.prototype.getAdapter = function()
{
    if (undefined == this.adapter) {
        // use https library if API URL starts with HTTPS
        this.adapter = this.isHttps() ? https : http;

        globalOptions.getLogger().info('HttpAdapter: Using adapter ' + (this.isHttps() ? 'https' : 'http'));
    }

    return this.adapter;
};

/**
 * Do a simple GET operation.
 * @param path String the Query path that will be appended to the API baseURL.
 * @param callback callback callback method that will be called in each case
 * @param onErrorCallback callback method that will be called if HTTP connection fails
 * @param options additional options
 */
HttpAdapter.prototype.doGet = function (path, callback, onErrorCallback, options) {
    var method = "GET";

    var httpOptions = this.getHttpOptions(path);
    httpOptions['method'] = method;
    httpOptions = this.extendByAdditionalOptions(httpOptions, options);

    var req = this.getAdapter().request(httpOptions, callback);

    req.on('error', function(error) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not connect to API.");
    });
    
    req.end();

    globalOptions.getLogger().info("HttpAdapter: Sending GET request..."
    + "\n" + util.inspect(httpOptions, {showHidden: false, depth: 3}));
};

/**
 * Do a POST operation.
 *
 * @param path String the Query path that will be appended to the API baseURL.
 * @param json String marshalled JSON that will be sent to the API
 * @param callback callback method that will be called in each case
 * @param onErrorCallback callback method that will be called if HTTP connection fails
 * @param options additional options
 */
HttpAdapter.prototype.doPost = function (path, json, callback, onErrorCallback, options) {
    var method = "POST";

    var httpOptions = this.getHttpOptions(path);
    httpOptions = this.extendJsonParameters(httpOptions);
    httpOptions['method'] = method;
    httpOptions = this.extendByAdditionalOptions(httpOptions, options);

    var req = this.getAdapter().request(httpOptions, callback);
    req.write(json);
    
    req.on('error', function(error) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not connect to API.");
    });
    
    req.end();

    globalOptions.getLogger().info("HttpAdapter: Sending POST request..."
        + "\n" + util.inspect(httpOptions, {showHidden: false, depth: 3})
    );
};

/**
 * Do a PUT operation.
 *
 * @param path String the Query path that will be appended to the API baseURL.
 * @param json String marshalled JSON that will be sent to the API
 * @param callback callback method that will be called in each case
 * @param onErrorCallback callback method that will be called if HTTP connection fails*
 * @param options additional options
 */
HttpAdapter.prototype.doPut = function (path, json, callback, onErrorCallback, options) {
    var method = "PUT";

    var httpOptions = this.getHttpOptions(path);
    httpOptions = this.extendJsonParameters(httpOptions);
    httpOptions['method'] = method;
    httpOptions = this.extendByAdditionalOptions(httpOptions, options);

    var req = this.getAdapter().request(httpOptions, callback);
    req.write(json);

    req.on('error', function(error) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not connect to API.");
    });
    
    req.end();

    globalOptions.getLogger().info("HttpAdapter: Sending PUT request..."
        + "\n" + util.inspect(httpOptions, {showHidden: false, depth: 3})
    );
};

/**
 * Do a DELETE operation.
 *
 * @param path String the Query path that will be appended to the API baseURL.
 * @param callback callback method that will be called in each case
 * @param onErrorCallback callback method that will be called if HTTP connection fails
 * @param options additional options
 */
HttpAdapter.prototype.doDelete = function (path, callback, onErrorCallback, options) {
    var method = "DELETE";

    var httpOptions = this.getHttpOptions(path);
    httpOptions['method'] = method;
    httpOptions = this.extendByAdditionalOptions(httpOptions, options);

    var req = this.getAdapter().request(httpOptions, callback);

    req.on('error', function(error) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not connect to API.");
    });
    
    req.end();

    globalOptions.getLogger().info("HttpAdapter: Sending DELETE request..."
        + "\n" + util.inspect(httpOptions, {showHidden: false, depth: 3})
    );
};

HttpAdapter.prototype.sendFile = function(path, fileName, filePath, fileType, callback, onErrorCallback, options) {
    var method = "POST";

    var httpOptions = this.getHttpOptions(path);
    httpOptions['method'] = method;

    var boundaryKey = Math.random().toString(16); // random string
    options['contentType'] =  'multipart/form-data; boundary="'+boundaryKey+'"';
    httpOptions = this.extendByAdditionalOptions(httpOptions, options);

    var req = this.getAdapter().request(httpOptions, callback);
    req.setHeader('Content-Type', 'multipart/form-data; boundary="'+boundaryKey+'"');
    req.setHeader('Authorization', 'Basic "' + options['authorizationToken'] +'"');

    // the header for the one and only part (need to use CRLF here)
    req.write(
        '--' + boundaryKey + '\r\n'
            // use your file's mime type here, if known
        + 'Content-Type: application/octet-stream\r\n'
            // "name" is the name of the form field
            // "filename" is the name of the original file
        + 'Content-Disposition: form-data; name="'+ fileName +'"; filename="'+ fileName +'\n"\r\n'
        + 'Content-Transfer-Encoding: binary\r\n\r\n'
    );

    fs.readFile(filePath, function(err, data) {
        if (err) {
            errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not read file: " + err);
        } else {
            globalOptions.getLogger().info('Sending... ');
            req.write(data);
            req.end('--' + boundaryKey + '--');
        }
    });

    req.on('error', function(error) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not connect to API.");
    });
    /*
     fs.createReadStream(filePath, { bufferSize: 4 * 1024 })
     // set "end" to false in the options so .end() isnt called on the request
     .pipe(req, { end: false }) // maybe write directly to the socket here?
     .on('end', function() {
     globalOptions.getLogger().info("in end..");
     // mark the end of the one and only part
     req.end('--' + boundaryKey + '--');
     })
     .on('error', function() {
     errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not sent file.");
     })
     ;*/

    req.on('error', function(error) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not sent file.");
    });

    globalOptions.getLogger().info("HttpAdapter: Sending File request..."
        + "\n" + util.inspect(httpOptions, {showHidden: false, depth: 3})
    );

};

var httpAdapter = new HttpAdapter();
module.exports = httpAdapter;
