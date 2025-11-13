// welcome.test.js
describe('Welcome Page', function() {
    beforeEach(function() {
        document.body.innerHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Добро пожаловать!</title>
            </head>
            <body>
                <h1>Вы вошли!</h1>
            </body>
            </html>
        `;
    });

    it('should display welcome message', function() {
        const h1 = document.querySelector('h1');
        assert.exists(h1, 'Welcome heading should exist');
        assert.strictEqual(h1.textContent, 'Вы вошли!', 'Should display correct welcome message');
    });

    it('should have correct page title', function() {
        const title = document.querySelector('title');
        assert.exists(title, 'Page should have title');
        assert.strictEqual(title.textContent, 'Добро пожаловать!', 'Page title should be correct');
    });
});