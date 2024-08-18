import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const { width, height } = Dimensions.get('window');

const radius = width * 0.4;

const notes = [
  { note: 'C', color: '#FF6B6B' },
  { note: 'C#-Db', color: '#4ECDC4' },
  { note: 'D', color: '#45B7D1' },
  { note: 'D#-Eb', color: '#F9D56E' },
  { note: 'E', color: '#FF8C42' },
  { note: 'F', color: '#98D9C2' },
  { note: 'F#-Gb', color: '#E84A5F' },
  { note: 'G', color: '#A8E6CE' },
  { note: 'G#-Ab', color: '#FF847C' },
  { note: 'A', color: '#FECEAB' },
  { note: 'A#-Bb', color: '#65C6FF' },
  { note: 'B', color: '#FF8066' },
];

const sounds = {
  'A#-Bb': require('../../assets/sounds/A#-Bb.wav'),
  'A#-Bb7': require('../../assets/sounds/A#-Bb7.wav'),
  'A#-Bbadd9': require('../../assets/sounds/A#-Bbadd9.wav'),
  'A#-Bbm': require('../../assets/sounds/A#-Bbm.wav'),
  'A#-BbM7': require('../../assets/sounds/A#-BbM7.wav'),
  'A#-Bbsus4': require('../../assets/sounds/A#-Bbsus4.wav'),
  'A': require('../../assets/sounds/A.wav'),
  'A7': require('../../assets/sounds/A7.wav'),
  'Aadd9': require('../../assets/sounds/Aadd9.wav'),
  'Am': require('../../assets/sounds/Am.wav'),
  'AM7': require('../../assets/sounds/AM7.wav'),
  'Asus4': require('../../assets/sounds/Asus4.wav'),
  'B': require('../../assets/sounds/B.wav'),
  'B7': require('../../assets/sounds/B7.wav'),
  'Badd9': require('../../assets/sounds/Badd9.wav'),
  'Bm': require('../../assets/sounds/Bm.wav'),
  'BM7': require('../../assets/sounds/BM7.wav'),
  'Bsus4': require('../../assets/sounds/Bsus4.wav'),
  'C#-Db': require('../../assets/sounds/C#-Db.wav'),
  'C#-Db7': require('../../assets/sounds/C#-Db7.wav'),
  'C#-Dbadd9': require('../../assets/sounds/C#-Dbadd9.wav'),
  'C#-Dbm': require('../../assets/sounds/C#-Dbm.wav'),
  'C#-DbM7': require('../../assets/sounds/C#-DbM7.wav'),
  'C#-Dbsus4': require('../../assets/sounds/C#-Dbsus4.wav'),
  'C': require('../../assets/sounds/C.wav'),
  'C7': require('../../assets/sounds/C7.wav'),
  'Cadd9': require('../../assets/sounds/Cadd9.wav'),
  'Cm': require('../../assets/sounds/Cm.wav'),
  'CM7': require('../../assets/sounds/CM7.wav'),
  'Csus4': require('../../assets/sounds/Csus4.wav'),
  'D#-Eb': require('../../assets/sounds/D#-Eb.wav'),
  'D#-Eb7': require('../../assets/sounds/D#-Eb7.wav'),
  'D#-Ebadd9': require('../../assets/sounds/D#-Ebadd9.wav'),
  'D#-Ebm': require('../../assets/sounds/D#-Ebm.wav'),
  'D#-EbM7': require('../../assets/sounds/D#-EbM7.wav'),
  'D#-Ebsus4': require('../../assets/sounds/D#-Ebsus4.wav'),
  'D': require('../../assets/sounds/D-1.wav'),
  'D7': require('../../assets/sounds/D7.wav'),
  'Dadd9': require('../../assets/sounds/Dadd9.wav'),
  'Dm': require('../../assets/sounds/Dm.wav'),
  'DM7': require('../../assets/sounds/DM7.wav'),
  'Dsus4': require('../../assets/sounds/Dsus4.wav'),
  'E': require('../../assets/sounds/E.wav'),
  'E7': require('../../assets/sounds/E7.wav'),
  'Eadd9': require('../../assets/sounds/Eadd9.wav'),
  'Em': require('../../assets/sounds/Em.wav'),
  'EM7': require('../../assets/sounds/EM7.wav'),
  'Esus4': require('../../assets/sounds/Esus4.wav'),
  'F#-Gb': require('../../assets/sounds/F#-Gb.wav'),
  'F#-Gb7': require('../../assets/sounds/F#-Gb7.wav'),
  'F#-Gbadd9': require('../../assets/sounds/F#-Gbadd9.wav'),
  'F#-Gbm': require('../../assets/sounds/F#-Gbm.wav'),
  'F#-GbM7': require('../../assets/sounds/F#-GbM7.wav'),
  'F#-Gbsus4': require('../../assets/sounds/F#-Gbsus4.wav'),
  'F': require('../../assets/sounds/F.wav'),
  'F7': require('../../assets/sounds/F7.wav'),
  'Fadd9': require('../../assets/sounds/Fadd9.wav'),
  'Fm': require('../../assets/sounds/Fm.wav'),
  'FM7': require('../../assets/sounds/FM7.wav'),
  'Fsus4': require('../../assets/sounds/Fsus4.wav'),
  'G#-Ab': require('../../assets/sounds/G#-Ab.wav'),
  'G#-Ab7': require('../../assets/sounds/G#-Ab7.wav'),
  'G#-Abadd9': require('../../assets/sounds/G#-Abadd9.wav'),
  'G#-Abm': require('../../assets/sounds/G#-Abm.wav'),
  'G#-AbM7': require('../../assets/sounds/G#-AbM7.wav'),
  'G#-Absus4': require('../../assets/sounds/G#-Absus4-1.wav'),
  'G': require('../../assets/sounds/G.wav'),
  'G7': require('../../assets/sounds/G7.wav'),
  'Gadd9': require('../../assets/sounds/Gadd9.wav'),
  'Gm': require('../../assets/sounds/Gm.wav'),
  'GM7': require('../../assets/sounds/GM7.wav'),
  'Gsus4': require('../../assets/sounds/Gsus4-1.wav'),
};
/*
const sounds = {
  'A#-Bb': require('../../assets/sounds/A#.wav'),
  'A#-Bb7': require('../../assets/sounds/A#7.wav'),
  'A#-Bbadd9': require('../../assets/sounds/A#add9.wav'),
  'A#-Bbm': require('../../assets/sounds/A#m.wav'),
  'A#-BbM7': require('../../assets/sounds/A#M7.wav'),
  'A#-Bbsus4': require('../../assets/sounds/A#sus4.wav'),
  'A': require('../../assets/sounds/A.wav'),
  'A7': require('../../assets/sounds/A7.wav'),
  'Aadd9': require('../../assets/sounds/Aadd9.wav'),
  'Am': require('../../assets/sounds/Am.wav'),
  'AM7': require('../../assets/sounds/AM7.wav'),
  'Asus4': require('../../assets/sounds/Asus4.wav'),
  'B': require('../../assets/sounds/B.wav'),
  'B7': require('../../assets/sounds/B7.wav'),
  'Badd9': require('../../assets/sounds/Badd9.wav'),
  'Bm': require('../../assets/sounds/Bm.wav'),
  'BM7': require('../../assets/sounds/BM7.wav'),
  'Bsus4': require('../../assets/sounds/Bsus4.wav'),
  'C#-Db': require('../../assets/sounds/C#.wav'),
  'C#-Db7': require('../../assets/sounds/C#7.wav'),
  'C#-Dbadd9': require('../../assets/sounds/C#add9.wav'),
  'C#-Dbm': require('../../assets/sounds/C#m.wav'),
  'C#-DbM7': require('../../assets/sounds/C#M7.wav'),
  'C#-Dbsus4': require('../../assets/sounds/C#sus4.wav'),
  'C': require('../../assets/sounds/C.wav'),
  'C7': require('../../assets/sounds/C7.wav'),
  'Cadd9': require('../../assets/sounds/Cadd9.wav'),
  'Cm': require('../../assets/sounds/Cm.wav'),
  'CM7': require('../../assets/sounds/CM7.wav'),
  'Csus4': require('../../assets/sounds/Csus4.wav'),
  'D#-Eb': require('../../assets/sounds/D#.wav'),
  'D#-Eb7': require('../../assets/sounds/D#7.wav'),
  'D#-Ebadd9': require('../../assets/sounds/D#add9.wav'),
  'D#-Ebm': require('../../assets/sounds/D#m.wav'),
  'D#-EbM7': require('../../assets/sounds/D#M7.wav'),
  'D#-Ebsus4': require('../../assets/sounds/D#sus4.wav'),
  'D': require('../../assets/sounds/D-1.wav'),
  'D7': require('../../assets/sounds/D7.wav'),
  'Dadd9': require('../../assets/sounds/Dadd9.wav'),
  'Dm': require('../../assets/sounds/Dm.wav'),
  'DM7': require('../../assets/sounds/DM7.wav'),
  'Dsus4': require('../../assets/sounds/Dsus4.wav'),
  'E': require('../../assets/sounds/E.wav'),
  'E7': require('../../assets/sounds/E7.wav'),
  'Eadd9': require('../../assets/sounds/Eadd9.wav'),
  'Em': require('../../assets/sounds/Em.wav'),
  'EM7': require('../../assets/sounds/EM7.wav'),
  'Esus4': require('../../assets/sounds/Esus4.wav'),
  'F#-Gb': require('../../assets/sounds/F#.wav'),
  'F#-Gb7': require('../../assets/sounds/F#7.wav'),
  'F#-Gbadd9': require('../../assets/sounds/F#add9.wav'),
  'F#-Gbm': require('../../assets/sounds/F#m.wav'),
  'F#-GbM7': require('../../assets/sounds/F#M7.wav'),
  'F#-Gbsus4': require('../../assets/sounds/F#sus4.wav'),
  'F': require('../../assets/sounds/F.wav'),
  'F7': require('../../assets/sounds/F7.wav'),
  'Fadd9': require('../../assets/sounds/Fadd9.wav'),
  'Fm': require('../../assets/sounds/Fm.wav'),
  'FM7': require('../../assets/sounds/FM7.wav'),
  'Fsus4': require('../../assets/sounds/Fsus4.wav'),
  'G#-Ab': require('../../assets/sounds/G#.wav'),
  'G#-Ab7': require('../../assets/sounds/G#7.wav'),
  'G#-Abadd9': require('../../assets/sounds/G#add9.wav'),
  'G#-Abm': require('../../assets/sounds/G#m.wav'),
  'G#-AbM7': require('../../assets/sounds/G#M7.wav'),
  'G#-Absus4': require('../../assets/sounds/G#sus4.wav'),
  'G': require('../../assets/sounds/G.wav'),
  'G7': require('../../assets/sounds/G7.wav'),
  'Gadd9': require('../../assets/sounds/Gadd9.wav'),
  'Gm': require('../../assets/sounds/Gm.wav'),
  'GM7': require('../../assets/sounds/GM7.wav'),
  'Gsus4': require('../../assets/sounds/Gsus4-1.wav'),
};
*/
const App = () => {
  const roles = ['Mode One', 'Mode Two', 'Mode Three', 'Mode Four'];
  const [selectedKey, setSelectedKey] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [confirmedKey, setConfirmedKey] = useState(false);
  const [roleKey, setRolekey] = useState(0);
  const [sound, setSound] = useState(null);
  const [highlightedNotes, setHighlightedNotes] = useState([]);
  const timerRef = useRef(null);
  const [draggedNote, setDraggedNote] = useState('');
  const [dragDistance, setDragDistance] = useState(0);
  const panResponders = useRef(notes.map(note => createPanResponder(note.note))).current;
  const [chordprogression, setChordprogression] = useState(['C','G','Am','Em','F','C','Dm','G']);
  const [isplaychordprogession, setisPlaychordprogession] = useState(false);
  const dragDistanceRef = useRef(dragDistance);
  const confirmedKeyRef = useRef(confirmedKey);

  useEffect(() => {
    if (dragDistance > 0) {
      console.log(`Drag Distance: ${dragDistance}`);
    }
    dragDistanceRef.current = dragDistance;
    confirmedKeyRef.current = confirmedKey;
  }, [dragDistance, confirmedKey, isplaychordprogession],);

  
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(error => console.error('Error unloading sound:', error));
      }
    };
  }, [sound]);

