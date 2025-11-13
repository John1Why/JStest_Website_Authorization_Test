// login.test.js
describe('Login Form', function() {
    let loginForm, emailInput, passwordInput, messageDiv;

    beforeEach(function() {
        // Создаем элементы DOM для тестирования
        document.body.innerHTML = `
            <form id="loginForm">
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Пароль" required />
                <button type="submit">Войти</button>
            </form>
            <div id="message"></div>
        `;

        loginForm = document.getElementById('loginForm');
        emailInput = document.querySelector('input[type="email"]');
        passwordInput = document.querySelector('input[type="password"]');
        messageDiv = document.getElementById('message');

        // Сбрасываем window.location перед каждым тестом
        window.location.href = '';
    });

    it('should have required fields', function() {
        assert.isTrue(emailInput.hasAttribute('required'), 'Email should be required');
        assert.isTrue(passwordInput.hasAttribute('required'), 'Password should be required');
    });

    it('should validate correct credentials', function() {
        // Имитируем логику из index.html
        const email = 'example@example.com';
        const password = '123';
        
        const isValid = users.hasOwnProperty(email) && users[email] === password;
        assert.isTrue(isValid, 'Should validate correct credentials');
    });

    it('should reject incorrect credentials', function() {
        const email = 'wrong@example.com';
        const password = 'wrong';
        
        const isValid = users.hasOwnProperty(email) && users[email] === password;
        assert.isFalse(isValid, 'Should reject incorrect credentials');
    });
});