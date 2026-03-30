import { useRouter } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";

import useInicialForm from "@/lib/stores/useInicialForm";
import { useUserStore } from "@/lib/stores/useUserStore";
import InputText from "@/components/inputs/InputText";
import InputNumber from "@/components/inputs/InputNumber";
import BtnForm from "@/components/buttons/btnForm";
import SelectDropdown from "@/components/dropdowns/selectDropdown";
import RadioGroup from "@/components/groupButtons/RadioGroup";
import { ISelectItem } from "rn-custom-select-dropdown";
import SearchableDropdown from "@/components/dropdowns/searchDropdown";
import { useRequest } from "@/lib/hooks/useRequest";
import WebContainer from "@/components/layout/WebContainer";
import { Colors, FontSizes, Spacing } from "@/lib/constants/theme";

type FormData = {
  nome: string;
  iniciais_do_nome: string;
  idade: string;
  email?: string;
  renda_mensal?: string;
  ocupacao?: string;
  carga_horaria_semanal?: string;
  escolaridade?: string;
  estado?: string;
  estado_civil?: string;
  faz_tratamento_psicologico?: string;
  tratamentos?: string;
  toma_medicacao_psiquiatrica?: string;
  medicacoes?: string;
};

// Componente de Toast simples
const Toast = ({
  message,
  visible,
  onHide,
}: {
  message: string;
  visible: boolean;
  onHide: () => void;
}) => {
  if (!visible) return null;

  // Auto-esconde após 3 segundos
  setTimeout(onHide, 3000);

  return (
    <View style={toastStyles.container}>
      <Text style={toastStyles.text}>{message}</Text>
    </View>
  );
};

const toastStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: "50%",
    transform: [{ translateX: -150 }],
    backgroundColor: "#FF4444",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    zIndex: 1000,
    width: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default function FormInicial() {
  //const api = process.env.EXPO_PUBLIC_API_URL;
  const api = "http://187.77.61.91:3000/api";

  const router = useRouter();
  const { setFormData } = useInicialForm();
  const { post, loading, error } = useRequest();
  const { setUser } = useUserStore();

  const [selectedSexo, setSelectedSexo] = useState<ISelectItem<string> | null>(
    null,
  );
  const [selectedEstado, setSelectedEstado] =
    useState<ISelectItem<string> | null>(null);
  const [selectedEscolaridade, setSelectedEscolaridade] =
    useState<ISelectItem<string> | null>(null);
  const [selectedTratamento, setSelectedTratamento] =
    useState<ISelectItem<string> | null>(null);
  const [selectedMedica, setSelectedMedica] =
    useState<ISelectItem<string> | null>(null);
  const [selectedEstadoCivil, setSelectedEstadoCivil] =
    useState<ISelectItem<string> | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({ mode: "onChange" });

  const isCustomValid = useMemo(() => {
    return (
      selectedSexo !== null &&
      selectedEstado !== null &&
      selectedEscolaridade !== null &&
      selectedTratamento !== null &&
      selectedMedica !== null &&
      selectedEstadoCivil !== null
    );
  }, [
    selectedSexo,
    selectedEstado,
    selectedEscolaridade,
    selectedTratamento,
    selectedMedica,
    selectedEstadoCivil,
  ]);

  const isAllValid = isValid && isCustomValid;

  // FUNÇÃO GENÉRICA: envia dados + navega
  const submitAndGo = (route: string) => {
    return async (data: FormData) => {
      try {
        // Validação do email apenas no envio
        if (data.email && data.email.trim() !== "") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(data.email)) {
            showToast(
              "Por favor, digite um email válido ou deixe o campo em branco.",
            );
            return; // Impede o envio se o email for inválido
          }
        }

        const payload = {
          iniciais_do_nome: data.iniciais_do_nome,
          //nome: data.nome,
          idade: Number(data.idade),
          sexo: (selectedSexo?.value ?? "").toString().toUpperCase() as
            | "M"
            | "F"
            | "O",
          email:
            data.email && data.email.trim() !== "" ? data.email : undefined,
          renda_mensal: data.renda_mensal
            ? Number(data.renda_mensal)
            : undefined,
          estado_civil: selectedEstadoCivil?.value || undefined,
          ocupacao: data.ocupacao || undefined,
          carga_horaria_semanal: data.carga_horaria_semanal
            ? Number(data.carga_horaria_semanal)
            : undefined,
          escolaridade: selectedEscolaridade?.value || undefined,
          estado: selectedEstado?.value || undefined,
          faz_tratamento_psicologico: selectedTratamento?.value === "sim",
          tratamentos:
            selectedTratamento?.value === "sim"
              ? data.tratamentos || ""
              : undefined,
          toma_medicacao_psiquiatrica: selectedMedica?.value === "sim",
          medicacoes:
            selectedMedica?.value === "sim" ? data.medicacoes || "" : undefined,
        };

        const response = await post(`${api}/usuarios`, payload);

        setUser({
          id: response.id,
        });

        setFormData(payload);

        // cast para satisfazer as assinaturas estritas do expo-router
        router.push(route as unknown as any);
      } catch (err: any) {
        showToast(error || err.message || "Erro ao enviar dados.");
      }
    };
  };

  const sexoOptions = [
    { label: "Masculino", value: "M" },
    { label: "Feminino", value: "F" },
    { label: "Outro", value: "O" },
  ];

  const escolaridadeOptions = [
    { label: "Ensino Fundamental", value: "Ensino Fundamental" },
    { label: "Ensino Médio", value: "Ensino Medio" },
    { label: "Ensino Superior", value: "Superior Completo" },
  ];

  const estados: Array<ISelectItem<string>> = [
    { label: "Acre", value: "AC" },
    { label: "Alagoas", value: "AL" },
    { label: "Amapá", value: "AP" },
    { label: "Amazonas", value: "AM" },
    { label: "Bahia", value: "BA" },
    { label: "Ceará", value: "CE" },
    { label: "Distrito Federal", value: "DF" },
    { label: "Espírito Santo", value: "ES" },
    { label: "Goiás", value: "GO" },
    { label: "Maranhão", value: "MA" },
    { label: "Mato Grosso", value: "MT" },
    { label: "Mato Grosso do Sul", value: "MS" },
    { label: "Minas Gerais", value: "MG" },
    { label: "Pará", value: "PA" },
    { label: "Paraíba", value: "PB" },
    { label: "Paraná", value: "PR" },
    { label: "Pernambuco", value: "PE" },
    { label: "Piauí", value: "PI" },
    { label: "Rio de Janeiro", value: "RJ" },
    { label: "Rio Grande do Norte", value: "RN" },
    { label: "Rio Grande do Sul", value: "RS" },
    { label: "Rondônia", value: "RO" },
    { label: "Roraima", value: "RR" },
    { label: "Santa Catarina", value: "SC" },
    { label: "São Paulo", value: "SP" },
    { label: "Sergipe", value: "SE" },
    { label: "Tocantins", value: "TO" },
  ];

  const optionSimNao = [
    { label: "Sim", value: "sim" },
    { label: "Não", value: "nao" },
  ];

  const estadosCivil = [
    { label: "Solteiro", value: "Solteiro" },
    { label: "Casado", value: "Casado" },
    { label: "Divorciado", value: "Divorciado" },
    { label: "Viúvo", value: "Viuvo" },
  ];

  return (
    <WebContainer size="md">
      <View style={styles.container}>
        {/* Toast para mensagens de erro */}
        <Toast
          message={toastMessage}
          visible={toastVisible}
          onHide={hideToast}
        />

        {/* Modal de Loading */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={loading}
          statusBarTranslucent={true}
        >
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primaryDark} />
              <Text style={styles.loadingText}>Enviando dados...</Text>
            </View>
          </View>
        </Modal>

        <Text style={styles.pageTitle}>Cadastro</Text>
        <ScrollView style={{ width: "100%" }}>
          {/* <InputText
          label="Nome"
          placeholder="Nome"
          name="nome"
          control={control}
          rules={{ required: true }}
          iconName="person"
        /> */}

          <InputText
            label="Iniciais do nome"
            placeholder="Ex: TST"
            name="iniciais_do_nome"
            control={control}
            rules={{ required: true }}
            iconName="text"
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
              zIndex: 10,
            }}
          >
            <InputNumber
              label="Idade"
              placeholder="Idade"
              name="idade"
              control={control}
              rules={{ required: true }}
              iconName="calendar"
              width="48%"
            />
            <SelectDropdown
              label="Sexo"
              placeholder="Selecione"
              items={sexoOptions}
              value={selectedSexo}
              onChange={setSelectedSexo}
              width="48%"
            />
          </View>

          <InputText
            label="Email"
            placeholder="Email"
            name="email"
            control={control}
            iconName="mail"
          />

          <InputNumber
            label="Renda Mensal"
            placeholder="R$"
            name="renda_mensal"
            control={control}
            iconName="cash"
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              zIndex: 10,
            }}
          >
            <InputText
              label="Ocupação"
              placeholder="Sua ocupação"
              name="ocupacao"
              control={control}
              iconName="briefcase"
              width="48%"
            />
            <InputNumber
              label="Carga horária semanal"
              placeholder="Horas"
              name="carga_horaria_semanal"
              control={control}
              iconName="time"
              width="48%"
            />
          </View>

          <View style={{ zIndex: 30, marginBottom: 20 }}>
            <SelectDropdown
              label="Escolaridade"
              placeholder="Selecione"
              items={escolaridadeOptions}
              value={selectedEscolaridade}
              onChange={setSelectedEscolaridade}
            />
          </View>

          <View style={{ zIndex: 20, marginBottom: 20 }}>
            <SelectDropdown
              label="Estado civil"
              placeholder="Selecione"
              items={estadosCivil}
              value={selectedEstadoCivil}
              onChange={setSelectedEstadoCivil}
            />
          </View>

          <View style={{ zIndex: 15 }}>
            <SearchableDropdown
              label="Estado"
              data={estados}
              onChange={setSelectedEstado}
              placeholder="Digite para buscar..."
            />
          </View>

          <RadioGroup
            label="Faz tratamento psicológico?"
            options={optionSimNao}
            value={selectedTratamento?.value ?? null}
            onChange={(newValue) => {
              const item =
                optionSimNao.find((s) => s.value === newValue) || null;
              setSelectedTratamento(item);
            }}
            horizontal
          />

          {selectedTratamento?.value === "sim" && (
            <InputText
              label="Qual tratamento?"
              name="tratamentos"
              control={control}
              placeholder={""}
            />
          )}

          <RadioGroup
            label="Toma medicação psiquiátrica?"
            options={optionSimNao}
            value={selectedMedica?.value ?? null}
            onChange={(newValue) => {
              const item =
                optionSimNao.find((s) => s.value === newValue) || null;
              setSelectedMedica(item);
            }}
            horizontal
          />

          {selectedMedica?.value === "sim" && (
            <InputText
              label="Qual medicação?"
              name="medicacoes"
              control={control}
              placeholder={""}
            />
          )}

          <View style={{ alignItems: "center" }}>
            <BtnForm
              title={loading ? "Enviando..." : "Ir para formulário Dass-21"}
              onPress={handleSubmit(submitAndGo("/(forms dass)/welcome"))}
              disabled={!isAllValid || loading}
            />

            <BtnForm
              title={loading ? "Enviando..." : "Ir para formulário FFMQ"}
              onPress={handleSubmit(submitAndGo("/(form ffmq)/welcome"))}
              disabled={!isAllValid || loading}
            />

            <BtnForm
              title={loading ? "Enviando..." : "Ir para formulário Capc"}
              onPress={handleSubmit(submitAndGo("/(form capc)/welcome"))}
              disabled={!isAllValid || loading}
            />

            <BtnForm
              title={loading ? "Enviando..." : "Ir para resultados"}
              onPress={handleSubmit(submitAndGo("/(results)/resultGeneral"))}
              disabled={!isAllValid || loading}
            />
          </View>
        </ScrollView>
      </View>
    </WebContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    padding: Spacing.lg,
    paddingTop: 25,
  },
  pageTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
  },
  loadingText: {
    marginTop: 15,
    fontSize: FontSizes.md,
    color: Colors.primaryDark,
    fontWeight: "500",
    textAlign: "center",
  },
});
