import React, { Component } from 'react';
import { Image, ListView, StyleSheet, Text, View, RefreshControl, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import Grid from '../components/Grid';
import Modal from '../components/Modal';
import LoadingView from '../components/LoadingView';

var DATA = [
    {
        id: 1,
        name: '我是天气预报',
        iconPath: '../images/ad.png',
        bundleVersionId: 1,
    },
    {
        id: 2,
        name: '我是财务报表',
        iconPath: '../images/anchor.png',
        bundleVersionId: 2,
    },
    {
        id: 3,
        name: '我是数据监控',
        iconPath: '../images/atom.png',
        bundleVersionId: 3,
    },
    {
        id: 4,
        name: '我是流量统计',
        iconPath: '../images/backpack.png',
        bundleVersionId: 4,
    },
    {
        id: 5,
        name: '我不知道是啥',
        iconPath: '../images/badge.png',
        bundleVersionId: 5,
    }
];
let sign = false;
let dataSourceProgress = {};
const { width, height } = Dimensions.get('window');
export default class SecondPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => {
                    if (sign) {
                        return true
                    } else {
                        return row1 !== row2
                    }

                },
            }),
            swiperShow: false,
            loaded: false,
            isRefreshing: false,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                data: DATA,
                dataSource: this.state.dataSource.cloneWithRows(DATA),
                loaded: true,
            });
        }, 2000)
        setTimeout(() => {
            this.setState({ swiperShow: true });
        }, 0)
    }

    onIconClick(name, id, bundleVersionId) {
        this.onIconClickEnter(name, id, bundleVersionId)
    }
    onIconClickEnter(name, id, bundleVersionId) {
        sign = true
        var obj = {};
        obj[name] = 0.6;
        var dsp = Object.assign(dataSourceProgress, obj);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.data),
        })
        dataSourceProgress = dsp;

        setTimeout(() => {
            var dsp = Object.assign([], dataSourceProgress);
            delete dsp[name];
            dataSourceProgress = Object.assign([], dsp);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.data),
            });
        }, 5000);

    }
    onRefresh() {
        this.setState({
            isRefreshing: true
        });
        setTimeout(() => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(DATA),
                isRefreshing: false
            });
        }, 3000);
    }

    renderLoadingView() {
        return (
            <LoadingView />
        );
    }

    renderSwiper = () => {
        if (this.state.swiperShow) {
            return (
                <Swiper height={180}
                    dot={<View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}
                    activeDot={<View style={{ backgroundColor: '#FFFFFF', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}
                    paginationStyle={{
                        bottom: 10, right: 10, left: null,
                    }}
                    loop={true}
                    autoplay={false}
                    horizontal={true}
                    index={0}
                    autoplayTimeout={5}
                >
                    <View style={[styles.slide, { backgroundColor: '#9DD6EB', alignItems: 'center', justifyContent: 'center' }]} title={<Text numberOfLines={1}>Title for 1</Text>}>
                        {/*<Image resizeMode='stretch' style={styles.image} source={{ uri: 'uri' }} />*/}
                        <Text style={{ fontSize: 28, color: '#fff' }}>Qyellow</Text>
                    </View>
                    <View style={[styles.slide, { backgroundColor: '#97CAE5', alignItems: 'center', justifyContent: 'center' }]} title={<Text numberOfLines={1}>Title for 2</Text>}>
                        <Text style={{ fontSize: 28, color: '#fff' }}>Hello</Text>
                    </View>
                    <View style={[styles.slide, { backgroundColor: '#92BBD9', alignItems: 'center', justifyContent: 'center' }]} title={<Text numberOfLines={1}>Title for 3</Text>}>
                        <Text style={{ fontSize: 28, color: '#fff' }}>React Native</Text>
                    </View>
                </Swiper>
            );
        } else {
            return <View style={{ height: 150, }}></View>;
        }
    }

    renderIcon(icon) {
        var iconPic = require('../images/ad.png');
        var isDownLoading = dataSourceProgress[icon.name] !== undefined ? true : false;

        return (
            <Grid
                isDownLoading={isDownLoading}
                text={icon.name}
                iconPic={iconPic}
                activeOpacity={0.2}
                onPress={() => this.onIconClick(icon.name, icon.id, icon.bundleVersionId)}
                gridStyle={styles.bundleBlock}
                imageStyle={styles.bundleIcon}
                textStyle={styles.bundleName}
            />
        );
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                            tintColor="grey"
                            title="Loading..."
                            titleColor="grey"
                            colors={['grey', 'grey', 'grey']}
                            progressBackgroundColor="#F1F1F1"
                        />
                    }
                >
                    <View>
                        {this.renderSwiper()}
                    </View>

                    <View style={styles.listTitleBlock}>
                        <Text style={styles.listTitle}>可用模块</Text>
                    </View>
                    <ListView
                        style={styles.listViewBac}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderIcon.bind(this)}
                        contentContainerStyle={styles.listView}
                    />
                </ScrollView>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: '#F1F1F1'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width: width,
        flex: 1
    },
    listViewBac: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE'
    },
    listTitleBlock: {
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 5,
        borderLeftColor: '#3e9ce9',
        marginTop: 15
    },
    listTitle: {
        textAlign: 'left',
        fontSize: 14,
        margin: 10
    },
    listView: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    bundleBlock: {
        width: width / 4,
        height: 100,
        paddingTop: 20,
        alignItems: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE'
    },
    bundleName: {
        textAlign: 'center',
        fontSize: 10,
        marginTop: 10
    },
    bundleIcon: {
        width: 40,
        height: 40,
        borderRadius: 5
    }
});