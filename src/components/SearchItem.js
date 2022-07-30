import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

function SearchItem(props) {
  return (
    <TouchableOpacity
      style={{...styles.wrapper, borderColor: props.fg}}
      onPress={() => props.onPress(props.cfi)}>
      <Text style={{...styles.text, color: props.fg}}>
        {props.excerpt.trim()}
      </Text>
    </TouchableOpacity>
  );
}

export default SearchItem;

const styles = {
  wrapper: {
    width: '90%',
    padding: 5,
    borderWidth: 1,

    borderRadius: 3,
    marginTop: 15,
  },
  text: {
    fontSize: 15,
  },
};
