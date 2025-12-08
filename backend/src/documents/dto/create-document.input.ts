import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateDocumentInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    filename?: string | null;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    title?: string | null;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    summary?: string | null;

    @Field(() => String)
    @IsString()
    content!: string;
}