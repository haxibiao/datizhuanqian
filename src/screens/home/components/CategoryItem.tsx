import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Row, Iconfont } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import LinearGradient from 'react-native-linear-gradient';

const CategoryItem = ({ tag, category, index }) => {
    const navigation = useNavigation();
    const isExam = useMemo(() => tag && tag.name == '考试' && category.is_official > 0, []);

    const navigator = useCallback(() => {
        if (TOKEN) {
            navigation.navigate(isExam ? 'Exam' : 'Answer', { category, question_id: null });
        } else {
            navigation.navigate('Login');
        }
    }, [category]);

    return (
        <TouchableWithoutFeedback onPress={navigator}>
            <View
                style={[
                    styles.container,
                    {
                        marginRight: PxFit(15),
                    },
                ]}>
                <View style={styles.coverContainer}>
                    <Image source={{ uri: category.icon }} style={styles.cover} />
                    <LinearGradient
                        style={styles.shadowContainer}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['rgba(000,000,000,0.1)', 'rgba(000,000,000,0.05)', 'rgba(000,000,000,0)']}>
                        {category.is_official > 0 && (
                            <Image
                                source={require('@src/assets/images/official_category.png')}
                                style={styles.officialCategory}>
                                {/* <Text style={styles.officialText}>精选</Text> */}
                            </Image>
                        )}
                    </LinearGradient>
                    <Row
                        style={{
                            justifyContent: 'flex-end',
                            paddingRight: PxFit(5),
                            paddingBottom: PxFit(5),
                            position: 'absolute',
                            bottom: 0,
                            padding: PxFit(4),
                            width: '100%',
                        }}>
                        <Image
                            source={require('@src/assets/images/ic_hot_white.png')}
                            style={{ width: PxFit(8), height: (PxFit(8) * 25) / 20 }}
                        />
                        <Text style={styles.countText}>{Helper.count(category.answers_count)}</Text>
                    </Row>
                </View>
                <View style={styles.body}>
                    <Text style={styles.largeName}>{category.name}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const COVER_WIDTH = (Device.WIDTH - PxFit(50)) * 0.315;

const styles = StyleSheet.create({
    container: {
        width: COVER_WIDTH,
        // marginRight: PxFit(10),
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
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        borderRadius: PxFit(5),
    },
    officialCategory: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: COVER_WIDTH * 0,
        height: (COVER_WIDTH * 0 * 60) / 110,
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
        color: '#fff',
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

    largeName: {
        color: '#424242',
        fontSize: Font(14),
        // lineHeight: PxFit(22),
        // fontWeight: 'bold',
    },
    body: {
        alignItems: 'center',
        marginTop: PxFit(12),
    },
});

export default CategoryItem;
