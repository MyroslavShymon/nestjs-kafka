import {Injectable, OnApplicationShutdown} from "@nestjs/common";
import {Consumer, ConsumerRunConfig, ConsumerSubscribeTopic, Kafka} from "kafkajs";
import { IConsumer } from "./consumer.interface";
import { KafkajsConsumerOptionsInterface } from "./kafkajs-consumer-options.interface";
import { KafkajsConsumer } from "./kafkajs.consumer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ConsumeService implements OnApplicationShutdown {
    private readonly consumers: IConsumer[] = [];

    constructor(private readonly configService: ConfigService) {
    }

    async consume({topic, config, onMessage}: KafkajsConsumerOptionsInterface) {
        const consumer = new KafkajsConsumer(
          topic,
          config,
          this.configService.get('KAFKA_BROKER')
        )
        await consumer.connect();
        await consumer.consume(onMessage);
        this.consumers.push(consumer);
    }

    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect()
        }
    }
}