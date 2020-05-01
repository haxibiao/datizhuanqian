import React, { useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeText } from 'components';
import { useBounceAnimation } from 'common';
import { GQL, useMutation } from 'apollo';
import { observer, app } from 'store';
import _ from 'lodash';
import { useNavigation } from 'react-navigation-hooks';

const imageSource = {
    liked: require('../../../assets/images/ic_liked.png'),
    unlike: require('../../../assets/images/ic_like.png'),
};

interface Props {
    [key: string]: any;
}

export default observer((props: Props) => {
    const { media } = props;
    const firstMount = useRef(true);
    const isError = useRef(false);
    const navigation = useNavigation();
    const [animation, startAnimation] = useBounceAnimation({ value: 1, toValue: 1.2 });
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            likable_id: Helper.syncGetter('id', media),
            likable_type: 'POST',
        },
        client: app.mutationClient,
    });

    const likeHandler = __.throttle(async function() {
        const [error, result] = await Helper.exceptionCapture(likeArticle);
        console.log('err', error, result);
        if (error) {
            isError.current = true;
            media.liked ? media.count_likes-- : media.count_likes++;
            media.liked = !media.liked;
            Toast.show({ content: '操作失败' });
        }
    }, 500);

    function toggleLike(): void {
        if (TOKEN) {
            media.liked ? media.count_likes-- : media.count_likes++;
            media.liked = !media.liked;
        } else {
            navigation.navigate('Login');
        }
    }

    useEffect(() => {
        if (!firstMount.current && !isError.current) {
            startAnimation();
            likeHandler();
        }
        firstMount.current = false;
        isError.current = false;
    }, [media.liked]);

    const scale = animation.interpolate({
        inputRange: [1, 1.1, 1.2],
        outputRange: [1, 1.25, 1],
    });
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity onPress={toggleLike}>
                <Image source={media.liked ? imageSource.liked : imageSource.unlike} style={styles.imageStyle} />
                <SafeText style={styles.countLikes} shadowText={true}>
                    {media.count_likes}
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
