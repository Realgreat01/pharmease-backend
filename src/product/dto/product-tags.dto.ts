import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductTagsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  items: string[];
}
