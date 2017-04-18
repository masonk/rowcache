import * as $protobuf from "protobufjs";

/**
 * ManifestType enum.
 * @exports ManifestType
 * @enum {number}
 * @property {number} Unknown=0 Unknown value
 * @property {number} GetUserByLoginT=1 GetUserByLoginT value
 * @property {number} GetUserByLoginResponseT=2 GetUserByLoginResponseT value
 * @property {number} GetLoginByNameT=3 GetLoginByNameT value
 * @property {number} GetLoginByNameResponseT=4 GetLoginByNameResponseT value
 */
export enum ManifestType {
    Unknown = 0,
    GetUserByLoginT = 1,
    GetUserByLoginResponseT = 2,
    GetLoginByNameT = 3,
    GetLoginByNameResponseT = 4
}

/**
 * Properties of an Envelope.
 * @typedef Envelope$Properties
 * @type {Object}
 * @property {ManifestType} [type] Envelope type.
 * @property {string} [version] Envelope version.
 * @property {Uint8Array} [message] Envelope message.
 */
type Envelope$Properties = {
    type?: ManifestType;
    version?: string;
    message?: Uint8Array;
};

/**
 * Constructs a new Envelope.
 * @exports Envelope
 * @constructor
 * @param {Envelope$Properties=} [properties] Properties to set
 */
export class Envelope {

    /**
     * Constructs a new Envelope.
     * @exports Envelope
     * @constructor
     * @param {Envelope$Properties=} [properties] Properties to set
     */
    constructor(properties?: Envelope$Properties);

    /**
     * Envelope type.
     * @type {ManifestType|undefined}
     */
    public type?: ManifestType;

    /**
     * Envelope version.
     * @type {string|undefined}
     */
    public version?: string;

    /**
     * Envelope message.
     * @type {Uint8Array|undefined}
     */
    public message?: Uint8Array;

    /**
     * Creates a new Envelope instance using the specified properties.
     * @param {Envelope$Properties=} [properties] Properties to set
     * @returns {Envelope} Envelope instance
     */
    public static create(properties?: Envelope$Properties): Envelope;

    /**
     * Encodes the specified Envelope message. Does not implicitly {@link Envelope.verify|verify} messages.
     * @param {Envelope$Properties} message Envelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encode(message: Envelope$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Envelope message, length delimited. Does not implicitly {@link Envelope.verify|verify} messages.
     * @param {Envelope$Properties} message Envelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encodeDelimited(message: Envelope$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Envelope message from the specified reader or buffer.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Envelope} Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Envelope;

    /**
     * Decodes an Envelope message from the specified reader or buffer, length delimited.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Envelope} Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Envelope;

    /**
     * Verifies an Envelope message.
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {?string} `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string;

    /**
     * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
     * @param {Object.<string,*>} object Plain object
     * @returns {Envelope} Envelope
     */
    public static fromObject(object: { [k: string]: any }): Envelope;

    /**
     * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
     * This is an alias of {@link Envelope.fromObject}.
     * @function
     * @param {Object.<string,*>} object Plain object
     * @returns {Envelope} Envelope
     */
    public static from(object: { [k: string]: any }): Envelope;

    /**
     * Creates a plain object from an Envelope message. Also converts values to other types if specified.
     * @param {Envelope} message Envelope
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public static toObject(message: Envelope, options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Creates a plain object from this Envelope message. Also converts values to other types if specified.
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Converts this Envelope to JSON.
     * @returns {Object.<string,*>} JSON object
     */
    public toJSON(): { [k: string]: any };
}

/**
 * Properties of a WebsocketEnvelope.
 * @typedef WebsocketEnvelope$Properties
 * @type {Object}
 * @property {number} [streamid] WebsocketEnvelope streamid.
 * @property {Envelope$Properties} [envelope] WebsocketEnvelope envelope.
 */
type WebsocketEnvelope$Properties = {
    streamid?: number;
    envelope?: Envelope$Properties;
};

/**
 * Constructs a new WebsocketEnvelope.
 * @exports WebsocketEnvelope
 * @constructor
 * @param {WebsocketEnvelope$Properties=} [properties] Properties to set
 */
