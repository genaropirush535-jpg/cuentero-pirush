import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { useFocusEffect, useRouter } from "expo-router";

import {
  prepararBaseDeDatos,
  obtenerCuentos,
} from "../lib/database";
import { exportarCuentos } from "../lib/exportarCuentos";

const imagenes = {
  "El delfín rosado": require("../assets/imagenes/images (3).jpg"),
  "La anaconda": require("../assets/imagenes/images .jpg"),
  "La taricaya": require("../assets/imagenes/images (2).jpg"),
};

export default function Inicio() {
  const router = useRouter();
  const [cuentos, setCuentos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      cargarCuentos();
    }, [])
  );

  function cargarCuentos() {
    try {
      prepararBaseDeDatos();

      setCuentos(obtenerCuentos());
    } catch (error) {
      console.log("Error cargando cuentos:", error);
    }
  }

  async function exportar() {
    try {
      await exportarCuentos(obtenerCuentos());
    } catch (error) {
      console.log("Error exportando cuentos:", error);
      Alert.alert("No se pudo exportar", "Intenta exportar los cuentos otra vez.");
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Cuentero",
          headerRight: () => (
            <Text style={styles.cantidadCabecera}>{cuentos.length} cuentos</Text>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.contenidoScroll}>
        <Text style={styles.tituloPrincipal}>Mis cuentos de la selva</Text>
        <Pressable
          style={styles.botonExportar}
          onPress={exportar}
          disabled={cuentos.length === 0}
        >
          <Text style={styles.textoBotonExportar}>Exportar cuentos</Text>
        </Pressable>

        {cuentos.map((cuento) => (
          <Pressable
            key={cuento.id}
            style={styles.tarjeta}
            onPress={() => router.push(`/cuento/${cuento.id}`)}
          >
            {imagenes[cuento.titulo] && (
              <Image
                source={imagenes[cuento.titulo]}
                style={styles.imagen}
                resizeMode="cover"
              />
            )}

            <View style={styles.contenido}>
              <Text style={styles.titulo}>{cuento.titulo}</Text>

              <Text style={styles.fecha}>
                Editado: {new Date(cuento.editado_en).toLocaleDateString("es-PE")}
              </Text>

              <Text style={styles.texto} numberOfLines={2}>
                {cuento.cuerpo.slice(0, 80)}
                {cuento.cuerpo.length > 80 ? "..." : ""}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        style={styles.botonAgregar}
        onPress={() => router.push("/nuevo")}
      >
        <Text style={styles.textoBotonAgregar}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  contenidoScroll: {
    padding: 20,
    paddingBottom: 100,
  },

  tituloPrincipal: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 14,
  },

  cantidadCabecera: {
    color: "#555555",
    fontSize: 14,
    marginRight: 12,
  },

  botonExportar: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: "#e8f1e9",
    borderRadius: 6,
  },

  textoBotonExportar: {
    color: "#245b3c",
    fontWeight: "600",
  },

  tarjeta: {
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },

  imagen: {
    width: "100%",
    height: 200,
  },

  contenido: {
    padding: 15,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },

  fecha: {
    color: "#666666",
    fontSize: 13,
    marginBottom: 8,
  },

  texto: {
    fontSize: 16,
    lineHeight: 24,
  },

  botonAgregar: {
    position: "absolute",
    right: 25,
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  textoBotonAgregar: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 40,
  },
});