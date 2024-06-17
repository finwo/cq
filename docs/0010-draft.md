Very rough idea again, trying to simplify, json-ld context is optional, but
recommended

Note that the certificates in this document are NOT x509 certificates, but for
brevity we'll call them certificates in the rest of this document.

While example data here is formatted as json-like, the actual serialization
format not been decided on yet.

  - identity/&lt;hash-algorithm&gt;:&lt;chain-root-iat-sub-hash&gt;

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

    TODO: decide if this is a good idea, or just to use `@` like people are used
    to: The node may recognize aliases for specific identities, starting with an
    `~` character, but these are NOT propagated across the network. The relay or
    node decides how these are assigned to identities.

    For example, on a mobile phone you might assign aliases to make tagging
    friends in posts easier, on a self-hosted relay you may choose to assign
    easily-memorable aliases to your friends so they can easily be found in your
    environment, on a commercial relay the operator may allow users to claim
    aliases for a fee. It's truly up to the node operator how to assign the
    aliases.

  - identity/&lt;hash-algorithm&gt;:&lt;chain-root-iat-sub-hash&gt;/chain

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
      "usg": "<optional-usage-key>|<optional-usage-key>"
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

    TODO: define identifiers for usages, like "post|profile|messaging|issue" or
    something

  - identity/&lt;hash-algorithm&gt;:&lt;chain-root-iat-sub-hash&gt;/outbox

    Note: may be renamed to "messages" instead of "outbox"

    Private messages to other identifies. Other identities are responsible for
    fetching private messages from identities they follow in order to prevent
    being sent spam by unknown identities.

    Example private message:

    ```
    {
      "iat": <issued-at-timestamp-in-seconds>,
      "src": "<source-algorithm>:<source-pubkey>",
      "dst": "<destination-algorithm>:<destination-pubkey>",
      "kex": "<optional key-exchange parameter>",
      "dat": "<encrypted message data, including headers>",
    }
    "." <signature-by-src>
    ```

    It is still to be determined if the destination key should be disclosed, as
    decoding a message and checking if it's formatted correctly isn't too much
    effort on the receiver side, akin to how bitmessage attempts to decode all
    known messages and keeps the one intended for it's own identities.

    Removing the dst would prevent anyone from detecting who you're
    communicating with, but would increase bandwidth usage drastically for
    private messaging.

    If the "dst" field is indeed removed, the "src" field should be renamed to
    "iss" to indicate it's the issuer of the private message.

    Nodes may decide for themselves how much history is to be retained

  - identity/&lt;hash-algorithm&gt;:&lt;chain-root-iat-sub-hash&gt;/inbox

    **NOT** shared over the network (maybe only to other devices signed in to
    the same identity, but that is not part of this draft), only a suggested
    internal structure to the node for keeping a copy of messages sent to it.

  - identity/&lt;hash-algorithm&gt;:&lt;chain-root-iat-sub-hash&gt;/posts

    Publically-readable posts

    ```
    {
      "iat": <issued-at-timestamp-in-seconds>,
      "sub": "<hash-algorithm>:<chain-root-iat-sub-hash>",
      "iss": "<issuer-algorithm>:<issuer-pubkey>",
      "dat": "<plaintext post data, including headers>",
    }
    "." <signature-by-src>
    ```
