/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:20
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
    PageContainer,
    CustomRefreshControl,
    ListFooter,
    Placeholder,
    Banner,
    beginnerGuidance,
    VideoTaskGuidance,
} from 'components';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils';
import PlateItem from './components/PlateItem';

import { observer, app, keys, storage } from 'store';
import { when } from 'mobx';
import { withApollo, compose, graphql, GQL } from 'apollo';

import JPushModule from 'jpush-react-native';
import NetInfo from '@react-native-community/netinfo';

import { Util } from 'native';
import { Overlay } from 'teaset';

import UserRewardOverlay from './components/UserRewardOverlay';

// 监听新用户登录
when(
	() => app.me.isNewUser,
	() => {
		// 新手指导
		beginnerGuidance({
			guidanceKey: 'VideoTask',
			GuidanceView: VideoTaskGuidance,
			dismissEnabled: false
		});
	}
);

@observer
class index extends Component {
    constructor(props) {
        super(props);

		this.state = {
			finished: false,
			categoryCache: null,
			description: null,
			content: null,
			time: new Date()
		};
	}

    async componentDidMount() {
        const { navigation } = this.props;

        this.resetUser();

        this.registerTimer = setTimeout(async () => {
            // 再次请求权限防止未获取到手机号
            const phone = await Util.getPhoneNumber();
            const userCache = await storage.getItem(keys.userCache);

            if (!app.login && !userCache) {
                this.loadUserReword(phone);
            }
        }, 5000);

        this.didFocusSubscription = navigation.addListener('didFocus', payload => {
            const { client, login } = this.props;
            if (login) {
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

        // 当有用户seesion 过期时 ,清空redux 强制重新登录。

        this.receiveNotificationListener = message => {
            this.setState({
                content: message.alertContent,
                type: JSON.parse(message.extras).type,
                time: JSON.parse(message.extras).time,
            });
        };
        JPushModule.addReceiveNotificationListener(this.receiveNotificationListener);
        // 监听推送通知

        this.openNotificationListener = map => {
            const { type, content, time } = this.state;
            // if (type == 'maintenance') {
            // 	this.props.navigation.navigate('推送通知', { content: content, name: '系统维护', time: time });
            // }
            this.props.navigation.navigate('PushNotification', { content: content, name: '官方提示', time: time });
        };
        JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener);
        // 监听打开通知事件
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        JPushModule.removeReceiveNotificationListener(this.receiveNotificationListener);
        JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener);
    }

    componentDidUpdate(nextProps, nextState) {
        const { data } = this.props;
        if (data && data.categories && nextProps.data.categories !== data.categories) {
            app.updateCategoryCache(data.categories);
        }
    }

    // 每个版本静默重新登录一次
    async resetUser() {
        const resetVersion = await storage.getItem(keys.resetVersion);
        const me = (await storage.getItem(keys.me)) || (await storage.getItem(keys.user));

        if (resetVersion !== Config.AppVersionNumber && me) {
            this.props
                .signToken({
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
    }

    // 新用户奖励提示
    loadUserReword = phone => {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <UserRewardOverlay
                        hide={() => Overlay.hide(this.OverlayKey)}
                        navigation={this.props.navigation}
                        phone={phone}
                        client={this.props.client}
                    />
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
        // 回调后端
    };

    _renderCategoryList = () => {
        const {
            navigation,
            data: { loading, categories, refetch, fetchMore },
        } = this.props;
        let questionCategories = categories;
        const { login, categoryCache } = app;
        if (!questionCategories) {
            if (categoryCache) {
                questionCategories = categoryCache;
            } else {
                return Array(10)
                    .fill(0)
                    .map((elem, index) => {
                        return <Placeholder key={index} type="list" />;
                    });
            }
        }

        const categrorys = questionCategories.filter((elem, i, category) => {
            return category.indexOf(elem, 0) === i;
        });

        return (
            <View style={styles.container}>
                {login && <Banner />}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={categrorys}
                    refreshControl={
                        <CustomRefreshControl
                            refreshing={loading}
                            onRefresh={refetch}
                            reset={() =>
                                this.setState({
                                    finished: false,
                                })
                            }
                        />
                    }
                    keyExtractor={(item, index) => (item.id ? item.id.toString() + Date.now() : index.toString())}
                    renderItem={({ item, index }) => (
                        <PlateItem category={item} navigation={navigation} login={login} />
                    )}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => {
                        if (categories && questionCategories) {
                            fetchMore({
                                variables: {
                                    offset: questionCategories.length,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (
                                        !(
                                            fetchMoreResult &&
                                            fetchMoreResult.categories &&
                                            fetchMoreResult.categories.length > 0
                                        )
                                    ) {
                                        this.setState({
                                            finished: true,
                                        });
                                        return prev;
                                    }
                                    return Object.assign({}, prev, {
                                        categories: [...prev.categories, ...fetchMoreResult.categories],
                                    });
                                },
                            });
                        }
                    }}
                    ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
                />
            </View>
        );
    };

    render() {
        return (
            <PageContainer title={Config.AppName} isTopNavigator>
                {this._renderCategoryList()}
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },

    overlayInner: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0)',
        flex: 1,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        width: SCREEN_WIDTH,
    },
});

export default compose(
    graphql(GQL.CategoriesQuery, { options: props => ({ variables: { limit: 10 } }) }),
    graphql(GQL.signToken, { name: 'signToken' }),
)(withApollo(index));
