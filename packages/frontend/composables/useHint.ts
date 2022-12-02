const state = reactive({
  taskTitle: "",
  hint: "",
});
const isHintModalOpen = ref(false);

export default function useHint() {
  function showHint(taskTitle: string, hint: string) {
    state.hint = hint;
    state.taskTitle = taskTitle;
    isHintModalOpen.value = true;
  }
  return { hint: state, isHintModalOpen, showHint };
}
