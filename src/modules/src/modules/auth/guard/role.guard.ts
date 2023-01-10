import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IStaff } from '../interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user: IStaff = request.user;

    const userRoles: string[] = user.staffGroups
      .toArray()
      .map((e) => e.GroupId.name);
    const check = this.checkPermission(roles, userRoles);
    
    return check;
  }

  checkPermission(roles: string[], staffRoles: string[]): boolean {
    try {
      const check = roles.some((role) => staffRoles.includes(role));
      if (!check) throw new UnauthorizedException();
      return true;
    } catch (err) {
      return false;
    }
  }
}
