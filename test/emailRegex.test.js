const { emailRegex } = require('../emailRegex');

describe('Email Regex Test', () => {
    test('should fail if email contains no @ symbol', () => {
        expect(emailRegex('email.com')).toBe(false);
    });

    test('should fail if email contains no . after @ and letter', () => {
        expect(emailRegex('email@ddddcom')).toBe(false);
    });

    test('should fail if email does not contain @ or .', () => {
        expect(emailRegex('emailddd')).toBe(false);
    });

    test('should fail if email contains no service after @', () => {
        expect(emailRegex('email@.com')).toBe(false);
    });

    test('should fail if email contains nothing less than 2 char after .', () => {
        expect(emailRegex('NoNumbers!')).toBe(false);
    });

    test('should fail if email containts nothing', () => {
        expect(emailRegex('')).toBe(false);
    });

});