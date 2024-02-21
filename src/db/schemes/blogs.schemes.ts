import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type BlogDocument = HydratedDocument<BlogDBType>;

@Schema()
export class BlogDBType {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  websiteUrl: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(BlogDBType);
