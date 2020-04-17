import {
    StyleSheet
} from 'react-native'

/**
 * styles
 * author smallapes
 */
const styles = StyleSheet.create({
    scrollTab:{
    },
    tabBarStyle:{
        height:44,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd"
    },
    tabBarItemStyle:{
        justifyContent:"center",
        alignItems:"center",
    },
    tabBarItemTitleStyle:{
        fontSize:15,
        color:"#333",
    },
    tabBarTextActiveStyle:{
        fontSize:16,
        color:"red",
        fontWeight:'bold',
    },
    pageStyle:{

    },
    tabBarUnderLineStyle :{
        position:"absolute",
        height:3,
        backgroundColor:"red",
        bottom:0,
    }
})

export default styles;