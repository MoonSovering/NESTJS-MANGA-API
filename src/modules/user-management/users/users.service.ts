import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ){}

  async createUser(body: CreateUserDto) {

    const { ...userDetails } = body

    try {
      return await this.userModel.create(userDetails)
    } catch (error) {
      console.log(error);
      if(error.name === 'SequelizeUniqueConstraintError') throw new BadRequestException(`Register already exist in DB ${ JSON.stringify( error.errors[0].message ) }`)
    }

  }

  async findAllUser( query: {
    limit: number;
    offset: number;
  } ) {
    const { limit, offset } = query;
    return await this.userModel.findAll({
      limit,
      offset
    })
  }

  async findOneUser(email: string) {
    return await this.userModel.findOne({
      where: {email: email}
    })
  }

  async updateUser(uuid: string, body: UpdateUserDto){

    return await this.userModel.update(
      body,
      {where: {id: uuid}, returning: true}
    )

  }

  async removeUser(uuid: string) {
    return await this.userModel.destroy({
      where: {id: uuid}
    })
  }
}
