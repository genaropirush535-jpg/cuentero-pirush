import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import {
  prepararBaseDeDatos,
  obtenerCuentos,
} from "../lib/database";

const imagenes = {
  "El delfín rosado": require("../assets/imagenes/images (3).jpg"),
  "La anaconda": require("../assets/imagenes/images .jpg"),
  "La taricaya": require("../assets/imagenes/images (2).jpg"),
};

const ordenCuentos = {
  "El delfín rosado": 0,
  "La anaconda": 1,
  "La taricaya": 2,
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

      const datos = obtenerCuentos();

      setCuentos(
        [...datos].sort(
          (primero, segundo) =>
            (ordenCuentos[primero.titulo] ?? 3) -
            (ordenCuentos[segundo.titulo] ?? 3)
        )
      );
    } catch (error) {
      console.log("Error cargando cuentos:", error);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contenidoScroll}>
        <Text style={styles.tituloPrincipal}>📚 Cuentero</Text>

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
              />
            )}

            <View style={styles.contenido}>
              <Text style={styles.titulo}>{cuento.titulo}</Text>

              <Text style={styles.texto}>{cuento.cuerpo}</Text>
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
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
    resizeMode: "cover",
  },

  contenido: {
    padding: 15,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
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