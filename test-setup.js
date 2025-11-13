// test-setup.js
const { JSDOM } = require('jsdom');
const { expect, assert } = require('chai');
const sinon = require('sinon');

// Создаем виртуальный DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost'
});

// Глобальные переменные для тестов
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.Location = dom.window.Location;

// Глобальные библиотеки断言
global.assert = assert;
global.expect = expect;
global.sinon = sinon;

// Мокаем users объект
global.users = {
    'example@example.com': '123'
};

// Мокаем window.location
delete window.location;
window.location = { 
    href: '',
    assign: sinon.stub(),
    replace: sinon.stub() 
};