// users.test.js
describe('Users Object', function() {
    it('should contain valid user credentials', function() {
        assert.exists(users, 'Users object should exist');
        assert.isObject(users, 'Users should be an object');
    });

    it('should have example user with correct credentials', function() {
        assert.property(users, 'example@example.com', 'Should have example user');
        assert.strictEqual(users['example@example.com'], '123', 'Password should match');
    });

    it('should allow adding new users', function() {
        const initialCount = Object.keys(users).length;
        users['test@test.com'] = 'password123';
        
        assert.property(users, 'test@test.com', 'New user should be added');
        assert.strictEqual(users['test@test.com'], 'password123', 'New user password should match');
        
        // Очищаем тестовые данные
        delete users['test@test.com'];
    });
});