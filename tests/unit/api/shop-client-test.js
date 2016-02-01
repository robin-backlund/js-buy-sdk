import { module, test } from 'qunit';
import { step, resetStep } from 'buy-button-sdk/tests/helpers/assert-step';
import ShopClient from 'buy-button-sdk/shop-client';
import Config from 'buy-button-sdk/config';
import Promise from 'promise';

const configAttrs = {
  myShopifyDomain: 'buckets-o-stuff',
  apiKey: 123,
  channelId: 'abc'
};

const config = new Config(configAttrs);

let shopClient;

function FakeAdapter() {
  this.fetchCollection = function () {
    return new Promise(function (resolve) {
      resolve({});
    });
  };
  this.fetchSingle = function () {
    return new Promise(function (resolve) {
      resolve({});
    });
  };
}

function FakeSerializer() {
  this.serializeSingle = function () {
    return {};
  };
  this.serializeCollection = function () {
    return [{}];
  };
}

module('Unit | ShopClient', {
  setup() {
    shopClient = new ShopClient(config);
    resetStep();
  },
  teardown() {
    shopClient = null;
  }
});


test('it retains a reference to the passed config.', function (assert) {
  assert.expect(1);

  assert.equal(shopClient.config, config);
});

test('it inits a type\'s adapter with the config during fetchAll', function (assert) {
  assert.expect(1);

  shopClient.adapters = {
    products: function (localConfig) {
      assert.equal(localConfig, config);
      FakeAdapter.apply(this, arguments);
    }
  };
  shopClient.serializers = {
    products: FakeSerializer
  };

  shopClient.fetchAll('products');
});

test('it inits a type\'s adapter with the config during fetchOne', function (assert) {
  assert.expect(1);

  shopClient.adapters = {
    products: function (localConfig) {
      assert.equal(localConfig, config);
      FakeAdapter.apply(this, arguments);
    }
  };
  shopClient.serializers = {
    products: FakeSerializer
  };

  shopClient.fetchOne('products', 1);
});

test('it inits a type\'s adapter with the config during fetchQuery', function (assert) {
  assert.expect(1);

  shopClient.adapters = {
    products: function (localConfig) {
      assert.equal(localConfig, config);
      FakeAdapter.apply(this, arguments);
    }
  };
  shopClient.serializers = {
    products: FakeSerializer
  };

  shopClient.fetchQuery('products', { product_ids: [1, 2, 3] });
});

test('it inits a type\'s serializer with the config during fetchAll', function (assert) {
  assert.expect(1);

  const done = assert.async();

  shopClient.adapters = {
    products: FakeAdapter
  };
  shopClient.serializers = {
    products: function (localConfig) {
      assert.equal(localConfig, config);
      FakeSerializer.apply(this, arguments);
      done();
    }
  };

  shopClient.fetchAll('products').catch(() => {
    assert.ok(false, 'should not reject');
    done();
  });
});

test('it inits a type\'s serializer with the config during fetchOne', function (assert) {
  assert.expect(1);

  const done = assert.async();

  shopClient.adapters = {
    products: FakeAdapter
  };
  shopClient.serializers = {
    products: function (localConfig) {
      assert.equal(localConfig, config);
      FakeSerializer.apply(this, arguments);
      done();
    }
  };

  shopClient.fetchOne('products', 1).catch(() => {
    assert.ok(false, 'should not reject');
    done();
  });
});

test('it inits a type\'s serializer with the config during fetchQuery', function (assert) {
  assert.expect(1);

  const done = assert.async();

  shopClient.adapters = {
    products: FakeAdapter
  };
  shopClient.serializers = {
    products: function (localConfig) {
      assert.equal(localConfig, config);
      FakeSerializer.apply(this, arguments);
      done();
    }
  };

  shopClient.fetchQuery('products', { product_ids: [1, 2, 3] }).catch(() => {
    assert.ok(false, 'should not reject');
    done();
  });
});

