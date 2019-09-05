/*
 * @flow
 * created by wyk made in 2018-12-14 13:25:56
 */
'use strict';
import React, { Component } from 'react';
import { Image, View, StyleSheet } from 'react-native';

type Props = {
	uri: string,
	width?: number,
	height?: number,
	max?: { width: number, height: number },
	resizeMode?: 'cover' | 'contain',
	style?: View.PropTypes.style
};
class ResponseImage extends Component {
	static defaultProps = {
		resizeMode: 'cover'
	};

	constructor() {
		super();
		this.state = {
			calc_width: null,
			calc_height: null
		};
	}

	componentDidMount() {
		let { max, width: image_width, height: image_height } = this.props;
		Image.getSize(this.props.uri, (width, height) => {
			if (image_width && !image_height) {
				this.setState({
					calc_width: image_width,
					calc_height: height * (image_width / width)
				});
			} else if (!image_width && image_height) {
				this.setState({
					calc_width: width * (image_height / height),
					calc_height: image_height
				});
			} else if (max) {
				if (width >= height) {
					this.setState({
						calc_width: max.width,
						calc_height: height * (max.width / width)
					});
				} else {
					this.setState({
						calc_width: width * (max.height / height),
						calc_height: max.height
					});
				}
			} else {
				this.setState({ calc_width: width, calc_height: height });
			}
		});
	}

	render() {
		let { uri, style, resizeMode } = this.props;
		let { calc_width, calc_height } = this.state;
		style = {
			width: calc_width,
			height: calc_height,
			...style
		};
		return (
			<View style={style}>
				<Image source={{ uri }} style={style} resizeMode={resizeMode} />
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default ResponseImage;
