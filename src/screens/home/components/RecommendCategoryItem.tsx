import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Row, Iconfont } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import LinearGradient from 'react-native-linear-gradient';

const RecommendCategoryItem = ({ tag, category }) => {
    const navigation = useNavigation();
    const isExam = useMemo(() => tag && tag.name == '考试' && category.is_official > 0, []);

    const navigator = useCallback(() => {
        if (TOKEN) {
            navigation.navigate(isExam ? 'Exam' : 'Answer', { category, question_id: null });
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
                            <Image
                                source={require('@src/assets/images/official_category.png')}
                                style={styles.officialCategory}>
                                {/* <Text style={styles.officialText}>精选</Text> */}
                            </Image>
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
                            <Image
                                source={require('@src/assets/images/ic_hot.png')}
                                style={{ width: PxFit(13), height: PxFit(13) }}
                            />
                            <Text style={styles.countText}>{Helper.count(category.answers_count)}人答过</Text>
                        </Row>
                        <Row>
                            <Image
                                source={require('@src/assets/images/ic_category_answer_count.png')}
                                style={{ width: PxFit(13), height: PxFit(13) }}
                            />
                            <Text style={styles.countText}>{Helper.count(category.questions_count)}道题</Text>
                        </Row>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const COVER_WIDTH = (Device.WIDTH - PxFit(50)) * 0.315;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    coverContainer: {
        width: COVER_WIDTH,
        borderRadius: PxFit(5),
        // overflow: 'hidden',
    },
    shadowContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        padding: PxFit(4),
        borderRadius: PxFit(5),
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    officialCategory: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: COVER_WIDTH * 0.4,
        height: (COVER_WIDTH * 0.4 * 60) / 110,
        paddingRight: COVER_WIDTH * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: PxFit(5),
    },
    officialText: {
        fontSize: PxFit(10),
        color: '#fff',
    },
    countText: {
        marginLeft: PxFit(5),
        fontSize: PxFit(11),
        color: '#888888',
    },
    content: {
        marginTop: PxFit(6),
    },
    cover: {
        height: COVER_WIDTH,
        width: COVER_WIDTH,
        borderRadius: PxFit(5),
    },
    name: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
        lineHeight: PxFit(22),
    },
    description: {
        marginTop: PxFit(15),
        flexDirection: 'row',
    },
    descriptionText: {
        fontSize: Font(13),
        color: Theme.grey,
        paddingHorizontal: PxFit(8),
        paddingVertical: PxFit(5),
        borderRadius: PxFit(4),
        backgroundColor: '#FAFAFA',
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
        color: '#424242',
        fontSize: Font(16),
        fontWeight: 'bold',
        lineHeight: PxFit(22),
    },
});

export default RecommendCategoryItem;
