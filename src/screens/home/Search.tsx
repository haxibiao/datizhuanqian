import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { PageContainer, Iconfont, CustomTextInput, ListFooter, Loading } from 'components';

import { storage, keys } from '@src/store';
import { useApolloClient, GQL } from 'apollo';
import { useNavigation } from 'react-navigation-hooks';
import SearchRecord from './components/SearchRecord';
import RecommendCategoryItem from './components/RecommendCategoryItem';

const Search = () => {
    const navigation = useNavigation();
    const client = useApolloClient();

    const backButtonPress = useCallback(() => {
        navigation.goBack();
    }, []);

    const [keyword, setKeyword] = useState('');
    const [categories, setCategories] = useState();
    const [recordData, setRecordData] = useState([]);

    const searchCategories = useMemo(() => {
        return __.debounce(async (keyword, isCache) => {
            const trimmedKeyword = keyword && keyword.trim();
            if (trimmedKeyword && trimmedKeyword.length > 0) {
                const categoriesQuery = () => {
                    return client.query({
                        query: GQL.SearchCategoriesQuery,
                        variables: { keyword: trimmedKeyword, limit: 100, allow_submit: -1 },
                        fetchPolicy: 'network-only',
                    });
                };

                const [error, result] = await Helper.exceptionCapture(categoriesQuery);
                const categoriesData = Helper.syncGetter('data.categories', result);

                if (isCache) {
                    addRecord(trimmedKeyword);
                    Loading.hide();
                }
                if (error) {
                    //
                    Loading.hide();
                } else if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                    Loading.hide();
                }
            }
        }, 400);
    }, [client]);

    const onChangeText = useCallback(
        text => {
            setKeyword(() => {
                setCategories();
                searchCategories(text);
                return text;
            });
        },
        [searchCategories],
    );

    const addRecord = useCallback(keyword => {
        setRecordData(prv => {
            const newData = [...new Set([keyword, ...prv])].slice(0, 12);
            storage.setItem(keys.searchRecord, newData);
            return newData;
        });
    }, []);

    const getRecord = useCallback(async () => {
        const record = await storage.getItem(keys.searchRecord);
        if (record) {
            setRecordData(record);
        }
    }, []);

    const removeRecord = useCallback(() => {
        setRecordData([]);
        storage.removeItem(keys.searchRecord);
    }, []);

    const search = useCallback(
        keyword => {
            setKeyword(keyword);
            searchCategories(keyword, true);
        },
        [searchCategories],
    );

    useEffect(() => {
        getRecord();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                {/*  <TouchableOpacity activeOpacity={1} onPress={backButtonPress} style={styles.backButton}>
                    <Iconfont name="left" color={Theme.primaryTextColor} size={PxFit(21)} />
                </TouchableOpacity> */}
                <View style={styles.inputContainer}>
                    <Image style={styles.searchImage} source={require('@src/assets/images/ic_search_category.png')} />
                    <View style={styles.inputWrap}>
                        <CustomTextInput
                            value={keyword}
                            autoFocus
                            placeholder="搜索你感兴趣的题库"
                            onChangeText={onChangeText}
                            TextColor={'#DDDDDD'}
                            style={{ flex: 1, marginLeft: PxFit(6), fontSize: Font(12) }}
                        />
                    </View>
                    <TouchableOpacity style={styles.closeButton} activeOpacity={0.8} onPress={() => onChangeText('')}>
                        <View style={styles.closeLabel}>
                            <Iconfont name="close" size={PxFit(14)} color={'#fff'} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>取消</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                {keyword ? (
                    <FlatList
                        data={categories}
                        contentContainerStyle={styles.contentStyle}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={({ item }) => <RecommendCategoryItem category={item} />}
                        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                        ListHeaderComponent={() => {
                            if (Array.isArray(categories)) {
                                if (categories.length < 1) {
                                    return (
                                        <View style={styles.emptyComponent}>
                                            <Text style={styles.highlightText}>"{keyword}"</Text>
                                            <Text style={styles.notFoundText}>没有找到相关内容</Text>
                                        </View>
                                    );
                                } else {
                                    return null;
                                }
                            }
                            return (
                                <View style={styles.listHeader}>
                                    <Iconfont name="search" size={PxFit(18)} color={Theme.subTextColor} />
                                    <Text style={styles.searchText}>
                                        搜索"<Text style={styles.highlightText}>{keyword}</Text>"
                                    </Text>
                                </View>
                            );
                        }}
                        ListFooterComponent={() => {
                            if (Array.isArray(categories) && categories.length > 0) {
                                return (
                                    <View style={styles.listFooter}>
                                        <ListFooter finished={true} />
                                    </View>
                                );
                            } else {
                                return null;
                            }
                        }}
                    />
                ) : (
                    <SearchRecord data={recordData} remove={removeRecord} search={search} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentStyle: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: PxFit(Theme.itemSpace),
        paddingBottom: Device.HOME_INDICATOR_HEIGHT + PxFit(20),
    },
    itemSeparator: {
        // height: PxFit(1),
        marginLeft: PxFit(70 + Theme.itemSpace),
        marginVertical: PxFit(20),
        backgroundColor: '#f0f0f0',
    },
    header: {
        height: Device.NAVBAR_HEIGHT,
        paddingTop: PxFit(Device.statusBarHeight + 6),
        paddingBottom: PxFit(6),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.navBarSeparatorColor,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PxFit(15),
    },
    backButton: {
        width: PxFit(45),
        paddingLeft: PxFit(10),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    searchButton: {
        paddingLeft: PxFit(15),
        alignSelf: 'stretch',
        justifyContent: 'center',
        textAlign: 'center',
    },
    inputContainer: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: PxFit(5),
        paddingLeft: PxFit(10),
        paddingRight: PxFit(7),
        backgroundColor: Theme.groundColour,
        borderRadius: PxFit(30),
        // overflow: 'hidden',
    },
    inputWrap: {
        flex: 1,
        alignSelf: 'stretch',
    },
    closeButton: {
        paddingLeft: PxFit(10),
        width: PxFit(30),
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeLabel: {
        width: PxFit(16),
        height: PxFit(16),
        borderRadius: PxFit(8),
        backgroundColor: '#e9e9e9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        fontSize: Font(14),
        color: '#999999',
    },
    searchText: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
        marginLeft: PxFit(2),
    },
    highlightText: {
        fontSize: PxFit(13),
        color: Theme.secondaryColor,
    },
    notFoundText: {
        fontSize: PxFit(14),
        color: Theme.subTextColor,
    },
    emptyComponent: {
        paddingVertical: PxFit(Theme.itemSpace),
        alignItems: 'center',
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listFooter: {
        paddingTop: PxFit(Theme.itemSpace),
    },
    searchImage: {
        height: PxFit(20),
        width: PxFit(20),
    },
});

export default Search;
