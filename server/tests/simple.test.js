const { test, describe } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

describe('Backend API Tests', () => {
  test('GET /api/health returns 200 status', async () => {
    const response = await request(app).get('/api/health');
    assert.strictEqual(response.status, 200);
  });

  test('GET /api/health returns correct structure', async () => {
    const response = await request(app).get('/api/health');
    assert.strictEqual(response.body.status, 'ok');
    assert.ok(response.body.message);
    assert.ok(response.body.timestamp);
  });

  test('GET /api/products returns 200 status', async () => {
    const response = await request(app).get('/api/products');
    assert.strictEqual(response.status, 200);
  });

  test('GET /api/products returns products array', async () => {
    const response = await request(app).get('/api/products');
    assert.ok(Array.isArray(response.body.products));
    assert.strictEqual(response.body.products.length, 8);
  });

  test('GET /api/products filters by category', async () => {
    const response = await request(app).get('/api/products?category=Electronics');
    assert.strictEqual(response.status, 200);
    assert.ok(response.body.products.every(p => p.category === 'Electronics'));
  });

  test('GET /api/categories returns 200 status', async () => {
    const response = await request(app).get('/api/categories');
    assert.strictEqual(response.status, 200);
  });

  test('GET /api/categories returns categories array', async () => {
    const response = await request(app).get('/api/categories');
    assert.ok(Array.isArray(response.body.categories));
  });

  test('POST /api/cart adds item to cart', async () => {
    const response = await request(app)
      .post('/api/cart')
      .send({ productId: 1, quantity: 2 });
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, 'Added to cart');
  });

  test('POST /api/cart returns 400 for missing productId', async () => {
    const response = await request(app).post('/api/cart').send({});
    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, 'productId is required');
  });

  test('GET /api/cart returns cart structure', async () => {
    const response = await request(app).get('/api/cart');
    assert.strictEqual(response.status, 200);
    assert.ok('items' in response.body);
    assert.ok('total' in response.body);
    assert.ok('count' in response.body);
  });
});
