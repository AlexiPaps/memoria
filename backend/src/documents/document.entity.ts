import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';

@ObjectType()
export class Document {
    @Field(() => Int)
    id!: number;

    @Field(() => String, { nullable: true })
    filename!: string | null;

    @Field(() => String, { nullable: true })
    title!: string | null;

    @Field(() => String, { nullable: true })
    summary!: string | null;

    @Field(() => String)
    content!: string;

    @Field(() => Date)
    createdAt!: Date | null;

    @Field(() => Date)
    updatedAt!: Date | null;

    @HideField()
    embedding?: number[] | null;
}