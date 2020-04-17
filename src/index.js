/***
 * react-native-scroll-tab
 * author smallapes
 */
import React , { Component } from 'react'
import PropTypes from 'prop-types'
import {
    View,
    ScrollView,
    Dimensions,
    Platform,
    ViewPropTypes,
    Animated,
} from 'react-native'
import styles from './style'
import DefaultTabBarComponent from './DefaultTabBar'

const { width } = Dimensions.get("window")
const ScreenWidth = width;

/**
 * 可以滚动的标签页
 */
class ScrollTab extends Component {

    constructor(props){
        super(props)
        const page = props.page || 0;
        this.state = {
            page:page,
            scrollValue: new Animated.Value(page),
            WIDTH: props.style && props.style.width != null ? props.style.width  : ScreenWidth, //  初始化组件宽度
        }
    }

    static getDerivedStateFromProps(props,state){
        // 从props中获取state
        state.tabs = [...(props.tabs || [])];
        if(props.page != null){
            state.page = props.page;
        }
        const { tabs , WIDTH } = state;
        // 计算tabBar的宽度
        const count = 5;
        let width = tabs.length <= count ? WIDTH / tabs.length : WIDTH / count;
        state.TabItemWidth = width || 0;
        return state;
    }
    
    componentDidMount(){
        // 初始化页面，移动到相应的page
        const { page ,tabs } = this.state;
        if(tabs && tabs.length){
            this._tabBarItemClick(tabs[page],page);

            // 页面变更回调
            const { onChange } = this.props;
            if(onChange){
                const { tabs } = this.props;
                onChange(tabs[page],page)
            }
        }
    }

    /**
     * tabBar点击事件
     */
    _tabBarItemClick = (item,index)=>{
        const { WIDTH } = this.state;
        // tabBar设置选中，移动位置
        this._tabScrollToIndex(index)
        setTimeout(()=>{
            // 底部scrollView移动到相应page
            this._scrollView.scrollTo({x:index*WIDTH,y:0,animated:true})
        })
    }

    /**
     * tabBar修正当前的位置
     * @param {*} index 
     */
    _tabScrollToIndex(index){
        const { TabItemWidth , WIDTH } = this.state;
        this._setPage(index);
        // 屏幕水平中点
        const centerX = WIDTH / 2;
        // index的tabBarItem的中点位置
        const itemX = index * TabItemWidth + TabItemWidth / 2;
        // index的tabBar移动到屏幕水平中点的偏移量
        let scrollX = itemX - centerX;
        if(scrollX <= 0){
            scrollX = 0;
        }
        const { tabs } = this.state;
        if (scrollX >= tabs.length * TabItemWidth ){
            scrollX = tabs.length * TabItemWidth - WIDTH;
        }
        // 移动tabBar
        if(this._scrollTabBarView){
            this._scrollTabBarView.scrollTo({x:scrollX,y:0,animated:true})
        }
        // 默认的DefaultTabBar移动偏移位置
        if(this.DefaultTabBar){
            this.DefaultTabBar.scrollToX(scrollX)
        }
    }

    /***
     * 设置当前选中
     */
    _setPage(selectIdx){
        const { tabs ,page } = this.state;
        if(selectIdx >= tabs.length || selectIdx === page){
            return;
        }
        let list = [];
        this.setState({tabs:[...list],page:selectIdx})
        this.state.scrollValue.setValue(selectIdx)

        // 页面变更回调
        const { onChange } = this.props;
        if(onChange){
            const { tabs } = this.props;
            onChange(tabs[selectIdx],selectIdx)
        }
    }

    /**
     * 滚动结束（代码滚动不会触发android）
     *  */ 
    _onAnimationEnd = (event) => {
        const { WIDTH } = this.state;
        const element= event.nativeEvent;
        const offsetX = element.contentOffset.x
        if(offsetX < 0){
            return
        }
        this._tabScrollToIndex(Math.floor(offsetX / WIDTH))
    }

    /**
     * 暴露外界，需要移动第几个页面
     *  */ 
    goToPage(index){
        const { WIDTH } = this.state;
        this._scrollView.scrollTo({x:index*WIDTH,y:0,animated:true})
        if(Platform.OS == 'android'){
            this._tabScrollToIndex(index)
        }
    }

    /**
     * 渲染内容也面
     * 1. this.props.children传入方法的时候，使用 回调function 渲染每页
     * 2. this.props.children不是方法的时候，直接遍历渲染children
     * */ 
    
    _renderPage = ()=>{
        const { children } = this.props;
        const { tabs , WIDTH } = this.state;
        if(children == null) return;
        if(typeof children === 'function' ){
            return tabs.map((item,index)=>{
                return (
                    <View key={index} style={{...styles.pageStyle,...{width:WIDTH}}}>
                        { children(item,index) }
                    </View>
                )
            })
        }else  {
            return React.Children.map(children,(child,index)=>{
                return (
                    <View key={index} style={{...styles.pageStyle,...{width:WIDTH}}}>
                        {child}
                    </View>
                )
            })
        }
    }
    
    /**
     * 渲染tabBar
     * 1. 传入 renderTabBar 属性 必须是function，返回自定义tabBar
     * 2. 使用默认的TabBar
     */
    renderTabBar = (props)=>{
        const { renderTabBar } = this.props
        const { WIDTH } = this.state;
        if(renderTabBar && typeof renderTabBar === 'function'){
            return (
                <View style={{width:WIDTH}}>
                    <ScrollView horizontal={true} 
                                ref={ref => this._scrollTabBarView = ref}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                automaticallyAdjustContentInsets={false}
                                scrollsToTop={false}     
                                bounces={false}    
                    >
                        {renderTabBar(props)}
                    </ScrollView>
                </View>
            )
        }else{
            return <DefaultTabBarComponent {...props} ref={(ref)=>this.DefaultTabBar=ref}/>
        }
    }

    render(){
        const { tabs , WIDTH,page,TabItemWidth,scrollValue } = this.state;
        const { style = {} ,tabBarTextStyle = {}, tabBarActiveTextStyle = {} , tabBarUnderlineStyle={} } = this.props;
        // tabBar的属性
        const tabBarProps = {
            WIDTH,
            tabBarTextStyle,
            tabBarActiveTextStyle,
            activeTab:page,
            tabs,
            tabItemWidth:TabItemWidth,
            goToTab:this._tabBarItemClick,
            scrollValue,
            tabBarUnderlineStyle
        }
        return (
            <View style={{...styles.scrollTab,...{width:WIDTH,...style}}}>
                {/* 渲染tabBar */}
                {this.renderTabBar(tabBarProps)}
                {/* 渲染内容页面 */}
                <View style={{width:WIDTH,flex:1}}>
                    <ScrollView horizontal={true} 
                                pagingEnabled={true}
                                ref={ref => this._scrollView = ref}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                automaticallyAdjustContentInsets={false}
                                onMomentumScrollEnd={this._onAnimationEnd}
                                scrollsToTop={false}         
                    >
                        {this._renderPage()}
                    </ScrollView>
                </View>
            </View>
        )
    }
}

ScrollTab.propTypes  = {
    tabs:PropTypes.array.isRequired,
    page:PropTypes.number,
    style: ViewPropTypes.style,
    onTabClick: PropTypes.func,
    onChange: PropTypes.func,
    renderTabBar: PropTypes.func,
    tabBarTextStyle: PropTypes.object,
    tabBarActiveTextStyle: PropTypes.object,
    tabBarUnderlineStyle: PropTypes.object,
}

export default ScrollTab;
export const DefaultTabBar = DefaultTabBarComponent;