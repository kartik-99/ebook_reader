import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

function Header(props) {
  return (
    <View style={{...styles.header, backgroundColor: props.bg}}>
      <TouchableOpacity
        onPress={() => {
          console.log('pressed back');
          props.goBack();
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <MaterialIcon name="arrow-back-ios" size={24} color={props.fg} />
        </View>
      </TouchableOpacity>
      <Text style={{...styles.headerText, color: props.fg}} numberOfLines={1}>
        {props.title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          console.log('pressed drawer');
          props.showDrawer();
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <MaterialIcon name="menu" size={24} color={props.fg} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Header;

const styles = new StyleSheet.create({
  header: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    flex: 1,
  },
  headerText: {
    width: 200,
    fontSize: 20,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
