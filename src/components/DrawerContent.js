import React, {useState} from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Contents from './Contents';
import Settings from './Settings';
import BookSearch from './BookSearch';
import Annotations from './Annotations';
import {Divider} from 'react-native-elements';

const {height} = Dimensions.get('window');
const sections = [
  {name: 'contents', icon: 'list'},
  {name: 'settings', icon: 'settings'},
  {name: 'bookmark', icon: 'bookmark'},
  {name: 'search', icon: 'search'},
];

function DrawerContent(props) {
  const [currentSection, setCurrentSection] = useState('contents');

  function renderSection() {
    switch (currentSection) {
      case 'contents':
        return <Contents {...props} level={0} />;
      case 'settings':
        return <Settings {...props} />;
      case 'bookmark':
        return <Annotations {...props} />;
      case 'search':
        return <BookSearch {...props} />;
      default:
        return null;
    }
  }

  return (
    <View style={{flex: 1, flexDirection: 'row', backgroundColor: props.bg}}>
      <Divider
        width={5}
        orientation="vertical"
        color={props.fg === '#000000' ? 'lightgrey' : props.fg}
      />
      <View style={{...styles.wrapper, backgroundColor: props.bg}}>
        <View style={{...styles.iconWrapper, backgroundColor: props.bg}}>
          {sections.map(({name, icon}, i) => (
            <TouchableOpacity
              onPress={() => setCurrentSection(name)}
              style={
                currentSection === name
                  ? [
                      styles.sectionButton,
                      {...styles.selectedSectionButton, borderColor: props.fg},
                    ]
                  : styles.sectionButton
              }
              key={i}>
              <MaterialIcon name={icon} size={22} color={props.fg} />
            </TouchableOpacity>
          ))}
        </View>
        {renderSection()}
      </View>
    </View>
  );
}

export default DrawerContent;

const styles = {
  wrapper: {
    flex: 1,
    height,
    paddingTop: 10,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
  iconWrapper: {
    flexDirection: 'row',
    paddingRight: 15,
    paddingBottom: 10,
  },
  sectionButton: {
    height: 50,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSectionButton: {
    borderBottomWidth: 2,
  },
};
