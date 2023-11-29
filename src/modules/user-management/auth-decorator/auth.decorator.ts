import { UseGuards, applyDecorators } from "@nestjs/common";
import { validRoles } from "../roles/enum.roles";
import { Roles } from "../roles/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../roles/guards/roles.guard";





export function Auth( ...roles: validRoles[]  ){

    return applyDecorators(
        Roles(...roles),
        UseGuards(AuthGuard('access_token'), RolesGuard)
    )
}