export class WebsocketEnvelope {

    /**
     * Constructs a new WebsocketEnvelope.
     * @exports WebsocketEnvelope
     * @constructor
     * @param {WebsocketEnvelope$Properties=} [properties] Properties to set
     */
    constructor(properties?: WebsocketEnvelope$Properties);

    /**
     * WebsocketEnvelope streamid.
     * @type {number|undefined}
     */
    public streamid?: number;

    /**
     * WebsocketEnvelope envelope.
     * @type {Envelope$Properties|undefined}
     */
    public envelope?: Envelope$Properties;

    /**
     * Creates a new WebsocketEnvelope instance using the specified properties.
     * @param {WebsocketEnvelope$Properties=} [properties] Properties to set
     * @returns {WebsocketEnvelope} WebsocketEnvelope instance
     */
    public static create(properties?: WebsocketEnvelope$Properties): WebsocketEnvelope;

    /**
     * Encodes the specified WebsocketEnvelope message. Does not implicitly {@link WebsocketEnvelope.verify|verify} messages.
     * @param {WebsocketEnvelope$Properties} message WebsocketEnvelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encode(message: WebsocketEnvelope$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified WebsocketEnvelope message, length delimited. Does not implicitly {@link WebsocketEnvelope.verify|verify} messages.
     * @param {WebsocketEnvelope$Properties} message WebsocketEnvelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encodeDelimited(message: WebsocketEnvelope$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a WebsocketEnvelope message from the specified reader or buffer.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WebsocketEnvelope} WebsocketEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WebsocketEnvelope;

    /**
     * Decodes a WebsocketEnvelope message from the specified reader or buffer, length delimited.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WebsocketEnvelope} WebsocketEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WebsocketEnvelope;

    /**
     * Verifies a WebsocketEnvelope message.
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {?string} `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string;

    /**
     * Creates a WebsocketEnvelope message from a plain object. Also converts values to their respective internal types.
     * @param {Object.<string,*>} object Plain object
     * @returns {WebsocketEnvelope} WebsocketEnvelope
     */
    public static fromObject(object: { [k: string]: any }): WebsocketEnvelope;

    /**
     * Creates a WebsocketEnvelope message from a plain object. Also converts values to their respective internal types.
     * This is an alias of {@link WebsocketEnvelope.fromObject}.
     * @function
     * @param {Object.<string,*>} object Plain object
     * @returns {WebsocketEnvelope} WebsocketEnvelope
     */
    public static from(object: { [k: string]: any }): WebsocketEnvelope;

    /**
     * Creates a plain object from a WebsocketEnvelope message. Also converts values to other types if specified.
     * @param {WebsocketEnvelope} message WebsocketEnvelope
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public static toObject(message: WebsocketEnvelope, options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Creates a plain object from this WebsocketEnvelope message. Also converts values to other types if specified.
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Converts this WebsocketEnvelope to JSON.
     * @returns {Object.<string,*>} JSON object
     */
    public toJSON(): { [k: string]: any };
}

/**
 * Properties of a GetUserByLogin.
 * @typedef GetUserByLogin$Properties
 * @type {Object}
 * @property {string} [login] GetUserByLogin login.
 */
type GetUserByLogin$Properties = {
    login?: string;
};

/**
 * Constructs a new GetUserByLogin.
 * @exports GetUserByLogin
 * @constructor
 * @param {GetUserByLogin$Properties=} [properties] Properties to set
 */
export class GetUserByLogin {

    /**
     * Constructs a new GetUserByLogin.
     * @exports GetUserByLogin
     * @constructor
     * @param {GetUserByLogin$Properties=} [properties] Properties to set
     */
    constructor(properties?: GetUserByLogin$Properties);

    /**
     * GetUserByLogin login.
     * @type {string|undefined}
     */
    public login?: string;

    /**
     * Creates a new GetUserByLogin instance using the specified properties.
     * @param {GetUserByLogin$Properties=} [properties] Properties to set
     * @returns {GetUserByLogin} GetUserByLogin instance
     */
    public static create(properties?: GetUserByLogin$Properties): GetUserByLogin;

