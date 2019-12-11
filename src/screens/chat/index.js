import React, { useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Theme, PxFit, Tools, ISAndroid } from '@src/utils';
import { PageContainer } from '@src/components';
import { throttle } from '@src/common';
import { observer, app } from '@src/store';
import { GiftedChat, Bubble, Actions, Send, Composer, Accessory, InputToolbar } from 'react-native-gifted-chat';
import { useNavigation } from 'react-navigation-hooks';
import store from './store';

const index = observer(props => {
    const navigation = useNavigation();
    const { user, chat = {} } = navigation.state.params;
    const chatStore = useMemo(() => new store({ me: app.me, friend: user, chatId: chat.id }), []);

    const renderInputToolbar = useCallback(props => {
        return <InputToolbar {...props} containerStyle={chatStyle.inputToolbar} />;
    }, []);

    const renderComposer = useCallback(props => {
        return <Composer {...props} textInputStyle={chatStyle.composer} />;
    }, []);

    const renderBubble = useCallback(props => {
        return <Bubble {...props} wrapperStyle={chatStyle.bubbleWrapper} textStyle={chatStyle.bubbleText} />;
    }, []);

    const renderSend = useCallback(props => {
        return (
            <Send
                {...props}
                onSend={throttle(chatStore.sendMessage)}
                containerStyle={[chatStyle.sendButton, !chatStore.textMessage && chatStyle.disabledButton]}
                alwaysShowSend
                disabled={!chatStore.textMessage}>
                <Text style={{ color: '#fff', fontSize: PxFit(14) }}>发送</Text>
            </Send>
        );
    }, []);

    const renderLoadEarlier = useCallback(() => {
        return (
            <View style={styles.loadEarlier}>
                {chatStore.status === 'loadMore' && <ActivityIndicator size="small" color="rgba(255, 87, 51 ,0.6)" />}
                {chatStore.status === 'loaded' && (
                    <TouchableOpacity style={styles.touchView} onPress={throttle(chatStore.fetchMessages)}>
                        <Text style={styles.loadMoreText}>点击加载更多</Text>
                    </TouchableOpacity>
                )}
                {chatStore.status === 'finished' && (
                    <View>
                        <Text style={styles.createdAt}>{chatStore.startTime}</Text>
                    </View>
                )}
            </View>
        );
    }, [chatStore.status]);

    useEffect(() => {
        return () => {
            chatStore.leaveChatRoom();
        };
    }, []);

    return (
        <PageContainer
            white
            title={user.name}
            autoKeyboardInsets={ISAndroid}
            topInsets={ISAndroid ? 0 : -Theme.statusBarHeight}>
            <View style={styles.container}>
                <GiftedChat
                    renderAvatarOnTop={true}
                    showUserAvatar={true}
                    isAnimated={true}
                    showAvatarForEveryMessage={true}
                    placeholder={'发私信...'}
                    onInputTextChanged={chatStore.changText}
                    text={chatStore.textMessage}
                    renderInputToolbar={renderInputToolbar}
                    renderComposer={renderComposer}
                    renderSend={renderSend}
                    renderBubble={renderBubble}
                    messages={chatStore.messagesData.slice()}
                    onPressAvatar={user => {
                        user = { ...user, ...{ id: user._id } };
                        navigation.navigate('User', { user });
                    }}
                    user={{
                        _id: app.me.id,
                        name: app.me.name,
                        avatar: app.me.avatar,
                    }}
                    loadEarlier={true}
                    isLoadingEarlier={true}
                    renderLoadEarlier={renderLoadEarlier}
                />
            </View>
        </PageContainer>
    );
});

var chatStyle = {
    inputToolbar: {
        paddingVertical: PxFit(8),
        borderTopWidth: 0,
        backgroundColor: '#F0F3F4',
    },
    actions: {
        marginTop: 0,
        marginLeft: 0,
        marginBottom: PxFit(4),
        width: PxFit(32),
        height: PxFit(32),
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapperStyle: {
        borderWidth: 0,
        borderRadius: 0,
    },
    composer: {
        marginBottom: 0,
        marginRight: PxFit(15),
        marginLeft: PxFit(15),
        padding: 0,
        paddingTop: 0,
        paddingBottom: 0,
        alignItems: 'center',
        borderRadius: PxFit(8),
        backgroundColor: '#fff',
        paddingHorizontal: PxFit(10),
    },
    sendButton: {
        marginBottom: 5,
        marginRight: PxFit(15),
        width: PxFit(60),
        height: PxFit(30),
        borderRadius: PxFit(8),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1CACF9',
    },
    disabledButton: { opacity: 0.5 },
    bubbleWrapper: {
        left: {
            marginBottom: PxFit(15),
            marginLeft: PxFit(3),
            backgroundColor: '#eee',
            borderWidth: PxFit(2),
            borderColor: '#fff',
            overflow: 'hidden',
        },
        right: {
            marginBottom: PxFit(15),
            marginRight: PxFit(3),
            backgroundColor: '#b7e8ff',
            borderWidth: PxFit(2),
            borderColor: '#fff',
            overflow: 'hidden',
        },
    },
    bubbleText: {
        left: {
            padding: PxFit(5),
            color: '#515151',
        },
        right: {
            padding: PxFit(5),
            color: '#515151',
        },
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    loadEarlier: {
        marginVertical: PxFit(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchView: {
        width: PxFit(100),
        height: PxFit(30),
        borderRadius: PxFit(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 87, 51 ,0.6)',
    },
    loadMoreText: {
        fontSize: PxFit(11),
        color: '#fff',
    },
    createdAt: {
        fontSize: PxFit(11),
        color: Theme.subTextColor,
    },
    darkText: {
        fontSize: PxFit(14),
        color: Theme.defaultTextColor,
    },
    tintText: {
        fontSize: PxFit(14),
        color: Theme.subTextColor,
    },
});

export default index;
