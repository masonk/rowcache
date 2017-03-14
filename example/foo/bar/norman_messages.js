// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Lazily resolved type references
var $lazyTypes = [];

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.norman = (function() {

    /**
     * Namespace norman.
     * @exports norman
     * @namespace
     */
    var norman = {};

    norman.messages = (function() {

        /**
         * Namespace messages.
         * @exports norman.messages
         * @namespace
         */
        var messages = {};

        messages.GetUserByLogin = (function() {

            /**
             * Constructs a new GetUserByLogin.
             * @exports norman.messages.GetUserByLogin
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function GetUserByLogin(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetUserByLogin login.
             * @type {string|undefined}
             */
            GetUserByLogin.prototype.login = "";

            /**
             * Creates a new GetUserByLogin instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {norman.messages.GetUserByLogin} GetUserByLogin instance
             */
            GetUserByLogin.create = function create(properties) {
                return new GetUserByLogin(properties);
            };

            /**
             * Encodes the specified GetUserByLogin message.
             * @param {norman.messages.GetUserByLogin|Object} message GetUserByLogin message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUserByLogin.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.login !== undefined && message.hasOwnProperty("login"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.login);
                return writer;
            };

            /**
             * Encodes the specified GetUserByLogin message, length delimited.
             * @param {norman.messages.GetUserByLogin|Object} message GetUserByLogin message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUserByLogin.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetUserByLogin message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {norman.messages.GetUserByLogin} GetUserByLogin
             */
            GetUserByLogin.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.norman.messages.GetUserByLogin();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.login = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetUserByLogin message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {norman.messages.GetUserByLogin} GetUserByLogin
             */
            GetUserByLogin.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetUserByLogin message.
             * @param {norman.messages.GetUserByLogin|Object} message GetUserByLogin message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            GetUserByLogin.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.login !== undefined)
                    if (!$util.isString(message.login))
                        return "login: string expected";
                return null;
            };

            /**
             * Creates a GetUserByLogin message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {norman.messages.GetUserByLogin} GetUserByLogin
             */
            GetUserByLogin.fromObject = function fromObject(object) {
                if (object instanceof $root.norman.messages.GetUserByLogin)
                    return object;
                var message = new $root.norman.messages.GetUserByLogin();
                if (object.login !== undefined && object.login !== null)
                    message.login = String(object.login);
                return message;
            };

            /**
             * Creates a GetUserByLogin message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link norman.messages.GetUserByLogin.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {norman.messages.GetUserByLogin} GetUserByLogin
             */
            GetUserByLogin.from = GetUserByLogin.fromObject;

            /**
             * Creates a plain object from a GetUserByLogin message. Also converts values to other types if specified.
             * @param {norman.messages.GetUserByLogin} message GetUserByLogin
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetUserByLogin.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.login = "";
                if (message.login !== undefined && message.login !== null && message.hasOwnProperty("login"))
                    object.login = message.login;
                return object;
            };

            /**
             * Creates a plain object from this GetUserByLogin message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetUserByLogin.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this GetUserByLogin to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            GetUserByLogin.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GetUserByLogin;
        })();

        messages.GetUserByLoginResponse = (function() {

            /**
             * Constructs a new GetUserByLoginResponse.
             * @exports norman.messages.GetUserByLoginResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function GetUserByLoginResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetUserByLoginResponse userLogin.
             * @type {string|undefined}
             */
            GetUserByLoginResponse.prototype.userLogin = "";

            /**
             * GetUserByLoginResponse userEmail.
             * @type {string|undefined}
             */
            GetUserByLoginResponse.prototype.userEmail = "";

            /**
             * Creates a new GetUserByLoginResponse instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {norman.messages.GetUserByLoginResponse} GetUserByLoginResponse instance
             */
            GetUserByLoginResponse.create = function create(properties) {
                return new GetUserByLoginResponse(properties);
            };

            /**
             * Encodes the specified GetUserByLoginResponse message.
             * @param {norman.messages.GetUserByLoginResponse|Object} message GetUserByLoginResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUserByLoginResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userLogin !== undefined && message.hasOwnProperty("userLogin"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.userLogin);
                if (message.userEmail !== undefined && message.hasOwnProperty("userEmail"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userEmail);
                return writer;
            };

            /**
             * Encodes the specified GetUserByLoginResponse message, length delimited.
             * @param {norman.messages.GetUserByLoginResponse|Object} message GetUserByLoginResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetUserByLoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetUserByLoginResponse message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {norman.messages.GetUserByLoginResponse} GetUserByLoginResponse
             */
            GetUserByLoginResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.norman.messages.GetUserByLoginResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.userLogin = reader.string();
                        break;
                    case 2:
                        message.userEmail = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetUserByLoginResponse message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {norman.messages.GetUserByLoginResponse} GetUserByLoginResponse
             */
            GetUserByLoginResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetUserByLoginResponse message.
             * @param {norman.messages.GetUserByLoginResponse|Object} message GetUserByLoginResponse message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            GetUserByLoginResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.userLogin !== undefined)
                    if (!$util.isString(message.userLogin))
                        return "userLogin: string expected";
                if (message.userEmail !== undefined)
                    if (!$util.isString(message.userEmail))
                        return "userEmail: string expected";
                return null;
            };

            /**
             * Creates a GetUserByLoginResponse message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {norman.messages.GetUserByLoginResponse} GetUserByLoginResponse
             */
            GetUserByLoginResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.norman.messages.GetUserByLoginResponse)
                    return object;
                var message = new $root.norman.messages.GetUserByLoginResponse();
                if (object.userLogin !== undefined && object.userLogin !== null)
                    message.userLogin = String(object.userLogin);
                if (object.userEmail !== undefined && object.userEmail !== null)
                    message.userEmail = String(object.userEmail);
                return message;
            };

            /**
             * Creates a GetUserByLoginResponse message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link norman.messages.GetUserByLoginResponse.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {norman.messages.GetUserByLoginResponse} GetUserByLoginResponse
             */
            GetUserByLoginResponse.from = GetUserByLoginResponse.fromObject;

            /**
             * Creates a plain object from a GetUserByLoginResponse message. Also converts values to other types if specified.
             * @param {norman.messages.GetUserByLoginResponse} message GetUserByLoginResponse
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetUserByLoginResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.userLogin = "";
                    object.userEmail = "";
                }
                if (message.userLogin !== undefined && message.userLogin !== null && message.hasOwnProperty("userLogin"))
                    object.userLogin = message.userLogin;
                if (message.userEmail !== undefined && message.userEmail !== null && message.hasOwnProperty("userEmail"))
                    object.userEmail = message.userEmail;
                return object;
            };

            /**
             * Creates a plain object from this GetUserByLoginResponse message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetUserByLoginResponse.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this GetUserByLoginResponse to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            GetUserByLoginResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GetUserByLoginResponse;
        })();

        messages.GetLoginByName = (function() {

            /**
             * Constructs a new GetLoginByName.
             * @exports norman.messages.GetLoginByName
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function GetLoginByName(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetLoginByName first.
             * @type {string|undefined}
             */
            GetLoginByName.prototype.first = "";

            /**
             * Creates a new GetLoginByName instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {norman.messages.GetLoginByName} GetLoginByName instance
             */
            GetLoginByName.create = function create(properties) {
                return new GetLoginByName(properties);
            };

            /**
             * Encodes the specified GetLoginByName message.
             * @param {norman.messages.GetLoginByName|Object} message GetLoginByName message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLoginByName.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.first !== undefined && message.hasOwnProperty("first"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.first);
                return writer;
            };

            /**
             * Encodes the specified GetLoginByName message, length delimited.
             * @param {norman.messages.GetLoginByName|Object} message GetLoginByName message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLoginByName.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetLoginByName message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {norman.messages.GetLoginByName} GetLoginByName
             */
            GetLoginByName.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.norman.messages.GetLoginByName();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.first = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetLoginByName message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {norman.messages.GetLoginByName} GetLoginByName
             */
            GetLoginByName.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetLoginByName message.
             * @param {norman.messages.GetLoginByName|Object} message GetLoginByName message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            GetLoginByName.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.first !== undefined)
                    if (!$util.isString(message.first))
                        return "first: string expected";
                return null;
            };

            /**
             * Creates a GetLoginByName message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {norman.messages.GetLoginByName} GetLoginByName
             */
            GetLoginByName.fromObject = function fromObject(object) {
                if (object instanceof $root.norman.messages.GetLoginByName)
                    return object;
                var message = new $root.norman.messages.GetLoginByName();
                if (object.first !== undefined && object.first !== null)
                    message.first = String(object.first);
                return message;
            };

            /**
             * Creates a GetLoginByName message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link norman.messages.GetLoginByName.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {norman.messages.GetLoginByName} GetLoginByName
             */
            GetLoginByName.from = GetLoginByName.fromObject;

            /**
             * Creates a plain object from a GetLoginByName message. Also converts values to other types if specified.
             * @param {norman.messages.GetLoginByName} message GetLoginByName
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetLoginByName.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.first = "";
                if (message.first !== undefined && message.first !== null && message.hasOwnProperty("first"))
                    object.first = message.first;
                return object;
            };

            /**
             * Creates a plain object from this GetLoginByName message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetLoginByName.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this GetLoginByName to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            GetLoginByName.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GetLoginByName;
        })();

        messages.GetLoginByNameResponse = (function() {

            /**
             * Constructs a new GetLoginByNameResponse.
             * @exports norman.messages.GetLoginByNameResponse
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function GetLoginByNameResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetLoginByNameResponse userLogin.
             * @type {string|undefined}
             */
            GetLoginByNameResponse.prototype.userLogin = "";

            /**
             * GetLoginByNameResponse userEmail.
             * @type {string|undefined}
             */
            GetLoginByNameResponse.prototype.userEmail = "";

            /**
             * Creates a new GetLoginByNameResponse instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {norman.messages.GetLoginByNameResponse} GetLoginByNameResponse instance
             */
            GetLoginByNameResponse.create = function create(properties) {
                return new GetLoginByNameResponse(properties);
            };

            /**
             * Encodes the specified GetLoginByNameResponse message.
             * @param {norman.messages.GetLoginByNameResponse|Object} message GetLoginByNameResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLoginByNameResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userLogin !== undefined && message.hasOwnProperty("userLogin"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.userLogin);
                if (message.userEmail !== undefined && message.hasOwnProperty("userEmail"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userEmail);
                return writer;
            };

            /**
             * Encodes the specified GetLoginByNameResponse message, length delimited.
             * @param {norman.messages.GetLoginByNameResponse|Object} message GetLoginByNameResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLoginByNameResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetLoginByNameResponse message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {norman.messages.GetLoginByNameResponse} GetLoginByNameResponse
             */
            GetLoginByNameResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.norman.messages.GetLoginByNameResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.userLogin = reader.string();
                        break;
                    case 2:
                        message.userEmail = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetLoginByNameResponse message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {norman.messages.GetLoginByNameResponse} GetLoginByNameResponse
             */
            GetLoginByNameResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetLoginByNameResponse message.
             * @param {norman.messages.GetLoginByNameResponse|Object} message GetLoginByNameResponse message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            GetLoginByNameResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.userLogin !== undefined)
                    if (!$util.isString(message.userLogin))
                        return "userLogin: string expected";
                if (message.userEmail !== undefined)
                    if (!$util.isString(message.userEmail))
                        return "userEmail: string expected";
                return null;
            };

            /**
             * Creates a GetLoginByNameResponse message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {norman.messages.GetLoginByNameResponse} GetLoginByNameResponse
             */
            GetLoginByNameResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.norman.messages.GetLoginByNameResponse)
                    return object;
                var message = new $root.norman.messages.GetLoginByNameResponse();
                if (object.userLogin !== undefined && object.userLogin !== null)
                    message.userLogin = String(object.userLogin);
                if (object.userEmail !== undefined && object.userEmail !== null)
                    message.userEmail = String(object.userEmail);
                return message;
            };

            /**
             * Creates a GetLoginByNameResponse message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link norman.messages.GetLoginByNameResponse.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {norman.messages.GetLoginByNameResponse} GetLoginByNameResponse
             */
            GetLoginByNameResponse.from = GetLoginByNameResponse.fromObject;

            /**
             * Creates a plain object from a GetLoginByNameResponse message. Also converts values to other types if specified.
             * @param {norman.messages.GetLoginByNameResponse} message GetLoginByNameResponse
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetLoginByNameResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.userLogin = "";
                    object.userEmail = "";
                }
                if (message.userLogin !== undefined && message.userLogin !== null && message.hasOwnProperty("userLogin"))
                    object.userLogin = message.userLogin;
                if (message.userEmail !== undefined && message.userEmail !== null && message.hasOwnProperty("userEmail"))
                    object.userEmail = message.userEmail;
                return object;
            };

            /**
             * Creates a plain object from this GetLoginByNameResponse message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetLoginByNameResponse.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };

            /**
             * Converts this GetLoginByNameResponse to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            GetLoginByNameResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GetLoginByNameResponse;
        })();

        return messages;
    })();

    return norman;
})();

// Resolve lazy type references to actual types
$util.lazyResolve($root, $lazyTypes);