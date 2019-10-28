import React, { Component, useContext, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Image, Text } from 'react-native';
import { SafeText } from 'components';
import { exceptionCapture, useBounceAnimation } from 'common';
import { GQL, useMutation } from 'apollo';
import { observer } from 'store';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools } from 'utils';
import _ from 'lodash';
import { useNavigation } from 'react-navigation-hooks';

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
    const firstMount = useRef(true);
    const navigation = useNavigation();
    const [animation, startAnimation] = useBounceAnimation({ value: 1, toValue: 1.2 });
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            likable_id: Tools.syncGetter('question.id', media),
            likable_type: 'QUESTION',
        },
    });

    const likeHandler = _.debounce(async function() {
        const [error] = await exceptionCapture(likeArticle);
        if (error) {
            media.question.liked ? media.question.count_likes-- : media.question.count_likes++;
            media.question.liked = !media.question.liked;
            Toast.show({ content: '操作失败' });
        }
    }, 500);

    function toggleLike(): void {
        if (TOKEN) {
            media.question.liked ? media.question.count_likes-- : media.question.count_likes++;
            media.question.liked = !media.question.liked;
        } else {
            navigation.navigate('Login');
        }
    }

    useEffect(() => {
        if (!firstMount.current) {
            startAnimation();
            likeHandler();
        }
        firstMount.current = false;
    }, [media.question.liked]);

    const scale = animation.interpolate({
        inputRange: [1, 1.1, 1.2],
        outputRange: [1, 1.25, 1],
    });
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity onPress={toggleLike}>
                <Image
                    source={media.question.liked ? imageSource.liked : imageSource.unlike}
                    style={styles.imageStyle}
                />
                <SafeText style={styles.countLikes} shadowText={true}>
                    {media.question.count_likes}
                </SafeText>
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    countLikes: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: PxFit(12),
        marginTop: PxFit(10),
        textAlign: 'center',
    },
    imageStyle: {
        height: PxFit(40),
        width: PxFit(40),
    },
});