function createPanResponder(note) {
    return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          console.log(note);
          setDraggedNote(note);
        },
        onPanResponderMove: (event, gestureState) => {
            const distance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
            setDragDistance(distance);
        },
        onPanResponderRelease: () => {
          const distance = dragDistanceRef.current;
          const confirmed = confirmedKeyRef.current;
            console.log(`Distance: ${distance}`);
            if (confirmed){
              let result;
              if (distance < 50) {
              result = note;
              } else if (distance < 100) {
              result = note + '7';
              } else if (distance < 150) {
              result = note + 'add9';
              } else {
                result = note + 'sus4';
              }
              console.log('Note:', result);
              playSound(result);
            }
            else{
              setSelectedKey(note);
            }
            setDraggedNote('');
        },
    });
}

  const getScaleNotes = (key) => {
    const keyIndex = notes.findIndex(note => note.note === key);

    if (scaleType === 'major') {
      return [0, 2, 4, 5, 7, 9, 11].map(interval => 
        notes[(keyIndex + interval) % 12].note
      );
    }
    else if (scaleType === 'minor') {
      return [0, 2, 3, 5, 7, 8, 10].map(interval => 
        notes[(keyIndex + interval) % 12].note
      );
    }
  };

  const isNoteInScale = (note) => {
    if (!selectedKey) return false;
    const scaleNotes = getScaleNotes(selectedKey);
    return scaleNotes.includes(note);
  };

  const getNoteRole = (note) => {
    if (!selectedKey) return false;  
    const scaleNotes = getScaleNotes(selectedKey);
    const index = scaleNotes.indexOf(note);
    if (index == 0 || index == 2 || index == 5){
      return "T";
    }
    else if (index == 4 || index == 6){
      return "D";
    }
    else if (index == 1 || index == 3){
      return "S";
    }
  };

  const getDegree = (note) => {
    if (!selectedKey) return false;
    const scaleNotes = getScaleNotes(selectedKey);
    index = scaleNotes.indexOf(note);
    index = index + 1;
    if (index == 0){
      return "";
    }
    return index.toString();
  }

  const getdoremi = (note) => {
    if (!selectedKey) return false;
    const doremi =
      ['ド', 'ド#', 'レ', 'レ#', 'ミ', 'ファ', 'ファ#', 'ソ', 'ソ#', 'ラ', 'ラ#', 'シ'];
    index = notes.findIndex(n => n.note === note);
    return doremi[index];
  }

  const getchord = (note) => {
    if (!selectedKey) return false;
    const scaleNotes = getScaleNotes(selectedKey);
    const index = scaleNotes.indexOf(note);
    if (scaleType === 'major') {
      if (index == 1 || index == 2 || index == 5){
        return sounds[note + "m"];
      }
      else{
        return sounds[note];
      }
    }
    else if (scaleType === 'minor') {
      if (index == 0 || index == 2 || index == 4){
        return sounds[note + "m"];
      }
      else{
        return sounds[note];
      }
    }
  };

  const get_constituents = (note) => {
    const keyIndex = notes.findIndex(n => n.note === note);

    if (!selectedKey) return false;
    const scaleNotes = getScaleNotes(selectedKey);
    const index = scaleNotes.indexOf(note);
    if (scaleType === 'major') {
      if (index == 1 || index == 2 || index == 5){
        return [0, 3, 7].map(interval => 
        notes[(keyIndex + interval) % 12].note
      );
       }
      else{
        return [0, 4, 7].map(interval => 
        notes[(keyIndex + interval) % 12].note
      );
      }
    }
    else if (scaleType === 'minor') {
      if (index == 0 || index == 2 || index == 4){
        return [0, 3, 7].map(interval => 
        notes[(keyIndex + interval) % 12].note
      );
      }
      else{
       return [0, 4, 7].map(interval => 
        notes[(keyIndex + interval) % 12].note
      );
      }
    }
  }; const is_note_in_constituent = (note) => { return highlightedNotes.includes(note); };
  const playSound = async (note) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(getchord(note));
    setSound(newSound);
    await newSound.playAsync();
    
    const constituents = get_constituents(note);
    setHighlightedNotes(constituents);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      console.log("Timer cleared");
    }

    timerRef.current = setTimeout(() => {
      setHighlightedNotes([]);
      console.log("Highlighted notes cleared");
    }, 2000);
  }
  
  const playchordprogession = async () => {
    //`１秒おきに`
    for (times = 0; times < 5; times++) {
    for (i = 0; i < chordprogression.length; i++) {
      const note = chordprogression[i];
      playSound(note);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    }
  }

  const SetisPlaychordprogession = () => {
    setisPlaychordprogession(prevState => !prevState);
      playchordprogession();
  }

  const getNoteBackgroundColor = (note) => {
    if (selectedKey === note || isNoteInScale(note)) {
      return notes.find(n => n.note === note)?.color || '#FFF';
    }
    return '#333';
  };

  const getborderColor = (note) => {
    if (highlightedNotes.includes(note)) {
      return '#FFFF00';
    }
    if (selectedKey === note || isNoteInScale(note)) {
      return '#FFF';
    }
    return '#FFF';
  };

  const confirmKey = () => {
    setConfirmedKey(prevState => !prevState);
  };

  const rolekey = () => {
    setRolekey(prevIndex => (prevIndex + 1) % roles.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}></Text>
  
      <TouchableOpacity
        style={[styles.confirmKeyButton, confirmedKey && styles.confirmedKeyButton]}
        onPress={confirmKey}
      >
        <Text style={[styles.confirmButtonText, confirmedKey && styles.confirmedButtonText]}>
          {confirmedKey ? 'Confirm' : 'Confirm'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleKeyButton, roleKey && styles.roleKeyButton]}
        onPress={rolekey}
      >
        <Text style={[styles.roleButtonText, roleKey && styles.roleButtonText]}>
          {roleKey ? 'Role' : 'Role'}
        </Text>
      </TouchableOpacity>

      <View style={styles.scaleTypeContainer}>
        <TouchableOpacity 
          style={[styles.scaleTypeButton, scaleType === 'major' && styles.selectedScaleTypeButton]}
          onPress={() => setScaleType('major')}
        >
          <Text style={styles.scaleTypeButtonText}>Major</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.scaleTypeButton, scaleType === 'minor' && styles.selectedScaleTypeButton]}
          onPress={() => setScaleType('minor')}
        >
          <Text style={styles.scaleTypeButtonText}>Minor</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.circle} />
        {notes.map((note, index) => {
          const angle = ((index / notes.length) * 2 * Math.PI) - (Math.PI / 2);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (

<Animated.View
  key={index}
  {...panResponders[index].panHandlers}
  style={[
    styles.note,
    {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale: draggedNote === note.note ? 1.2 : 1 },
      ],
      backgroundColor: getNoteBackgroundColor(note.note),
      borderColor: getborderColor(note.note),
      borderWidth: selectedKey === note.note || isNoteInScale(note.note) || is_note_in_constituent(note.note) ? 4 : 0,
    },
  ]}
>
<View>
  <Text style={styles.noteText}>
    {roleKey === 0
      ? (draggedNote === note.note
          ? dragDistance < 50
            ? note.note
            : dragDistance < 100
              ? note.note + '7th'
              : dragDistance < 150
                ? note.note + 'add9'
                : note.note + 'sus4'
          : note.note)  // draggedNote !== note.note の場合はそのまま note.note を表示
      : roleKey === 1 
        ? getDegree(note.note) 
        : roleKey === 2
          ? getNoteRole(note.note)
          : getdoremi(note.note)}
  </Text>
</View>

</Animated.View>
         );
        })}
      </View>

      <View style={styles.keyInfoContainer}>
        <Text style={styles.keyInfoText}>
          {selectedKey ? `Selected Key: ${selectedKey}` : 'Tap a note to select a key'}
        </Text>
      </View>

      {selectedKey && (
        <View style={styles.scaleContainer}>
          <Text style={styles.scaleTitle}>{scaleType} Scale Notes:</Text>
          <View style={styles.scaleNotesContainer}>
            {getScaleNotes(selectedKey).map((note, index) => (
              <Text key={index} style={styles.scaleNote}>{note}</Text>
            ))}
          </View>
        </View>
      )}

      <View style={styles.bpmContainer}>
        <TouchableOpacity style={styles.bpmButton} onPress={SetisPlaychordprogession}>
        <Text style={styles.bpmValue}>{chordprogression}</Text>
        </TouchableOpacity>
      </View>

      {draggedNote && (
        <View style={styles.dragIndicator}>
          <Text style={styles.dragIndicatorText}>
            {dragDistance < 50 ? '' : dragDistance < 100 ? '7th' : dragDistance > 150 ?'add9' :'sus4' }
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  chartContainer: {
    width: radius * 2,
    height: radius * 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    bottom: 80,
  },
  noteText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  circle: {
    position: 'absolute',
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    bottom: -50,
  },
  keyInfoContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  keyInfoText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  scaleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  scaleTitle: {
    display: 'none',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    bottom: -55,
  },
  scaleNotesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -95,
  },
  scaleNote: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 5,
    marginVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    position: 'absolute',
    bottom: 40,
  },
  bpmLabel: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },
  bpmValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scaleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  scaleTypeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  selectedScaleTypeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  scaleTypeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmKeyButton: {
    position: 'absolute',
    top: 120,
    left: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  confirmedKeyButton: {
    backgroundColor: '#333',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmedButtonText: {
    color: '#000',
  },
  roleKeyButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleKeyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dragIndicator: {
    position: 'absolute',
    bottom: 450,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
  },
  dragIndicatorText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
