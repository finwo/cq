Very rough idea again, trying to simplify, json-ld context is optional, but
recommended

Note that the certificates in this document are NOT x509 certificates, but for
brevity we'll call them certificates in the rest of this document.

While example data here is formatted as json-like, the actual serialization
format not been decided on yet.

  - identity/&lt;hash-algorithm&gt;:&lt;chain-root-sub-hash&gt;

    Represents a person, organization, etc

    ```
    {
      "@context": {
        "name": "http://xmlns.com/foaf/0.1/name",
        "version": "#sparkly:version",
        "device": "#sparkly:device",
        ...
      },
      "version": <number>,
      "name": "finwo",
      ...
    }
    ```

    The "id" of the identity is the hash of the "iat" and "sub" fields of it's
    certificate chain root. This should prevent hijacking a pre-existing
    identity by generating a new root certificate for it.

    TODO: message receiving pubkey

  - identity/&lt;chain-root-sub-hash&gt;/chain

    Represents the key-chain for the identity. Every node has a responsibility
    to keep the full chain of the identity they're hosting.

    Please note that by default, issuers are allowed to issue new certificates
    with an expiry beyond their own expiry. This allows creating a continuous
    chain by the entity managing the chain without having to rely on a trusted
    3rd-party.

    The first entry in a chain MUST be a self-signed certificate, any following
    entry MUST NOT be a self-signed certificate and MUST be signed by a
    certificate valid during being issued.

    Example "certificate":
    ```
    {
      "iss": "<issuer-algorithm>:<issuer-pubkey>",
      "sub": "<subject-algorithm>:<subject-pubkey>",
      "iat": <issued-at-timestamp-in-seconds>,
      "exp": <optional-expiry-timestamp-in-seconds>,
    }
    "." <signature-by-issuer>
    ```

    You can also revoke keys by re-issuing the key with an expiry if omitted or
    too generous in the previous "certificate". Keep note that the any entities
    signed with the subject after the new expiry will be invalidated.

    There "is" a risk of the last valid certificate in the chain expiring or
    being revoked, this mechanism is used to permanently "deactivate" an
    identity. It's the user's responsibility to keep an active key for as long
    as there's intent to keep the identity active.

    TODO: different certificate purposes. So, like "devices" which are allowed
    to post and update the identity, and like "messaging" purposes for handling
    incoming messages shared between multiple devices, etc.
