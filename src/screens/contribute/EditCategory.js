/*
 * @flow
 * created by wyk made in 2019-06-05 09:16:56
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	FlatList
} from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Button, SearchBar } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools } from 'utils';

import { Query, GQL } from 'apollo';
import ContributeStore from './ContributeStore';
import { observer, Provider } from 'mobx-react';

@observer
class CategoryItem extends Component {
	render() {
		let { category, selectedCategory, selectCategory } = this.props;
		let selected = selectedCategory && selectedCategory.id === category.id;
		return (
			<TouchFeedback disabled={!category.user_can_submit} onPress={() => selectCategory(category)}>
				<View style={styles.categoryItem}>
					<View style={styles.iconWrap}>
						<Image source={{ uri: category.icon }} style={styles.categoryIcon} />
					</View>
					<View style={{ flex: 1, marginRight: PxFit(Theme.itemSpace) }}>
						<Text style={styles.categoryName} numberOfLines={1}>
							{category.name}
						</Text>
						{!category.user_can_submit && (
							<Text style={{ fontSize: PxFit(12), color: Theme.secondaryColor }} numberOfLines={1}>
								您暂时没有该分类的投稿权限
							</Text>
						)}
					</View>
					{selected && <Iconfont name={'correct'} size={PxFit(20)} color={Theme.primaryColor} />}
				</View>
			</TouchFeedback>
		);
	}
}

@observer
class EditCategory extends Component {
	constructor(props) {
		super(props);
		this.contributeStore = new ContributeStore();
		this.state = {
			keyword: null
		};
	}

	onChangeText = keyword => {
		this.setState({ keyword });
	};

	render() {
		let { keyword } = this.state;
		let { category: selectedCategory, selectCategory } = this.contributeStore;
		return (
			<Query
				query={GQL.SearchCategoriesQuery}
				variables={{
					limit: 999,
					keyword
				}}
			>
				{({ data, loading, error, refetch, fetchMore }) => {
					let categories = Tools.syncGetter('categories', data);
					let empty = categories && categories.length === 0;
					loading = !categories;
					return (
						<PageContainer
							white
							title={
								<View
									style={{
										flex: 1,
										marginLeft: PxFit(40),
										marginVertical: PxFit(5)
									}}
								>
									<SearchBar
										onChangeText={Tools.debounce(this.onChangeText, 300)}
										placeholder="搜索题库"
									/>
								</View>
							}
							refetch={refetch}
							loading={loading}
							empty={empty}
						>
							<View style={styles.container}>
								<FlatList
									contentContainerStyle={styles.scrollStyle}
									showsVerticalScrollIndicator={false}
									data={categories}
									keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
									renderItem={({ item, index }) => (
										<CategoryItem
											category={item}
											selectedCategory={selectedCategory}
											selectCategory={selectCategory}
										/>
									)}
									ListFooterComponent={() => (
										<View style={styles.footer}>
											<Text style={styles.footerText}>--end--</Text>
										</View>
									)}
								/>
							</View>
						</PageContainer>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.groundColour
	},
	saveButton: {
		flex: 1,
		justifyContent: 'center'
	},
	saveText: {
		fontSize: PxFit(15),
		textAlign: 'center',
		color: Theme.secondaryColor
	},
	scrollStyle: {
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT
	},
	categoryItem: {
		paddingVertical: PxFit(10),
		paddingHorizontal: PxFit(Theme.itemSpace),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor,
		backgroundColor: '#fff'
	},
	iconWrap: {
		width: PxFit(36),
		height: PxFit(36),
		borderRadius: PxFit(18),
		backgroundColor: '#f0f0f0',
		marginRight: PxFit(10)
	},
	categoryIcon: {
		width: PxFit(36),
		height: PxFit(36),
		borderRadius: PxFit(18)
	},
	categoryName: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	},
	footer: {
		flex: 1,
		height: PxFit(44),
		justifyContent: 'center',
		paddingRight: PxFit(Theme.itemSpace)
	},
	footerText: {
		fontSize: PxFit(15),
		color: '#999',
		textAlign: 'center'
	}
});

export default EditCategory;
