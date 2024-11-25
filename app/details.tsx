import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Image, TextInput, Button, Alert } from "react-native";
import { useEffect, useState } from "react";
import { getInfoById } from "@/api";

const Details = () => {
  const params = useLocalSearchParams();
  const [country, setCountry] = useState({} as any);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCountry, setUpdatedCountry] = useState({} as any);

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await getInfoById(params.id as string);
      setCountry(response);
      setUpdatedCountry(response);
    };

    fetchInfo();
  }, [params.id]);

  const updateCountry = async () => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/padjemian/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCountry),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setCountry(updatedData);
        setIsEditing(false);
        Alert.alert("Éxito", "El planeta fue actualizado correctamente.");
      } else {
        Alert.alert("Error", "No se pudo actualizar el planeta. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al actualizar el planeta:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Detalles del Planeta",
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      {isEditing ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del cuadro"
            value={updatedCountry.name}
            onChangeText={(text) => setUpdatedCountry({ ...updatedCountry, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={updatedCountry.description}
            onChangeText={(text) => setUpdatedCountry({ ...updatedCountry, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Cantidad de Goles"
            value={updatedCountry.goals}
            onChangeText={(text) => setUpdatedCountry({ ...updatedCountry, goals: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Cantidad de Puntos"
            value={updatedCountry.points}
            onChangeText={(text) => setUpdatedCountry({ ...updatedCountry, points: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Imagen URL"
            value={updatedCountry.logo}
            onChangeText={(text) => setUpdatedCountry({ ...updatedCountry, logo: text })}
          />
          <Button title="Guardar Cambios" onPress={updateCountry} />
          <Button title="Cancelar" onPress={() => setIsEditing(false)} />
        </View>
      ) : (
        <View style={styles.card}>
          <Image source={{ uri: country.logo }} style={styles.image} />
          <Text style={styles.title}>{country.name}</Text>
          <Text>Descripción: {country.description}</Text>
          <Text>Cantidad de Puntos: {country.points}</Text>
          <Text>Cantidad de Goles: {country.goals}</Text>
        
          <Button title="Editar" onPress={() => setIsEditing(true)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    margin: 16,
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    padding: 5,
  },
});

export default Details;
