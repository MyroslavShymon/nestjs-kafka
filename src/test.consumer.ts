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
        await this.consumerService.consume({
            topic: {topic: 'test'},
            config: { groupId: 'test-consumer'},
            onMessage: async (message) => {
             console.log(`Value - ${message.value.toString()}`);
            }
        })
    }

}