const assert = require('assert').strict;
const docker = require('services/docker');
const { Readable, Writable } = require("stream");
const readline = require('readline');
const es = require('event-stream');

describe('docker', function() {
  // before(async function(done) {
  //   this.timeout(5000);
  //   const stream = await docker.pull('alpine:3')
  //   stream.pipe(process.stdout);
  //   done()
  // })

  it('runs docker', async function(done) {
    const container = await docker(
      'alpine:3',
      { foo: 'bar' },
      5000,
      { memory: 500 * 1024 ** 2 },
      { Cmd: ['sh', '-c', 'echo $foo; cat'] }
    )

    let outputText = '';
    const output = new Writable({
      write: function(chunk, encoding, next) {
        outputText += chunk.toString();
        next();
      }
    })

    container.stdout.pipe(output);
    await container.start();
    Readable.from(['a\n', 'b\n', 'c\n']).pipe(container.stdin);
    
    const { StatusCode } = await container.wait();
    
    assert.equal(StatusCode, 0);
    assert.equal(outputText, 'bar\na\nb\nc\n')
    done()
  });

  it('fails gracefully', async function(done) {
    const container = await docker(
      'alpine:3',
      { foo: 'bar' },
      5000,
      { memory: 500 * 1024 ** 2 },
      { Cmd: ['sh', '-c', 'echo $foo > /dev/stderr; exit 1;'] }
    )

    await container.start();
    Readable.from(['a\n', 'b\n', 'c\n']).pipe(container.stdin);
    
    const { StatusCode } = await container.wait();

    assert.equal(StatusCode, 1);
    container.stderr.setEncoding('utf8');
    assert.equal(container.stderr.read(), 'bar\n');
    done()
  });

  it('writes nice lines', async function(done) {
    this.timeout(5000);
    const container = await docker(
      'alpine:3',
      { foo: 'bar' },
      5000,
      { memory: 500 * 1024 ** 2 },
      { Cmd: ['sh', '-c', 'sleep 1; cat'] }
    )

    const lines = readline.createInterface({
      input: container.stdout,
      crlfDelay: Infinity,
    });

    await container.start();
    Readable.from(['a\n', 'b\n', 'c\n']).pipe(container.stdin);
    
    let i = 0;
    const expected = ['a', 'b', 'c']

    const sink = new Writable({
      objectMode: true,
      write(line, _, done) {
        assert.equal(line, expected[i]);
        i++
        done()
      }
    })

    Readable.from(lines).pipe(sink)

    await container.wait();
    assert.equal(i, 3);
    done()
  })

  it('limits memory', async function(done) {
    const container = await docker(
      'alpine:3',
      { foo: 'bar' },
      5000,
      { memory: 10 * 1024 ** 2 },
      { Cmd: ['sh', '-c', 'foo=$(dd if=/dev/random bs=1M count=20); sleep 5;'] }
    )

    await container.start();
    Readable.from(['a\n', 'b\n', 'c\n']).pipe(container.stdin);
    
    const { StatusCode } = await container.wait();

    assert.equal(StatusCode, 137);
    done()
    
  })
})