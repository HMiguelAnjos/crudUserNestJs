import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    @Inject('PAYEVER_USERS') private readonly clientMQ: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await new this.userModel(createUserDto);
      this.clientMQ.send({ cmd: 'user_created' }, newUser);
      await newUser.save();
      return newUser;
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAll(): Promise<IUser[]> {
    const userData = await this.userModel.find();
    if (!userData || userData.length == 0) {
      throw new NotFoundException('User not found!');
    }
    return userData;
  }

  async findOne(id: number): Promise<IUser> {
    const findUser = await this.userModel.findById(id);
    if (!findUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return findUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return existingUser;
  }

  async remove(id: number): Promise<IUser> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return deletedUser;
  }
}
