// simple.test.js
const assert = require('chai').assert;

// Тестовые данные
const users = {
    'example@example.com': '123'
};

describe('Simple Auth Tests', function() {
    describe('Users', function() {
        it('should have test user', function() {
            assert.property(users, 'example@example.com');
            assert.strictEqual(users['example@example.com'], '123');
        });
    });

    describe('Auth Logic', function() {
        it('should validate correct credentials', function() {
            const isValid = users['example@example.com'] === '123';
            assert.isTrue(isValid);
        });

        it('should reject wrong credentials', function() {
            const isValid = users['example@example.com'] === 'wrong';
            assert.isFalse(isValid);
        });
    });
});