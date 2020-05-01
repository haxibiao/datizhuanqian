import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { PageContainer, beginnerGuidance, VideoTaskGuidance, UserAgreementOverlay } from '@src/components';
import { observer, app, storage, keys, config } from '@src/store';
import { useQuery, GQL } from '@src/apollo';
import { Util } from 'native';
import { when } from 'mobx';
import { Overlay } from 'teaset';
import JPushModule from 'jpush-react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation } from 'react-navigation-hooks';
import { useApolloClient } from '@apollo/react-hooks';
import TagsPlaceholder from './components/TagsPlaceholder';
import ScrollableTabBar from './components/ScrollableTabBar';
import UserRewardOverlay from './components/UserRewardOverlay';
import TimeReward from './components/TimeReward';
import TagList from './TagList';
import { useDetainment } from 'common';
// 监听新用户登录
when(
    () => app.me.isNewUser,
    () => {
        // 新手指导
        beginnerGuidance({
            guidanceKey: 'VideoTask',
            GuidanceView: VideoTaskGuidance,
        });
    },
);

const index = observer(() => {
    const navigation = useNavigation();
    const client = useApolloClient();
    const registerTimer = useRef();
    const push_content = useRef();
    const push_time = useRef(() => new Date());
    const push_type = useRef();
    // 首页分类
    const { data, error, loading, refetch } = useQuery(GQL.TagsQuery, {
        variables: {
            filter: 'HOMEPAGE',
        },
    });

    const tags = useMemo(() => {
        const tagsData = Helper.syncGetter('tags', data);
        if (Array.isArray(tagsData) && tagsData.length > 0) {
            // app.updateTagsCache(tagsData);
            return tagsData;
        } else if (app.tagsCache) {
            return app.tagsCache;
        }
        return null;
    }, [data, error, loading, app.tagsCache]);

    useEffect(() => {
        const tagsData = Helper.syncGetter('tags', data);
        //更新缓存
        if (Array.isArray(tagsData) && tagsData.length > 0) {
            app.updateTagsCache(tagsData);
        }
    }, [loading, refetch]);

    // 每个版本静默重新登录一次
    const resetUser = useCallback(async () => {
        const resetVersion = await storage.getItem(keys.resetVersion);
        const me = (await storage.getItem(keys.me)) || (await storage.getItem(keys.user));

        if (resetVersion !== Config.Version && me) {
            app.mutationClient
                .mutate({
                    mutation: GQL.signToken,
                    variables: {
                        token: me.token,
                    },
                })
                .then(result => {
                    app.signIn(result.data.signInWithToken);
                    app.updateResetVersion(Config.Version);
                    app.updateUserCache(result.data.signInWithToken);
                });
        }
    }, [app.mutationClient]);

    // 新用户奖励提示
    const loadUserReword = useCallback(
        phone => {
            let overlayRef;
            Overlay.show(
                <Overlay.View animated ref={ref => (overlayRef = ref)}>
                    <View style={styles.overlayInner}>
                        <UserRewardOverlay
                            hide={() => overlayRef.close()}
                            navigation={navigation}
                            phone={phone}
                            client={client}
                        />
                    </View>
                </Overlay.View>,
            );
        },
        [client],
    );

    // 身份信息、网络状态查询
    useEffect(() => {
        const didFocusSubscription = navigation.addListener('didFocus', () => {
            if (app.login) {
                client
                    .query({
                        query: GQL.UserWithdrawQuery,
                    })
                    .then(() => {})
                    .catch(error => {
                        console.log('error :', error);
                        const info = error.toString().indexOf('登录');
                        if (info > -1) {
                            app.forget();
                            app.signOut();
                            Toast.show({ content: '您的身份信息已过期,请重新登录' });
                        }
                    });
            }
            NetInfo.isConnected.fetch().then(isConnected => {
                if (!isConnected) {
                    Toast.show({ content: '网络不可用' });
                }
            });
        });

        return () => {
            didFocusSubscription.remove();
        };
    }, [client]);

    useEffect(() => {
        resetUser();
        registerTimer.current = setTimeout(async () => {
            // 再次请求权限防止未获取到手机号
            const phone = Device.IOS ? '' : await Util.getPhoneNumber();
            const userCache = await storage.getItem(keys.userCache);

            if (!app.login && !userCache && !config.disableAd) {
                if (!app.createUserAgreement && Config.AppStore == 'tencent') {
                    UserAgreementOverlay.show({
                        callback: () => loadUserReword(phone),
                    });
                } else {
                    loadUserReword(phone);
                }
            }
        }, 3000);

        return () => {
            clearTimeout(registerTimer.current);
        };
    }, [app.login]);

    // 推送通知
    useEffect(() => {
        JPushModule.getRegistrationID(registrationId => {
            console.log('registrationId', registrationId);
        });
        const receiveNotificationListener = message => {
            push_content.current = message.alertContent;
            push_type.current = JSON.parse(message.extras).type;
            push_time.current = JSON.parse(message.extras).time;
        };
        JPushModule.addReceiveNotificationListener(receiveNotificationListener);

        // 监听打开通知事件
        const openNotificationListener = () => {
            navigation.navigate('PushNotification', {
                content: push_content.current,
                name: '官方提示',
                time: push_time.current,
            });
        };
        JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener);

        return () => {
            JPushModule.removeReceiveNotificationListener(receiveNotificationListener);
            JPushModule.removeReceiveOpenNotificationListener(openNotificationListener);
        };
    }, []);

    useDetainment(navigation);

    const Content = useMemo(() => {
        if (tags && tags.length > 0) {
            return (
                <ScrollableTabView
                    prerenderingSiblingsNumber={0}
                    renderTabBar={() => <ScrollableTabBar {...scrollTabStyle} />}>
                    {tags.map(tag => {
                        return <TagList key={tag.id} tabLabel={tag.name} tag={tag} />;
                    })}
                </ScrollableTabView>
            );
        } else {
            return <TagsPlaceholder contentStyle={styles.placeholderStyle} />;
        }
    }, [tags]);

    return (
        <PageContainer
            white
            isTopNavigator
            navBarStyle={{
                borderBottomWidth: PxFit(0),
            }}
            rightView={!config.disableAd ? <TimeReward navigation={navigation} /> : null}
            leftView={
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Search')}>
                    <View style={styles.searchButton}>
                        <Image
                            style={styles.searchImage}
                            source={require('@src/assets/images/ic_search_category.png')}
                        />
                        <Text style={{ marginLeft: PxFit(6), fontSize: Font(12), color: '#DDDDDD' }}>
                            搜索你感兴趣的题库
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            }>
            {Content}
        </PageContainer>
    );
});

