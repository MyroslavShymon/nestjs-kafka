import { Injectable } from '@nestjs/common';
import {ProducerService} from "./kafka/producer.service";

@Injectable()
export class AppService {
  constructor(
      private readonly producerService: ProducerService
  ) {
  }

  async getHello(): Promise<string> {
    await this.producerService.produce('test', {value: 'Hello Hello world'});
    return 'Hello Hello world';
  }
}
