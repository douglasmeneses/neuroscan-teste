import { useQuestionStore } from "@/lib/stores/useFormDass";
import { dassQuestions } from "@/lib/questions/QuestionsDass";
import QuestionnaireTemplateDireto from "@/components/templates/QuestionnaireTemplateDireto";

export default function Questions() {
  const api = process.env.EXPO_PUBLIC_API_URL;

  const {
    perguntas,
    setResposta,
    incrementaClique,
    setTempo,
    setTempoResposta,
    resetResposta,
  } = useQuestionStore();

  return (
    <QuestionnaireTemplateDireto
      initialId={61}
      questions={dassQuestions}
      sensorKey="DASS"
      store={{
        respostas: perguntas,
        setResposta,
        incrementaClique,
        setTempo,
        setTempoResposta,
        resetResposta,
      }}
      finishRoute="/(form ffmq)/welcome"
      endpoint={`${api}/respostas/json`}
    />
  );
}
