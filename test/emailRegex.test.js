const { emailRegex } = require('../emailRegex');

describe('Email Regex Test', () => {
    test('should fail if email contains no @ symbol', () => {
        const result = emailRegex('email.com');
        console.log('Result for email.com:', result); // Debug output
        expect(result).toBe(false);
    });

    test('should fail if email contains no . after @ and letter', () => {
        const result = emailRegex('email@ddddcom');
        console.log('Result for email@ddddcom:', result); // Debug output
        expect(result).toBe(false);
    });

    test('should fail if email does not contain @ or .', () => {
        const result = emailRegex('emailddd');
        console.log('Result for emailddd:', result); // Debug output
        expect(result).toBe(false);
    });

    test('should fail if email contains no service after @', () => {
        const result = emailRegex('email@.com');
        console.log('Result for email@.com:', result); // Debug output
        expect(result).toBe(false);
    });

    test('should fail if email contains nothing less than 2 chars after .', () => {
        const result = emailRegex('email@domain.c');
        console.log('Result for email@domain.c:', result); // Debug output
        expect(result).toBe(false);
    });

    test('should fail if email contains nothing', () => {
        const result = emailRegex('');
        console.log('Result for empty string:', result); // Debug output
        expect(result).toBe(false);
    });

    test('should be valid email format', () => {
        const result = emailRegex('tylon@gmail.com');
        console.log('Result for tylon@gmail.com:', result); // Debug output
        expect(result).toBe(true);
    });
});
