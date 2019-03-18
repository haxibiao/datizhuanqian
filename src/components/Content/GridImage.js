/*
* @flow
* created by wyk made in 2018-12-13 11:38:24
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image } from 'react-native';
import { Theme, PxFit, Tools } from '../../utils';
import PlaceholderImage from '../Basics/PlaceholderImage';
import Row from '../Container/Row';
import OverlayViewer from '../Overlay/OverlayViewer';
import TouchFeedback from '../TouchableView/TouchFeedback';
import ImageViewer from 'react-native-image-zoom-viewer';

type Props = {
	images: Array<{
		id: any,
		url: any,
		width: any,
		height: any
	}>,
	gap?: number,
	style: any,
	gridStyle: any
};

class GridImage extends Component<Props> {
	static defaultProps = {
		gap: 6
	};

	state = {
		gridWidth: 0
	};

	_onLayout = e => {
		let { width } = e.nativeEvent.layout;
		this.setState({ gridWidth: width });
	};

	imagesLayout() {
		let { images, gap, style, gridStyle } = this.props;
		let { gridWidth } = this.state;
		if (images.length === 1) {
			let { width, height } = images[0];
			let style = Tools.singleImageResponse(width, height, gridWidth);
			gridStyle = {
				borderRadius: 4,
				...style,
				...gridStyle
			};
			return (
				<TouchFeedback onPress={() => this.showPicture(0)} style={{ alignSelf: 'flex-start' }}>
					<PlaceholderImage style={gridStyle} source={{ uri: images[0].url }} />
				</TouchFeedback>
			);
		} else {
			let size = (gridWidth - gap * 2) / 3;
			gridStyle = {
				width: size,
				height: size,
				marginRight: gap,
				marginTop: gap,
				borderRadius: 4,
				...gridStyle
			};
			if (images.length === 4) {
				return (
					<View style={{ marginTop: -gap }}>
						<Row>
							<TouchFeedback onPress={() => this.showPicture(0)}>
								<PlaceholderImage style={gridStyle} source={{ uri: images[0].url }} />
							</TouchFeedback>
							<TouchFeedback onPress={() => this.showPicture(1)}>
								<PlaceholderImage style={gridStyle} source={{ uri: images[1].url }} />
							</TouchFeedback>
						</Row>
						<Row>
							<TouchFeedback onPress={() => this.showPicture(2)}>
								<PlaceholderImage style={gridStyle} source={{ uri: images[2].url }} />
							</TouchFeedback>
							<TouchFeedback onPress={() => this.showPicture(3)}>
								<PlaceholderImage style={gridStyle} source={{ uri: images[3].url }} />
							</TouchFeedback>
						</Row>
					</View>
				);
			} else {
				images.length > 9 && images.splice(9);
				return (
					<View
						style={{
							flexDirection: 'row',
							flexWrap: 'wrap',
							marginTop: -gap,
							marginRight: -gap,
							overflow: 'hidden'
						}}
					>
						{images.map((elem, index) => {
							return (
								<TouchFeedback onPress={() => this.showPicture(index)} key={index}>
									<PlaceholderImage style={gridStyle} source={{ uri: elem.url }} />
								</TouchFeedback>
							);
						})}
					</View>
				);
			}
		}
	}

	showPicture = initIndex => {
		let overlayView = (
			<ImageViewer
				onSwipeDown={() => OverlayViewer.hide()}
				imageUrls={this.props.images}
				index={initIndex}
				enableSwipeDown
			/>
		);
		OverlayViewer.show(overlayView);
	};

	render() {
		let { gap } = this.props;
		return <View onLayout={this._onLayout}>{this.imagesLayout()}</View>;
	}
}

const styles = StyleSheet.create({});

export default GridImage;
