import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDBType, BlogDocument } from '../db/schemes/blogs.schemes';
import { Model } from 'mongoose';
import { PostDBType, PostDocument } from '../db/schemes/posts.schemes';
import { UserDBType, UserDocument } from '../db/schemes/users.schemes';
import { CommentDBType, CommentDocument } from '../db/schemes/comments.schemes';
import {
  RefreshTokensMetaDBType,
  RefreshTokensMetaDocument,
} from '../db/schemes/token.schemes';

@Controller('testing')
export class DeleteAllData {
  constructor(
    @InjectModel(BlogDBType.name) private blogModel: Model<BlogDocument>,
    @InjectModel(PostDBType.name) private postModel: Model<PostDocument>,
    @InjectModel(UserDBType.name) private userModel: Model<UserDocument>,
    @InjectModel(CommentDBType.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(RefreshTokensMetaDBType.name)
    private refreshTokenMetaModel: Model<RefreshTokensMetaDocument>,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllData() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.refreshTokenMetaModel.deleteMany({});
    //await this.rateLimitModel.deleteMany({});
  }
}
