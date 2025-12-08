import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Document } from './document.entity';

@ObjectType()
export class DocumentSearchResult {
    @Field(() => Document)
    document!: Document;

    @Field(() => Float)
    score!: number;
}