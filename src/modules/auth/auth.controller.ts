import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/core/decorators/user.decorator';
import BadRequest from 'src/core/exceptions/bad-request.exception';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { LocalAuthGuard } from './guard/local.guard';
import { IStaff } from './interface';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: SignInDTO, @User() user: IStaff): Promise<string> {
    try {
      const { id } = user;
      const { username } = body;
      const token = this.authService.getAccessToken(username, id);
      return token;
    } catch (err) {
      throw new BadRequest(AuthController.name, err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('info')
  async getInfo(@User() user: IStaff): Promise<IStaff> {
    try {
      return user;
    } catch (err) {
      throw new BadRequest(AuthController.name, err);
    }
  }
}
