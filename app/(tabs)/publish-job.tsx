import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const categories=['仓库物流','餐饮','司机运输','建筑装修','清洁家政','美容美甲','工厂生产','办公室','销售零售','维修技术','其它工作'];
const PUBLISHED_JOBS_KEY='findwork_published_jobs';

const initialRegion:Region={
  latitude:34.0522,
  longitude:-118.2437,
  latitudeDelta:0.08,
  longitudeDelta:0.08
};

export default function PublishJobScreen(){
  const mapRef=useRef<MapView>(null);

  const [category,setCategory]=useState('餐馆');
  const [jobTitle,setJobTitle]=useState('');
  const [company,setCompany]=useState('');
  const [salary,setSalary]=useState('');
  const [people,setPeople]=useState('');
  const [description,setDescription]=useState('');
  const [contact,setContact]=useState('');

  const [addressLine1,setAddressLine1]=useState('');
  const [addressLine2,setAddressLine2]=useState('');
  const [city,setCity]=useState('');
  const [stateProvince,setStateProvince]=useState('');
  const [zip,setZip]=useState('');

  const [latitude,setLatitude]=useState<number|null>(null);
  const [longitude,setLongitude]=useState<number|null>(null);
  const [searchingAddress,setSearchingAddress]=useState(false);
  const [publishing,setPublishing]=useState(false);

  const clearLocation=()=>{
    setLatitude(null);
    setLongitude(null);
  };

  const getFullAddress=()=>{
    const parts=[
      addressLine1.trim(),
      addressLine2.trim(),
      city.trim(),
      stateProvince.trim().toUpperCase(),
      zip.trim(),
      'USA'
    ].filter(Boolean);

    return parts.join(', ');
  };

  const searchAddress=async()=>{
    const line1=addressLine1.trim();
    const cityValue=city.trim();
    const stateValue=stateProvince.trim();
    const zipValue=zip.trim();

    if(!line1||!cityValue||!stateValue||!zipValue){
      Alert.alert(
        '地址不完整',
        '请填写 Address Line 1、City、State / Province 和 ZIP / Postal Code。Address Line 2 可以留空。'
      );
      return;
    }

    const fullAddress=getFullAddress();

    try{
      setSearchingAddress(true);

      const results=await Location.geocodeAsync(fullAddress);

      if(results.length===0){
        Alert.alert(
          '未找到地址',
          '没有找到这个工作地点，请检查门牌号、街道、城市、州和邮编是否正确。'
        );
        return;
      }

      const result=results[0];

      setLatitude(result.latitude);
      setLongitude(result.longitude);

      mapRef.current?.animateToRegion({
        latitude:result.latitude,
        longitude:result.longitude,
        latitudeDelta:0.01,
        longitudeDelta:0.01
      },500);

    }catch(error){
      console.log('地址搜索失败:',error);

      Alert.alert(
        '地址定位失败',
        '暂时无法定位这个地址，请检查网络后再试。'
      );

    }finally{
      setSearchingAddress(false);
    }
  };


  const publishJob=async()=>{
    if(!jobTitle.trim()){
      Alert.alert('还差一点','请填写职位名称。');
      return;
    }
    if(!company.trim()){
      Alert.alert('还差一点','请填写店铺 / 公司名称。');
      return;
    }
    if(!salary.trim()){
      Alert.alert('还差一点','请填写薪资。');
      return;
    }
    if(latitude===null||longitude===null){
      Alert.alert('请先确认地址','填写完整工作地址后，点击“确认工作地点”。');
      return;
    }
    if(!contact.trim()){
      Alert.alert('还差一点','请填写联系方式。');
      return;
    }

    try{
      setPublishing(true);
      const fullAddress=getFullAddress();
      const raw=await AsyncStorage.getItem(PUBLISHED_JOBS_KEY);
      const oldJobs=raw ? JSON.parse(raw) : [];
      const now=Date.now();
      const newJob={
        id:now,
        area:city.trim(),
        title:jobTitle.trim(),
        shortTitle:jobTitle.trim(),
        category,
        pay:salary.trim(),
        shortPay:salary.trim(),
        extra:description.trim() || `${company.trim()} 招聘`,
        distance:'',
        time:'刚刚',
        latitude,
        longitude,
        keywords:[jobTitle,company,description].filter(Boolean).join(' '),
        company:company.trim(),
        people:people.trim(),
        description:description.trim(),
        contact:contact.trim(),
        addressLine1:addressLine1.trim(),
        addressLine2:addressLine2.trim(),
        city:city.trim(),
        state:stateProvince.trim().toUpperCase(),
        zip:zip.trim(),
        fullAddress,
        createdAt:now
      };

      await AsyncStorage.setItem(PUBLISHED_JOBS_KEY,JSON.stringify([newJob,...oldJobs]));
      Alert.alert('发布成功','招聘已经发布到地图。',[{
        text:'查看地图',
        onPress:()=>router.replace('/')
      }]);
    }catch(error){
      console.log('发布招聘失败:',error);
      Alert.alert('发布失败','招聘暂时没有保存成功，请再试一次。');
    }finally{
      setPublishing(false);
    }
  };

  return(
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS==='ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.headerTitle}>发布招聘</Text>
        <View style={styles.headerRight}/>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Text style={styles.label}>职位类别</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
          keyboardShouldPersistTaps="handled"
        >
          {categories.map(item=>{
            const active=category===item;

            return(
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  active&&styles.categoryButtonActive
                ]}
                activeOpacity={0.8}
                onPress={()=>setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active&&styles.categoryTextActive
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>职位名称</Text>

        <TextInput
          style={styles.normalInput}
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholder="例如：仓库叉车工"
          placeholderTextColor="#AAAAAA"
          maxLength={50}
        />

        <Text style={styles.label}>店铺 / 公司名称</Text>

        <TextInput
          style={styles.normalInput}
          value={company}
          onChangeText={setCompany}
          placeholder="例如：ABC Warehouse"
          placeholderTextColor="#AAAAAA"
          maxLength={60}
        />

        <Text style={styles.label}>薪资</Text>

        <TextInput
          style={styles.normalInput}
          value={salary}
          onChangeText={setSalary}
          placeholder="例如：$22/小时"
          placeholderTextColor="#AAAAAA"
          maxLength={30}
        />

        <Text style={styles.label}>招聘人数</Text>

        <TextInput
          style={styles.normalInput}
          value={people}
          onChangeText={setPeople}
          placeholder="例如：2"
          placeholderTextColor="#AAAAAA"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>工作介绍 / 要求</Text>

        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          placeholder="介绍工作内容、工作时间、经验要求、语言要求等..."
          placeholderTextColor="#AAAAAA"
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />

        <Text style={styles.countText}>
          {description.length}/1000
        </Text>

        <Text style={styles.label}>工作地址</Text>

        <Text style={styles.addressHint}>
          请填写准确的工作地址。确认后，这个招聘会显示在地图对应的位置。
        </Text>

        <View style={styles.addressBox}>
          <Text style={styles.addressFieldLabel}>
            Address Line 1
          </Text>

          <TextInput
            style={styles.addressInput}
            value={addressLine1}
            onChangeText={text=>{
              setAddressLine1(text);
              clearLocation();
            }}
            placeholder="例如：123 Main St"
            placeholderTextColor="#AAAAAA"
            autoCorrect={false}
            autoCapitalize="words"
          />

          <Text style={styles.addressFieldLabel}>
            Address Line 2
            <Text style={styles.optionalText}>  可选</Text>
          </Text>

          <TextInput
            style={styles.addressInput}
            value={addressLine2}
            onChangeText={text=>{
              setAddressLine2(text);
              clearLocation();
            }}
            placeholder="例如：Apt 4B / Suite 200"
            placeholderTextColor="#AAAAAA"
            autoCorrect={false}
            autoCapitalize="words"
          />

          <View style={styles.addressRow}>
            <View style={styles.cityColumn}>
              <Text style={styles.addressFieldLabel}>
                City
              </Text>

              <TextInput
                style={styles.smallAddressInput}
                value={city}
                onChangeText={text=>{
                  setCity(text);
                  clearLocation();
                }}
                placeholder="Williston"
                placeholderTextColor="#AAAAAA"
                autoCorrect={false}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.stateColumn}>
              <Text style={styles.addressFieldLabel}>
                State
              </Text>

              <TextInput
                style={styles.smallAddressInput}
                value={stateProvince}
                onChangeText={text=>{
                  setStateProvince(text.toUpperCase());
                  clearLocation();
                }}
                placeholder="ND"
                placeholderTextColor="#AAAAAA"
                autoCorrect={false}
                autoCapitalize="characters"
                maxLength={20}
              />
            </View>
          </View>

          <Text style={styles.addressFieldLabel}>
            ZIP / Postal Code
          </Text>

          <TextInput
            style={styles.addressInput}
            value={zip}
            onChangeText={text=>{
              setZip(text);
              clearLocation();
            }}
            placeholder="例如：58801"
            placeholderTextColor="#AAAAAA"
            autoCorrect={false}
            keyboardType="numbers-and-punctuation"
            returnKeyType="search"
            onSubmitEditing={searchAddress}
          />

          <TouchableOpacity
            style={[
              styles.locationButton,
              searchingAddress&&styles.locationButtonDisabled
            ]}
            activeOpacity={0.8}
            onPress={searchAddress}
            disabled={searchingAddress}
          >
            <Text style={styles.locationButtonText}>
              {searchingAddress ? '正在确认地址...' : '确认工作地点'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapBox}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
          >
            {latitude!==null&&longitude!==null&&(
              <Marker
                coordinate={{
                  latitude,
                  longitude
                }}
                title={company || jobTitle || '工作地点'}
              />
            )}
          </MapView>
        </View>

        {latitude!==null&&longitude!==null ? (
          <View style={styles.locationResult}>
            <Text style={styles.locationResultTitle}>
              ✓ 已确认工作地点
            </Text>

            <Text style={styles.locationResultAddress}>
              {getFullAddress()}
            </Text>

            <Text style={styles.coordinateText}>
              纬度：{latitude.toFixed(6)}
            </Text>

            <Text style={styles.coordinateText}>
              经度：{longitude.toFixed(6)}
            </Text>
          </View>
        ):(
          <Text style={styles.mapHint}>
            填写完整地址后点击“确认工作地点”，地图会自动定位到招聘地址。
          </Text>
        )}

        <Text style={styles.label}>联系方式</Text>

        <TextInput
          style={styles.normalInput}
          value={contact}
          onChangeText={setContact}
          placeholder="电话、微信或其他联系方式"
          placeholderTextColor="#AAAAAA"
        />

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>
            地图位置
          </Text>

          <Text style={styles.tipText}>
            发布前需要确认准确工作地点。系统会保存完整地址以及经纬度，招聘发布后会显示在地图对应的位置。
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.publishButton,publishing&&styles.publishButtonDisabled]}
          activeOpacity={0.85}
          onPress={publishJob}
          disabled={publishing}
        >
          <Text style={styles.publishButtonText}>
            {publishing ? '正在发布...' : '发布招聘'}
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

  descriptionInput:{
    minHeight:160,
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

  addressHint:{
    color:'#888888',
    fontSize:12,
    lineHeight:18,
    marginTop:-4,
    marginBottom:10
  },

  addressBox:{
    backgroundColor:'#FFFFFF',
    borderRadius:15,
    padding:14,
    marginBottom:12
  },

  addressFieldLabel:{
    color:'#444444',
    fontSize:12,
    fontWeight:'800',
    marginBottom:7
  },

  optionalText:{
    color:'#AAAAAA',
    fontSize:11,
    fontWeight:'600'
  },

  addressInput:{
    height:48,
    paddingHorizontal:13,
    backgroundColor:'#F5F6F7',
    borderRadius:12,
    color:'#111111',
    fontSize:15,
    marginBottom:14
  },

  addressRow:{
    flexDirection:'row',
    gap:10
  },

  cityColumn:{
    flex:2
  },

  stateColumn:{
    flex:1
  },

  smallAddressInput:{
    height:48,
    paddingHorizontal:13,
    backgroundColor:'#F5F6F7',
    borderRadius:12,
    color:'#111111',
    fontSize:15,
    marginBottom:14
  },

  locationButton:{
    height:46,
    borderRadius:12,
    backgroundColor:'#6F8F7A',
    justifyContent:'center',
    alignItems:'center',
    marginTop:2
  },

  locationButtonDisabled:{
    opacity:0.6
  },

  locationButtonText:{
    color:'#FFFFFF',
    fontSize:14,
    fontWeight:'900'
  },

  mapBox:{
    height:230,
    borderRadius:18,
    overflow:'hidden',
    backgroundColor:'#E9EDEB',
    marginBottom:12
  },

  map:{
    flex:1
  },

  mapHint:{
    color:'#718078',
    fontSize:12,
    lineHeight:18,
    marginBottom:20,
    paddingHorizontal:4
  },

  locationResult:{
    backgroundColor:'#EEF3F0',
    borderRadius:15,
    padding:14,
    marginBottom:20
  },

  locationResultTitle:{
    color:'#466052',
    fontSize:13,
    fontWeight:'900',
    marginBottom:7
  },

  locationResultAddress:{
    color:'#34453B',
    fontSize:13,
    fontWeight:'700',
    lineHeight:19,
    marginBottom:8
  },

  coordinateText:{
    color:'#65736A',
    fontSize:11,
    lineHeight:17
  },

  tipBox:{
    backgroundColor:'#EEF3F0',
    borderRadius:15,
    padding:14,
    marginTop:2,
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

  publishButtonDisabled:{
    opacity:0.6
  },

  publishButtonText:{
    color:'#FFFFFF',
    fontSize:16,
    fontWeight:'900'
  }
});