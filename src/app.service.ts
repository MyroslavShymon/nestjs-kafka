import { Injectable } from '@nestjs/common';
import {ProducerService} from "./kafka/producer.service";

@Injectable()
export class AppService {
  constructor(
      private readonly producerService: ProducerService
  ) {
  }

  async getHello(): Promise<string> {
    await this.producerService.produce({
      topic: 'test',
      messages: [{
        value: 'Hello world!'
      }]
    })
    return 'Hello World!';
  }
}
