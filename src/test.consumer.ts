import {Injectable, OnModuleInit} from "@nestjs/common";
import {ConsumeService} from "./kafka/consume.service";

@Injectable()
export class TestConsumer implements OnModuleInit{
    constructor(
        private readonly consumerService: ConsumeService
    ) {
    }

    async onModuleInit() {
        console.log("onModuleInit")
        await this.consumerService.consume({topic: 'test'}, {
            eachMessage: async ({message, topic,partition}) => {
                console.log("consume")
                console.log({
                    value: message.value.toString(),
                    topic: topic.toString(),
                    partition: partition.toString(),
                })
            }
        })
    }

}