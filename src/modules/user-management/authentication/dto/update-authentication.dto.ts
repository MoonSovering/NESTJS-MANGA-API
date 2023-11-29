import { PartialType } from '@nestjs/swagger';
import { CreateAuthenticationDto } from './create-authentication.dto';

export class UpdateAuthenticationDto extends PartialType(CreateAuthenticationDto) {}
