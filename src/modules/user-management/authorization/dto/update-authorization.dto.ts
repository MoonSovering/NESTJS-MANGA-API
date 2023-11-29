import { PartialType } from '@nestjs/swagger';
import { CreateAuthorizationDto } from './create-authorization.dto';

export class UpdateAuthorizationDto extends PartialType(CreateAuthorizationDto) {}
