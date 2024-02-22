"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Corpus {
    constructor(documents, options = {}) {
        this.defaultOptions = {
            processor: (input) => input
                .toLowerCase()
                .split(/\W+/)
                .filter(Boolean)
                .filter(w => w.length >= Corpus.MIN_TERM_LENGTH),
            k1: 1.5,
            b: 0.75,
        };
        this.options = Object.assign({}, this.defaultOptions, options);
        this.documents = documents.map(document => this.processDocument(document));
    }
    addDocument(document) {
        this.documents.push(this.processDocument(document));
    }
    processDocument(document) {
        return {
            original: document,
            words: this.options.processor(document),
        };
    }
    search(query, partial = false) {
        const terms = query
            .split(/\W+/)
            .filter(Boolean)
            .filter(term => term.length >= Corpus.MIN_TERM_LENGTH);
        return this.documents
            .map(document => ({
            document,
            score: terms.reduce((score, term) => score + this.bm25(term, document, partial), 0) / terms.length,
        }))
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(result => ({
            document: result.document.original,
            score: result.score,
        }));
    }
    bm25(term, document, partial) {
        const tf = this.tf(term, document, partial);
        const idf = this.idf(term, partial);
        const averageDocumentLength = this.documents.reduce((sum, d) => sum + d.words.length, 0) / this.documents.length;
        return idf * ((tf * (this.options.k1 + 1)) /
            (tf + this.options.k1 * (1 - this.options.b +
                this.options.b * document.words.length / averageDocumentLength)));
    }
    tf(term, document, partial) {
        term = term.toLowerCase();
        return document.words.filter(w => this.match(w, term, partial)).length;
    }
    idf(term, partial) {
        term = term.toLowerCase();
        const n = this.documents.filter(document => document.words.some(w => this.match(w, term, partial))).length;
        return Math.log((this.documents.length - n + 0.5) / (n + 0.5) + 1);
    }
    match(a, b, partial) {
        return partial ? a.includes(b) : a === b;
    }
}
Corpus.MIN_TERM_LENGTH = 3;
exports.default = Corpus;
