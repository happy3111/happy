import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './auth.entity';
import { AuthToken, SigninArgs } from './dto/signin.args';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server-errors';

@Injectable()
export class AuthService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(User)
    private readonly authModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async signin(signinArgs: SigninArgs): Promise<AuthToken> {
    const user = await this.authModel.findOne({
      where: { username: signinArgs.username },
    });
    console.log('password', bcrypt.hashSync(signinArgs.password, 10));
    if (user && bcrypt.compareSync(signinArgs.password, user.password)) {
      const payload = { user: user.username, id: user.id };
      const access_token = this.jwtService.sign(payload);
      user.apikey = access_token;
      await user.save();
      return {
        token: access_token,
        expiresAt: Date.now() + 36000 * 1000,
      };
    }
    return null;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    console.log(email, pass);
    const user = await this.authModel.findOne({ where: { email } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      const result = user.toJSON();
      delete result.password;
      return result;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.authModel.findAll({
      include: [],
    });
  }

  findOne(id: string): Promise<User> {
    return this.authModel.findOne({
      where: {
        id,
      },
      include: [],
    });
  }

  async update(id: string, oldPassword, newPassword): Promise<User> {
    const user = await this.authModel.findByPk(id);
    console.log(id, user, oldPassword);
    if (user && bcrypt.compareSync(oldPassword, user.password)) {
      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();
      return user;
    } else {
      throw new AuthenticationError('Wrong password');
    }
  }

  async remove(id: string): Promise<boolean> {
    const auth = await this.findOne(id);
    if (auth) {
      await auth.destroy();
      return true;
    } else return false;
  }

  async isUser(token: string) {
    const user = await this.authModel.findOne({ where: { apikey: token } });
    if (!user) return false;
    return user.role == 'user';
  }
}
