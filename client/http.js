/*
 * dependencies
 */
var globalOptions = require('./options'),
    http = require('http'),
    https = require('https'),
    request = require('request'),
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
    this.getHttpOptions = function(path, method, additionalOptions) {
        var urlParts = url.parse(globalOptions.getApiUrl());

        var httpOptions = {
            "hostname": urlParts.hostname,
            "port": urlParts.port,
            "path": path,
            "method" : method
        };

        if (_this.isHttps() && globalOptions.isAllowSelfSignedCertificates()) {
            httpOptions['rejectUnauthorized'] = false;
        }

        httpOptions = this.extendByAdditionalOptions(httpOptions, additionalOptions);

        return httpOptions;
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
        if (undefined !== contentType) {
            httpOptions['headers']['Content-Type'] = contentType;
        }

        return httpOptions;
    };
    
    this.handleNoApiConnectionError = function(req, onErrorCallback) {
        req.on('error', function(error) {
            errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Could not connect to API.");
        });
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
    var httpOptions = this.getHttpOptions(path, "GET", options);

    var req = this.getAdapter().request(httpOptions, callback);

    this.handleNoApiConnectionError(req, onErrorCallback);
    
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
    var httpOptions = this.getHttpOptions(path, "POST", options);
    httpOptions = this.extendJsonParameters(httpOptions);

    var req = this.getAdapter().request(httpOptions, callback);
    req.write(json);

    this.handleNoApiConnectionError(req, onErrorCallback);
    
    req.end();

    globalOptions.getLogger().info("HttpAdapter: Sending POST request..."
        + "\n" + util.inspect(httpOptions, {showHidden: false, depth: 3})
        + "\n" + "Request JSON:"
        + "\n" + json
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
    var httpOptions = this.getHttpOptions(path, "PUT", options);
    httpOptions = this.extendJsonParameters(httpOptions);

    var req = this.getAdapter().request(httpOptions, callback);
    req.write(json);

    this.handleNoApiConnectionError(req, onErrorCallback);
    
    req.end();

    globalOptions.getLogger().info("HttpAdapter: Sending PUT request..."
        + "\n" + util.inspect(httpOptions, {showHidden: false, depth: 3})
        + "\n" + "Request JSON:"
        + "\n" + json
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
    var httpOptions = this.getHttpOptions(path, "DELETE", options);

    if ("deleteJson" in options) {
        httpOptions = this.extendJsonParameters(httpOptions);
    }
    
    var req = this.getAdapter().request(httpOptions, callback);

    this.handleNoApiConnectionError(req, onErrorCallback);

    if ("deleteJson" in options) {
        req.write(options["deleteJson"]);
        
        globalOptions.getLogger().info(
        + "\n" + "Request JSON:"
        + "\n" + json);
    }

    req.end();

    globalOptions.getLogger().info("HttpAdapter: Sending DELETE request..."
        + "\n" + util.inspect(httpOptions, {showHidden: false, depth: 3})
    );
};

HttpAdapter.prototype.sendFile = function(path, fileName, filePath, fileType, callback, onErrorCallback, options) {
    var authToken = options.authorizationToken || undefined;
    var fieldName = options.fieldName;
    
    globalOptions.getLogger().info('auth token ' + authToken);

    var req = request.post(
        { url: globalOptions.getApiUrl() + path,
            rejectUnauthorized : false,
            headers: {'Authorization' : 'Basic ' + authToken}},
        function (err, resp, body) {
            if (err) {
                errorHandler.newMessageAndLogError(onErrorCallback, messages.no_api_connection, "Error: " + err);
            } else {
                callback(resp, body);
            }
        });

    var form = req.form();
    form.append(fieldName, fs.createReadStream(filePath));
};

var httpAdapter = new HttpAdapter();
module.exports = httpAdapter;