    /**
     * Encodes the specified GetUserByLogin message. Does not implicitly {@link GetUserByLogin.verify|verify} messages.
     * @param {GetUserByLogin$Properties} message GetUserByLogin message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encode(message: GetUserByLogin$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetUserByLogin message, length delimited. Does not implicitly {@link GetUserByLogin.verify|verify} messages.
     * @param {GetUserByLogin$Properties} message GetUserByLogin message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encodeDelimited(message: GetUserByLogin$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetUserByLogin message from the specified reader or buffer.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetUserByLogin} GetUserByLogin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetUserByLogin;

    /**
     * Decodes a GetUserByLogin message from the specified reader or buffer, length delimited.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetUserByLogin} GetUserByLogin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetUserByLogin;

    /**
     * Verifies a GetUserByLogin message.
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {?string} `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string;

    /**
     * Creates a GetUserByLogin message from a plain object. Also converts values to their respective internal types.
     * @param {Object.<string,*>} object Plain object
     * @returns {GetUserByLogin} GetUserByLogin
     */
    public static fromObject(object: { [k: string]: any }): GetUserByLogin;

    /**
     * Creates a GetUserByLogin message from a plain object. Also converts values to their respective internal types.
     * This is an alias of {@link GetUserByLogin.fromObject}.
     * @function
     * @param {Object.<string,*>} object Plain object
     * @returns {GetUserByLogin} GetUserByLogin
     */
    public static from(object: { [k: string]: any }): GetUserByLogin;

    /**
     * Creates a plain object from a GetUserByLogin message. Also converts values to other types if specified.
     * @param {GetUserByLogin} message GetUserByLogin
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public static toObject(message: GetUserByLogin, options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Creates a plain object from this GetUserByLogin message. Also converts values to other types if specified.
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Converts this GetUserByLogin to JSON.
     * @returns {Object.<string,*>} JSON object
     */
    public toJSON(): { [k: string]: any };
}

/**
 * Properties of a GetUserByLoginResponse.
 * @typedef GetUserByLoginResponse$Properties
 * @type {Object}
 * @property {string} [userLogin] GetUserByLoginResponse userLogin.
 * @property {string} [userEmail] GetUserByLoginResponse userEmail.
 */
type GetUserByLoginResponse$Properties = {
    userLogin?: string;
    userEmail?: string;
};

/**
 * Constructs a new GetUserByLoginResponse.
 * @exports GetUserByLoginResponse
 * @constructor
 * @param {GetUserByLoginResponse$Properties=} [properties] Properties to set
 */
export class GetUserByLoginResponse {

    /**
     * Constructs a new GetUserByLoginResponse.
     * @exports GetUserByLoginResponse
     * @constructor
     * @param {GetUserByLoginResponse$Properties=} [properties] Properties to set
     */
    constructor(properties?: GetUserByLoginResponse$Properties);

    /**
     * GetUserByLoginResponse userLogin.
     * @type {string|undefined}
     */
    public userLogin?: string;

    /**
     * GetUserByLoginResponse userEmail.
     * @type {string|undefined}
     */
    public userEmail?: string;

    /**
     * Creates a new GetUserByLoginResponse instance using the specified properties.
     * @param {GetUserByLoginResponse$Properties=} [properties] Properties to set
     * @returns {GetUserByLoginResponse} GetUserByLoginResponse instance
     */
    public static create(properties?: GetUserByLoginResponse$Properties): GetUserByLoginResponse;

