import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

import { getScaleNotes, getchord ,getDegree, getNoteRole, isNoteInScale, getdoremi, get_constituents, is_note_in_constituent } from '../../components/ScaleFunctions';
import styles from '../../components/styles'; 

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
 
  const playSound = async (note) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(getchord(note,selectedKey, scaleType));
    setSound(newSound);
    await newSound.playAsync();
    
    const constituents = get_constituents(note, selectedKey, scaleType);
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
    if (selectedKey === note || isNoteInScale(note, selectedKey)) {
      return notes.find(n => n.note === note)?.color || '#FFF';
    }
    return '#333';
  };

  const getborderColor = (note) => {
    if (highlightedNotes.includes(note)) {
      return '#FFFF00';
    }
    if (selectedKey === note || isNoteInScale(note, selectedKey)) {
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
      borderWidth: selectedKey === note.note || isNoteInScale(note.note, selectedKey) || is_note_in_constituent(note.note, highlightedNotes) ? 4 : 0,
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
        ? getDegree(note.note,selectedKey,scaleType) 
        : roleKey === 2
          ? getNoteRole(note.note,selectedKey,scaleType)
          : getdoremi(note.note,selectedKey)}
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
            {getScaleNotes(selectedKey, scaleType).map((note, index) => (
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

export default App;
