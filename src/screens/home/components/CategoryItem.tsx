import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { useNavigation } from 'react-navigation-hooks';

const CategoryItem = ({ category, hasSibling }) => {
    const navigation = useNavigation();

    const categories = useMemo(() => category.children || [], []);

    const navigator = useCallback(() => {
        if (TOKEN) {
            navigation.navigate('Answer', { category, question_id: null });
        } else {
            navigation.navigate('Login');
        }
    }, []);

    const keyExtractor = useCallback((item, index) => {
        return item.id ? item.id.toString() + Date.now() : index.toString();
    }, []);

    const subCategory = useCallback(({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={navigator}>
                <View style={styles.subItem}>
                    <Text style={styles.subItemText}>{item.name}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }, []);

    if (hasSibling) {
        return (
            <TouchableOpacity onPress={navigator} style={styles.categoryCover}>
                <View>
                    <Image source={{ uri: category.icon }} style={styles.cover} />
                    <View style={styles.shadow} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.name} numberOfLines={2}>
                        {category.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        <View style={styles.container}>
            <View style={styles.main}>
                <TouchableOpacity onPress={navigator} style={styles.categoryCover}>
                    <View>
                        <Image source={{ uri: category.icon }} style={styles.cover} />
                        <View style={styles.shadow} />
                    </View>
                </TouchableOpacity>
                <View style={styles.body}>
                    <Text style={styles.largeName} numberOfLines={2}>
                        {category.name}
                    </Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {category.description}
                    </Text>
                </View>
            </View>
            <FlatList
                data={categories}
                renderItem={subCategory}
                keyExtractor={keyExtractor}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>;
    }
};

const COVER_WIDTH = (SCREEN_WIDTH - PxFit(Theme.itemSpace) * 6) / 3;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    main: {
        borderRadius: PxFit(10),
        flexDirection: 'row',
    },
    categoryCover: { width: COVER_WIDTH },
    content: {
        marginTop: PxFit(6),
    },
    cover: {
        borderRadius: PxFit(5),
        height: COVER_WIDTH,
        width: COVER_WIDTH,
    },
    name: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
        lineHeight: PxFit(22),
    },
    description: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
        paddingTop: PxFit(5),
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
        marginHorizontal: PxFit(Theme.itemSpace),
        justifyContent: 'space-between',
    },
    largeName: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
        lineHeight: PxFit(23),
    },
    subItem: {
        minWidth: PxFit(80),
        paddingHorizontal: PxFit(10),
        paddingVertical: PxFit(5),
        marginTop: PxFit(Theme.itemSpace),
        marginRight: PxFit(Theme.itemSpace),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF0E6',
    },
    subItemText: {
        fontSize: PxFit(12),
        color: Theme.grey,
    },
});

export default CategoryItem;
