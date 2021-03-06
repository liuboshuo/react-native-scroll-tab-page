react-native实现一个简单的标签页组件

### 前言

`react-native-scroll-tab-page`是一个可滑动的标签页组件。源码[react-native-scroll-tab-page](https://github.com/liuboshuo/react-native-scroll-tab-page)

相信很多伙伴都有写过滑动标签页的功能，react-native官方没有提供这个组件。但是很多大佬都写开发了自己的滑动标签页组件。其中有`react-native-scroll-tab`等。相信很多伙伴都用过。因此，我也开发一个属于自己的标签页组件，具体实现查看[源码](https://github.com/liuboshuo/react-native-scroll-tab-page)

可以`clone`源码` cd Example/ `运行`Example`查看运行的效果。下面介绍使用方法

### 提供的属性和方法介绍

`ScrollTab `
属性|说明|类型|默认值|必选
-|-|-|-|-
tabs|tab数据|Array<{title:''}>|-|true
page|当前选中的页面index|number|-|false
style|组件样式(没有高度的话内容显示不出来)|object|-|false
onTabClick|tab点击触发|(tab: Array<{title:''}>, index: number) => void|-|false
onChange|tab变化时触发|(tab: Array<{title:''}>, index: number) => void|-|false
renderTabBar|替换tab的tabBar|(tab: tabBarOptions) => React.ReactNode tabBarOptions见下面属性|-|false
tabBarTextStyle|tab的字体样式|object|-|false
tabBarActiveTextStyle|tab选中字体样式|object|-|false
tabBarUnderlineStyle|tab选中下划线的样式|object|-|false

方法|说明|参数
-|-|-|
goToPage(index)|切换tab|跳转页面索引


`ScrollTab .DefaultTabBar`
属性|说明|类型|默认值|必选
-|-|-|-|-
tabs|tab数据|Array<{title:''}>|-|true
activeTab|当前选中的tab|number|-|true
tabItemWidth|tab每项的宽(自定义tabbar的时候，必须告诉你的组件每个显示的宽度)|number|-|true
goToTab|跳转tab|(index: number) => void|-|true
onTabClick|tab点击触发|(tab: Array<{title:''}>, index: number) => void|-|false
WIDTH|tab的宽|number|-|true


### 使用方法

```
npm install -S react-native-scroll-tab-page
```

下面是3种使用方法

```
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
```
运行效果图
![QQ截图20200417144352.png](https://upload-images.jianshu.io/upload_images/2152694-edeb934c638e24c5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

又兴趣的同学可以看源码
