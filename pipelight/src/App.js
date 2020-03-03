import React from 'react';
import { Container } from 'native-base';
import { StyleSheet } from 'react-native';
import './App.css';
import AppContent from './components/AppContent.js';

function App() {
  return (
      <Container style={ styles.container } >
        <AppContent />
      </Container>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      width: '100%',
      height: '100%',
    },
  }
)

export default App;
