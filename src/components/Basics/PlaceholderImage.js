/*
 * @flow
 * created by wyk made in 2018-12-06 16:06:03
 */
import React, { Component } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Theme, PxFit } from '../../utils';

const ViewProps = require('ViewPropTypes');

type Props = {
	size?: number,
	style?: typeof ViewProps,
	...Image.propTypes
};

class PlaceholderImage extends Component<Props> {
	static defaultProps = {
		style: {},
		resizeMode: 'cover'
	};

	constructor() {
		super();
		this.state = {
			error: false
		};
	}

	render() {
		let { style, source, resizeMode } = this.props;
		if (this.state.error || !source || !source.uri || !source.uri.includes('http')) {
			return <View style={[styles.container, style]} />;
		}
		return (
			<View style={[styles.container, style]}>
				<Image
					source={source}
					resizeMode={resizeMode}
					style={styles.content}
					onLoad={this._onLoad}
					onError={this._onError}
					onLayout={this._onLayout}
				/>
			</View>
		);
	}

	_onLoad = () => {
		const { onLoad } = this.props;
		onLoad && onLoad();
	};

	_onError = () => {
		this.setState({
			error: true
		});
		const { onError } = this.props;
		onError && onError();
	};

	_onLayout = () => {
		const { onLayout } = this.props;
		onLayout && onLayout();
	};
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Theme.groundColour,
		overflow: 'hidden'
	},
	content: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	}
});

export default PlaceholderImage;
