import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    ScrollTab,
    beginnerGuidance,
    VideoTaskGuidance,
} from '@src/components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, ISIOS, Config } from '@src/utils';
import { observer, app, storage, keys, config } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';
import { syncGetter } from '@src/common';
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

// 监听新用户登录
when(
    () => app.me.isNewUser,
    () => {
        // 新手指导
        !config.disableAd &&
            beginnerGuidance({
                guidanceKey: 'VideoTask',
                GuidanceView: VideoTaskGuidance,
            });
    },
);

const index = observer(props => {
    const navigation = useNavigation();
    const client = useApolloClient();
    const registerTimer = useRef();
    const push_content = useRef();
    const push_time = useRef(() => new Date());
    const push_type = useRef();
    // 首页分类
    const { data, error, loading } = useQuery(GQL.TagsQuery, {
        variables: {
            filter: 'HOMEPAGE',
        },
    });

    const tags = useMemo(() => {
        const tagsData = syncGetter('tags', data);
        if (Array.isArray(tagsData) && tagsData.length > 0) {
            app.updateTagsCache(tagsData);
            return tagsData;
        } else if (app.tagsCache) {
            return app.tagsCache;
        }
        return null;
    }, [data, error, loading, app.tagsCache]);

    // 每个版本静默重新登录一次
    const resetUser = useCallback(async () => {
        const resetVersion = await storage.getItem(keys.resetVersion);
        const me = (await storage.getItem(keys.me)) || (await storage.getItem(keys.user));

        if (resetVersion !== Config.AppVersionNumber && me) {
            client
                .mutate({
                    mutation: GQL.signToken,
                    variables: {
                        token: me.token,
                    },
                })
                .then(result => {
                    app.signIn(result.data.signInWithToken);
                    app.updateResetVersion(Config.AppVersionNumber);
                    app.updateUserCache(result.data.signInWithToken);
                });
        }
    }, [client]);

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
        const didFocusSubscription = navigation.addListener('didFocus', payload => {
            if (app.login) {
                client
                    .query({
                        query: GQL.UserWithdrawQuery,
                    })
                    .then(({ data }) => {})
                    .catch(error => {
                        const info = error.toString().indexOf('登录');
                        if (info > -1) {
                            app.forget();
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
            const phone = ISIOS ? '' : await Util.getPhoneNumber();
            const userCache = await storage.getItem(keys.userCache);

            if (!app.login && !userCache && !config.disableAd) {
                loadUserReword(phone);
            }
        }, 3000);

        return () => {
            clearTimeout(registerTimer.current);
        };
    }, [app.login]);

    // 推送通知
    useEffect(() => {
        const receiveNotificationListener = message => {
            push_content.current = message.alertContent;
            push_type.current = JSON.parse(message.extras).type;
            push_time.current = JSON.parse(message.extras).time;
        };
        JPushModule.addReceiveNotificationListener(receiveNotificationListener);

        // 监听打开通知事件
        const openNotificationListener = map => {
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

    const Content = useMemo(() => {
        if (tags) {
            return (
                <ScrollableTabView
                    prerenderingSiblingsNumber={0}
                    renderTabBar={() => <ScrollableTabBar {...scrollTabStyle} />}>
                    {tags.map((tag, index) => {
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
            title={Config.AppName}
            white
            isTopNavigator
            rightView={!config.disableAd ? <TimeReward navigation={navigation} /> : null}>
            {Content}
        </PageContainer>
    );
});

const scrollTabStyle = {
    style: {
        height: 41,
        borderColor: '#F6F6F6',
    },
    tabStyle: {
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
    },
    activeTextStyle: {
        fontSize: PxFit(17),
        fontWeight: 'bold',
        color: Theme.defaultTextColor,
    },
    inactiveTextStyle: {
        color: Theme.defaultTextColor,
    },
    textStyle: {
        fontSize: PxFit(15),
    },
    underlineStyle: {
        height: PxFit(2),
        backgroundColor: Theme.watermelon,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Theme.statusBarHeight,
        backgroundColor: '#fff',
    },
    overlayInner: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0)',
        flex: 1,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        width: SCREEN_WIDTH,
    },
    placeholderStyle: {
        marginHorizontal: PxFit(Theme.itemSpace),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(56),
    },
});

export default index;
