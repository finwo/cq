Append-only mutations
Aliases for entity chains, to fetch cached version from trusted store

Main entity types:
  - actor
    - has list of grants and revokes + profile info
    - posts = reference to another mutation chain
  - credential (username/password, device, etc)
    - each credential has permissions granted, enforced by relays

Extended entity types:
  - channel
    - includes optional list of participants -> covers private chats
    - optionally part of channelGroup
    - optionally part of community (directly, without channelgroup)
    - optionally inherits participants from channelGroup
    - channelPosts = reference to another mutation chain
  - channelGroup
    - optionally inherits participants from community
  - community
    - creator = admin at start

Mutation structure, JWT-like:
  'root' subject = '@'
  head: b64url.encode({
          actor    : profileId
          actorKey : credential's pubkey contained in profile
          algorithm: "supercop" | "rsa-4096" | etc
        })
  body: b64url.encode({
          iat    : timestamp of mutation in milliseconds
          parents: [
            hash(parentMutation),
            ...
          ],
          set: [
            [subject, predicate, object],
          ]
          del: [
            [subject, predicate, object],
          ]
        })
  sign: b64url.encode(algorithm.sign(head + '.' + 'body'))
