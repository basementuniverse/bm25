# Okapi BM25

Search for terms in an array of documents using [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25).

## Installation

```
npm install -g @basementuniverse/bm25
```

## Usage

```typescript
import { Corpus } from '@basementuniverse/bm25';

const corpus = new Corpus([
  'This is a document',
  'Here is another document',
]);

const results = corpus.search('document');
```

`results` will look something like:

```json
[
  {
    "document": "This is a document",
    "score": 0.5
  },
  {
    "document": "Here is another document",
    "score": 0.5
  }
]
```

The documents passed into the `Corpus` constructor will be treated as strings by default, and will be converted to lowercase and split by non-word characters.

However, it is possible to pass in values of any type here, as long as you provide a function to convert each value to an array of strings. For example:

```typescript
const corpus = new Corpus(
  [
    {
      id: '1234',
      name: 'John Doe',
    },
    {
      id: '2345',
      name: 'Jane Doe',
    },
  ],
  {
    processor: document => [document.id, ...document.name.toLowerCase().split(' ')],
  },
);
```

Partial term matching can be enabled by passing `true` as the second argument to `search()`:

```typescript
const results = corpus.search('doe', true);
```

## Options

The 2nd argument to the `Corpus` constructor is an options object, which can contain the following properties:

- `processor` (function) - A function to convert each document to an array of strings.
- `k1` (number between 1.2 and 2, default: 1.5) - Controls the impact of term frequency saturation.
- `b` (number between 0 and 1, default: 0.75) - Controls how much the document length affects the term frequency score.
- `gamma` (number, default: 1) - Addresses a deficiency of BM25 in which term frequency normalization by document length is not properly lower-bounded.
