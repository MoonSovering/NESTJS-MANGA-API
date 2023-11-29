import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PRIVATE_ROLES_KEY } from 'src/core/Constants/constants';
import { validRoles } from '../enum.roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<validRoles[]>(PRIVATE_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const request = context.switchToHttp().getRequest();
    const { username, role } = request.user;
    if(!username){
        throw new BadRequestException('User not found.');
    }
    if(requiredRoles.includes(role)){
        return true
    }
    throw new ForbiddenException(`User ${username} need a valid role.`)
  }
}