import { ConfigService } from '@nestjs/config';
import { AuthService } from '.';
import { UserService } from '../../user/providers';
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
  let userService: UserService;
  let configService: ConfigService;
  let jwtService: JwtService;

  let authService: AuthService;

  beforeEach(async (): Promise<void> => {
    configService = {
      get: jest.fn(),
    } as unknown as ConfigService;

    userService = {
      findOneByLoginOrEmail: jest.fn(),
      createUser: jest.fn(),
    } as unknown as UserService;

    authService = new AuthService(jwtService, configService, userService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', (): void => {
    it('Регистрация пользователя', async (): Promise<void> => {
      const data = {
        login: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 20,
      };

      const token = { access_token: 'token' };

      jest.spyOn(authService, 'register').mockResolvedValue(token);

      const res = await authService.register(data);

      expect(authService.register).toHaveBeenCalledWith(data);
      expect(res.access_token).toEqual(token.access_token);
    });
  });
});
