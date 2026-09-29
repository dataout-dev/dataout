// Must be imported before anything that pulls in isomorphic-git/lightning-fs: both assume a
// Node-like global scope (a `global` object, a `Buffer` global) that a Web Worker never has
// (only `self`), so without this they crash the moment they touch the index/tree encoding.
import { Buffer } from 'buffer'

if (typeof global === 'undefined') {
  self.global = self
}
self.Buffer ??= Buffer
