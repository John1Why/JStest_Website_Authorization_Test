// integration.test.js
describe('Integration Tests', function() {
    it('should work end-to-end with correct credentials', function() {
        // Тестируем полный цикл авторизации
        const testEmail = 'example@example.com';
        const testPassword = '123';
        
        // Проверяем существование пользователя
        const userExists = users.hasOwnProperty(testEmail);
        assert.isTrue(userExists, 'User should exist');
        
        // Проверяем пароль
        const passwordCorrect = users[testEmail] === testPassword;
        assert.isTrue(passwordCorrect, 'Password should be correct');
        
        // Проверяем общую валидацию
        const isValid = userExists && passwordCorrect;
        assert.isTrue(isValid, 'Credentials should be valid');
    });

    it('should reject invalid credentials', function() {
        const testEmail = 'nonexistent@test.com';
        const testPassword = 'wrongpass';
        
        const isValid = users.hasOwnProperty(testEmail) && users[testEmail] === testPassword;
        assert.isFalse(isValid, 'Should reject invalid credentials');
    });

    it('should reject wrong password for existing user', function() {
        const testEmail = 'example@example.com';
        const testPassword = 'wrongpassword';
        
        const userExists = users.hasOwnProperty(testEmail);
        const passwordCorrect = users[testEmail] === testPassword;
        
        assert.isTrue(userExists, 'User should exist');
        assert.isFalse(passwordCorrect, 'Password should be incorrect');
        assert.isFalse(userExists && passwordCorrect, 'Should reject wrong password');
    });
});