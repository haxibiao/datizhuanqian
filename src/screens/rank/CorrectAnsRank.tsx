import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, Image, Text, Dimensions } from 'react-native';
import { GQL, useApolloClient } from 'apollo';
import { app } from 'store';
import { Avatar, ListFooter, StatusView, TouchFeedback } from '../../components';
import { useNavigation } from 'react-navigation-hooks';

const { width } = Dimensions.get('window');

interface Props {
    index: number;
}

export default function CorrectAnsRank() {
    const [d, setD] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meLoading, setMeLoading] = useState(true);
    const [error, setError] = useState(false);
    const [merank, setMeRank] = useState();
    const [, setMeError] = useState(false);
    const client = useApolloClient();
    const navigation = useNavigation();

    console.log('前三 app.me : ', { ...app.me });
    var me = { ...app.me };

    useEffect(() => {
        //查询排行列表
        client
            .query({
                query: GQL.userCorrectRank,
                fetchPolicy: 'network-only',
            })
            .then((v: any) => {
                let { data, loading } = v;
                // console.log("data : ",data," loading : ",loading);
                if (!loading) {
                    setLoading(false);
                    console.log(data.users);
                    setD(data.users);
                }
            })
            .catch((error: any) => {
                console.log('用户总提现排名接口返回错误 ，错误信息 : ', error);
                setError(true);
            });

        if (me.id) {
            //查询自己排名
            client
                .query({
                    query: GQL.meRank,
                    fetchPolicy: 'network-only',
                })
                .then((v: any) => {
                    let { data, loading } = v;
                    if (!loading) {
                        setMeLoading(false);
                        setMeRank(data.user);
                        console.log('前三 ', data.user);
                    }
                })
                .catch((error: any) => {
                    console.log('个人排名接口返回错误 ，错误信息 : ', error);
                    setMeError(true);
                });
        }
    }, []);

    // 渲染自己以及前三名 item

    const memoizedRenderTop = useCallback(() => {
        function _renderTopThree() {
            let len = d.length;
            var data: any[];
            if (len >= 3) {
                data = d.slice(0, 3);
            } else {
                data = d.slice(0, len);
            }
            return (
                <View style={styles.topThree}>
                    {data.map((item, index) => {
                        console.log('前三 index : ', item, index);
                        if (len >= 3) {
                            switch (index) {
                                case 0:
                                    //返回第二名的item
                                    return (
                                        <TouchFeedback
                                            style={styles.topItem}
                                            onPress={() =>
                                                navigation.navigate('User', {
                                                    user: data[1],
                                                })
                                            }>
                                            <View style={{ width: 50, height: 50 }}>
                                                <Image
                                                    source={require('../../assets/images/topsecond.png')}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                    }}
                                                    resizeMode={'contain'}
                                                />
                                                <Avatar
                                                    source={data[1].avatar}
                                                    userId={data[1].id}
                                                    size={30}
                                                    style={{
                                                        position: 'absolute',
                                                        zIndex: -9,
                                                        top: 8,
                                                        left: 10,
                                                    }}
                                                />
                                            </View>
                                            <Text style={styles.topThreeTitle}>{data[1].name}</Text>
                                            <Text style={styles.topThreeNumber}>{data[1].correct_count}题</Text>
                                        </TouchFeedback>
                                    );
                                    break;
                                case 1:
                                    //返回第一名的item
                                    return (
                                        <TouchFeedback
                                            style={styles.topItem}
                                            onPress={() =>
                                                navigation.navigate('User', {
                                                    user: data[0],
                                                })
                                            }>
                                            <View style={{ width: 66, height: 66 }}>
                                                <Image
                                                    source={require('../../assets/images/topfirst.png')}
                                                    style={{
                                                        width: 66,
                                                        height: 66,
                                                    }}
                                                    resizeMode={'contain'}
                                                />
                                                <Avatar
                                                    source={data[0].avatar}
                                                    userId={data[0].id}
                                                    size={44}
                                                    style={{
                                                        position: 'absolute',
                                                        zIndex: -9,
                                                        top: 10.8,
                                                        left: 11,
                                                    }}
                                                />
                                            </View>
                                            <Text style={styles.topThreeTitle}>{data[0].name}</Text>
                                            <Text style={styles.topThreeNumber}>{data[0].correct_count}题</Text>
                                        </TouchFeedback>
                                    );
                                    break;
                                case 2:
                                    //返回第三名的item
                                    return (
                                        <TouchFeedback
                                            style={styles.topItem}
                                            onPress={() =>
                                                navigation.navigate('User', {
                                                    user: data[2],
                                                })
                                            }>
                                            <View style={{ width: 50, height: 50 }}>
                                                <Image
                                                    source={require('../../assets/images/topthird.png')}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                    }}
                                                    resizeMode={'contain'}
                                                />
                                                <Avatar
                                                    source={data[2].avatar}
                                                    userId={data[2].id}
                                                    size={30}
                                                    style={{
                                                        position: 'absolute',
                                                        zIndex: -9,
                                                        top: 8,
                                                        left: 10,
                                                    }}
                                                />
                                            </View>
                                            <Text style={styles.topThreeTitle}>{data[2].name}</Text>
                                            <Text style={styles.topThreeNumber}>{data[2].correct_count}题</Text>
                                        </TouchFeedback>
                                    );
                                    break;
                            }
                        } else {
                            return index == 1 ? (
                                <TouchFeedback
                                    style={styles.topItem}
                                    onPress={() =>
                                        navigation.navigate('User', {
                                            user: data[0],
                                        })
                                    }>
                                    <View style={{ width: 50, height: 50 }}>
                                        <Image
                                            source={require('../../assets/images/topfirst.png')}
                                            style={{ width: 50, height: 50 }}
                                            resizeMode={'contain'}
                                        />
                                        <Avatar
                                            source={data[0].avatar}
                                            userId={data[0].id}
                                            size={44}
                                            style={{
                                                position: 'absolute',
                                                zIndex: -9,
                                                top: 10.8,
                                                left: 11,
                                            }}
                                        />
                                    </View>
                                    <Text style={styles.topThreeTitle}>{data[0].name}</Text>
                                    <Text style={styles.topThreeNumber}>{data[0].correct_count}题</Text>
                                </TouchFeedback>
                            ) : (
                                <TouchFeedback
                                    style={styles.topItem}
                                    onPress={() =>
                                        navigation.navigate('User', {
                                            user: data[0],
                                        })
                                    }>
                                    <View style={{ width: 50, height: 50 }}>
                                        <Image
                                            source={require('../../assets/images/topsecond.png')}
                                            style={{ width: 50, height: 50 }}
                                            resizeMode={'contain'}
                                        />
                                        <Avatar
                                            source={data[0].avatar}
                                            userId={data[0].id}
                                            size={44}
                                            style={{
                                                position: 'absolute',
                                                zIndex: -9,
                                                top: 10.8,
                                                left: 11,
                                            }}
                                        />
                                    </View>
                                    <Text style={styles.topThreeTitle}>{data[1].name}</Text>
                                    <Text style={styles.topThreeNumber}>{data[1].correct_count}题</Text>
                                </TouchFeedback>
                            );
                        }
                    })}
                </View>
            );
        }
        return loading && meLoading ? (
            <View />
        ) : (
            <View style={styles.top}>
                {merank && me.id ? (
                    <View style={styles.me}>
                        <View style={styles.left}>
                            <Avatar source={merank.avatar} userId={merank.id} size={45} style={{ marginStart: 8 }} />
                            <Text style={styles.meTitle}>{merank.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.rightTextTop}>
                                {merank.rank == -1 ? '未上榜' : '第 ' + merank.rank + ' 名'}
                            </Text>
                            <Text style={styles.rightTextBottom}>{merank.correct_count}题</Text>
                        </View>
                    </View>
                ) : (
                    <View />
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                    {_renderTopThree()}
                </View>
            </View>
        );
    }, [d]);

    // 渲染排行列表 函数
    function _renderItem(index: number, item: any) {
        function _renderBadge(index: number) {
            let s = 24;
            switch (index) {
                case 0:
                    return (
                        <Image
                            source={require('../../assets/images/qzone.png')}
                            style={{ width: s, height: s }}
                            resizeMode={'contain'}
                        />
                    );
                case 1:
                    return (
                        <Image
                            source={require('../../assets/images/qzone.png')}
                            style={{ width: s, height: s }}
                            resizeMode={'contain'}
                        />
                    );
                case 2:
                    return (
                        <Image
                            source={require('../../assets/images/qzone.png')}
                            style={{ width: s, height: s }}
                            resizeMode={'contain'}
                        />
                    );
                default:
                    return <Text style={styles.badgeNumber}>{++index}</Text>;
            }
        }
        console.log('拿到的item为 : ', item);
        if (error) {
            return <StatusView.ErrorView onPress={() => {}} />;
        } else if (d.length > 0) {
            if (d.length > 3 && index >= 3) {
                console.log('数组长度大于3 返回列表', d.length);
                return (
                    <View style={styles.item}>
                        <TouchFeedback
                            style={styles.left}
                            onPress={() =>
                                navigation.navigate('User', {
                                    user: item,
                                })
                            }>
                            {_renderBadge(index)}
                            <Avatar source={item.avatar} userId={item.id} size={40} style={{ marginHorizontal: 12 }} />
                            <Text style={styles.title}>{item.name}</Text>
                        </TouchFeedback>
                        <Text style={styles.rightText}>{item.correct_count}题</Text>
                        <View style={styles.bottomLine} />
                    </View>
                );
            }
        } else {
            return <StatusView.EmptyView />;
        }
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <StatusView.LoadingSpinner />
            ) : (
                <FlatList
                    data={d}
                    contentContainerStyle={styles.fl}
                    keyExtractor={index => index.toString()}
                    showsVerticalScrollIndicator={true}
                    ListHeaderComponent={() => {
                        return memoizedRenderTop();
                    }}
                    initialNumToRender={50}
                    renderItem={({ item, index }) => {
                        return _renderItem(index, item);
                    }}
                    ListFooterComponent={() => {
                        return <ListFooter hidden={false} finished={true} text={'没有更多了哦'} />;
                    }}
                />
            )}
        </View>
    );
}
const meWidth = (width - 20) * 0.95;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
    },
    fl: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    me: {
        width: meWidth,
        height: 76,
        backgroundColor: '#FEEED0',
        borderRadius: 10,
        marginBottom: 8,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    item: {
        width: width,
        height: 62,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badgeNumber: {
        color: '#333',
        fontSize: 17,
        fontWeight: '400',
        width: 24,
        height: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    left: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingStart: 13,
    },
    title: {
        fontSize: 15,
        color: '#444',
        paddingEnd: 16,
    },
    rightText: {
        fontSize: 13,
        color: '#FF9265',
        paddingEnd: 23,
    },
    rightTextTop: {
        fontSize: 14,
        color: '#FF9265',
        paddingEnd: 16,
        marginBottom: 4,
    },
    rightTextBottom: {
        fontSize: 14,
        color: '#FF9265',
        paddingEnd: 16,
        marginTop: 4,
    },
    meTitle: {
        marginStart: 13,
        color: '#444',
        fontSize: 15,
    },
    bottomLine: {
        height: 0.5,
        width: width * 0.86,
        marginStart: width * 0.07,
        position: 'absolute',
        backgroundColor: '#e8e8e8',
        bottom: 0,
    },
    top: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    topThree: {
        paddingTop: 8,
        paddingBottom: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    topItem: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    topThreeTitle: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
        marginTop: 2,
    },
    topThreeNumber: {
        fontSize: 15,
        color: '#FF9265',
    },
});
