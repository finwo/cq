While gimmicks like a virtual graph database like in earlier sound fun, the
intent is to keep the data structure and protocols as simple as possible.

With that in mind, this draft suggests a new structure.

This new version of the protocol draft is very loosely based on
[nostr](https://nostr.com/) but focusses on other aspects like methods for
revoking a device's write access on an actor and not having to re-encode a
message for the purpose of validating a signature.

jsonld @context markers are allowed and encouraged, as they clarify how fields
should be interpreted and used.

<!--
## Entity types

### Keypair

Tangle: N

Essentially a credential. Could be viewed as a username/password combination,
unique device registration and/or a user session.

### Actor

Tangle: N

### Post

### Channel

Channels, somewhat like actors, are non-tangled entities. They do have a
virtual path containing posts made to them.

Channels using a uuid structure as identifier MUST be part of a channelgroup or
community. Any channel that has an identifier structured differently than a uuid
is by definition public, has no configuration, and anyone can post.

Non-public channels inherit permissions from their assigned channelgroup, but
can have more permissions granted to specific actors.

### ChannelGroup

IDs are uuidv4-structured. Inherit permission config from their assigned
community, but can have more permissions granted to specific actors.

### Community

IDs are uuidv4-structured. During creation of a community, the creator MUST
grant '*' permissions on the community to their own actor, but these may be
changed later should the creator assign a new actor with the '*' permission
and wants to leave.
-->

## Generic message sharing

### Initializing a actor

Messages, closely related to JWT, must always contain a head, body, and
signature section. During transfer these must be base64url-encoded joined by
period characters, but how the specific client, relay or server chooses to store
these internally is up to that specific implementation.

For example, should you want to initialize a new actor, you would inject 2
messages into the network (local, relay, server), as base64url-encoded messages
off course:

- Declare actor
  - Head:
    ```json
    {
      "alg": "<keypair's algorithm name>",
      "typ": "actor",
      "iat": <timestamp in milliseconds>
    }
    ```
  - Body:
    ```json
    {
      "id"     : "<uuidv4>",
      "parent" : null,
      "name"   : "Alice",
      "rootkey": "<hex-encoded pubkey>"
    }
    ```
  - Signature:
    base64url_encode(sign(head + '.' + body, rootkey))

- Declare root key
  - Head:
    ```json
    {
      "alg": "<rootkey's algorithm name>",
      "typ": "pubkey",
      "iat": <timestamp in milliseconds>
    }
    ```
  - Body:
    ```json
    {
      "parent"   : null,
      "algorithm": "<rootkey's algorithm name>",
      "root"     : null,
      "actor"    : "<actor-id>",
      "data"     : "<hex-encoded rootkey public data>"
    }
    ```
  - Signature: self-signed
    base64url_encode(sign(head + '.' + body, rootkey))

The "id" of a actor is simply a randomly-generated uuidv4. A relay or server
must reject a new actor declaration using an already-known id.

When fetching a actor by "id", only the N most recent versions of the actor
should be returned by the relay/server. Older versions of the actor may be
fetched by their non-mutable hash (using the parent field) or by asking the
relay/server to output the whole history for that actor id by adding something
like ?limit=0 on the request. In this case, `N` is decided by the relay/server
administrator.

Fetching "currently active" keys for a actor should be done through a query
somewhat resembling `GET /pubkey?actor=<uuid>`. This path is not final and will
most likely be extended or more clearly defined later in this draft or in a
future draft.

Human-readable aliases of the actor are NOT implemented in this part of the
spec. They may be added in the future, but for now alias registration is the
renderer's job, possibly in combination with some (distributed) registrar.

### Adding a leaf key

After the initialization, leaf keys (a.k.a. non-root keys) can be registered by
declaring a new key with a root key reference, and signing them with the
referenced root key. Leaf keys must have their permissions declared.

- Declare leaf key
  - Head:
    ```json
    {
      "alg": "<rootkey's algorithm name>",
      "typ": "pubkey",
      "iat": <timestamp in milliseconds>
    }
    ```
  - Body:
    ```json
    {
      "parent"     : null,
      "algorithm"  : "<leafkey's algorithm name>",
      "root"       : "<rootkey's pubkey data>",
      "actor"      : "<actor-id>",
      "data"       : "<hex-encoded leafkey public data>",
      "permissions": [
        {
          "action"  : "actor:update",
          "resource": "/actor/<actor-id>"
        },
        {
          "action"  : "actor:post",
          "resource": "/actor/<actor-id>"
        }
      ],
    }
    ```
  - Signature:
    base64url_encode(sign(head + '.' + body, rootkey))

### Declaring a post

Now that you have an actor and a leaf key that can post, it's time to make
create a "hello world" post on the actor.

- Declare post
  - Head:
    ```json
    {
      "alg": "<leafkey's algorithm name>",
      "typ": "post",
      "key": "<leafkey public data>"
      "iat": <timestamp in milliseconds>
    }
    ```
  - Body:
    ```json
    {
      "actor"  : "<actor-id>",
      "mime"   : "text/plain",
      "content": "Hello World"
    }
    ```
  - Signature:
    base64url_encode(sign(head + '.' + body, leafkey))

The post identifier is deterministic, based on the hash of the whole post
contents, so something like sha256(message). Posts are therefor non-mutable.

### Adding a post to a tag or your own profile

Before you can add the post to a tag or profile, you need to fetch at least 2
previous posts for that tag or profile with a query somewhat resembling this:
`GET /actor/<uuid>/posts?limit=2` or `GET /tag/<tagtext>?limit=2`. The
server/relay should return the most recent entries it knows and has verified by
default, not the oldest entries.

Assuming you've received 0..2 post references from the server/relay, you need to
add the hashes of these references to the `parent` field of the reference you'll
be submitting to the server/relay, making your own reference entry look
something like this:

- Head:
  ```json
  {
    "alg": "<leafkey's algorithm name>",
    "typ": "postref",
    "key": "<leafkey public data>",
    "iat": <timestamp in milliseconds>
  }
  ```
- Body:
  ```json
  {
    "parent": [
      ...content-hashes-of-parents
    ],
    "post": "<content-hash-of-post>"
  }
  ```
- Signature:
  base64url_encode(sign(head + '.' + body, leafkey))

When submitting the postref to the server/relay, the server/relay must reject
the reference if the "iat" field is in the future, or if it is lower than the
parents' references registered in the reference.

This behavior will make it beneficial for the client to have an up-to-date local
clock, as this will increase the chance of a different postref using our own
postref as parent, essentially "committing" the postref to the tangle.

A "commit" by a following postref using our own as it's parent is not required
for postrefs made on a profile. Here just the signature by a permitted key
suffices.

For postrefs on a profile, only a pubkey permitted for that profile that is
allowed to post is allowed to submit a postref there. servers/relays must reject
postrefs made by any other keys.
