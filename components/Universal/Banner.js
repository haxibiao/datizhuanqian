import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import Swiper from "react-native-swiper";

import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

class Banner extends Component {
	render() {
		let { size = 50, color = Colors.theme, type = "ThreeBounce", isVisible = true } = this.props;
		return (
			<View style={styles.container}>
				<Swiper
					autoplay={true}
					autoplayTimeout={5}
					paginationStyle={{ bottom: 10 }}
					activeDotColor="#fff"
					showsPagination={false}
				>
					<Image
						source={{
							uri:
								"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543913182396&di=e51b0c30c58addd3c281ed01782dfcd5&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0157975987e5f5a8012156030e7341.jpg"
						}}
						style={styles.img}
					/>
					<Image
						source={{
							uri:
								"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543913209691&di=71d73beae5bfe28d25a8f91912020442&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F18%2F88%2F94%2F80858PICcTK_1024.jpg"
						}}
						style={styles.img}
					/>
					<Image
						source={{
							uri:
								"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543913243620&di=d26b702c862588366f9c7a37851e4831&imgtype=0&src=http%3A%2F%2Fpic2.ooopic.com%2F11%2F65%2F54%2F78bOOOPICca_1024.jpg"
						}}
						style={styles.img}
					/>
				</Swiper>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 74,
		alignItems: "center",
		justifyContent: "center"
	},
	img: {
		width,
		height: 74,
		resizeMode: "cover"
	}
});

export default Banner;
