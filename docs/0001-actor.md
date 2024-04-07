Merged mutation representation

json-ld-ish:

<actor>: {
  "@context": {
    "name"      : "http://xmlns.com/foaf/0.1/name",
    "credential": "some-other-rdf-field-spec",
  },
  "@type": "Actor"
  "@id"  : "some-long-hash"
  "name" : "R2D2",
  <credential>: [
    <pubkey-a>,
    <pubkey-b>
  ],
  <pubkey-a>: {
    "@type"      : "Credential",
    "actor"      : <actor>,
    "algorithm"  : "supercop",
    "description": "foobar",
    <permissions>: [
      "*",
    ]
  },
  <pubkey-b>: {
    "@type"      : "Credential",
    "actor"      : <actor>,
    "algorithm"  : "supercop",
    <permissions>: [
      "add-post",
    ]
  },
}

n-triples:
<actor>     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> "Actor"          .
<actor>     <http://xmlns.com/foaf/0.1/name>                  "string"         .
<actor>     <credential>                                      <pubkey-a>       .
<actor>     <credential>                                      <pubkey-b>       .
<pubkey-a>  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> "Credential"     .
<pubkey-a>  actor                                             <actor>          .
<pubkey-a>  "algorithm"                                       "supercop"       .
<pubkey-a>  <permissions>                                     "*"              .
<pubkey-a>  "description"                                     "foobar"         .
<pubkey-b>  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> "Credential"     .
<pubkey-b>  actor                                             <actor>          .
<pubkey-b>  "algorithm"                                       "supercop"       .
<pubkey-b>  <permissions>                                     "add-post"       .
