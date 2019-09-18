import React, { Component, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Image, Text } from 'react-native';
import { exceptionCapture, useBounceAnimation } from 'common';
import { GQL, useMutation } from 'apollo';
import { observer } from 'store';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit } from 'utils';
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
    const { media } = props;
    const animation = useBounceAnimation(media.question.liked);
    const [likeArticle, { data }] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            likable_id: media.id,
            likable_type: 'question',
        },
    });

    const likeHandler = _.debounce(async function() {
        const [error, res] = await exceptionCapture(likeArticle);
        if (error) {
            media.question.liked ? media.question.count_likes-- : media.question.count_likes++;
            media.question.liked = !media.question.liked;
            Toast.show({ content: '操作失败' });
        }
    }, 500);

    function toggleLike(): void {
        media.question.liked ? media.question.count_likes-- : media.question.count_likes++;
        media.question.liked = !media.question.liked;
        likeHandler();
    }

    const scale = animation.interpolate({
        inputRange: [1, 1.1, 1.2],
        outputRange: [1, 1.25, 1],
    });
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity style={styles.center} onPress={toggleLike}>
                <Image
                    source={media.question.liked ? imageSource.liked : imageSource.unlike}
                    style={styles.imageStyle}
                />
                <Text style={styles.countLikes}>{media.question.count_likes}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: PxFit(40),
        height: PxFit(40),
        borderRadius: PxFit(40) / 2,
    },
    countLikes: {
        marginTop: PxFit(10),
        fontSize: PxFit(12),
        color: 'rgba(255,255,255,0.8)',
    },
});
