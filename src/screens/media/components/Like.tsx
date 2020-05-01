import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, Image, Text } from 'react-native';
import { useBounceAnimation } from 'common';
import { GQL, useMutation } from 'apollo';
import { observer, app } from 'store';

const imageSource = {
    liked: require('../../../assets/images/ic_liked.png'),
    unlike: require('../../../assets/images/ic_like.png'),
};

interface Props {
    [key: string]: any;
}

export default observer((props: Props) => {
    const { media, isPost } = props;
    const [animation, startAnimation] = useBounceAnimation({ value: 1, toValue: 1.2 });
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            likable_id: media.id,
            likable_type: isPost ? 'POST' : 'VIDEO',
        },
        client: app.mutationClient,
    });

    const likeHandler = __.debounce(async function() {
        try {
            const result = await Helper.exceptionCapture(likeArticle);
            console.log('result', result);
        } catch (error) {
            media.liked ? media.count_likes-- : media.count_likes++;
            media.liked = !media.liked;
            Toast.show({ content: '操作失败' });
        }
    }, 500);

    function toggleLike(): void {
        media.liked ? media.count_likes-- : media.count_likes++;
        media.liked = !media.liked;
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
                <Image source={media.liked ? imageSource.liked : imageSource.unlike} style={styles.imageStyle} />
                <Text style={styles.countLikes}>{media.count_likes || 0}</Text>
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
