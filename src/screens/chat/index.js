import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Theme, PxFit, Tools, ISAndroid } from '@src/utils';
import { PageContainer } from '@src/components';
import { observer, app } from '@src/store';
import { GiftedChat, Bubble, Actions, Send, Composer, Accessory, InputToolbar } from 'react-native-gifted-chat';
import { useNavigation } from 'react-navigation-hooks';
import store from './store';

const index = observer(props => {
    const navigation = useNavigation();
    const { user, chat } = navigation.state.params;
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
                onSend={chatStore.sendMessage}
                containerStyle={chatStyle.sendButton}
                alwaysShowSend
                // disabled={disabled}
            >
                <Text style={{ color: '#fff', fontSize: PxFit(14) }}>发送</Text>
            </Send>
        );
    }, []);

    return (
        <PageContainer
            white
            title={user.name}
            // autoKeyboardInsets={ISAndroid}
            topInsets={ISAndroid ? 0 : -Theme.statusBarHeight}>
            <View style={{ flex: 1, backgroundColor: '#F6F7F9' }}>
                <GiftedChat
                    renderAvatarOnTop={true}
                    showUserAvatar={true}
                    // loadEarlier={true}
                    isAnimated={true}
                    showAvatarForEveryMessage={true}
                    placeholder={'写私信...'}
                    onInputTextChanged={chatStore.changText}
                    text={chatStore.textMessage}
                    renderInputToolbar={renderInputToolbar}
                    renderComposer={renderComposer}
                    renderSend={renderSend}
                    renderBubble={renderBubble}
                    messages={chatStore.messagesData.slice()}
                    isLoadingEarlier={true}
                    onPressAvatar={user => {
                        user = { ...user, ...{ id: user._id } };
                        navigation.navigate('User', { user });
                    }}
                    user={{
                        _id: app.me.id,
                        name: app.me.name,
                        avatar: app.me.avatar,
                    }}
                />
            </View>
        </PageContainer>
    );
});

var chatStyle = {
    inputToolbar: {
        paddingVertical: PxFit(8),
        borderTopWidth: 0,
        backgroundColor: '#F1EFFA',
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
        borderRadius: PxFit(6),
        backgroundColor: '#fff',
        paddingHorizontal: PxFit(10),
    },
    sendButton: {
        marginBottom: 5,
        marginRight: PxFit(15),
        width: 60,
        height: 31,
        borderRadius: PxFit(6),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.theme,
    },
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
        backgroundColor: '#fff',
    },
    loadEarlier: {
        marginVertical: PxFit(20),
        flexDirection: 'row',
        justifyContent: 'center',
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

// const chatStyle = {
//     inputToolbar: {
//         paddingVertical: PxFit(5),
//         borderTopWidth: 0,
//         backgroundColor: '#fff',
//     },
//     actions: {
//         marginTop: 0,
//         marginLeft: 0,
//         marginBottom: PxFit(4),
//         width: PxFit(32),
//         height: PxFit(32),
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     wrapperStyle: {
//         borderWidth: 0,
//         borderRadius: 0,
//     },
//     composer: {
//         marginBottom: 0,
//         marginRight: PxFit(15),
//         marginLeft: PxFit(15),
//         padding: 0,
//         paddingTop: 0,
//         paddingBottom: 0,
//         alignItems: 'center',
//         borderRadius: PxFit(6),
//         backgroundColor: '#fff',
//         paddingHorizontal: PxFit(10),
//     },
//     sendButton: {
//         marginBottom: 5,
//         marginRight: PxFit(15),
//         width: 60,
//         height: 31,
//         borderRadius: PxFit(6),
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: Theme.theme,
//     },
//     bubbleWrapper: {
//         left: {
//             marginBottom: PxFit(15),
//             marginLeft: PxFit(3),
//             backgroundColor: '#eee',
//             borderWidth: PxFit(2),
//             borderColor: '#fff',
//             overflow: 'hidden',
//         },
//         right: {
//             marginBottom: PxFit(15),
//             marginRight: PxFit(3),
//             backgroundColor: '#b7e8ff',
//             borderWidth: PxFit(2),
//             borderColor: '#fff',
//             overflow: 'hidden',
//         },
//     },
//     bubbleText: {
//         left: {
//             padding: PxFit(5),
//             color: '#515151',
//         },
//         right: {
//             padding: PxFit(5),
//             color: '#515151',
//         },
//     },
// };

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#fff',
//         flex: 1,
//     },
//     darkText: {
//         color: Theme.defaultTextColor,
//         fontSize: PxFit(14),
//     },
//     loadEarlier: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginVertical: PxFit(20),
//     },
//     tintText: {
//         color: Theme.subTextColor,
//         fontSize: PxFit(14),
//     },
// });

export default index;
