import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.servis';
import { QueryBlogsModel } from './models/input/QueryBlogsModules';
import { BlogsQueryRepository } from './blogs.query.repository';
import { CreateBlogModel } from './models/input/CreateBlogModel';
import { CreatePostBlogModel } from './models/input/CreatePostByBlogModel';
import { AuthGuard } from '../../auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get()
  async getBlogs(@Query() query: QueryBlogsModel) {
    const blog = await this.blogsQueryRepository.findBlogs(query);
    if (!blog) {
      // Возвращаем HTTP статус 404 и сообщение
      throw new NotFoundException('Post not found');
    }
    return blog;
  }
  @Get(':id/posts')
  async getPostsByBlog(
    @Query() query: QueryBlogsModel,
    @Param('id') blogId: string,
  ) {
    const foundBlog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!foundBlog) {
      // Возвращаем HTTP статус 404 и сообщение
      throw new NotFoundException('Post not found');
    }
    return await this.blogsQueryRepository.getPostsByBlogId(query, blogId);
  }
  @Get(':id')
  async getBlog(@Param('id') blogId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      // Возвращаем HTTP статус 404 и сообщение
      throw new NotFoundException('Post not found');
    }
    return blog;
  }
  @Post()
  async createBlog(@Body() inputModel: CreateBlogModel) {
    const newBlog = await this.blogsService.createBlog(inputModel);

    return newBlog;
  }
  @Post(':id/posts')
  async createPostByBlog(
    @Body() createDTO: CreatePostBlogModel,
    @Param('id') blogId: string,
  ) {
    const newPostId = await this.blogsService.createPostBlog(blogId, createDTO);

    if (newPostId === null) {
      // Возвращаем HTTP статус 404 и сообщение
      throw new NotFoundException('Post not found');
    }
    return newPostId;
  }
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Body() inputModel: CreateBlogModel,
    @Param('id') blogId: string,
  ) {
    const updateBlog = await this.blogsService.updateBlog(blogId, inputModel);
    if (updateBlog === false) {
      // Возвращаем HTTP статус 404 и сообщение
      throw new NotFoundException('Post not found');
    }
    return updateBlog;
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') blogId: string) {
    const deleteBlog = await this.blogsService.deleteBlogById(blogId);
    if (deleteBlog === false) {
      // Возвращаем HTTP статус 404 и сообщение
      throw new NotFoundException('Post not found');
    }
    return deleteBlog;
  }
}
