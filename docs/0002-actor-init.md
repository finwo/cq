Minimum actor init mutation:

Generate pubkey using username/password (pbkdf2 anyone?)

head:
{
  actor    : uuidv4(),
  actorKey : <generated pubkey>
  algorithm: "supercop" | "rsa-4096" | etc
}

body:
{
  iat    : <timestamp>
  parents: null,
  set    : [
    [<actorId>, <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>, "Actor"     ],
    [<actorId>, <credential>                                     , <pubkey>    ],
    [<pubkey> , <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>, "Credential"],
    [<pubkey> , "actor"                                          , <actorId>   ],
    [<pubkey> , "algorithm"                                      , "supercop"  ],
    [<pubkey> , "permission",                                    , "*"         ],
  ]
}
