import {Injectable, OnApplicationShutdown, OnModuleInit} from "@nestjs/common";
import { Kafka, Message, Producer, ProducerRecord } from "kafkajs";
import { ProducerInterface } from "../producer.interface";
import { ConfigService } from "@nestjs/config";
import { KafkajsProducer } from "./kafkajs.producer";

@Injectable()
export class ProducerService implements OnApplicationShutdown {
    // private readonly kafka = new Kafka({
    //     brokers: ['localhost:9092'],
    // })
    // private readonly producer: Producer = this.kafka.producer();

    private readonly producers = new Map<string, ProducerInterface>()

    constructor(private readonly configService: ConfigService) {
    }

    async produce(topic: string, message: Message) {
        const producer = await this.getProducer(topic);
        await producer.produce(message);
    }

    private async getProducer(topic: string) {
        let producer = this.producers.get(topic);
        if (!producer) {
            producer = new KafkajsProducer(
              topic,
              this.configService.get('KAFKA_BROKER')
            );
            await producer.connect();
            this.producers.set(topic, producer);
        }
        return producer;
    }

    async onApplicationShutdown() {
        for (const producer of this.producers.values()) {
            await producer.disconnect();
        }
    }

}