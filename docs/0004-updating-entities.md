
### Declaring a new actor version

Building on the actor declaration done in draft 0003, we can simply declare a
new actor version but with a parent reference to link history.

A server/relay must reject a new actor version if it re-uses a known actor id
without a parent reference and without the proper signature.

The new actor version MUST be signed either by the old root key for that actor,
or by a leaf key that has the `actor:update` permission on the actor that is
being updated.

If the root key is changing, the actor update MUST be signed by the old root
key, that is not permitted to be done by any leaf key. Servers/relays must
reject the new declaration accordingly.

- Head:
  ```json
  {
    "alg": "<signing key's algorithm name>",
    "typ": "actor",
    "key": "<signing key public data>",
    "iat": <timestamp in milliseconds>
  }
  ```
- Body:
  ```json
  {
    "id"     : "<uuidv4>",
    "parent" : "<content-hash of old version>",
    "name"   : "Alice",
    "rootkey": "<hex-encoded pubkey>"
  }
  ```
- Signature:
  base64url_encode(sign(head + '.' + body, signingkey))

### Updating a key

Keys may be updated by either their associated root key or by themselves. Please
note that new permissions may only be added if the message is signed by the
associated root key. A self-update may only contain the same or less
permissions, essentially having a key drop permissions it doesn't want or need.

Updating a key can simply be done by submitting another 'pubkey' typ message as
follows:

- Head
  ```json
  {
    "alg": "<signing key's algorithm name>",
    "typ": "pubkey",
    "key": "<signing key's public data>",
    "iat": <timestamp in milliseconds>
  }
  ```
- Body
  ```json
  {
    "parent"     : "<content hash of previous version>",
    "algorithm"  : "<this key's algorithm name>"
    "root"       : "<rootkey's pubkey data>"
    "actor"      : "<actor-id>",
    "data"       : "<hex-encoded pubkey data>",
    "permissions": [
      ...
    ]
  }
  ```
- Signature:
  base64url_encode(sign(head + '.' + body, signingkey))

### Updating a root key

To update a root key, you must submit an actor update with the new rootkey
reference, signed by the old root key. After this, you must declare the new
rootkey, and update all leaf keys you want to keep active using the new root
key.

### Revoking a key

Note: a root key can not be revoked until the profile it belongs to has adopted
a new root key

Note: A leaf key should be rejected for signing if it's associated root key has
been revoked.

To revoke a key, simply generate an update on the key, with a "revoked:true"
field on it. Combined with the "iat" in the header, this will provide a clear
point in time from when the key should be rejected for new messages.

A key can be revoked either by itself or it's associated root key. In the revoke
message, all permissions should be dropped to compress the message somewhat and
to safeguard against invalid permission checking implementations.

- Head:
  ```json
  {
    "alg": "<key's algorithm name>",
    "typ": "pubkey",
    "key": "<signing key's public data>",
    "iat": <timestamp in milliseconds>
  }
  ```
- Body:
  ```json
  {
    "parent"     : "<content-hash of old version>",
    "algorithm"  : "<key's algorithm name>",
    "root"       : "<rootkey's pubkey data>",
    "actor"      : "<actor-id>",
    "data"       : "<hex-encoded leafkey public data>",
    "revoked"    : true
  }
  ```
- Signature:
  base64url_encode(sign(head + '.' + body, signingkey))
