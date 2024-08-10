import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const { width, height } = Dimensions.get('window');

const radius = width * 0.4;

const notes = [
  { note: 'C', color: '#FF6B6B' },
  { note: 'C#/Db', color: '#4ECDC4' },
  { note: 'D', color: '#45B7D1' },
  { note: 'D#/Eb', color: '#F9D56E' },
  { note: 'E', color: '#FF8C42' },
  { note: 'F', color: '#98D9C2' },
  { note: 'F#/Gb', color: '#E84A5F' },
  { note: 'G', color: '#A8E6CE' },
  { note: 'G#/Ab', color: '#FF847C' },
  { note: 'A', color: '#FECEAB' },
  { note: 'A#/Bb', color: '#65C6FF' },
  { note: 'B', color: '#FF8066' },
];


const sounds = {
  'C': require('../../assets/sounds/C.wav'),
  'Cm': require('../../assets/sounds/Cm.wav'),
  'D': require('../../assets/sounds/D-1.wav'),
  'Dm': require('../../assets/sounds/Dm.wav'),
  'E': require('../../assets/sounds/E.wav'),
  'Em': require('../../assets/sounds/Em.wav'),
  'F': require('../../assets/sounds/F.wav'),
  'Fm': require('../../assets/sounds/Fm.wav'),
  'G': require('../../assets/sounds/G.wav'),
  'Gm': require('../../assets/sounds/Gm.wav'),
  'A': require('../../assets/sounds/A.wav'),
  'Am': require('../../assets/sounds/Am.wav'),
  'B': require('../../assets/sounds/B.wav'),
  'Bm': require('../../assets/sounds/Bm.wav'),
};


const App = () => {
  const [selectedKey, setSelectedKey] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [confirmedKey, setConfirmedKey] = useState(false);
  const [roleKey, setRolekey] = useState(false);
  const [sound, setSound] = useState(null);
  const [highlightedNotes, setHighlightedNotes] = useState([]);
  const timerRef = useRef(null);

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
    //リストの何番目にnoteがあるか
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
  };

  const is_note_in_constituent = (note) => {
     return highlightedNotes.includes(note); 
  };

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

    // 新しいタイマーを設定
    timerRef.current = setTimeout(() => {
      setHighlightedNotes([]);
      console.log("Highlighted notes cleared");
    }, 2000); // 2000ms (2秒)
  }

  const getNoteBackgroundColor = (note) => {
    if (selectedKey === note || isNoteInScale(note)) {
      return notes.find(n => n.note === note)?.color || '#FFF';
    }
    return '#333'; // Dark color for non-selected notes
  };

  const getborderColor = (note) => {
    if (highlightedNotes.includes(note)) {
      return '#FFFF00'; // Highlight color for constituents
    }
    if (selectedKey === note || isNoteInScale(note)) {
      return '#FFF'; // Light color for selected notes
    }
    return '#FFF'; // Dark color for non-selected notes
  };

  const confirmKey = () => {
    setConfirmedKey(prevState => !prevState);
  };

  const rolekey = () => {
    setRolekey(prevState => !prevState);
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

      {/* Scale Type Selection */}
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

      {/* Circular Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.circle} />
        {notes.map((note, index) => {
          const angle = ((index / notes.length) * 2 * Math.PI) - (Math.PI / 2);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.note,
                {
                  transform: [
                    { translateX: x },
                    { translateY: y },
                  ],
                  backgroundColor: getNoteBackgroundColor(note.note),
                  borderColor: getborderColor(note.note),
                  borderWidth: selectedKey === note.note || isNoteInScale(note.note) || is_note_in_constituent(note.note) ? 4 : 0,
                },
              ]}
               onPress={() => {
                if (!confirmedKey){
                  setSelectedKey(note.note);
                }
                if (confirmedKey) {
                
                playSound(note.note); // confirmedKey が true のときのみ音を鳴らす
                }
              }}    
              //disabled={confirmedKey}
            >
              <Text style={styles.noteText}>{roleKey ? getNoteRole(note.note) : note.note}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Key Info */}
      <View style={styles.keyInfoContainer}>
        <Text style={styles.keyInfoText}>
          {selectedKey ? `Selected Key: ${selectedKey}` : 'Tap a note to select a key'}
        </Text>
      </View>

      {/* Scale Notes */}
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

      {/* BPM */}
      <View style={styles.bpmContainer}>
        <Text style={styles.bpmLabel}>BPM</Text>
        <Text style={styles.bpmValue}>120</Text>
      </View>
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
  },
  keyInfoContainer: {
    position: 'absolute',
    top: 20,
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
    bottom: 20,
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
    bottom: 150,
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
    top: 80,
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
    top: 80,
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
}
);

export default App;

