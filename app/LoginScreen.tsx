import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import bgImage from '../assets/images/bg.png'; // make sure this path is correct

const Form: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // Mock login validation
    if (email === 'test@example.com' && password === '123456') {
      Alert.alert('Success', `Logged in as ${email}`);
      setEmail('');
      setPassword('');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrapper}
      >
        <View style={styles.form}>
          <Text style={styles.formTitle}>Log in to your account</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity style={styles.submit} onPress={handleLogin}>
            <Text style={styles.submitText}>Log in</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  wrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  formTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  input: {
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submit: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: '#fff', fontWeight: '500', fontSize: 16, textTransform: 'uppercase' },
  signupLink: { color: '#6B7280', textAlign: 'center', marginTop: 12, fontSize: 14 },
  signupLinkText: { color: '#4F46E5', textDecorationLine: 'underline' },
});

export default Form;
