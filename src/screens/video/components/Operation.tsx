import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { GQL, useMutation } from '@src/apollo';
import { TouchFeedback } from '@src/components';
import { PxFit, Theme, Tools, SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils';
import useReport from '@src/components/Utils/useReport';
import VideoStore from '../VideoStore';

const MoreOperation = props => {
    const { options, target, type, onPressIn } = props;
    const report = useReport({ target, type });

    const [dislikeMutation] = useMutation(GQL.NotLikeMutation, {
        variables: {
            notlike_id: target.user.id,
        },
        onCompleted: data => {
            console.log('data', data);
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

    const reportArticle = useCallback(() => {
        onPressIn();
        report();
    }, [report]);

    const dislike = useCallback(() => {
        onPressIn();
        dislikeMutation();
        VideoStore.filterUserPost(target.user.id);
    }, []);

    const operation = useMemo(
        () => ({
            举报: {
                image: require('@src/assets/images/more_report.png'),
                callback: reportArticle,
            },
            不感兴趣: {
                image: require('@src/assets/images/more_dislike.png'),
                callback: dislike,
            },
        }),
        [reportArticle, dislike],
    );

    const optionsView = useMemo(() => {
        return options.map(option => {
            return (
                <TouchFeedback style={styles.optionItem} key={option} onPress={operation[option].callback}>
                    <Image style={styles.optionIcon} source={operation[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchFeedback>
            );
        });
    }, [options]);

    return (
        <TouchableWithoutFeedback onPress={onPressIn}>
            <View style={styles.optionsContainer}>
                <Text style={styles.title}>请选择你要进行的操作</Text>
                <View style={styles.body}>{optionsView}</View>
            </View>
        </TouchableWithoutFeedback>
    );
};

MoreOperation.defaultProps = {
    options: ['不感兴趣', '举报'],
    type: 'POST',
};

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: PxFit(30),
    },
    optionIcon: {
        height: PxFit(50),
        width: PxFit(50),
    },
    optionItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: PxFit(25),
    },
    optionName: {
        color: '#fff',
        fontSize: PxFit(13),
        marginTop: PxFit(10),
    },
    optionsContainer: {
        height: SCREEN_HEIGHT,
        justifyContent: 'flex-end',
        paddingBottom: SCREEN_HEIGHT / 2,
        width: SCREEN_WIDTH,
    },
    title: {
        color: '#fff',
        fontSize: PxFit(20),
        textAlign: 'center',
    },
});

export default MoreOperation;
