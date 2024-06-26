export interface MessageContent {
  message: string
  senderId:string
  receiverId:string
}

export interface MessageSender {
  sendMessage(content: MessageContent): void
}

export interface UserDetails {
  user_id?: string
}
