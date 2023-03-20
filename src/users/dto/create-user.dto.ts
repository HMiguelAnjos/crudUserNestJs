import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly first_name: string;
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly last_name: string;
}
