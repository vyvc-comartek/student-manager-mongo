import { Args, Query, Resolver } from '@nestjs/graphql';
import { Class } from './class.entity';
import { ClassesService } from './classes.service';
import { SearchClassDto } from './dto/search-class.dto';

@Resolver(() => Class)
export class ClassesResolver {
  constructor(private readonly classesService: ClassesService) {}

  @Query(() => [Class])
  async classes(@Args() searchClassDto: SearchClassDto) {
    return this.classesService.search(searchClassDto);
  }
}
