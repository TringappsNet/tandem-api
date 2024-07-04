import { IsBoolean, IsNotEmpty } from "class-validator";


export class SetActiveBrokerDto {
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}