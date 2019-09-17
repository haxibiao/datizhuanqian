import React, { Component, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Image, Text } from 'react-native';
import { exceptionCapture, useBounceAnimation } from 'common';
import { GQL, useMutation } from 'apollo';
import { observer } from 'store';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit } from 'utils';

const imageSource = {
    liked: require('../../../assets/images/ic_liked.png'),
    unlike: require('../../../assets/images/ic_like.png'),
};

interface Media {
    id: number | string;
    liked: boolean;
    count_likes: number | string;
    [key: string]: any;
}

interface Props {
    media: Media;
    [key: string]: any;
}

export default observer((props: Props) => {
    const { media } = props;
    const store = useContext(StoreContext);
    const animation = useBounceAnimation(media.liked);
    const [likeArticle, { data }] = useMutation(GQL.likeVideoMutation, {
        variables: {
            like_id: media.id,
            like_type: 'articles',
            user_id: Helper.syncGetter('userStore.me.id', store),
        },
    });

    const likeHandler = __.debounce(async function() {
        const [error, res] = await exceptionCapture(likeArticle);
        if (error) {
            media.liked ? media.count_likes-- : media.count_likes++;
            media.liked = !media.liked;
            Toast.show({ content: '操作失败' });
        }
    }, 500);

    function toggleLike() {
        media.liked ? media.count_likes-- : media.count_likes++;
        media.liked = !media.liked;
        likeHandler();
    }

    const scale = animation.interpolate({
        inputRange: [1, 1.1, 1.2],
        outputRange: [1, 1.25, 1],
    });
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity style={styles.center} onPress={toggleLike}>
                <Image source={media.liked ? imageSource.liked : imageSource.unlike} style={styles.imageStyle} />
                <Text style={styles.countLikes}>{media.count_likes}</Text>
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
