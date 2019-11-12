import React, { Component, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Image, Text } from 'react-native';
import { exceptionCapture, useBounceAnimation } from 'common';
import { GQL, useMutation } from 'apollo';
import { observer } from 'store';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools } from 'utils';
import _ from 'lodash';

const imageSource = {
    liked: require('../../../assets/images/ic_liked.png'),
    unlike: require('../../../assets/images/ic_like.png'),
};

interface Question {
    id: number | string;
    liked: boolean;
    count_likes: number | string;
    [key: string]: any;
}

interface Props {
    [key: string]: any;
}

export default observer((props: Props) => {
    const { question } = props;
    const [animation, startAnimation] = useBounceAnimation({ value: 1, toValue: 1.2 });
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            likable_id: question.id,
            likable_type: 'QUESTION',
        },
    });

    const likeHandler = _.debounce(async function() {
        try {
            const result = await exceptionCapture(likeArticle);
            console.log('result', result);
        } catch (error) {
            question.liked ? question.count_likes-- : question.count_likes++;
            question.liked = !question.liked;
            Toast.show({ content: '操作失败' });
        }
    }, 500);

    function toggleLike(): void {
        question.liked ? question.count_likes-- : question.count_likes++;
        question.liked = !question.liked;
        startAnimation();
        likeHandler();
    }

    const scale = animation.interpolate({
        inputRange: [1, 1.1, 1.2],
        outputRange: [1, 1.25, 1],
    });
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity onPress={toggleLike}>
                <Image source={question.liked ? imageSource.liked : imageSource.unlike} style={styles.imageStyle} />
                <Text style={styles.countLikes}>{question.count_likes}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    imageStyle: {
        width: PxFit(32),
        height: PxFit(32),
    },
    countLikes: {
        textAlign: 'center',
        marginTop: PxFit(10),
        fontSize: PxFit(12),
        color: 'rgba(255,255,255,0.8)',
    },
});
