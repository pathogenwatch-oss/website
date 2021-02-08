/* eslint-disable brace-style */
/* eslint-disable max-len */
/* eslint-disable quotes */

import { fetchFile, parseInBatches } from '@loaders.gl/core';

const EOF = Symbol();

const decodeBatch = (arrayBuffer) => (new TextDecoder().decode(arrayBuffer));

const TextLoader = {
  name: "TEXT",
  extension: "txt",
  extensions: [ "txt" ],
  testText: null,
  parseInBatches: async (asyncIterator) => {
    async function* makeAsyncIterator() {
      for await (const batch of asyncIterator) {
        const textChunk = decodeBatch(batch);
        yield textChunk;
      }
    }
    return makeAsyncIterator();
  },
  parse: async (arrayBuffer) => decodeBatch(arrayBuffer),
  parseSync: decodeBatch,
  parseTextSync: (x) => x,
};

async function* linesAsyncIterator(input) {
  const chunkIterator = await parseInBatches(
    fetchFile(input),
    TextLoader,
  );

  for await (const chunk of chunkIterator) {
    const lines = chunk.split(/\n|\r\n/);
    for (const line of lines) {
      yield line;
    }
  }

  yield EOF;
}

async function* contigsAsyncIterator(inputBlob) {
  const linesIterator = await linesAsyncIterator(inputBlob);

  let buffer;
  let name;
  for await (const line of linesIterator) {
    if (line === EOF || line.startsWith(">")) {
      if (buffer) {
        yield new File(
          buffer,
          name,
          { type: "text/x-fasta" },
        );
      }
    }

    if (typeof line === "string") {
      if (line.startsWith(">")) {
        // buffer = [ ">contig\n" ];
        buffer = [ `${line}\n` ];
        name = (line.length > 1) ? line.substr(1) : undefined;
      }
      else if (buffer) {
        buffer.push(line);
      }
    }
  }
}

async function processMultiFastaFile(inputBlob) {
  const contigsIterator = await contigsAsyncIterator(inputBlob);

  const files = [];

  for await (const contigFile of contigsIterator) {
    files.push(contigFile);
  }

  return files;
}

export default processMultiFastaFile;
