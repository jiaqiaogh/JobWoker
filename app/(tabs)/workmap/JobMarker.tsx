import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';



type JobMarkerProps={
  title:string;
  pay:string;
  latitude:number;
  longitude:number;
  onPress:()=>void;
  selected:boolean;
};

function JobMarkerComponent({
  title,
  pay,
  latitude,
  longitude,
  onPress,
  selected
}:JobMarkerProps){

  const color=
    selected
      ? '#365E7D'
      : '#6F8F7A';

  return(
    <Marker
      coordinate={{
        latitude,
        longitude
      }}
      anchor={{x:0.5,y:1}}
      tracksViewChanges={false}
      zIndex={selected?999:1}
      onPress={event=>{
        event.stopPropagation();
        onPress();
      }}
    >

      <View style={styles.jobMarker}>

        <View
          style={[
            styles.jobBubble,
            {
              backgroundColor:color
            }
          ]}
        >
          <Text style={styles.bubbleTitle}>
            {title}
          </Text>

          <Text style={styles.bubblePay}>
            {pay}
          </Text>
        </View>

        <View
          style={[
            styles.bubbleTriangle,
            {
              borderTopColor:color
            }
          ]}
        />

        <View
          style={[
            styles.bubbleDot,
            {
              backgroundColor:color
            }
          ]}
        />

      </View>

    </Marker>
  );
}

// 用 React.memo 包一层：职位数据没变的图钉，父组件(WorkMap)状态变化
// (比如搜索框打字)时就不会跟着重新渲染，这是之前"元素多了卡顿"的主因之一
export default React.memo(JobMarkerComponent);

const styles=StyleSheet.create({

  jobMarker:{
    alignItems:'center'
  },

  jobBubble:{
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical:7,
    borderRadius:14,
    borderWidth:1.5,
    borderColor:'#fff'
  },

  bubbleTitle:{
    color:'#fff',
    fontSize:11,
    fontWeight:'700',
    marginRight:5
  },

  bubblePay:{
    color:'#fff',
    fontSize:12,
    fontWeight:'900'
  },

  bubbleTriangle:{
    width:0,
    height:0,
    borderLeftWidth:5,
    borderRightWidth:5,
    borderTopWidth:6,
    borderLeftColor:'transparent',
    borderRightColor:'transparent'
  },

  bubbleDot:{
    width:6,
    height:6,
    borderRadius:3,
    marginTop:1
  }

});