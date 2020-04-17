import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import ScrollTab from 'react-native-scroll-tab-page'
class App extends React.Component {

  state = {
    tabs1:[{title:"tab1"},{title:"tab2"},{title:"tab3"},{title:"tab4"},{title:"tab5"},{title:"tab6"}],
    tabs2:[{title:"tab1"},{title:"tab2"},{title:"tab3"},{title:"tab4"},{title:"tab5"},{title:"tab6"},{title:"tab7"},{title:"tab8"}],
    page:2
  }

  renderPage1 = (item,index) => {
    return (
      <View style={{flex:1,margin:5, padding: 3, backgroundColor:"orange"}}>
        <Text>{item.title}</Text>
        {
          index != 1 && <TouchableOpacity onPress={()=>{
            this.scrollTab.goToPage(1)
          }}>
            <Text>回到第1页</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
  
  renderPage = (item,index) => {
    return (
      <View style={styles.tabPageStyle}>
        <Text>{item.title}</Text>
      </View>
    )
  }

  renderTabBar = (tabBarOptions) =>{
    const { tabs , tabItemWidth ,activeTab , goToTab  } = tabBarOptions;
    return (
      <View style={{flexDirection:"row",backgroundColor:'purple'}}>
        {tabs.map((item,index)=>{
          let tabBarItemActiveStyle = {};
          if(activeTab == index){
            tabBarItemActiveStyle = {
              color:"red",
              fontSize:16,
              fontWeight:'bold'
            }
          }
          return(
            // width必须是tabItemWidth
            <TouchableOpacity key={index} style={{width:tabItemWidth,alignItems:"center",justifyContent:"center"}} onPress={()=>goToTab(item,index)}>
              <Text style={{...{color:'#333'},...tabBarItemActiveStyle}}>{item.title}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
  render(){
    const { tabs1 , tabs2, page} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex:1}}>
          <ScrollView>

            <Text>1、基本用法(数组长度超出5，tabBar自动滚动)</Text>
            <ScrollTab tabs={tabs1}
                      style={{height:120}}>
              <View style={styles.tabPageStyle}>
                <Text>tab1</Text>
              </View>
              <View style={styles.tabPageStyle}>
                <Text>tab2</Text>
              </View>
              <View style={styles.tabPageStyle}>
                <Text>tab3</Text>
              </View>
              <View style={styles.tabPageStyle}>
                <Text>tab4</Text>
              </View>
              <View style={styles.tabPageStyle}>
                <Text>tab5</Text>
              </View>
              <View style={styles.tabPageStyle}>
                <Text>tab6</Text>
              </View>
            </ScrollTab>

            <Text>2、基本用法(内容页面提供方法进行渲染)</Text>
            <ScrollTab tabs={tabs2}
                       style={{height:120}}>
              {this.renderPage}
            </ScrollTab>

            <Text>3、基本用法(自定义tabBar)</Text>
            <ScrollTab tabs={tabs2}
                       ref={ref=>this.scrollTab = ref}
                       style={{height:320}}
                       renderTabBar={(tabBarOptions)=>this.renderTabBar(tabBarOptions)}
                       page={page}
                       onChange={(item,index)=>this.setState({page:index})}
                       onTabClick={(item,index)=>console.log(index)}
            >
              {this.renderPage1}
            </ScrollTab>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  tabPageStyle:{
    marginVertical: 10,
    marginHorizontal:15,
    backgroundColor:"gray",
    flex:1,
    flexDirection:"row",
    justifyContent:'center',
    alignItems:'center'
  }
});

export default App;
