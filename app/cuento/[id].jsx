import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  prepararBaseDeDatos,
  obtenerCuento,
  actualizarCuento,
  eliminarCuento,
} from "../../lib/database";

export default function CuentoDetalle() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [cuento, setCuento] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [cuerpo, setCuerpo] = useState("");

  useEffect(() => {
    cargarCuento();
  }, [id]);

  function cargarCuento() {
    try {
      prepararBaseDeDatos();

      const resultado = obtenerCuento(id);

      if (resultado) {
        setCuento(resultado);
        setTitulo(resultado.titulo);
        setCuerpo(resultado.cuerpo);
      }
    } catch (error) {
      console.log("Error cargando cuento:", error);
    }
  }

  function volverInicio() {
    router.replace("/");
  }

  function guardarCambios() {
    if (!titulo.trim() || !cuerpo.trim()) {
      Alert.alert(
        "Campos incompletos",
        "Debes escribir un título y el contenido del cuento."
      );
      return;
    }

    try {
      actualizarCuento(id, titulo.trim(), cuerpo.trim());

      Alert.alert(
        "Guardado",
        "Los cambios se guardaron correctamente.",
        [
          {
            text: "OK",
            onPress: volverInicio,
          },
        ]
      );
    } catch (error) {
      console.log("Error guardando cuento:", error);

      Alert.alert(
        "Error",
        "No se pudieron guardar los cambios."
      );
    }
  }

  function borrarCuento() {
    Alert.alert(
      "Borrar cuento",
      "¿Estás seguro de que quieres borrar este cuento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Borrar",
          style: "destructive",
          onPress: () => {
            try {
              eliminarCuento(id);

              Alert.alert(
                "Cuento borrado",
                "El cuento se eliminó correctamente.",
                [
                  {
                    text: "OK",
                    onPress: volverInicio,
                  },
                ]
              );
            } catch (error) {
              console.log("Error borrando cuento:", error);

              Alert.alert(
                "Error",
                "No se pudo borrar el cuento."
              );
            }
          },
        },
      ]
    );
  }

  if (!cuento) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>
          Cuento no encontrado
        </Text>

        <Pressable
          style={styles.botonVolver}
          onPress={volverInicio}
        >
          <Text style={styles.textoBoton}>
            ← Volver al inicio
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tituloPrincipal}>
        📖 Editar cuento
      </Text>

      <Text style={styles.etiqueta}>
        Título
      </Text>

      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Escribe el título"
      />

      <Text style={styles.etiqueta}>
        Cuento
      </Text>

      <TextInput
        style={styles.textArea}
        value={cuerpo}
        onChangeText={setCuerpo}
        placeholder="Escribe el cuento"
        multiline
        textAlignVertical="top"
      />

      <Pressable
        style={styles.botonGuardar}
        onPress={guardarCambios}
      >
        <Text style={styles.textoBoton}>
          💾 Guardar cambios
        </Text>
      </Pressable>

      <Pressable
        style={styles.botonEliminar}
        onPress={borrarCuento}
      >
        <Text style={styles.textoBoton}>
          🗑️ Borrar este cuento
        </Text>
      </Pressable>

      <Pressable
        style={styles.botonVolver}
        onPress={volverInicio}
      >
        <Text style={styles.textoBoton}>
          ← Volver al inicio
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },

  tituloPrincipal: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
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
    fontSize: 18,
    marginBottom: 20,
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 17,
    minHeight: 220,
    marginBottom: 20,
  },

  botonGuardar: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  botonEliminar: {
    backgroundColor: "#e53935",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  botonVolver: {
    backgroundColor: "#777777",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  textoBoton: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  error: {
    fontSize: 20,
    marginBottom: 20,
  },
});