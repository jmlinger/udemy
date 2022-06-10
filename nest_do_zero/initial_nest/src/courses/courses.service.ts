import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  list() {
    return this.courseRepository.find();
  }

  async getById(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id: +id },
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found.`);
    }

    return course;
  }

  create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);

    return this.courseRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.preload({
      id: +id, // + transforma para numerico
      ...updateCourseDto,
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found.`);
    }

    return this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id: +id },
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found.`);
    }

    return this.courseRepository.remove(course);
  }
}
