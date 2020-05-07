import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Linking, Clipboard } from 'react-native';
import { GQL, useMutation } from '@src/apollo';
import { config, app, observer } from 'store';
import useReport from './useReport';
import TouchFeedback from '../TouchableView/TouchFeedback';
import VideoStore from '../../screens/video/VideoStore';
import * as WeChat from 'react-native-wechat';
import { Share } from 'native';

const MoreOperation = props => {
    const { options, target, type, onPressIn, deleteCallback } = props;
    const report = useReport({ target, type });
    const [deleteArticleMutation] = useMutation(GQL.deleteQuestionMutation, {
        variables: {
            id: target.id,
        },
        client: app.mutationClient,
        onCompleted: data => {
            deleteCallback();
            Toast.show({
                content: '删除成功',
            });
        },
        onError: error => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '删除失败',
            });
        },
    });

    const [dislikeMutation] = useMutation(GQL.NotLikeMutation, {
        variables: {
            notlike_id: target.user.id,
        },
        client: app.mutationClient,
        onCompleted: data => {
            Toast.show({
                content: '操作成功，将减少此类型内容的推荐',
            });
        },
        onError: error => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '操作失败',
            });
        },
    });

    const deleteArticle = useCallback(() => {
        onPressIn();
        deleteArticleMutation();
    }, [deleteArticleMutation]);

    const reportArticle = useCallback(() => {
        onPressIn();
        report();
    }, [report]);

    const copyLink = useCallback(async () => {
        onPressIn();
        const link = 'http://datizhuanqian.com' + '/share/post/' + target.id + '?user_id=' + app.me.id;
        Clipboard.setString(link);
        Toast.show({ content: '复制成功，快去分享给好友吧！' });
    }, []);

    const captureVideo = useCallback(() => {
        onPressIn();
        if (app.firstReadSpiderVideoTask) {
            Linking.openURL('snssdk1128://');
        } else {
            Helper.middlewareNavigate('VideoPost', { medium: [VideoStore.guidanceVideo], isPost: true });
            app.setReadSpiderVideoTask(true);
        }
    }, []);

    const blockUser = useCallback(() => {
        onPressIn();
        setTimeout(() => {
            Toast.show({ content: '该用户已加入黑名单' });
        }, 300);
        VideoStore.filterUserPost(target.user.id);
        // dislikeMutation();
    }, []);

    const dislike = useCallback(() => {
        onPressIn();
        dislikeMutation();
        VideoStore.filterUserPost(target.user.id);
    }, []);

    const shareToWechat = useCallback(async () => {
        onPressIn();
        //    const link = await fetchShareLink();
        try {
            await WeChat.shareToSession({
                type: 'news',
                title: '我在答题赚钱发现一个很好看的小视频，分享给你',
                description: target.description,
                thumbImage:
                    'https://mmbiz.qlogo.cn/mmbiz_png/xq0pH6ugFxD5er0WWLsr5xt5Iwjt9FHrqAibUO5OUbJibIiao55O4iaiaPIaa346KiaagUVOMoGmfhZtaic77BXZLjS8A/0?wx_fmt=png',

                webpageUrl: 'http://datizhuanqian.com' + '/share/post/' + target.id + '?user_id=' + app.me.id,
            });
        } catch (e) {
            Toast.show({ content: '未安装微信或当前微信版本较低' });
        }
    }, []);

    const shareToTimeline = useCallback(() => {
        try {
            WeChat.shareToTimeline({
                type: 'news',
                // thumbImage:""
                title: '我在答题赚钱发现一个很好看的小视频，分享给你',
                description: target.description,
                thumbImage:
                    'https://mmbiz.qlogo.cn/mmbiz_png/xq0pH6ugFxD5er0WWLsr5xt5Iwjt9FHrqAibUO5OUbJibIiao55O4iaiaPIaa346KiaagUVOMoGmfhZtaic77BXZLjS8A/0?wx_fmt=png',

                webpageUrl: 'http://datizhuanqian.com' + '/share/post/' + target.id + '?user_id=' + app.me.id,
            });
        } catch (e) {
            console.log('e', e);
            Toast.show({
                content: '未安装微信或当前微信版本较低',
            });
        }
    }, []);

    const shareToQQ = useCallback(async () => {
        let callback = await Share.shareTextToQQ(
            'http://datizhuanqian.com' + '/share/post/' + target.id + '?user_id=' + app.me.id,
        );
        if (callback == false) {
            Toast.show({
                content: '请先安装QQ客户端',
            });
        }
    }, []);

    const shareToSina = useCallback(async () => {
        let callback = await Share.shareTextToSina(
            'http://datizhuanqian.com' + '/share/post/' + target.id + '?user_id=' + app.me.id,
        );
        if (callback == false) {
            Toast.show({
                content: '请先安装微博客户端',
            });
        }
    }, []);

    const shares = [
        {
            text: '微信好友',
            image: require('@src/assets/images/wechat.png'),
            callback: shareToWechat,
            style: {
                width: PxFit(50),
                height: (PxFit(50) * 200) / 207,
            },
        },
        {
            text: '朋友圈',
            image: require('@src/assets/images/friends.png'),
            callback: shareToTimeline,
        },
        {
            text: 'QQ好友',
            image: require('@src/assets/images/qq.png'),
            callback: shareToQQ,
        },
        {
            text: '微博',
            image: require('@src/assets/images/weibo.png'),
            callback: shareToSina,
        },
    ];

    const shareView = useMemo(() => {
        return shares.map((option, index) => {
            console.log('option :>> ', option.image);

            return (
                <TouchFeedback style={styles.optionItem} key={index} onPress={option.callback}>
                    <View
                        style={[
                            styles.optionIcon,
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        ]}>
                        <Image style={option.style || styles.optionIcon} source={option.image} />
                    </View>
                    <Text style={styles.optionName}>{option.text}</Text>
                </TouchFeedback>
            );
        });
    }, [shares]);

    const operation = useMemo(
        () => ({
            采集视频: {
                image: require('@src/assets/images/more_video_download.png'),
                callback: captureVideo,
            },
            举报: {
                image: require('@src/assets/images/more_report.png'),
                callback: reportArticle,
            },
            拉黑: {
                image: require('@src/assets/images/more_block_user.png'),
                callback: blockUser,
            },
            删除: {
                image: require('@src/assets/images/more_delete.png'),
                callback: deleteArticle,
            },
            不感兴趣: {
                image: require('@src/assets/images/more_dislike.png'),
                callback: dislike,
            },
            复制链接: {
                image: require('@src/assets/images/more_links.png'),
                callback: copyLink,
            },
        }),
        [reportArticle, deleteArticle, dislike, copyLink],
    );

    const optionsView = useMemo(() => {
        return options.map((option, index) => {
            console.log('options :>> ', operation[option].image);
            return (
                <TouchFeedback style={styles.optionItem} key={index} onPress={operation[option].callback}>
                    <View
                        style={[
                            styles.optionIcon,
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        ]}>
                        <Image style={operation[option].style || styles.optionIcon} source={operation[option].image} />
                    </View>
                    <Text style={styles.optionName}>{option}</Text>
                </TouchFeedback>
            );
        });
    }, [options]);

    return (
        <View style={styles.optionsContainer}>
            <View style={styles.share}>{shareView}</View>
            <View style={styles.body}>{optionsView}</View>
            <TouchFeedback style={styles.footer} onPress={onPressIn}>
                <Text style={styles.footerText}>取消</Text>
            </TouchFeedback>
        </View>
    );
};

MoreOperation.defaultProps = {
    options: ['不感兴趣', '举报'],
    type: 'POST',
};

const styles = StyleSheet.create({
    share: {
        paddingTop: PxFit(Theme.itemSpace),
        flexDirection: 'row',
        alignItems: 'center',
    },
    body: {
        paddingVertical: PxFit(Theme.itemSpace),
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: PxFit(Theme.itemSpace),
        borderTopWidth: PxFit(1),
        borderColor: Theme.borderColor,
    },
    footerText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
    },
    optionIcon: {
        width: PxFit(50),
        height: PxFit(50),
    },
    optionItem: {
        flex: 1,
        paddingVertical: PxFit(10),
        alignItems: 'center',
    },
    optionName: {
        marginTop: PxFit(10),
        color: Theme.subTextColor,
        fontSize: PxFit(13),
    },
    optionsContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: PxFit(12),
        borderTopRightRadius: PxFit(12),
        paddingBottom: PxFit(Device.HOME_INDICATOR_HEIGHT),
        overflow: 'hidden',
    },
});

export default MoreOperation;
