import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDBType, BlogDocument } from '../../db/schemes/blogs.schemes';
import { Model } from 'mongoose';
import { BlogsViewModel } from './models/output/BlogsViewModel';
import { ObjectId } from 'mongodb';
import { UpdateBlogModel } from './models/input/UpdateBlogModule';
import { PostDBType, PostDocument } from '../../db/schemes/posts.schemes';
import { CreateBlogReposModel } from './models/input/CreateBlogModel';
import { CreatePostBlogRepoModel } from './models/input/CreatePostByBlogModel';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(BlogDBType.name) private blogModel: Model<BlogDocument>,
    @InjectModel(PostDBType.name) private postModel: Model<PostDocument>,
  ) {}
  async createPostBlog(createData: CreatePostBlogRepoModel) {
    const createPostBlog = await this.postModel.create(createData);

    return createPostBlog.save();
  }
  async getBlog(id: string): Promise<BlogDBType | null> {
    const blog = await this.blogModel.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return blog;
  }
  async createBlog(
    createBlogDto: CreateBlogReposModel,
  ): Promise<BlogsViewModel> {
    const createdBlog = new this.blogModel(createBlogDto);
    return createdBlog.save();
  }
  async updateBlog(
    id: string,
    updateBlogDto: UpdateBlogModel,
  ): Promise<boolean> {
    const foundBlog = await this.blogModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: updateBlogDto.name,
          description: updateBlogDto.description,
          websiteUrl: updateBlogDto.websiteUrl,
        },
      },
    );

    return !!foundBlog.matchedCount;
  }
  async deleteBlog(id: string): Promise<boolean> {
    const foundBlog = await this.blogModel.deleteOne({ _id: new ObjectId(id) });

    return !!foundBlog.deletedCount;
  }
}