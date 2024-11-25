import { Text, View, ScrollView, Image, Button, Alert, TextInput, Modal } from "react-native";
import { useEffect, useState } from "react";
import { getInfo } from "@/api";
import { Stack, Link } from "expo-router";

export default function Index() {
  const [countrys, setCountrys] = useState([]);
  const [newCountry, setNewCountry] = useState({
    id: "", 
    name: "",
    description: "",
    goals:"",
    points:"",
    logo: "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleDeleteCountry = async (id: String) => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/padjemian/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setCountrys(countrys.filter((country) => country.id !== id));
        Alert.alert("Éxito", "El planeta fue eliminado correctamente.");
      } else {
        Alert.alert("Error", "No se pudo eliminar el planeta. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al eliminar el planeta:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await getInfo();
      setCountrys(response);
    };

    fetchInfo();
  }, []);

  // generar ID
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9); 
  };

  const addCountry = async () => {
    try {
      const countryData = {
        ...newCountry,
        id: generateRandomId(), 
        
      };

      const response = await fetch("http://161.35.143.238:8000/padjemian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(countryData),
      });

      if (response.ok) {
        const createCountry = await response.json();
        setCountrys([...countrys, createCountry]); 
        setShowForm(false); 
        setNewCountry({
          id: "", 
          name: "",
          description: "",
          goals:"",
          points:"",
          logo: "",
        });
        Alert.alert("Éxito", "El planeta fue agregado correctamente.");
      } else {
        Alert.alert("Error", "No se pudo agregar el planeta. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Home",
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      
      
      <View>
        <Button title="Agregar Cuadro" onPress={() => setShowForm(true)} />
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showForm}
        onRequestClose={() => setShowForm(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
            <TextInput
              placeholder="Nombre del cuadro"
              value={newCountry.name}
              onChangeText={(text) => setNewCountry({ ...newCountry, name: text })}
            />
            <TextInput
              placeholder="Descripción"
              value={newCountry.description}
              onChangeText={(text) => setNewCountry({ ...newCountry, description: text })}
            />
            <TextInput
              placeholder="Cantidad de goles"
              value={newCountry.goals}
              onChangeText={(text) => setNewCountry({ ...newCountry, goals: text })}
            />
            <TextInput
              placeholder="Cantidad de puntos"
              value={newCountry.points}
              onChangeText={(text) => setNewCountry({ ...newCountry, points: text })}
            />
            <TextInput
              placeholder="Imagen URL"
              value={newCountry.logo}
              onChangeText={(text) => setNewCountry({ ...newCountry, logo: text })}
            />
            <Button title="Guardar Cuadro" onPress={addCountry} />
            <Button title="Cancelar" onPress={() => setShowForm(false)} />
          </View>
        </View>
      </Modal>

      
      {countrys &&
        countrys.map((country) => {
          return (
            <View
              key={country.id}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                width: "90%",
                margin: 16,
                padding: 16,
              }}
            >
              <Link
                href={{
                  pathname: "/details",
                  params: { id: country.id },
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{country.name}</Text>
                
                <View
                  style={{
                    backgroundColor: "#f4511e",
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Image
                    source={{ uri: country.logo }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                    }}
                  />

                  
                </View>
              </Link>
              <Button title="Eliminar" onPress={() => handleDeleteCountry(country.id)} />
            </View>
          );
        })}
    </ScrollView>
  );
}

