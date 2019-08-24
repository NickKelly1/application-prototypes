# Based on Ben Awad video series:
https://www.youtube.com/playlist?list=PLN3n1USn4xlltIGRInnlHtsOdvHIUQFHL


## Docker

Note: In development on Windows with Docker, fs-events are not passed through hypervisor, meaning the auto-server-restarting tool (be it nodemon or ts-node-dev) needs to run in a polling (/legacy) mode
nodemon: https://github.com/remy/nodemon/issues/1447
ts-node-dev: https://github.com/whitecolor/ts-node-dev/issues/55


## Graphql Code Generator

https://medium.com/open-graphql/type-safe-graphql-servers-3922b8a70e52

yarn add -D graphql-code-generator
yarn add -D graphql-codegen-typescript-common graphql-codegen-typescript-server graphql-codegen-typescript-resolvers

## Apollo codegen

[Apollo Codegen GitHub](https://www.youtube.com/watch?v=sGuiC4N76Jw&list=PLN3n1USn4xlltIGRInnlHtsOdvHIUQFHL&index=2)
[Example video](https://www.youtube.com/watch?v=1PVrZNi3sb8)
[Example video's corresponding article](https://www.leighhalliday.com/generating-types-apollo)

Apollo Codegen can auto-generate TypeScript Types for your GraphQL Schemas

With npm `npm i -g apollo`
With yarn `yarn global add apollo`

```
--excludes=node_modules/*
--includes=**/*.tsx
--endpoint <graphql server endpoint>
--header \"<headers required to query server>\"
--target typescript
--tagName=gql
--outputFlat src/generated
--passThroughCustomScalars (optional)
--customScalarPrefix <prefix name> (optional)
```

  - passThroughCustomScalars will alow custom types that are not properly understood by the generator to pass through. If not provided, will default such types to `any`
  - customScalarsPrefix will prefix custom scalars so they don't conflict with existing types (such as from node)
  - To define types for these customScalars, put global.d.ts (in src?) and define the types so they're ambiently available in the generated type files


In package.json define a script:
`"apollo:generate":  "apollo code:generate --target typescript --excludes=node_modules/* --includes=**/*.tsx --" --endpoint= <graphql server endpoint>" --header=\"<headers required to query server>\" --tagName=gql --outputFlat src/generated"`

