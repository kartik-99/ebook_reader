import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {Divider} from 'react-native-elements/dist/divider/Divider';

function AnnotationItem(props) {
  return (
    <TouchableOpacity
      style={{...styles.wrapper, borderColor: props.fg}}
      onPress={() => props.onPress(props.cfi)}>
      <Divider width={10} orientation="vertical" color={props.color} />
      <View style={{flexDirection: 'column'}}>
        <Text style={{...styles.text, color: props.fg}}>{props.text}</Text>
        {props.note !== undefined && props.note && (
          <>
            <Text style={{...styles.text, fontWeight: 'bold', color: props.fg}}>
              Note :
            </Text>
            <Text style={{...styles.text, color: props.fg}}>{props.note}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default AnnotationItem;

const styles = {
  wrapper: {
    width: '95%',
    padding: 5,
    borderWidth: 1,

    borderRadius: 3,
    marginTop: 15,
    flexDirection: 'row',
  },
  text: {
    fontSize: 15,
    marginLeft: 5,
    marginRight: 15,
  },
};
