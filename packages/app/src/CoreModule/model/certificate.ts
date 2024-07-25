import { FromSchema } from "json-schema-to-ts";

export const certificateSchema = {
  type: 'object',
  properties: {
    // As-stored
    raw      : { type: 'string' }, // Raw body data, as stored on disk
    signature: { type: 'string' }, // ?encoded? signature data

    // Decoded
    issuer    : { type: 'string'  }, // iss, Which alg:pub issued this certificate
    subject   : { type: 'string'  }, // sub, This certificate's alg:pub
    root      : { type: 'string'  }, // xcr, Root certificate reference alg:pub
    issued_at : { type: 'integer' }, // iat, When this certificate was issued
    expires_at: { type: 'integer' }, // exp, When this certificate expires
    usage     : { type: 'array', items: { type: 'string' } }, // usg, How this key is allowed to be used
  },
  required: [
    // TODO
    // 'identity',
    // 'algorithm',
    // 'public_key',
    // 'secret_key',
  ],
};

export type Certificate = FromSchema<typeof certificateSchema>;