    /**
     * Encodes the specified GetUserByLoginResponse message. Does not implicitly {@link GetUserByLoginResponse.verify|verify} messages.
     * @param {GetUserByLoginResponse$Properties} message GetUserByLoginResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encode(message: GetUserByLoginResponse$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetUserByLoginResponse message, length delimited. Does not implicitly {@link GetUserByLoginResponse.verify|verify} messages.
     * @param {GetUserByLoginResponse$Properties} message GetUserByLoginResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encodeDelimited(message: GetUserByLoginResponse$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetUserByLoginResponse message from the specified reader or buffer.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetUserByLoginResponse} GetUserByLoginResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetUserByLoginResponse;

    /**
     * Decodes a GetUserByLoginResponse message from the specified reader or buffer, length delimited.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetUserByLoginResponse} GetUserByLoginResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetUserByLoginResponse;

    /**
     * Verifies a GetUserByLoginResponse message.
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {?string} `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string;

    /**
     * Creates a GetUserByLoginResponse message from a plain object. Also converts values to their respective internal types.
     * @param {Object.<string,*>} object Plain object
     * @returns {GetUserByLoginResponse} GetUserByLoginResponse
     */
    public static fromObject(object: { [k: string]: any }): GetUserByLoginResponse;

    /**
     * Creates a GetUserByLoginResponse message from a plain object. Also converts values to their respective internal types.
     * This is an alias of {@link GetUserByLoginResponse.fromObject}.
     * @function
     * @param {Object.<string,*>} object Plain object
     * @returns {GetUserByLoginResponse} GetUserByLoginResponse
     */
    public static from(object: { [k: string]: any }): GetUserByLoginResponse;

    /**
     * Creates a plain object from a GetUserByLoginResponse message. Also converts values to other types if specified.
     * @param {GetUserByLoginResponse} message GetUserByLoginResponse
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public static toObject(message: GetUserByLoginResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Creates a plain object from this GetUserByLoginResponse message. Also converts values to other types if specified.
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Converts this GetUserByLoginResponse to JSON.
     * @returns {Object.<string,*>} JSON object
     */
    public toJSON(): { [k: string]: any };
}

/**
 * Properties of a GetLoginByName.
 * @typedef GetLoginByName$Properties
 * @type {Object}
 * @property {string} [first] GetLoginByName first.
 */
type GetLoginByName$Properties = {
    first?: string;
};

/**
 * Constructs a new GetLoginByName.
 * @exports GetLoginByName
 * @constructor
 * @param {GetLoginByName$Properties=} [properties] Properties to set
 */
export class GetLoginByName {

    /**
     * Constructs a new GetLoginByName.
     * @exports GetLoginByName
     * @constructor
     * @param {GetLoginByName$Properties=} [properties] Properties to set
     */
    constructor(properties?: GetLoginByName$Properties);

    /**
     * GetLoginByName first.
     * @type {string|undefined}
     */
    public first?: string;

    /**
     * Creates a new GetLoginByName instance using the specified properties.
     * @param {GetLoginByName$Properties=} [properties] Properties to set
     * @returns {GetLoginByName} GetLoginByName instance
     */
    public static create(properties?: GetLoginByName$Properties): GetLoginByName;

    /**
     * Encodes the specified GetLoginByName message. Does not implicitly {@link GetLoginByName.verify|verify} messages.
     * @param {GetLoginByName$Properties} message GetLoginByName message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encode(message: GetLoginByName$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetLoginByName message, length delimited. Does not implicitly {@link GetLoginByName.verify|verify} messages.
     * @param {GetLoginByName$Properties} message GetLoginByName message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encodeDelimited(message: GetLoginByName$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetLoginByName message from the specified reader or buffer.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetLoginByName} GetLoginByName
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetLoginByName;

    /**
     * Decodes a GetLoginByName message from the specified reader or buffer, length delimited.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetLoginByName} GetLoginByName
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetLoginByName;

    /**
     * Verifies a GetLoginByName message.
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {?string} `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string;

    /**
     * Creates a GetLoginByName message from a plain object. Also converts values to their respective internal types.
     * @param {Object.<string,*>} object Plain object
     * @returns {GetLoginByName} GetLoginByName
     */
    public static fromObject(object: { [k: string]: any }): GetLoginByName;

    /**
     * Creates a GetLoginByName message from a plain object. Also converts values to their respective internal types.
     * This is an alias of {@link GetLoginByName.fromObject}.
     * @function
     * @param {Object.<string,*>} object Plain object
     * @returns {GetLoginByName} GetLoginByName
     */
    public static from(object: { [k: string]: any }): GetLoginByName;

