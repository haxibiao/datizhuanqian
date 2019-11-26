import { observable, action, runInAction } from 'mobx';
import { app } from '@src/store';
import { useApolloClient, GQL } from '@src/apollo';
import JPushModule from 'jpush-react-native';

export const enum ViewStatus {
    loadMore = 'loadMore',
    error = 'error',
    finished = 'finished',
}

interface User {
    id: number;
    name: string;
    avatar: string;
}

interface ChatUser {
    _id: number;
    name: string;
    avatar: string;
}

interface Message {
    message_id: number;
    message_content: string;
    user_id: number;
    user_name: string;
    user_avatar: string;
}

interface NewMessage {
    _id: number;
    user: ChatUser;
    createdAt?: string;
    [key: string]: any;
}

interface Props {
    me: User;
    friend: User;
}

// 聊天管理
class ChatStore {
    @observable public me: User;
    @observable public friend: User;
    @observable public chatId: number = 0;
    @observable public status: ViewStatus = ViewStatus.finished;
    @observable public messagesData: NewMessage[] = [];
    @observable public currentPage: number = 1;
    @observable public hasMorePages: boolean = false;
    @observable public messageId: number = 1;
    @observable public textMessage = '';

    public constructor(props: Props) {
        this.me = props.me;
        this.friend = props.friend;
    }

    @action.bound
    public createChatroom(userId: number) {
        app.client
            .mutate({
                mutation: GQL.RoomMutation,
                variables: {
                    id: userId,
                },
            })
            .then((result: any) => {
                const chatroom = result.data.Room;
                this.chatId = chatroom.id as number;
                this.listenChat(this.chatId);
                this.fetchMessages(this.chatId);
            })
            .catch((err: any) => {
                console.log('err', err);
            });
    }

    @action.bound
    public listenChat(chatId: number) {
        app.echo
            .join(`chat.${chatId}`)
            .here((users: User[]) => {
                console.log('echo join here users:', users);
            })
            .joining((user: User) => {
                console.log(user.name);
            })
            .leaving((user: User) => {
                console.log(user.name);
            })
            .listen('NewMessage', (message: Message) => {
                console.log('new message', message);
                if (message.user_id !== Number(this.me.id)) {
                    this.appendMessage(this.constructMessage(message));
                    this.sendLocalNotification(message, this.friend.name);
                }
            });
    }

    @action.bound
    public constructMessage(message: Message): NewMessage {
        return {
            _id: message.message_id,
            text: message.message_content,
            user: {
                _id: message.user_id,
                name: message.user_name,
                avatar: message.user_avatar,
            },
        };
    }

    @action.bound
    public constructNewMessage(message: string): NewMessage {
        return {
            _id: this.messageId++,
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
                mutation: GQL.sendMessageMutation,
                variables: {
                    user_id: this.me.id,
                    chat_id: this.chatId,
                    message: text,
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
    public fetchMessages(chatId: number) {
        this.status = ViewStatus.loadMore;
        app.client
            .query({
                query: GQL.messagesQuery,
                variables: {
                    chat_id: chatId,
                    page: this.currentPage,
                },
            })
            .then((data: any) => {
                this.status = ViewStatus.finished;
                console.log('Data', data);
            })
            .catch((err: any) => {
                this.status = ViewStatus.error;
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
            id: data.message_id,
            content: data.message_content,
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
