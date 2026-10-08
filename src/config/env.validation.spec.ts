import { Logger } from '@nestjs/common';
import { validate } from './env.validation';

describe('environment validation', () => {
  it('accepts the production configuration shape', () => {
    const config = validate({
      PORT: '10000',
      CORS_ORIGINS: 'https://nurse-balance.example.com',
      DATABASE_URL: 'postgresql://user:password@localhost:5432/nurse_balance',
      ACCESS_TOKEN_SECRET: 'a'.repeat(32),
      ACCESS_TOKEN_EXPIRES_IN: '86400',
      CLOUDINARY_CLOUD_NAME: 'nurse-balance',
      CLOUDINARY_API_KEY: 'api-key',
      CLOUDINARY_API_SECRET: 'api-secret'
    });

    expect(config.PORT).toBe(10000);
    expect(config.CORS_ORIGINS).toBe('https://nurse-balance.example.com');
    expect(config.ACCESS_TOKEN_EXPIRES_IN).toBe(86400);
  });

  it('rejects a configuration without allowed CORS origins', () => {
    const loggerError = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    try {
      expect(() =>
        validate({
          PORT: '10000',
          DATABASE_URL:
            'postgresql://user:password@localhost:5432/nurse_balance',
          ACCESS_TOKEN_SECRET: 'a'.repeat(32),
          ACCESS_TOKEN_EXPIRES_IN: '86400',
          CLOUDINARY_CLOUD_NAME: 'nurse-balance',
          CLOUDINARY_API_KEY: 'api-key',
          CLOUDINARY_API_SECRET: 'api-secret'
        })
      ).toThrow('Env validation failed');
    } finally {
      loggerError.mockRestore();
    }
  });
});
