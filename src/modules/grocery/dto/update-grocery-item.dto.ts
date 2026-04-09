import { PartialType } from '@nestjs/swagger';
import { CreateGroceryItemDto } from './create-grocery-item.dto';

export class UpdateGroceryItemDto extends PartialType(CreateGroceryItemDto) {}
