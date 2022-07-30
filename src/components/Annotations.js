import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import AnnotationItem from './AnnotationItem';

function Annotations(props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function isHighlight(x) {
    return x.note === undefined || x.note.trim() === '';
  }

  function isNote(x) {
    return !isHighlight(x);
  }

  function renderResults(annotes) {
    return annotes.map((result, i) => (
      <AnnotationItem
        {...result}
        onPress={props.goToLocation}
        key={i}
        bg={props.bg}
        fg={props.fg}
      />
    ));
  }
  return (
    <>
      {props.highlights && (
        <>
          <ButtonGroup
            selectedButtonStyle={{backgroundColor: '#000'}}
            buttons={['All', 'Highlights', 'Notes']}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
            }}
            containerStyle={{marginBottom: 20}}
          />
          <ScrollView>
            {selectedIndex === 0 && renderResults(props.highlights)}
            {selectedIndex === 1 &&
              renderResults(props.highlights.filter(isHighlight))}
            {selectedIndex === 2 &&
              renderResults(props.highlights.filter(isNote))}
          </ScrollView>
        </>
      )}
    </>
  );
}

export default Annotations;
