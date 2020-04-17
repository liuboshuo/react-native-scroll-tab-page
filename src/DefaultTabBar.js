/**
 * DefaultTabBar
 * author smallapes
 */
import React from 'react'
import PropTypes from 'prop-types'
import {
    ScrollView,
    View,
    TouchableOpacity,
    Text,
    Animated,
} from 'react-native'
import styles from './style'
/**
 * DefaultTabBar
 */
class DefaultTabBar extends React.Component {

    /**
     * 渲染tabBarIten
     */
    _renderTabBarItem = ({item,index})=>{
        const { tabBarTextStyle,
                tabBarActiveTextStyle, 
                activeTab , 
                goToTab , 
                tabItemWidth,
                onTabClick
        } = this.props;
        // 选中样式
        let selectedStyle = {}
        if(index === activeTab){
            selectedStyle = {
                ...styles.tabBarTextActiveStyle,
                ...tabBarActiveTextStyle
            }
        }
        return (
            <TouchableOpacity key={index} 
                              style={{
                                ...styles.tabBarItemStyle,
                                ...{ width: tabItemWidth}
                              }} 
                              activeOpacity={0.6} 
                              onPress={()=>{
                                onTabClick&&onTabClick(item,index)
                                goToTab&&goToTab(item,index)
                              }}>
                <Text style={{
                                ...styles.tabBarItemTitleStyle,
                                ...tabBarTextStyle,...selectedStyle
                            }}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        )
    }

    /**
     * 提供外界，移动tabBar的选中tabBarItem到屏幕中点
     * @param {*} x 
     */
    scrollToX(x){
        this._scrollTabBarView.scrollTo({x:x,y:0,animated:true})
    }
    
    render(){
        const { WIDTH , tabs , tabItemWidth ,scrollValue , tabBarUnderlineStyle} = this.props;
        return (
            <View style={{...styles.tabBarStyle,...{width:WIDTH}}}>
                <ScrollView horizontal={true} 
                            ref={ref => this._scrollTabBarView = ref}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            automaticallyAdjustContentInsets={false}
                            scrollsToTop={false}
                            bounces={false}         
                >
                    {
                        tabs.map((item,index)=>this._renderTabBarItem({item,index}))
                    }
                    <Animated.View style={{
                        ...styles.tabBarUnderLineStyle, ...{
                            ...tabBarUnderlineStyle,
                            width:tabItemWidth,
                            left: scrollValue.interpolate({
                                inputRange:[0,1],
                                outputRange: [ 0 , tabItemWidth ]
                            })
                        }
                    }} />
                </ScrollView>
            </View>
        )
    }
}

DefaultTabBar.propTypes  = {
    activeTab: PropTypes.number.isRequired,
    goToTab : PropTypes.func.isRequired,
    tabItemWidth: PropTypes.number.isRequired,
    tabs:PropTypes.array.isRequired,
    WIDTH:PropTypes.number.isRequired,
    tabBarTextStyle: PropTypes.object,
    tabBarActiveTextStyle: PropTypes.object,
    tabBarUnderlineStyle: PropTypes.object,
    onTabClick:PropTypes.func,
}

export default DefaultTabBar