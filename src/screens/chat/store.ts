import { observable, action, runInAction } from 'mobx';
import { app } from '@src/store';
import { GQL } from '@src/apollo';
import { syncGetter } from '@src/common';
import JPushModule from 'jpush-react-native';

export type ViewStatus = 'init' | 'loadMore' | 'error' | 'loaded' | 'finished';

interface User {
    id: number;
    name: string;
    avatar: string;
}

interface ChatUser {
    _id: number | string;
    name: string;
    avatar: string;
}

interface Message {
    id: number;
    user: User;
    body: {
        text: string;
    };
    created_at: string;
}

interface NewMessage {
    _id: number | string;
    user: ChatUser;
    createdAt?: string;
    [key: string]: any;
}

interface Props {
    me: User;
    friend: User;
    chatId?: number;
}

// 聊天管理
class ChatStore {
    @observable public me: User;
    @observable public friend: User;
    @observable public chatId: number = 0;
    @observable public status: ViewStatus = 'init';
    @observable public messagesData: NewMessage[] = [];
    @observable public newMessageOffset: number = 0;
    @observable public hasMoreMessage: boolean = false;
    @observable public messageId: number = 1;
    @observable public textMessage = '';

    public constructor(props: Props) {
        this.me = props.me;
        this.friend = props.friend;
        if (props.chatId) {
            this.chatId = props.chatId;
            this.fetchMessages();
            this.listenChat();
        }
    }

    @action.bound
    public createChatroom(userId: number) {
        app.client
            .mutate({
                mutation: GQL.CreateChatMutation,
                variables: {
                    id: [this.me.id, userId],
                },
            })
            .then((result: any) => {
                const chatroom = result.data.Room;
                this.chatId = chatroom.id as number;
                this.fetchMessages();
                this.listenChat();
            })
            .catch((err: any) => {
                console.log('err', err);
            });
    }

    @action.bound
    public listenChat() {
        app.echo.private(`App.Chat.${this.chatId}`).listen('NewMessage', (message: Message) => {
            console.log('new message', message);
            this.appendMessage(this.constructMessage(message));
            this.sendLocalNotification(message, this.friend.name);
        });
    }

    @action.bound
    public constructMessage(message: Message): NewMessage {
        return {
            _id: message.id,
            text: message.body.text,
            user: {
                _id: message.user.id,
                name: message.user.name,
                avatar: message.user.avatar,
            },
        };
    }

    @action.bound
    public constructNewMessage(message: string): NewMessage {
        ++this.messageId;
        return {
            _id: '_id' + this.messageId,
            text: message,
            user: {
                _id: this.me.id,
                name: this.me.name,
                avatar: this.me.avatar,
            },
        };
    }

    @action.bound
    public sendMessage() {
        const text = this.textMessage;
        const incomingMessage = this.constructNewMessage(text);
        this.appendMessage(incomingMessage);
        this.textMessage = '';
        app.client
            .mutate({
                mutation: GQL.CreateMessageMutation,
                variables: {
                    chat_id: this.chatId,
                    body: {
                        text,
                    },
                },
            })
            .then((data: any) => {
                console.log('Data', data);
            })
            .catch((err: any) => {
                console.log('err', err);
            });
    }

    @action.bound
    public fetchMessages() {
        if (this.status === 'loadMore') {
            return;
        }
        this.status = 'loadMore';
        app.client
            .query({
                query: GQL.MessagesQuery,
                variables: {
                    chat_id: this.chatId,
                    limit: 10,
                    offset: this.newMessageOffset,
                },
                fetchPolicy: 'network-only',
            })
            .then((data: any) => {
                const messages: Message[] = syncGetter('data.messages', data) || [];
                console.log('====================================');
                console.log('messages', this.newMessageOffset, messages);
                console.log('====================================');
                this.newMessageOffset += messages.length;
                messages.forEach((message: Message) => {
                    const incomingMessage = {
                        _id: message.id,
                        text: message.body.text,
                        // createdAt: message.created_at,
                        user: {
                            _id: message.user.id,
                            name: message.user.name,
                            avatar: message.user.avatar,
                        },
                    };
                    this.prependMessage(incomingMessage);
                });
                if (messages.length >= 10) {
                    this.hasMoreMessage = true;
                } else {
                    this.status = 'finished';
                }
                this.status = 'loaded';
            })
            .catch((err: any) => {
                this.status = 'error';
                console.log('err', err);
            });
    }

    @action.bound
    public prependMessage(message: NewMessage) {
        this.messagesData.push(message);
    }

    @action.bound
    public appendMessage(message: NewMessage) {
        this.messagesData.unshift(message);
    }

    @action.bound
    public sendLocalNotification = (data: Message, title: string) => {
        const currentDate = new Date();
        JPushModule.sendLocalNotification({
            buildId: 1,
            id: data.id,
            content: data.body.text,
            extra: {},
            fireTime: currentDate.getTime() + 3000,
            title,
        });
    };

    @action.bound
    public changText(text: string) {
        this.textMessage = text;
    }
}

export default ChatStore;
