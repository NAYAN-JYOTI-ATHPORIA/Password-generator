import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Clipboard } from 'react-native';
import { useState, useEffect } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import * as Yup from 'yup';
import { Formik } from 'formik';

const passwordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'It should be a minimum of 4 characters')
    .max(12, 'It should be a maximum of 12 characters')
    .required('Length is required')
});

export default function App() {
  const [password, setPassword] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [lowercase, setLowercase] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [number, setNumber] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [strength, setStrength] = useState(0);

  const calculateStrength = (length : Number) => {
    let strengthPoints = 0;
    if (lowercase) strengthPoints += 1;
    if (uppercase) strengthPoints += 1;
    if (number) strengthPoints += 1;
    if (symbols) strengthPoints += 1;
    setStrength((strengthPoints / 4) * (+length / 10) * 100);
  };

  const generatePasswordString = (passwordLength : Number) => {
    let characterList = '';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?/~`';

    if (uppercase) {
      characterList += upperCase;
    }
    if (lowercase) {
      characterList += lowerCase;
    }
    if (number) {
      characterList += numbers;
    }
    if (symbols) {
      characterList += specialCharacters;
    }

    const passwordResult = createPassword(characterList, passwordLength);
    setPassword(passwordResult);
    setIsGenerated(true);
  };

  const createPassword = (characters : string, passwordLength :Number) => {
    let result = '';
    for (let i = 0; i < +passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  };

  const resetPassword = () => {
    setPassword('');
    setIsGenerated(false);
    setLowercase(true);
    setUppercase(false);
    setNumber(false);
    setSymbols(false);
    setStrength(0);
  };

  const handleCopy = () => {
    Clipboard.setString(password);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={passwordSchema}
            onSubmit={(values) => {
              calculateStrength(+values.passwordLength);
              generatePasswordString(+values.passwordLength);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <>
                <Text style={styles.label}>Password Length</Text>
                {touched.passwordLength && errors.passwordLength && (
                  <Text style={styles.errorText}>{errors.passwordLength}</Text>
                )}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="e.g., 8 or 6"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.cardContainer}>
                  <View style={[styles.card, { backgroundColor: '#d4edda' }]}>
                    <BouncyCheckbox
                      isChecked={lowercase}
                      onPress={() => setLowercase(!lowercase)}
                      text="Include Lowercase"
                      fillColor="green"
                    />
                  </View>
                  <View style={[styles.card, { backgroundColor: '#d1ecf1' }]}>
                    <BouncyCheckbox
                      isChecked={uppercase}
                      onPress={() => setUppercase(!uppercase)}
                      text="Include Uppercase"
                      fillColor="blue"
                    />
                  </View>
                  <View style={[styles.card, { backgroundColor: '#fff3cd' }]}>
                    <BouncyCheckbox
                      isChecked={number}
                      onPress={() => setNumber(!number)}
                      text="Include Numbers"
                      fillColor="orange"
                    />
                  </View>
                  <View style={[styles.card, { backgroundColor: '#f8d7da' }]}>
                    <BouncyCheckbox
                      isChecked={symbols}
                      onPress={() => setSymbols(!symbols)}
                      text="Include Symbols"
                      fillColor="purple"
                    />
                  </View>
                </View>
                <View style={styles.strengthContainer}>
                  <Text style={styles.strengthLabel}>Password Strength: {Math.round(strength)}%</Text>
                  <View style={[styles.strengthBar, { width: `${strength}%`, backgroundColor: strength > 70 ? 'green' : strength > 40 ? 'orange' : 'red' }]} />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Generate Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetPassword}>
                  <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>

                {isGenerated && (
                  <View style={styles.generatedCard}>
                    <Text style={styles.generatedPassword}>Generated Password: {password}</Text>
                    <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                      <Text style={styles.buttonText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  strengthContainer: {
    marginBottom: 20,
  },
  strengthLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  strengthBar: {
    height: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generatedCard: {
    backgroundColor: '#d4edda',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  generatedPassword: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
});
