import { Link, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { addPost } from './square/postsStore';

const categories=[
  '找工作',
  '租房',
  '二手',
  '求助',
  '本地生活'
];

export default function PublishSquareScreen(){
  const router=useRouter();

  const [selectedCategory,setSelectedCategory]=useState('找工作');
  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [location,setLocation]=useState('');
  const [price,setPrice]=useState('');
  const [contact,setContact]=useState('');

  const clearForm=useCallback(()=>{
    setSelectedCategory('找工作');
    setTitle('');
    setContent('');
    setLocation('');
    setPrice('');
    setContact('');
  },[]);

  useFocusEffect(
    useCallback(()=>{
      clearForm();
    },[clearForm])
  );

  const getTitlePlaceholder=()=>{
    if(selectedCategory==='找工作'){
      return '例如：本人找仓库工作，会开叉车';
    }

    if(selectedCategory==='租房'){
      return '例如：罗兰岗单间出租';
    }

    if(selectedCategory==='二手'){
      return '例如：九成新电脑桌出售';
    }

    if(selectedCategory==='求助'){
      return '简单说明需要什么帮助';
    }

    return '简单说明你想分享什么';
  };

  const getContentPlaceholder=()=>{
    if(selectedCategory==='找工作'){
      return '介绍一下工作经验、会什么、什么时候可以上班等...';
    }

    if(selectedCategory==='租房'){
      return '介绍房间、停车、环境、入住要求等...';
    }

    if(selectedCategory==='二手'){
      return '介绍物品新旧程度、使用情况、取货方式等...';
    }

    if(selectedCategory==='求助'){
      return '详细说明你遇到的情况以及需要什么帮助...';
    }

    return '详细写一下你想发布的信息...';
  };

  const handlePublish=()=>{
    const cleanTitle=title.trim();
    const cleanContent=content.trim();
    const cleanLocation=location.trim();
    const cleanPrice=price.trim();
    const cleanContact=contact.trim();

    if(!cleanTitle){
      Alert.alert('提示','请填写标题');
      return;
    }

    if(!cleanContent){
      Alert.alert('提示','请填写详细内容');
      return;
    }

    if(!cleanLocation){
      Alert.alert('提示','请填写所在地区');
      return;
    }

    if(
      (selectedCategory==='租房' ||
        selectedCategory==='二手') &&
      !cleanPrice
    ){
      Alert.alert(
        '提示',
        selectedCategory==='租房'
          ? '请填写月租'
          : '请填写价格'
      );
      return;
    }

    if(
      selectedCategory==='找工作' &&
      !cleanContact
    ){
      Alert.alert('提示','请填写联系方式');
      return;
    }

    let rightText='刚刚发布';
    let isPrice=false;

    if(selectedCategory==='租房'){
      rightText=`$${cleanPrice}/月`;
    }

    if(selectedCategory==='二手'){
      rightText=`$${cleanPrice}`;
      isPrice=true;
    }

    addPost({
      id:Date.now(),
      userName:'我',
      avatar:'我',
      category:selectedCategory,
      meta:`刚刚 · ${cleanLocation}`,
      title:cleanTitle,
      body:cleanContent,
      location:cleanLocation,
      rightText,
      price:isPrice,
      contact:
        selectedCategory==='找工作'
          ? cleanContact
          : undefined
    });

    clearForm();
    router.replace('/square');
  };

  return(
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS==='ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >

      {/* 顶部 */}
      <View style={styles.header}>
        <Link href="/square" asChild>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.headerTitle}>
          发布信息
        </Text>

        <View style={styles.headerRight}/>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >

        {/* 分类 */}
        <Text style={styles.label}>
          发布到
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
          keyboardShouldPersistTaps="handled"
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
                  setSelectedCategory(category);
                  setTitle('');
                  setContent('');
                  setPrice('');
                  setContact('');
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

        {/* 标题 */}
        <Text style={styles.label}>
          {selectedCategory==='找工作'
            ? '期望工作'
            : selectedCategory==='二手'
              ? '商品名称'
              : '标题'}
        </Text>

        <TextInput
          style={styles.normalInput}
          value={title}
          onChangeText={setTitle}
          placeholder={getTitlePlaceholder()}
          placeholderTextColor="#AAAAAA"
          maxLength={60}
        />

        {/* 正文 */}
        <Text style={styles.label}>
          {selectedCategory==='找工作'
            ? '个人介绍'
            : selectedCategory==='租房'
              ? '房源介绍'
              : selectedCategory==='二手'
                ? '商品描述'
                : '详细内容'}
        </Text>

        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder={getContentPlaceholder()}
          placeholderTextColor="#AAAAAA"
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />

        <Text style={styles.countText}>
          {content.length}/1000
        </Text>

        {/* 位置 */}
        <Text style={styles.label}>
          所在地区
        </Text>

        <TextInput
          style={styles.normalInput}
          value={location}
          onChangeText={setLocation}
          placeholder="例如 Ontario、San Gabriel"
          placeholderTextColor="#AAAAAA"
        />

        {/* 租房价格 */}
        {selectedCategory==='租房'&&(
          <>
            <Text style={styles.label}>
              月租
            </Text>

            <View style={styles.moneyInputWrap}>
              <Text style={styles.moneySymbol}>
                $
              </Text>

              <TextInput
                style={styles.moneyInput}
                value={price}
                onChangeText={setPrice}
                placeholder="850"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
              />

              <Text style={styles.moneyUnit}>
                /月
              </Text>
            </View>
          </>
        )}

        {/* 二手价格 */}
        {selectedCategory==='二手'&&(
          <>
            <Text style={styles.label}>
              价格
            </Text>

            <View style={styles.moneyInputWrap}>
              <Text style={styles.moneySymbol}>
                $
              </Text>

              <TextInput
                style={styles.moneyInput}
                value={price}
                onChangeText={setPrice}
                placeholder="35"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
              />
            </View>
          </>
        )}

        {/* 找工作联系方式 */}
        {selectedCategory==='找工作'&&(
          <>
            <Text style={styles.label}>
              联系方式
            </Text>

            <TextInput
              style={styles.normalInput}
              value={contact}
              onChangeText={setContact}
              placeholder="电话、微信或其他联系方式"
              placeholderTextColor="#AAAAAA"
            />
          </>
        )}

        {/* 提示 */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>
            发布说明
          </Text>

          <Text style={styles.tipText}>
            信息广场用于个人求职、租房、二手、求助和本地生活信息。
          </Text>

          <Text style={styles.tipText}>
            商家招聘信息请前往地图页面发布。
          </Text>
        </View>

        {/* 发布 */}
        <TouchableOpacity
          style={styles.publishButton}
          activeOpacity={0.85}
          onPress={handlePublish}
        >
          <Text style={styles.publishButtonText}>
            发布
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F5F6F7'
  },

  header:{
    height:105,
    paddingTop:48,
    paddingHorizontal:14,
    backgroundColor:'#FFFFFF',
    borderBottomWidth:1,
    borderBottomColor:'#EEEEEE',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },

  backButton:{
    width:44,
    height:44,
    justifyContent:'center',
    alignItems:'center'
  },

  backText:{
    color:'#111111',
    fontSize:38,
    fontWeight:'300',
    lineHeight:40,
    marginTop:-4
  },

  headerTitle:{
    color:'#111111',
    fontSize:18,
    fontWeight:'900'
  },

  headerRight:{
    width:44,
    height:44
  },

  scroll:{
    flex:1
  },

  content:{
    padding:16,
    paddingBottom:80
  },

  label:{
    marginTop:8,
    marginBottom:10,
    color:'#222222',
    fontSize:15,
    fontWeight:'900'
  },

  categoryRow:{
    paddingBottom:14
  },

  categoryButton:{
    height:36,
    paddingHorizontal:15,
    marginRight:8,
    borderRadius:18,
    backgroundColor:'#ECEEEF',
    justifyContent:'center',
    alignItems:'center'
  },

  categoryButtonActive:{
    backgroundColor:'#6F8F7A'
  },

  categoryText:{
    color:'#555555',
    fontSize:13,
    fontWeight:'700'
  },

  categoryTextActive:{
    color:'#FFFFFF',
    fontWeight:'900'
  },

  normalInput:{
    height:50,
    paddingHorizontal:15,
    backgroundColor:'#FFFFFF',
    borderRadius:15,
    color:'#111111',
    fontSize:15,
    marginBottom:18
  },

  contentInput:{
    minHeight:180,
    paddingHorizontal:15,
    paddingTop:15,
    paddingBottom:15,
    backgroundColor:'#FFFFFF',
    borderRadius:15,
    color:'#111111',
    fontSize:15,
    lineHeight:22
  },

  countText:{
    marginTop:6,
    marginBottom:12,
    textAlign:'right',
    color:'#AAAAAA',
    fontSize:11
  },

  moneyInputWrap:{
    height:50,
    paddingHorizontal:15,
    marginBottom:18,
    backgroundColor:'#FFFFFF',
    borderRadius:15,
    flexDirection:'row',
    alignItems:'center'
  },

  moneySymbol:{
    color:'#222222',
    fontSize:16,
    fontWeight:'800',
    marginRight:5
  },

  moneyInput:{
    flex:1,
    height:50,
    color:'#111111',
    fontSize:15
  },

  moneyUnit:{
    color:'#777777',
    fontSize:13,
    fontWeight:'700'
  },

  tipBox:{
    backgroundColor:'#EEF3F0',
    borderRadius:15,
    padding:14,
    marginTop:5,
    marginBottom:24
  },

  tipTitle:{
    color:'#466052',
    fontSize:13,
    fontWeight:'900',
    marginBottom:7
  },

  tipText:{
    color:'#65736A',
    fontSize:12,
    lineHeight:19
  },

  publishButton:{
    height:54,
    borderRadius:17,
    backgroundColor:'#111111',
    justifyContent:'center',
    alignItems:'center'
  },

  publishButtonText:{
    color:'#FFFFFF',
    fontSize:16,
    fontWeight:'900'
  }
});