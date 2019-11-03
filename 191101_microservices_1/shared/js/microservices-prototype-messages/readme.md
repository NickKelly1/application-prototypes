# Microservices Prototype Messages

Package to be shared across microservices

```ts
// Anatomy of an event
type Event = {
  type: 'butotnCreated',
  streamId: 'fnjrekfndskn',
  streamType: 'button',
  streamVersion: 1,
  userId: 'ahduijenfjewkfn',
  correlationId: 'dnjskfngsdkjf',
  payload: { 'arbitrary': 'things' },
  createdAt: 14952495425,
}
```

## Publishing

```bash
yarn publish
```
