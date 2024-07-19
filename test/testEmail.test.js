// __tests__/sendTestEmail.test.js
const nodemailer = require('nodemailer');
const sendTestEmail = require('../testEmail'); // Ensure this path is correct

jest.mock('nodemailer');

describe('sendTestEmail configuration', () => {
  beforeEach(() => {
    nodemailer.createTransport.mockReturnValue({ sendMail: jest.fn().mockResolvedValue({ response: 'mocked response' }) });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should configure nodemailer with the correct settings', async () => {
    await sendTestEmail();

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS,
      },
    });
  });
});
