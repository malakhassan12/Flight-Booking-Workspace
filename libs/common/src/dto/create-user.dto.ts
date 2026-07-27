import {
  IsEmail,
  IsEnum,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsPhoneNumber,
  Length,
} from 'class-validator';

import { Type } from 'class-transformer';
import { Role } from '../types/enum/role.enum';
import { Gender } from '../types/enum/gender.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsEnum(Role)
  role!: Role ;

  // Age
  @Type(() => Number)
  @IsInt()
  @Min(18, { message: 'Age should be larger than 18 years' })
  @Max(150)
  age!: number;

  // Phone Number
  @IsString({ message: 'phoneNumber must be a string' })
  @IsPhoneNumber('EG', {
    message: 'phoneNumber must be a Egyptian phone number',
  })
  @Length(11, 11)
  phone!: string;

  // Address
  @IsString({ message: 'address must be a string' })
  @IsOptional()
  address!: string;

  // Gender
  @IsEnum(Gender)
  gender!: Gender;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;
}
