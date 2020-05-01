/* eslint-disable react-native/sort-styles */
/*
 * @flow
 * created by wyk made in 2019-03-19 12:59:55
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, FlatList } from 'react-native';
import { Iconfont, TouchFeedback } from 'components';

class PlateItem extends Component {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        const { category, navigation } = this.props;
        navigation.navigate('Answer', { category, question_id: null });
    };

    render() {
        const { category, navigation } = this.props;
        const { icon, name, description, children } = category;
        return (
            <View>
                <TouchFeedback
                    authenticated
                    navigation={navigation}
                    style={[
                        styles.container,
                        children.length <= 0 && { borderBottomWidth: PxFit(0.5), borderBottomColor: Theme.borderColor },
                    ]}
                    onPress={this.onPress}>
                    <Image source={{ uri: icon }} style={styles.cover} />
                    <View style={styles.content}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.description} numberOfLines={1}>
                            {description}
                        </Text>
                    </View>
                    <TouchFeedback>
                        <Iconfont name={'right'} size={16} color={Theme.secondaryTextColor} />
                    </TouchFeedback>
                </TouchFeedback>
                {children.length > 0 && (
                    <FlatList
                        data={children}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() + Date.now() : index.toString())}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <TouchFeedback
                                authenticated
                                navigation={navigation}
                                style={{ paddingVertical: PxFit(10) }}
                                onPress={() => navigation.navigate('Answer', { category: item, question_id: null })}
                                key={index}>
                                <View style={styles.item}>
                                    <Text style={styles.minText}>{item.name}</Text>
                                </View>
                            </TouchFeedback>
                        )}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: PxFit(15),
    },
    cover: {
        height: PxFit(48),
        width: PxFit(48),
        borderRadius: PxFit(5),
        backgroundColor: '#f0f0f0',
    },
    content: {
        flex: 1,
        paddingHorizontal: PxFit(15),
    },
    name: {
        fontSize: PxFit(16),
        fontWeight: '400',
        color: Theme.defaultTextColor,
    },
    description: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
        paddingTop: PxFit(5),
    },

    item: {
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: (Device.WIDTH - PxFit(75)) / 3.5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#FAF0E6',
        marginLeft: PxFit(15),
    },
    minText: {
        fontSize: 12,
        // paddingTop: 6,
        color: Theme.grey,
    },
});

export default PlateItem;
