import { CreateWorkplaceSettingDto } from '@/workplace-settings/dto/create-user-workplace-setting.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWorkplaceDto extends PartialType(
  CreateWorkplaceSettingDto
) {}
