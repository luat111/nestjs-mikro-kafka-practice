import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BadRequest from 'src/core/exceptions/bad-request.exception';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAll() {
    try {
      return await this.authService.getAll();
    } catch (err) {
      throw new BadRequest(AuthController.name, err);
    }
  }
}
