import { FromSchema } from "json-schema-to-ts";

export const sessionSchema = {
  type: 'object',
  properties: {
    name      : { type: 'string' }, // Identity's profile name, for human to select which session to use
    identity  : { type: 'string' }, // Reference to the root alg:pub
    algorithm : { type: 'string' }, // Algorithm of the keypair
    public_key: { type: 'string' },
    secret_key: { type: 'string' },
  },
  required: [
    'identity',
    'algorithm',
    'public_key',
    'secret_key',
  ],
};

export type Session = FromSchema<typeof sessionSchema>;
