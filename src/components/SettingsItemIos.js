import React from 'react';
import {View, Text, ActionSheetIOS, Button} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';

function SettingsItemIos(props) {
  const names = props.items.map((obj) => {
    return obj.label;
  });
  const values = props.items.map((obj) => {
    return obj.value;
  });

  names.push('Cancel');
  var buttonTitle = 'Select';
  let index = values.indexOf(props.settings[props.id]);
  if (index !== undefined && index !== -1) {
    buttonTitle = names[index].toString();
  }
  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: names,
        userInterfaceStyle: 'dark',
        cancelButtonIndex: names.length - 1,
      },
      (buttonIndex) => {
        if (buttonIndex === names.length - 1) return;
        props.updateSettings({[props.id]: values[buttonIndex]});
        buttonTitle = names[buttonIndex];
      },
    );
  return (
    <View style={styles.wrapper}>
      <Text style={{...styles.text, color: props.fg}}>{props.text}</Text>
      <View style={{...styles.pickerWrapper, borderColor: props.fg}}>
        <Button style={styles.picker} title={buttonTitle} onPress={onPress} />
      </View>
    </View>
  );
}

function mapStateToProps(state) {
  return {settings: state.settings};
}

export default connect(mapStateToProps, actions)(SettingsItemIos);

const styles = {
  wrapper: {
    width: '100%',
    height: 80,
    justifyContent: 'space-evenly',
    marginTop: 15,
  },
  pickerWrapper: {
    height: 45,
    width: '90%',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    paddingLeft: 2,
    paddingBottom: 6,
  },
  picker: {
    width: '100%',
  },
};
