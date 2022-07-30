import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Contents from './Contents';

function ContentItem(props) {
  const expandable = props.subitems !== undefined && props.subitems.length > 0;
  const [collapsed, setCollapsed] = useState(true);
  return (
    <View style={{flexDirection: 'column'}}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          padding: 3,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => props.onPress(props.href)}
          onLongPress={() => setCollapsed(!collapsed)}
          style={styles.wrapper}>
          <Text
            style={{
              ...styles.text,
              fontWeight: props.level === 0 ? 'bold' : 'normal',
              color: props.fg,
            }}
            numberOfLines={1}>
            {props.label.trim()}
          </Text>
        </TouchableOpacity>

        {expandable && (
          <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
            <MaterialIcon
              name={collapsed ? 'chevron-left' : 'expand-more'}
              size={24}
              color={props.fg}
            />
          </TouchableOpacity>
        )}
      </View>
      <Divider />
      {expandable && collapsed === false && (
        <Contents
          bookContents={props.subitems}
          level={props.level + 1}
          goToLocation={props.onPress}
          bg={props.bg}
          fg={props.fg}
        />
      )}
    </View>
  );
}

export default ContentItem;

const styles = {
  wrapper: {
    height: 40,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text: {
    width: '100%',
    fontSize: 15,
  },
};
