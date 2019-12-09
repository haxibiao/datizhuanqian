import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Row, Iconfont } from '@src/components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from 'utils';
import { useNavigation } from 'react-navigation-hooks';
import LinearGradient from 'react-native-linear-gradient';

const CategoryItem = ({ category }) => {
    const navigation = useNavigation();

    const navigator = useCallback(() => {
        if (TOKEN) {
            navigation.navigate('Answer', { category, question_id: null });
        } else {
            navigation.navigate('Login');
        }
    }, []);

    return (
        <TouchableWithoutFeedback onPress={navigator}>
            <View style={styles.container}>
                <View style={styles.coverContainer}>
                    <Image source={{ uri: category.icon }} style={styles.cover} />
                    <LinearGradient
                        style={styles.shadowContainer}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['rgba(000,000,000,0.5)', 'rgba(000,000,000,0.2)', 'rgba(000,000,000,0.1)']}>
                        {category.is_official > 0 && (
                            <ImageBackground
                                source={require('@src/assets/images/official_category.png')}
                                style={styles.officialCategory}>
                                <Text style={styles.officialText}>精选</Text>
                            </ImageBackground>
                        )}
                    </LinearGradient>
                </View>
                <View style={styles.body}>
                    <View style={styles.info}>
                        <Text style={styles.largeName} numberOfLines={1}>
                            {category.name}
                        </Text>
                        <View style={styles.description}>
                            {category.description && (
                                <Text style={styles.descriptionText} numberOfLines={1}>
                                    {category.description}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.metaCount}>
                        <Row>
                            <Iconfont name="order-fill" color={Theme.watermelon} size={PxFit(11)} />
                            <Text style={styles.countText}>{Tools.NumberFormat(category.questions_count)}道题</Text>
                        </Row>
                        <Row>
                            <Iconfont name="answerLog" color={Theme.watermelon} size={PxFit(11)} />
                            <Text style={styles.countText}>{Tools.NumberFormat(category.answers_count)}人答过</Text>
                        </Row>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const COVER_WIDTH = PxFit(70);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    coverContainer: {
        width: COVER_WIDTH,
        borderRadius: PxFit(5),
        overflow: 'hidden',
    },
    shadowContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        padding: PxFit(4),
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    officialCategory: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: COVER_WIDTH * 0.5,
        height: (COVER_WIDTH * 0.5 * 48) / 108,
        paddingRight: COVER_WIDTH * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
    },
    officialText: {
        fontSize: PxFit(10),
        color: '#fff',
    },
    countText: {
        marginLeft: PxFit(2),
        fontSize: PxFit(11),
        color: Theme.subTextColor,
    },
    content: {
        marginTop: PxFit(6),
    },
    cover: {
        height: COVER_WIDTH,
        width: COVER_WIDTH,
    },
    name: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
        lineHeight: PxFit(22),
    },
    description: {
        marginTop: PxFit(3),
        flexDirection: 'row',
    },
    descriptionText: {
        fontSize: PxFit(12),
        color: Theme.subTextColor,
        paddingHorizontal: PxFit(5),
        paddingVertical: PxFit(2),
        borderRadius: PxFit(4),
        backgroundColor: '#f0f0f0',
    },
    metaCount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shadow: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: PxFit(5),
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    body: {
        flex: 1,
        height: COVER_WIDTH,
        marginLeft: PxFit(Theme.itemSpace),
        justifyContent: 'space-between',
    },
    info: {
        marginBottom: PxFit(10),
    },
    largeName: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        lineHeight: PxFit(22),
    },
});

export default CategoryItem;
