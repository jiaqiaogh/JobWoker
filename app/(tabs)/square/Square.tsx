import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getPosts } from './postsStore';

const categories=[
  '全部',
  '找工作',
  '租房',
  '二手',
  '求助',
  '本地生活'
];

export default function Square(){
  const [selectedCategory,setSelectedCategory]=useState('全部');
  const [searchText,setSearchText]=useState('');
  const [posts,setPosts]=useState(getPosts());

  useFocusEffect(
    useCallback(()=>{
      setPosts([...getPosts()]);
    },[])
  );

  const filteredPosts=posts.filter(post=>{
    const matchCategory=
      selectedCategory==='全部' ||
      post.category===selectedCategory;

    const keyword=searchText.trim().toLowerCase();

    const matchSearch=
      keyword==='' ||
      post.title.toLowerCase().includes(keyword) ||
      post.body.toLowerCase().includes(keyword) ||
      post.location.toLowerCase().includes(keyword) ||
      post.userName.toLowerCase().includes(keyword) ||
      post.category.toLowerCase().includes(keyword) ||
      post.rightText.toLowerCase().includes(keyword);

    return matchCategory&&matchSearch;
  });

  return(
    <View style={styles.container}>

      {/* 顶部 */}
      <View style={styles.header}>
        <Text style={styles.title}>
          信息广场
        </Text>

        <Text style={styles.subtitle}>
          看看附近的人都在发布什么
        </Text>

        {/* 搜索框 */}
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="搜索信息"
            placeholderTextColor="#999"
            clearButtonMode="while-editing"
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>

        {/* 分类 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map(category=>{
            const active=selectedCategory===category;

            return(
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  active&&styles.categoryButtonActive
                ]}
                activeOpacity={0.8}
                onPress={()=>{
                  setSelectedCategory(current=>
                    current===category
                      ? '全部'
                      : category
                  );
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active&&styles.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 信息流 */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredPosts.length>0 ? (
          filteredPosts.map(post=>(
            <View
              key={post.id}
              style={styles.postCard}
            >

              <View style={styles.postTop}>

                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {post.avatar}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {post.userName}
                  </Text>

                  <Text style={styles.postMeta}>
                    {post.meta}
                  </Text>
                </View>

                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {post.category}
                  </Text>
                </View>

              </View>

              <Text style={styles.postTitle}>
                {post.title}
              </Text>

              <Text style={styles.postBody}>
                {post.body}
              </Text>

              <View style={styles.postBottom}>

                <Text style={styles.postBottomText}>
                  {post.location}
                </Text>

                <Text
                  style={
                    post.price
                      ? styles.priceText
                      : styles.postBottomText
                  }
                >
                  {post.rightText}
                </Text>

              </View>

            </View>
          ))
        ):(
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>
              没有找到相关信息
            </Text>

            <Text style={styles.emptyText}>
              换个关键词或分类试试
            </Text>
          </View>
        )}

        <View style={styles.bottomSpace}/>
      </ScrollView>

      {/* 底部导航 */}
      <View style={styles.bottomDock}>

        {/* 地图 */}
        <Link href="/" asChild>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <View style={styles.inactiveDot}/>

            <Text style={styles.navText}>
              地图
            </Text>
          </TouchableOpacity>
        </Link>

        {/* 信息广场 */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <View style={styles.activeDot}/>

          <Text style={styles.navTextActive}>
            信息广场
          </Text>
        </TouchableOpacity>

        {/* 发布 */}
        <View style={styles.plusSpace}>
          <Link href="/publish-square" asChild>
            <TouchableOpacity
              style={styles.plusButton}
              activeOpacity={0.85}
            >
              <Text style={styles.plusText}>
                +
              </Text>
            </TouchableOpacity>
          </Link>

          <Text style={styles.plusLabel}>
            发布
          </Text>
        </View>

        {/* 收藏 */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <View style={styles.inactiveDot}/>

          <Text style={styles.navText}>
            收藏
          </Text>
        </TouchableOpacity>

        {/* 我的 */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <View style={styles.inactiveDot}/>

          <Text style={styles.navText}>
            我的
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F5F6F7'
  },

  header:{
    paddingTop:58,
    backgroundColor:'#fff',
    borderBottomWidth:1,
    borderBottomColor:'#EEEEEE'
  },

  title:{
    paddingHorizontal:18,
    fontSize:28,
    color:'#111',
    fontWeight:'900'
  },

  subtitle:{
    marginTop:4,
    paddingHorizontal:18,
    fontSize:13,
    color:'#888',
    fontWeight:'600'
  },

  searchWrap:{
    marginTop:16,
    marginHorizontal:16
  },

  searchInput:{
    height:46,
    paddingHorizontal:16,
    backgroundColor:'#F3F4F5',
    borderRadius:15,
    color:'#111',
    fontSize:14
  },

  categoryContent:{
    paddingHorizontal:16,
    paddingTop:12,
    paddingBottom:13
  },

  categoryButton:{
    height:34,
    paddingHorizontal:14,
    marginRight:8,
    borderRadius:17,
    backgroundColor:'#F2F3F4',
    justifyContent:'center',
    alignItems:'center'
  },

  categoryButtonActive:{
    backgroundColor:'#6F8F7A'
  },

  categoryText:{
    color:'#555',
    fontSize:13,
    fontWeight:'700'
  },

  categoryTextActive:{
    color:'#fff',
    fontWeight:'800'
  },

  feed:{
    flex:1
  },

  feedContent:{
    paddingTop:12,
    paddingHorizontal:12,
    flexGrow:1
  },

  postCard:{
    backgroundColor:'#fff',
    borderRadius:18,
    padding:16,
    marginBottom:10
  },

  postTop:{
    flexDirection:'row',
    alignItems:'center'
  },

  avatar:{
    width:42,
    height:42,
    borderRadius:21,
    backgroundColor:'#E8F0EB',
    justifyContent:'center',
    alignItems:'center'
  },

  avatarText:{
    color:'#6F8F7A',
    fontSize:16,
    fontWeight:'900'
  },

  userInfo:{
    flex:1,
    marginLeft:10
  },

  userName:{
    color:'#222',
    fontSize:14,
    fontWeight:'800'
  },

  postMeta:{
    marginTop:3,
    color:'#999',
    fontSize:11,
    fontWeight:'600'
  },

  tag:{
    paddingHorizontal:9,
    paddingVertical:5,
    borderRadius:10,
    backgroundColor:'#EEF3F0'
  },

  tagText:{
    color:'#6F8F7A',
    fontSize:11,
    fontWeight:'800'
  },

  postTitle:{
    marginTop:14,
    color:'#111',
    fontSize:17,
    fontWeight:'900'
  },

  postBody:{
    marginTop:8,
    color:'#555',
    fontSize:14,
    lineHeight:21
  },

  postBottom:{
    marginTop:15,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },

  postBottomText:{
    color:'#999',
    fontSize:12,
    fontWeight:'600'
  },

  priceText:{
    color:'#365E7D',
    fontSize:15,
    fontWeight:'900'
  },

  emptyWrap:{
    flex:1,
    minHeight:300,
    justifyContent:'center',
    alignItems:'center',
    paddingBottom:60
  },

  emptyTitle:{
    color:'#444',
    fontSize:16,
    fontWeight:'800'
  },

  emptyText:{
    marginTop:7,
    color:'#999',
    fontSize:13,
    fontWeight:'600'
  },

  bottomSpace:{
    height:105
  },

  bottomDock:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    height:92,
    backgroundColor:'rgba(255,255,255,0.98)',
    borderTopWidth:1,
    borderTopColor:'#ECECEC',
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'space-around',
    paddingTop:13,
    paddingBottom:18,
    zIndex:100,
    shadowColor:'#000',
    shadowOpacity:0.08,
    shadowRadius:12,
    shadowOffset:{
      width:0,
      height:-3
    },
    elevation:25
  },

  navItem:{
    flex:1,
    height:58,
    justifyContent:'center',
    alignItems:'center'
  },

  activeDot:{
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor:'#6F8F7A',
    marginBottom:7
  },

  inactiveDot:{
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor:'#D8D8D8',
    marginBottom:7
  },

  navText:{
    color:'#888',
    fontSize:11,
    fontWeight:'700'
  },

  navTextActive:{
    color:'#6F8F7A',
    fontSize:11,
    fontWeight:'900'
  },

  plusSpace:{
    flex:1,
    height:65,
    alignItems:'center',
    marginTop:-15
  },

  plusButton:{
    width:58,
    height:58,
    borderRadius:29,
    backgroundColor:'#111',
    borderWidth:5,
    borderColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
    shadowColor:'#000',
    shadowOpacity:0.22,
    shadowRadius:8,
    shadowOffset:{
      width:0,
      height:4
    },
    elevation:12
  },

  plusText:{
    color:'#fff',
    fontSize:34,
    fontWeight:'300',
    lineHeight:36,
    marginTop:-2
  },

  plusLabel:{
    marginTop:2,
    color:'#777',
    fontSize:10,
    fontWeight:'700'
  }
});