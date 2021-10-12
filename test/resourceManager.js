const assert = require('assert');
const ResourceManager = require('services/resourceManager');

describe('resourceManager', () => {
  let resourceManager;
  beforeEach(() => {
    resourceManager = new ResourceManager({ foo: 10 });
  });

  it('should handle requests', async function (done) {
    this.timeout(5000);

    const p1 = resourceManager.request({ foo: 1 });
    const r2 = await resourceManager.request({ foo: 2 });
    assert.strictEqual(resourceManager.allocated.foo, 3);
    r2();
    assert.strictEqual(resourceManager.allocated.foo, 1);

    assert.throws(() => resourceManager.request({ foo: 100 }));
    assert.throws(() => resourceManager.request({ bar: 1 }));

    const p10 = resourceManager.request({ foo: 10 });
    assert.strictEqual(await Promise.race([
      p1.then(() => 'p1'),
      p10.then(() => 'p10'),
    ]), 'p1');
    const r1 = await p1;
    assert.strictEqual(resourceManager.allocated.foo, 1);
    r1();

    const r10 = await p10;
    assert.strictEqual(resourceManager.allocated.foo, 10);
    r10();

    assert.strictEqual(resourceManager.allocated.foo, 0);
    done();
  });
});
