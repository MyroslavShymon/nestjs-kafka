import { IConsumer } from "./consumer.interface";
import { Consumer, ConsumerConfig, ConsumerSubscribeTopic, Kafka, KafkaMessage } from "kafkajs";
import { Logger } from "@nestjs/common";
import { sleep } from "../sleep";
import * as retry from 'async-retry'

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger

  constructor(
    private readonly topic: ConsumerSubscribeTopic,
    config: ConsumerConfig,
    broker: string
  ) {
    this.kafka = new Kafka({ brokers: [broker]});
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topic}-${config.groupId}`);
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
    } catch (e) {
      this.logger.error('Failed to connect to Kafka.', e);
      await sleep(5000);
      await this.connect();
    }
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>): Promise<void> {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({message, partition}) => {
        this.logger.debug(`Processing message partition: ${partition}`)
        try {
          await retry(
            async () => onMessage(message),
            {
              retries: 3,
              onRetry: (error, attempt) =>
                this.logger.error(`Error consuming retry ${attempt}/3`, error)
            })
        } catch (e) {
          this.logger.error(`Error consuming message. Adding to DLQ...`, e);
          await this.addMessageToDLQ(message);
        }
      }
    })
  }

  private async addMessageToDLQ(message: KafkaMessage) {
    console.log(`Adding...`)
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}