import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Linking } from 'react-native';
import { GQL, useMutation } from '@src/apollo';
import { config, app, observer } from 'store';
import useReport from './useReport';
import TouchFeedback from '../TouchableView/TouchFeedback';
import VideoStore from '../../screens/video/VideoStore';
import * as WeChat from 'react-native-wechat';
const MoreOperation = props => {
    const { options, target, type, onPressIn, deleteCallback } = props;
    const report = useReport({ target, type });
    const [deleteArticleMutation] = useMutation(GQL.deleteQuestionMutation, {
        variables: {
            id: target.id,
        },
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
                type: 'video',
                title: '我在答题赚钱发现一个很好看的小视频，分享给你',
                videoUrl: Config.ServerRoot + '/share/post/' + target.id + '?user_id=' + app.me.id,
            });
        } catch (e) {
            Toast.show({ content: '未安装微信或当前微信版本较低' });
        }
    }, []);

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
            分享微信: {
                image: require('@src/assets/images/ic_pink_wechat.png'),
                callback: shareToWechat,
                style: {
                    height: PxFit(50),
                    width: PxFit(50),
                },
            },
        }),
        [reportArticle, deleteArticle, dislike],
    );

    const optionsView = useMemo(() => {
        return options.map((option, index) => {
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
        paddingBottom: PxFit(Theme.HOME_INDICATOR_HEIGHT),
        overflow: 'hidden',
    },
});

export default MoreOperation;
