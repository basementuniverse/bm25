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
};
export default class Corpus<T> {
    private static readonly MIN_TERM_LENGTH;
    private readonly defaultOptions;
    documents: Document<T>[];
    private options;
    constructor(documents: T[], options?: Partial<CorpusOptions<T>>);
    addDocument(document: T): void;
    private processDocument;
    search(query: string, partial?: boolean): SearchResult<T>[];
    private bm25;
    private tf;
    private idf;
    private match;
}
