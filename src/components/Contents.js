import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import ContentItem from './ContentItem';

function Contents(props) {
  if (props.bookContents === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {props.level !== undefined && props.level !== 0 && (
          <Divider
            width={5}
            orientation="vertical"
            style={{marginRight: 5}}
            color={props.fg === '#000000' ? 'lightgrey' : props.fg}
          />
        )}
        <View style={{flex: 1, flexDirection: 'column', gap: 100}}>
          {props.bookContents.map((item, i) => (
            <ContentItem
              {...item}
              key={i}
              onPress={props.goToLocation}
              level={props.level}
              bg={props.bg}
              fg={props.fg}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

export default Contents;

const styles = {
  scrollView: {flex: 1},
  scrollViewContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
};
