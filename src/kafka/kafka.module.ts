import { Module } from '@nestjs/common';
import {ProducerService} from "./producer.service";
import {ConsumeService} from "./consume.service";

@Module({
    providers: [ProducerService, ConsumeService],
    exports: [ProducerService, ConsumeService]
})
export class KafkaModule {}
