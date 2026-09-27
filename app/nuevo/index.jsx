import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { crearCuento } from "../../lib/database";

export default function NuevoCuento() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [cuerpo, setCuerpo] = useState("");

  function guardarCuento() {
    if (titulo.trim() === "" || cuerpo.trim() === "") {
      Alert.alert(
        "Datos incompletos",
        "Escribe un título y el contenido del cuento."
      );
      return;
    }

    try {
      crearCuento(titulo.trim(), cuerpo.trim());

      Alert.alert("Cuento guardado", "El cuento se guardó correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log("Error guardando cuento:", error);

      Alert.alert(
        "Error",
        "No se pudo guardar el cuento."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloPrincipal}>📖 Nuevo cuento</Text>

      <Text style={styles.etiqueta}>Título</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe el título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.etiqueta}>Contenido</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Escribe el cuento"
        value={cuerpo}
        onChangeText={setCuerpo}
        multiline
        textAlignVertical="top"
      />

      <Pressable style={styles.boton} onPress={guardarCuento}>
        <Text style={styles.textoBoton}>💾 Guardar cuento</Text>
      </Pressable>

      <Pressable style={styles.botonCancelar} onPress={() => router.back()}>
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },

  tituloPrincipal: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  etiqueta: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },

  textArea: {
    height: 180,
  },

  boton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  textoBoton: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  botonCancelar: {
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  textoCancelar: {
    fontSize: 17,
    color: "#555555",
  },
});