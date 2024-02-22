export type Document<T> = {
  original: T;
  words: string[];
};

export type SearchResult<T> = {
  document: T;
  score: number;
};

export type CorpusOptions<T> = {
  processor?: (input: T) => string[];
  k1: number;
  b: number;
  gamma: number;
};

export default class Corpus<T> {
  private static readonly MIN_TERM_LENGTH = 3;

  private readonly defaultOptions: CorpusOptions<T> = {
    processor: (input: T) => (input as string)
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean)
      .filter(w => w.length >= Corpus.MIN_TERM_LENGTH),
    k1: 1.5,
    b: 0.75,
    gamma: 0,
  };

  public documents: Document<T>[];

  private options: CorpusOptions<T>;

  public constructor(
    documents: T[],
    options: Partial<CorpusOptions<T>> = {}
  ) {
    this.options = Object.assign({}, this.defaultOptions, options);
    this.documents = documents.map(document => this.processDocument(document));
  }

  public addDocument(document: T): void {
    this.documents.push(this.processDocument(document));
  }

  private processDocument(document: T): Document<T> {
    return {
      original: document,
      words: this.options.processor(document),
    };
  }

  public search(
    query: string,
    partial: boolean = false
  ): SearchResult<T>[] {
    const terms = query
      .split(/\W+/)
      .filter(Boolean)
      .filter(term => term.length >= Corpus.MIN_TERM_LENGTH);

    return this.documents
      .map(document => ({
        document,
        score: terms.reduce(
          (score, term) => score + this.bm25(term, document, partial),
          0
        ) / terms.length,
      }))
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => ({
        document: result.document.original,
        score: result.score,
      }));
  }

  private bm25(
    term: string,
    document: Document<T>,
    partial: boolean
  ): number {
    const tf = this.tf(term, document, partial);
    const idf = this.idf(term, partial);
    const averageDocumentLength = this.documents.reduce(
      (sum, d) => sum + d.words.length,
      0
    ) / this.documents.length;

    return idf * (
      (tf * (this.options.k1 + 1)) /
      (tf + this.options.k1 * (
        1 - this.options.b +
        this.options.b * document.words.length / averageDocumentLength
      )) + this.options.gamma
    );
  }

  private tf(
    term: string,
    document: Document<T>,
    partial: boolean
  ): number {
    term = term.toLowerCase();
    return document.words.filter(
      w => this.match(w, term, partial)
    ).length;
  }

  private idf(term: string, partial: boolean): number {
    term = term.toLowerCase();
    const n = this.documents.filter(
      document => document.words.some(w => this.match(w, term, partial))
    ).length;

    return Math.log(
      (this.documents.length - n + 0.5) / (n + 0.5) + 1
    );
  }

  private match(a: string, b: string, partial: boolean): boolean {
    return partial ? a.includes(b) : a === b;
  }
}
