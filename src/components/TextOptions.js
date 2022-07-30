import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import {highlightColours as colours} from '../util/constants';

function TextOptions(props) {
  return (
    <>
      <View style={{...styles.view, backgroundColor: props.bg}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
          {colours.map((colour, i) => {
            return (
              <TouchableOpacity
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  ...styles.pageNoButton,
                  backgroundColor: colour,
                  borderColor:
                    props.selectedHighlight === undefined
                      ? '#ffffff00'
                      : colour === props.selectedHighlight.color
                      ? props.fg
                      : '#ffffff00',
                  borderWidth: 3,
                }}
                key={i}
                onPress={() => props.highlight(colour)}
              />
            );
          })}
        </ScrollView>
        {props.selectedHighlight !== undefined && (
          <View>
            <Divider orientation="vertical" />
            <TouchableOpacity
              style={styles.button}
              // disabled={props.markClicked}
              onPress={props.deleteAnnotation}>
              <MaterialIcon name="delete" size={20} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Divider width={1} />
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}>
        {props.selectedHighlight !== undefined && (
          <TextInput
            style={styles.input}
            textAlignVertical="top"
            onChangeText={props.updateNote}
            placeholder="Add a note..."
            defaultValue={
              props.note === undefined ? '' : props.selectedHighlight.note
            }
            multiline={true}
          />
        )}
      </View>
    </>
  );
}

export default TextOptions;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff0000',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    width: 35,
    height: 35,
  },
  icon: {padding: '2%', color: '#fff'},
  pageNoButton: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    borderRadius: 35,
    margin: 5,
  },
  input: {
    // height: 40,
    padding: 15,
  },
});