    /**
     * Creates a plain object from a GetLoginByName message. Also converts values to other types if specified.
     * @param {GetLoginByName} message GetLoginByName
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public static toObject(message: GetLoginByName, options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Creates a plain object from this GetLoginByName message. Also converts values to other types if specified.
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Converts this GetLoginByName to JSON.
     * @returns {Object.<string,*>} JSON object
     */
    public toJSON(): { [k: string]: any };
}

/**
 * Properties of a GetLoginByNameResponse.
 * @typedef GetLoginByNameResponse$Properties
 * @type {Object}
 * @property {string} [contactFirst] GetLoginByNameResponse contactFirst.
 * @property {string} [userEmail] GetLoginByNameResponse userEmail.
 */
type GetLoginByNameResponse$Properties = {
    contactFirst?: string;
    userEmail?: string;
};

/**
 * Constructs a new GetLoginByNameResponse.
 * @exports GetLoginByNameResponse
 * @constructor
 * @param {GetLoginByNameResponse$Properties=} [properties] Properties to set
 */
export class GetLoginByNameResponse {

    /**
     * Constructs a new GetLoginByNameResponse.
     * @exports GetLoginByNameResponse
     * @constructor
     * @param {GetLoginByNameResponse$Properties=} [properties] Properties to set
     */
    constructor(properties?: GetLoginByNameResponse$Properties);

    /**
     * GetLoginByNameResponse contactFirst.
     * @type {string|undefined}
     */
    public contactFirst?: string;

    /**
     * GetLoginByNameResponse userEmail.
     * @type {string|undefined}
     */
    public userEmail?: string;

    /**
     * Creates a new GetLoginByNameResponse instance using the specified properties.
     * @param {GetLoginByNameResponse$Properties=} [properties] Properties to set
     * @returns {GetLoginByNameResponse} GetLoginByNameResponse instance
     */
    public static create(properties?: GetLoginByNameResponse$Properties): GetLoginByNameResponse;

    /**
     * Encodes the specified GetLoginByNameResponse message. Does not implicitly {@link GetLoginByNameResponse.verify|verify} messages.
     * @param {GetLoginByNameResponse$Properties} message GetLoginByNameResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encode(message: GetLoginByNameResponse$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GetLoginByNameResponse message, length delimited. Does not implicitly {@link GetLoginByNameResponse.verify|verify} messages.
     * @param {GetLoginByNameResponse$Properties} message GetLoginByNameResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    public static encodeDelimited(message: GetLoginByNameResponse$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GetLoginByNameResponse message from the specified reader or buffer.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GetLoginByNameResponse} GetLoginByNameResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GetLoginByNameResponse;

    /**
     * Decodes a GetLoginByNameResponse message from the specified reader or buffer, length delimited.
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GetLoginByNameResponse} GetLoginByNameResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GetLoginByNameResponse;

    /**
     * Verifies a GetLoginByNameResponse message.
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {?string} `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string;

    /**
     * Creates a GetLoginByNameResponse message from a plain object. Also converts values to their respective internal types.
     * @param {Object.<string,*>} object Plain object
     * @returns {GetLoginByNameResponse} GetLoginByNameResponse
     */
    public static fromObject(object: { [k: string]: any }): GetLoginByNameResponse;

    /**
     * Creates a GetLoginByNameResponse message from a plain object. Also converts values to their respective internal types.
     * This is an alias of {@link GetLoginByNameResponse.fromObject}.
     * @function
     * @param {Object.<string,*>} object Plain object
     * @returns {GetLoginByNameResponse} GetLoginByNameResponse
     */
    public static from(object: { [k: string]: any }): GetLoginByNameResponse;

    /**
     * Creates a plain object from a GetLoginByNameResponse message. Also converts values to other types if specified.
     * @param {GetLoginByNameResponse} message GetLoginByNameResponse
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public static toObject(message: GetLoginByNameResponse, options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Creates a plain object from this GetLoginByNameResponse message. Also converts values to other types if specified.
     * @param {$protobuf.ConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

    /**
     * Converts this GetLoginByNameResponse to JSON.
     * @returns {Object.<string,*>} JSON object
     */
    public toJSON(): { [k: string]: any };
}
