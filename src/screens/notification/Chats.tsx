import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeText, Row, Badge, Avatar, StatusView } from '@src/components';
import { syncGetter, exceptionCapture } from '@src/common';
import { Query, useQuery, GQL } from '@src/apollo';
import { Theme, PxFit, Tools } from '@src/utils';
import { app } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';

const Chat = ({ chat }) => {
    const navigation = useNavigation();
    const user = chat.users.filter((item, index) => {
        return item.id !== app.me.id;
    })[0];
    return (
        <TouchableOpacity style={styles.notifyItem} onPress={() => navigation.navigate('Chat', { chat, user })}>
            <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('User', { user })}>
                <Avatar source={syncGetter('avatar', user)} size={PxFit(50)} />
            </TouchableOpacity>
            <View style={styles.itemContent}>
                <Row style={styles.itemContentTop}>
                    <SafeText style={styles.itemName}>{syncGetter('name', user)}</SafeText>
                    <SafeText style={styles.timeAgo}>{syncGetter('last_message.created_at', chat)}</SafeText>
                </Row>
                <Row style={styles.itemContentBottom}>
                    <SafeText style={styles.lastMessage} numberOfLines={1}>
                        {syncGetter('last_message.body.text', chat)}
                    </SafeText>
                    <Badge
                        count={chat.unreads_count}
                        style={{ minWidth: PxFit(16), height: PxFit(16) }}
                        countStyle={{ fontSize: PxFit(10) }}
                    />
                </Row>
            </View>
        </TouchableOpacity>
    );
};

const Chats = props => {
    const [chats, setChats] = useState([]);
    const init = useRef(true);
    const offset = useRef(0);
    const flag = useRef(false);
    const [loadingState, setLoadingState] = useState(false);
    const { data: chatsData, refetch, fetchMore, loading, error } = useQuery(GQL.ChatsQuery, {
        variables: { limit: 10, offset: offset.current },
        fetchPolicy: 'network-only',
    });
    console.log('====================================');
    console.log('chatsData', chatsData, error);
    console.log('====================================');
    useEffect(() => {
        setLoadingState(loading);
    }, [loading]);

    useEffect(() => {
        const newChats = syncGetter('chats', chatsData);
        if (init.current && Array.isArray(newChats)) {
            init.current = false;
            setChats(newChats);
        }
    }, [chatsData]);

    const onEndReached = useCallback(async () => {
        if (flag.current) {
            return;
        }
        setLoadingState(true);
        flag.current = true;
        const [err, res] = await exceptionCapture(() => {
            return fetchMore({
                variables: {
                    offset: chats.length,
                },
            });
        });
        if (Array.isArray(syncGetter('chats', res))) {
            setChats(chats => {
                offset.current += res.chats.length;
                return chats.concat(res.chats);
            });
            if (res.chats.length > 0) {
                flag.current = true;
            }
        }
        setLoadingState(false);
    }, []);

    return (
        <FlatList
            data={chats}
            onEndReached={onEndReached}
            renderItem={({ item }) => {
                return <Chat chat={item} />;
            }}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={() => <StatusView.EmptyView />}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            onEndReachedThreshold={0.2}
        />
    );
};

// if (true) {
//     fetchMore({
//         variables: {
//             offset: chats.length,
//         },
//         updateQuery: (prev, { fetchMoreResult }) => {
//             const newChats = syncGetter('chats', fetchMoreResult);
//             if (Array.isArray(newChats) && newChats.length > 0) {
//                 return Object.assign({}, prev, {
//                     data: [...prev.chats, ...newChats],
//                 });
//             } else {
//             }
//         },
//     });
// }

const styles = StyleSheet.create({
    avatar: {
        margin: PxFit(15),
    },
    contentContainerStyle: {
        flexGrow: 1,
    },
    itemContent: {
        flex: 1,
        paddingVertical: PxFit(15),
        paddingRight: PxFit(15),
        justifyContent: 'center',
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.borderColor,
    },
    itemContentBottom: {
        height: PxFit(20),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContentTop: {
        height: PxFit(20),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
    },
    lastMessage: {
        color: Theme.subTextColor,
        fontSize: PxFit(12),
        marginTop: PxFit(4),
        paddingRight: PxFit(20),
    },
    notifyItem: {
        height: PxFit(80),
        backgroundColor: '#fff',
        flexDirection: 'row',
    },
    timeAgo: {
        color: Theme.subTextColor,
        fontSize: PxFit(12),
    },
});

export default Chats;
