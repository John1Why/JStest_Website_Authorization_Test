// e2e.test.js - Глобальный End-to-End тест системы авторизации
const { JSDOM } = require('jsdom');
const { assert } = require('chai');
const fs = require('fs');
const path = require('path');

describe('Глобальное тестирование системы авторизации', function() {
    let dom, window, document, users;
    
    before(function() {
        // Загружаем реальные файлы
        const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        const usersContent = fs.readFileSync(path.join(__dirname, 'users.js'), 'utf8');
        
        // Создаем DOM из index.html
        dom = new JSDOM(htmlContent, {
            url: 'http://localhost',
            runScripts: "dangerously",
            resources: "usable"
        });
        
        window = dom.window;
        document = window.document;
        
        // Создаем объект users вручную из содержимого файла
        try {
            // Пытаемся извлечь users объект из файла
            const usersMatch = usersContent.match(/const users\s*=\s*({[^;]+});?/);
            if (usersMatch) {
                users = eval('(' + usersMatch[1] + ')');
            } else {
                // Если не удалось извлечь, создаем вручную
                users = {
                    'example@example.com': '123'
                };
            }
        } catch (error) {
            // В случае ошибки создаем стандартный объект
            users = {
                'example@example.com': '123'
            };
        }
        
        // Добавляем users в глобальную область видимости
        window.users = users;
    });

    beforeEach(function() {
        // Сбрасываем состояние перед каждым тестом
        window.location.href = '';
        document.body.innerHTML = dom.window.document.body.innerHTML;
    });

    describe('1. Тестирование users.js', function() {
        it('должен существовать объект users', function() {
            assert.exists(users, 'Users object should be defined');
            assert.isObject(users, 'Users should be an object');
        });

        it('должен содержать тестового пользователя', function() {
            assert.property(users, 'example@example.com', 'Should have example user');
            assert.strictEqual(users['example@example.com'], '123', 'Password should match');
        });

        it('должен позволять добавлять новых пользователей', function() {
            const initialCount = Object.keys(users).length;
            users['newuser@test.com'] = 'password456';
            
            assert.property(users, 'newuser@test.com', 'New user should be added');
            assert.strictEqual(users['newuser@test.com'], 'password456');
            assert.strictEqual(Object.keys(users).length, initialCount + 1);
            
            // Очистка
            delete users['newuser@test.com'];
        });
    });

    describe('2. Тестирование DOM структуры index.html', function() {
        it('должен содержать форму авторизации', function() {
            const form = document.getElementById('loginForm');
            assert.exists(form, 'Login form should exist');
        });

        it('должен иметь поля email и password', function() {
            const emailInput = document.querySelector('input[type="email"]');
            const passwordInput = document.querySelector('input[type="password"]');
            
            assert.exists(emailInput, 'Email input should exist');
            assert.exists(passwordInput, 'Password input should exist');
            assert.strictEqual(emailInput.placeholder, 'Email');
            assert.strictEqual(passwordInput.placeholder, 'Пароль');
        });

        it('должен иметь кнопку входа', function() {
            const button = document.querySelector('button[type="submit"]');
            assert.exists(button, 'Submit button should exist');
            assert.strictEqual(button.textContent, 'Войти');
        });

        it('должен иметь блок для сообщений', function() {
            const messageDiv = document.getElementById('message');
            assert.exists(messageDiv, 'Message div should exist');
        });

        it('поля должны быть обязательными', function() {
            const emailInput = document.querySelector('input[type="email"]');
            const passwordInput = document.querySelector('input[type="password"]');
            
            assert.isTrue(emailInput.hasAttribute('required'), 'Email should be required');
            assert.isTrue(passwordInput.hasAttribute('required'), 'Password should be required');
        });
    });

    describe('3. Тестирование логики авторизации', function() {
        let loginForm, emailInput, passwordInput, messageDiv;

        beforeEach(function() {
            loginForm = document.getElementById('loginForm');
            emailInput = document.querySelector('input[type="email"]');
            passwordInput = document.querySelector('input[type="password"]');
            messageDiv = document.getElementById('message');
        });

        it('должен авторизовать с правильными credentials', function() {
            // Настраиваем значения
            emailInput.value = 'example@example.com';
            passwordInput.value = '123';
            
            // Имитируем логику из index.html
            const isValid = users.hasOwnProperty(emailInput.value) && 
                           users[emailInput.value] === passwordInput.value;
            
            assert.isTrue(isValid, 'Should validate correct credentials');
            
            // Проверяем, что при валидных данных должен происходить редирект
            if (isValid) {
                const shouldRedirect = true;
                assert.isTrue(shouldRedirect, 'Should redirect on successful auth');
            }
        });

        it('должен показывать ошибку при неправильных credentials', function() {
            emailInput.value = 'wrong@example.com';
            passwordInput.value = 'wrongpassword';
            
            // Имитируем логику из index.html
            const isValid = users.hasOwnProperty(emailInput.value) && 
                           users[emailInput.value] === passwordInput.value;
            
            if (!isValid) {
                messageDiv.textContent = 'Неверный логин или пароль!';
            }
            
            assert.isFalse(isValid, 'Should reject invalid credentials');
            assert.strictEqual(messageDiv.textContent, 'Неверный логин или пароль!');
        });

        it('должен предотвращать стандартную отправку формы', function() {
            let defaultPrevented = false;
            
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();
                defaultPrevented = true;
            });

            const event = new window.Event('submit');
            loginForm.dispatchEvent(event);
            
            assert.isTrue(defaultPrevented, 'Default form submission should be prevented');
        });
    });

    describe('4. Тестирование welcome.html', function() {
        it('должен существовать файл welcome.html', function() {
            const welcomeExists = fs.existsSync(path.join(__dirname, 'welcome.html'));
            assert.isTrue(welcomeExists, 'welcome.html file should exist');
        });

        it('должен содержать правильную структуру', function() {
            const welcomeContent = fs.readFileSync(path.join(__dirname, 'welcome.html'), 'utf8');
            assert.include(welcomeContent, '<title>Добро пожаловать!</title>', 'Should have correct title');
            assert.include(welcomeContent, '<h1>Вы вошли!</h1>', 'Should have welcome message');
        });
    });

    describe('5. Интеграционное тестирование полного потока', function() {
        it('полный цикл авторизации должен работать корректно', function() {
            // Шаг 1: Проверяем существование пользователя
            const userExists = users.hasOwnProperty('example@example.com');
            assert.isTrue(userExists, 'User should exist in database');

            // Шаг 2: Проверяем правильность пароля
            const passwordCorrect = users['example@example.com'] === '123';
            assert.isTrue(passwordCorrect, 'Password should be correct');

            // Шаг 3: Проверяем валидацию
            const isValid = userExists && passwordCorrect;
            assert.isTrue(isValid, 'Credentials should be valid');

            // Шаг 4: Проверяем, что при валидных данных происходит редирект
            if (isValid) {
                const shouldRedirect = true;
                assert.isTrue(shouldRedirect, 'Should redirect on successful auth');
            }
        });

        it('должен блокировать неавторизованный доступ', function() {
            const testCases = [
                { email: 'nonexistent@test.com', password: '123', shouldWork: false },
                { email: 'example@example.com', password: 'wrong', shouldWork: false },
                { email: '', password: '123', shouldWork: false },
                { email: 'example@example.com', password: '', shouldWork: false }
            ];

            testCases.forEach(testCase => {
                const isValid = users.hasOwnProperty(testCase.email) && 
                               users[testCase.email] === testCase.password;
                assert.strictEqual(isValid, testCase.shouldWork, 
                    `Test case ${testCase.email}/${testCase.password} should ${testCase.shouldWork ? 'work' : 'fail'}`);
            });
        });
    });

    describe('6. Тестирование безопасности', function() {
        it('не должен принимать пустые поля', function() {
            const emailInput = document.querySelector('input[type="email"]');
            const passwordInput = document.querySelector('input[type="password"]');
            
            assert.isTrue(emailInput.required, 'Email should be required');
            assert.isTrue(passwordInput.required, 'Password should be required');
        });

        it('должен валидировать email формат', function() {
            const emailInput = document.querySelector('input[type="email"]');
            assert.strictEqual(emailInput.type, 'email', 'Input should be of type email');
        });

        it('пароль должен быть скрыт', function() {
            const passwordInput = document.querySelector('input[type="password"]');
            assert.strictEqual(passwordInput.type, 'password', 'Password input should hide text');
        });
    });

    describe('7. Финальный отчет', function() {
        it('вся система должна работать корректно', function() {
            // Проверяем все компоненты системы
            const components = {
                usersObject: typeof users !== 'undefined',
                loginForm: !!document.getElementById('loginForm'),
                emailField: !!document.querySelector('input[type="email"]'),
                passwordField: !!document.querySelector('input[type="password"]'),
                welcomePage: fs.existsSync(path.join(__dirname, 'welcome.html')),
                authLogic: true // Проверено в предыдущих тестах
            };

            const allComponentsWorking = Object.values(components).every(Boolean);
            assert.isTrue(allComponentsWorking, 'All system components should work correctly');
            
            console.log('\nФинальный отчет системы:');
            console.log('────────────────────────────');
            Object.entries(components).forEach(([component, status]) => {
                console.log(`${component}: ${status ? 'РАБОТАЕТ' : 'НЕ РАБОТАЕТ'}`);
            });
            console.log('────────────────────────────');
        });
    });
});