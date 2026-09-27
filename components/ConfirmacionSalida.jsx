import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export function ConfirmacionSalida({
  visible,
  mensaje,
  onCancelar,
  onDescartar,
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancelar}
    >
      <View style={styles.fondo}>
        <View style={styles.dialogo}>
          <Text style={styles.titulo}>Descartar cambios</Text>
          <Text style={styles.mensaje}>{mensaje}</Text>
          <View style={styles.acciones}>
            <Pressable style={styles.botonCancelar} onPress={onCancelar}>
              <Text style={styles.textoCancelar}>Seguir editando</Text>
            </Pressable>
            <Pressable style={styles.botonDescartar} onPress={onDescartar}>
              <Text style={styles.textoDescartar}>Descartar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dialogo: {
    width: "100%",
    maxWidth: 380,
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  titulo: {
    marginBottom: 8,
    color: "#222222",
    fontSize: 18,
    fontWeight: "700",
  },
  mensaje: {
    color: "#444444",
    fontSize: 15,
    lineHeight: 22,
  },
  acciones: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  botonCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  textoCancelar: {
    color: "#245b3c",
    fontWeight: "600",
  },
  botonDescartar: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#a32727",
  },
  textoDescartar: {
    color: "#ffffff",
    fontWeight: "600",
  },
});