test('it chains the result of the adapter\'s fetchCollection through the type\'s serializer on #fetchAll', function (assert) {
  assert.expect(5);

  const done = assert.async();

  const rawModel = { props: 'some-object' };
  const serializedModel = [{ attrs: 'serialized-model' }];

  shopClient.adapters = {
    products: function () {
      this.fetchCollection = function () {
        step(1, 'calls fetchAll on the adapter', assert);

        return new Promise(function (resolve) {
          resolve(rawModel);
        });
      };
    }
  };

  shopClient.serializers = {
    products: function () {
      this.serializeCollection = function (results) {
        step(2, 'calls serializeCollection', assert);

        assert.equal(results, rawModel);

        return serializedModel;
      };
    }
  };

  shopClient.fetchAll('products').then(products => {
    step(3, 'resolves after fetch and serialize', assert);
    assert.equal(products, serializedModel);

    done();
  }).catch(() => {
    assert.ok(false, 'promise should not reject');
    done();
  });
});

test('it chains the result of the adapter\'s fetchSingle through the type\'s serializer on #fetchOne', function (assert) {
  assert.expect(6);

  const done = assert.async();

  const rawModel = { props: 'some-object' };
  const serializedModel = { attrs: 'serialized-model' };
  const id = 1;

  shopClient.adapters = {
    products: function () {
      this.fetchSingle = function (localId) {
        step(1, 'calls fetchSingle on the adapter', assert);
        assert.equal(localId, id);

        return new Promise(function (resolve) {
          resolve(rawModel);
        });
      };
    }
  };

  shopClient.serializers = {
    products: function () {
      this.serializeSingle = function (results) {
        step(2, 'calls serializeSingle', assert);

        assert.equal(results, rawModel);

        return serializedModel;
      };
    }
  };

  shopClient.fetchOne('products', 1).then(product => {
    step(3, 'resolves after fetch and serialize', assert);
    assert.equal(product, serializedModel);

    done();
  }).catch(() => {
    assert.ok(false, 'promise should not reject');
    done();
  });
});

test('it chains the result of the adapter\'s fetchCollection through the type\'s serializer on #fetchQuery', function (assert) {
  assert.expect(6);

  const done = assert.async();

  const rawModel = { props: 'some-object' };
  const serializedModel = { attrs: 'serialized-model' };
  const query = { q: 'some-query' };

  shopClient.adapters = {
    products: function () {
      this.fetchCollection = function (localQuery) {
        step(1, 'calls fetchAll on the adapter', assert);
        assert.equal(localQuery, query);

        return new Promise(function (resolve) {
          resolve(rawModel);
        });
      };
    }
  };

  shopClient.serializers = {
    products: function () {
      this.serializeCollection = function (results) {
        step(2, 'calls serializeCollection', assert);

        assert.equal(results, rawModel);

        return serializedModel;
      };
    }
  };

  shopClient.fetchQuery('products', query).then(products => {
    step(3, 'resolves after fetch and serialize', assert);
    assert.equal(products, serializedModel);

    done();
  }).catch(() => {
    assert.ok(false, 'promise should not reject');
    done();
  });
});

test('it passes a shop client reference to the serializer', function (assert) {
  assert.expect(2);

  const done = assert.async();

  shopClient.adapters = {
    products: FakeAdapter
  };

  shopClient.serializers = {
    products: function () {
      this.serializeSingle = function (results, shopClientRef) {
        assert.equal(shopClientRef, shopClient, 'shop client reference to #serializeSingle');
        return {};
      };
      this.serializeCollection = function (results, shopClientRef) {
        assert.equal(shopClientRef, shopClient, 'shop client reference to #serializeCollection');
        done();
        return [{}];
      };
    }
  };

  shopClient.fetchOne('products', 1).catch(() => {
    assert.ok(false, 'promise should not reject');
    done();
  });
  shopClient.fetchAll('products').catch(() => {
    assert.ok(false, 'promise should not reject');
    done();
  });
});