import { ConsumerConfig, ConsumerSubscribeTopic, KafkaMessage } from "kafkajs";

export interface KafkajsConsumerOptionsInterface {
  topic: ConsumerSubscribeTopic;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>
}