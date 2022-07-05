import { MintEvent, Message, Transaction } from "../types";
import {
  CosmosEvent,
  CosmosBlock,
  CosmosMessage,
  CosmosTransaction,
} from "@subql/types-cosmos";

export async function handleBlock(block: CosmosBlock): Promise<void> {
  // If you wanted to index each block in Cosmos (CosmosHub), you could do that here
}

export async function handleTransaction(tx: CosmosTransaction): Promise<void> {
  const transactionRecord = Transaction.create({
    id: tx.hash,
    blockHeight: BigInt(tx.block.block.header.height),
    timestamp: tx.block.block.header.time,
  });
  await transactionRecord.save();
}

export async function handleMessage(msg: CosmosMessage): Promise<void> {
  const message = new Message(`${msg.tx.hash}-${msg.idx}`)
  message.blockHeight = BigInt(msg.block.block.header.height);
  message.txHash = msg.tx.hash;
  message.denomId = msg.msg.decodedMsg.denomId;
  message.name = msg.msg.decodedMsg.name;
  message.uri = msg.msg.decodedMsg.uri;
  message.sender = msg.msg.decodedMsg.sender;
  message.recipient = msg.msg.decodedMsg.recipient;

  await message.save();
}

export async function handleEvent(event: CosmosEvent): Promise<void> {
  const eventRecord = new MintEvent(`${event.tx.hash}-${event.msg.idx}-${event.idx}`,);
  eventRecord.blockHeight = BigInt(event.block.block.header.height);
  eventRecord.txHash = event.tx.hash;
  for(const attr of event.event.attributes) {
    switch(attr.key) {
      case "tokenId":
        eventRecord.tokenId = attr.value;
        break;
      case "denomId":
        eventRecord.denomId = attr.value;
        break;
      case "tokenUri":
        eventRecord.tokenUri = attr.value;
        break;
      case "recipient":
        eventRecord.recipient = attr.value;
        break;
      default:
        break;
    }
  }
  await eventRecord.save();
}