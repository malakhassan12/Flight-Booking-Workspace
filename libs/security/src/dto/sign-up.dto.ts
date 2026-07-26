import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Gender, Role } from '@flight-booking-workspace/common';
import { Type } from 'class-transformer';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsEnum(Role)
  role: Role = Role.PASSENGER;

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
