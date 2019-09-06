/*
 * @flow
 * created by wyk made in 2019-01-14 21:26:46
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Theme, PxFit, Api } from '../../utils';
import Iconfont from '../Iconfont';
import TouchFeedback from '../TouchableView/TouchFeedback';
import OverlayViewer from '../Overlay/OverlayViewer';
import ImageViewer from 'react-native-image-zoom-viewer';

type Props = {
    multiple?: boolean,
    horizontal?: boolean,
    maximum?: number,
    PickerView?: any,
    pickerStyle?: Object,
    style?: any,
    contentContainerStyle?: any,
    onResponse?: Function,
};
class ImagePickedViewer extends Component<Props> {
    static defaultProps = {
        maximum: 9,
        multiple: true,
        horizontal: true,
        contentContainerStyle: { paddingRight: PxFit(Theme.itemSpace) },
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            pictures: [],
        };
    }

    savedImages = [];

    openImagePicker = () => {
        const { multiple } = this.props;
        Api.imagePicker(
            images => {
                let imagesPath;
                if (multiple) {
                    imagesPath = images.map(image => `data:${image.mime};base64,${image.data}`);
                } else {
                    imagesPath = [`data:${images.mime};base64,${images.data}`];
                }
                this.saveImages(imagesPath);
            },
            {
                multiple,
                includeBase64: true,
            },
        );
    };

    saveImages = imagesPath => {
        const { pictures } = this.state;
        const { maximum } = this.props;
        const newPictures = pictures.concat(imagesPath);

        if (newPictures.length > maximum) {
            newPictures.splice(maximum);
            Toast.show({ content: `最多上传${maximum}张图片` });
        }
        this.setState({ pictures: newPictures }, () => {
            this.onResponse(this.state.pictures);
        });
    };

    removePicture = pictureIndex => {
        const { pictures } = this.state;
        pictures.splice(pictureIndex, 1);
        this.setState({ pictures }, () => {
            this.onResponse(this.state.pictures);
        });
    };

    removeAllPicture = () => {
        this.setState({ pictures: [] });
    };

    // 把上传的图片暴露出去
    onResponse = images => {
        this.props.onResponse && this.props.onResponse(images);
    };

    showPicture = url => {
        const overlayView = (
            <ImageViewer onSwipeDown={() => OverlayViewer.hide()} imageUrls={[{ url }]} enableSwipeDown />
        );
        OverlayViewer.show(overlayView);
    };

    renderPictures = (pictures: Array) => {
        return pictures.map((elem, index) => {
            return this.renderPicture(elem, index);
        });
    };

    renderPicture = (item, index) => {
        const { pickerStyle } = this.props;
        return (
            <TouchFeedback key={index} onPress={() => this.showPicture(item)} style={[styles.itemWrap, pickerStyle]}>
                <Image source={{ uri: item }} style={styles.imageItem} />
                <TouchFeedback style={styles.close} onPress={() => this.removePicture(index)}>
                    <Iconfont name="close" size={PxFit(10)} color="#fff" />
                </TouchFeedback>
            </TouchFeedback>
        );
    };

    renderFooter = pictureQuantity => {
        let { pickerStyle, PickerView, maximum } = this.props;
        if (!PickerView) {
            PickerView = <Iconfont name="add" size={PxFit(30)} color="#696482" />;
        }
        if (pictureQuantity < maximum) {
            return (
                <TouchFeedback style={[styles.itemWrap, pickerStyle]} onPress={this.openImagePicker}>
                    {PickerView}
                </TouchFeedback>
            );
        } else {
            return <View />;
        }
    };

    render() {
        const { pictures } = this.state;
        const { horizontal, contentContainerStyle, style, multiple } = this.props;
        const pictureQuantity = pictures.length;
        if (horizontal) {
            return (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={contentContainerStyle}>
                    {pictureQuantity > 0 && this.renderPictures(pictures)}
                    {!(pictureQuantity > 0 && !multiple) && this.renderFooter(pictureQuantity)}
                </ScrollView>
            );
        } else {
            return (
                <View style={[styles.flexContainer, style]}>
                    {pictureQuantity > 0 && this.renderPictures(pictures)}
                    {!(pictureQuantity > 0 && !multiple) && this.renderFooter(pictureQuantity)}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    close: {
        position: 'absolute',
        top: PxFit(3),
        right: PxFit(3),
        width: PxFit(16),
        height: PxFit(16),
        borderRadius: PxFit(16) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(32,30,51,0.8)',
    },
    itemWrap: {
        width: PxFit(68),
        height: PxFit(68),
        marginRight: PxFit(Theme.itemSpace),
        borderRadius: PxFit(4),
        backgroundColor: '#F1EFFA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageItem: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    flexContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default ImagePickedViewer;
