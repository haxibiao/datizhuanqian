import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { PageContainer, Iconfont, CustomTextInput, ListFooter } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, NAVBAR_HEIGHT, Tools } from 'utils';
import { syncGetter, exceptionCapture } from 'common';
import { app, storage, keys } from '@src/store';
import { useApolloClient, useQuery, GQL } from 'apollo';
import { useNavigation } from 'react-navigation-hooks';
import SearchRecord from './components/SearchRecord';
import CategoryItem from './components/CategoryItem';
import { debounce } from 'src/utils/Tools/adapter';

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
        return Tools.debounce(async (keyword, isCache) => {
            const trimmedKeyword = keyword && keyword.trim();
            if (trimmedKeyword && trimmedKeyword.length > 0) {
                const categoriesQuery = () => {
                    return client.query({
                        query: GQL.SearchCategoriesQuery,
                        variables: { limit: 999, keyword: trimmedKeyword },
                        fetchPolicy: 'network-only',
                    });
                };

                const [error, result] = await exceptionCapture(categoriesQuery);
                const categoriesData = syncGetter('data.categories', result);
                if (isCache) {
                    addRecord(trimmedKeyword);
                }
                if (error) {
                    //
                } else if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                }
            }
        }, 400);
    }, [client]);

    const onChangeText = useCallback(
        text => {
            setKeyword(prv => {
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
        <PageContainer hiddenNavBar>
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={1} onPress={backButtonPress} style={styles.backButton}>
                    <Iconfont name="left" color={Theme.primaryTextColor} size={PxFit(21)} />
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrap}>
                        <CustomTextInput
                            value={keyword}
                            placeholder="搜索话题"
                            onChangeText={onChangeText}
                            style={{ flex: 1 }}
                        />
                    </View>
                    <TouchableOpacity style={styles.closeButton} activeOpacity={0.8} onPress={() => onChangeText('')}>
                        <View style={styles.closeLabel}>
                            <Iconfont name="close" size={PxFit(14)} color={'#fff'} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => searchCategories(keyword, true)}
                    style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>搜索</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                {keyword ? (
                    <FlatList
                        data={categories}
                        contentContainerStyle={styles.contentStyle}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={({ item, index }) => <CategoryItem category={item} />}
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
        </PageContainer>
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
        paddingTop: PxFit(20),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(20),
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    itemSeparator: {
        height: PxFit(1),
        marginLeft: PxFit(70 + Theme.itemSpace),
        marginVertical: PxFit(20),
        backgroundColor: '#f0f0f0',
    },
    header: {
        height: PxFit(NAVBAR_HEIGHT),
        paddingTop: PxFit(Theme.statusBarHeight + 6),
        paddingBottom: PxFit(6),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.navBarSeparatorColor,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: PxFit(45),
        paddingLeft: PxFit(10),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    searchButton: {
        paddingHorizontal: PxFit(10),
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
        overflow: 'hidden',
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
        fontSize: PxFit(15),
        color: Theme.secondaryColor,
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
});

export default Search;
