import { SetMetadata } from '@nestjs/common';
import { PUBLIC_ROLES_KEY } from '../Constants/constants';


export const PublicRoute = () => SetMetadata(PUBLIC_ROLES_KEY, true);