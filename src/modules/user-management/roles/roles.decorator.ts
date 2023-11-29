import { SetMetadata } from '@nestjs/common';

import { PRIVATE_ROLES_KEY } from 'src/core/Constants/constants';
import { validRoles } from './enum.roles';


export const Roles = (...roles: validRoles[]) => SetMetadata(PRIVATE_ROLES_KEY, roles);