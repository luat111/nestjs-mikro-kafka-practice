import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private readonly consumers: Consumer[] = [];
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(KafkaService.name);
  }

  async onModuleInit() {
    this.kafka = this.createInstance();
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  createInstance(): Kafka {
    try {
      const instance = new Kafka({
        clientId: this.config.get<string>('kafka.clientId'),
        brokers: [this.config.get<string>('kafka.broker')],
        logCreator: this.customLogger(),
      });
      return instance;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  getInstance(): Kafka {
    if (!this.kafka) this.kafka = this.createInstance();
    return this.kafka;
  }

  async consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
  ): Promise<void> {
    try {
      if (!this.kafka) this.kafka = this.createInstance();
      const consumer = this.kafka.consumer({
        groupId: this.config.get<string>('kafka.groupId'),
      });
      await consumer.connect();
      await consumer.subscribe(topic);
      await consumer.run(config);
      this.consumers.push(consumer);
    } catch (err) {
      this.logger.error(err);
    }
  }

  customLogger() {
    return () =>
      ({ level, log }) => {
        this.logger.logKafka(level, JSON.stringify(log));
      };
  }
}
