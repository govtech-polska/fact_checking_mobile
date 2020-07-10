import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const InfoAboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>O projekcie</Text>
      <Text style={styles.text}>
        #FakeHunter to społeczny projekt weryfikacji treści publikowanych w
        internecie, uruchomiony przez Polską Agencję Prasową wspólnie z GovTech
        Polska, którego celem jest demaskowanie nieprawdziwych wiadomości
        dotyczących wirusa SARS-CoV-2. Każdy internauta będzie mógł zgłosić
        wątpliwą treść do weryfikacji, a następnie otrzymać wiarygodną
        odpowiedź, zweryfikowaną przez społecznych liderów opinii oraz ekspertów
        PAP.
      </Text>
      <Text style={styles.text}>
        W przestrzeni internetowej pojawia się coraz więcej fałszywych
        wiadomości, a ich zadaniem jest dezinformacja i sianie paniki w czasie
        zagrożenia epidemicznego. Projekt #FakeHunter zrodził się z potrzeby
        przeciwstawienia się takiej sytuacji, a także z dążenia do tego, by
        portale internetowe i wszyscy użytkownicy mediów społecznościowych w
        sposób odpowiedzialny dzielili się wyłącznie prawdziwymi przekazami.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    padding: 16,
  },
});

export default InfoAboutScreen;