const scrollTabStyle = {
    style: {
        height: 51,
        borderColor: '#F6F6F6',
    },
    tabStyle: {
        height: 50,
        paddingLeft: 2,
        paddingRight: 2,
        bottom: -5,
    },
    activeTextStyle: {
        fontSize: Font(20),
        fontWeight: 'bold',
        color: Theme.defaultTextColor,
    },
    inactiveTextStyle: {
        color: Theme.defaultTextColor,
    },
    textStyle: {
        fontSize: Font(16),
    },
    underlineStyle: {
        height: PxFit(8),
        borderRadius: PxFit(4),
        // width:PxFit(40),
        backgroundColor: '#FECE4D',
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Device.statusBarHeight,
        backgroundColor: '#fff',
    },
    overlayInner: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0)',
        flex: 1,
        height: Device.HEIGHT,
        justifyContent: 'center',
        width: Device.WIDTH,
    },
    placeholderStyle: {
        marginHorizontal: PxFit(Theme.itemSpace),
        paddingBottom: Device.HOME_INDICATOR_HEIGHT + PxFit(56),
    },
    searchButton: {
        flex: 1,
        marginTop: PxFit(14),
        // alignItems: 'flex-end',
        width: Device.WIDTH * 0.7,
        height: PxFit(31),
        borderWidth: PxFit(0.33),
        borderColor: '#D8D8D8',
        borderRadius: PxFit(20),
        // justifyContent: 'center',
        // padding: PxFit(4),
        paddingLeft: PxFit(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchImage: {
        height: PxFit(20),
        width: PxFit(20),
    },
});

export default index;
