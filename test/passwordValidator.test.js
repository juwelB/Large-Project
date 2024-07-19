
const { isStrongPassword } = require('../passwordValidator');

describe('Password Strength Validation', () => {
    test('should fail if password is too short', () => {
        expect(isStrongPassword('Short1!')).toBe(false);
    });

    test('should fail if password is too long', () => {
        const longPassword = 'X'.repeat(31) + '1!';
        expect(isStrongPassword(longPassword)).toBe(false);
    });

    test('should fail if password does not contain an uppercase letter', () => {
        expect(isStrongPassword('lowercase1!')).toBe(false);
    });

    test('should fail if password does not contain a lowercase letter', () => {
        expect(isStrongPassword('UPPERCASE1!')).toBe(false);
    });

    test('should fail if password does not contain a number', () => {
        expect(isStrongPassword('NoNumbers!')).toBe(false);
    });

    test('should fail if password does not contain a special character', () => {
        expect(isStrongPassword('NoSpecials1')).toBe(false);
    });

    test('should pass if password meets all criteria', () => {
        expect(isStrongPassword('Password1!')).toBe(true);
    });
});
