import * as React from "react";
import { ToastActionElement, type ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type Action =
  | { type: typeof actionTypes.ADD_TOAST; toast: ToasterToast }
  | { type: typeof actionTypes.UPDATE_TOAST; toast: Partial<ToasterToast> & { id: string } }
  | { type: typeof actionTypes.DISMISS_TOAST; toastId?: string }
  | { type: typeof actionTypes.REMOVE_TOAST; toastId?: string };

type State = ToasterToast[];

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return [action.toast, ...state].slice(0, TOAST_LIMIT);

    case actionTypes.UPDATE_TOAST:
      return state.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );

    case actionTypes.DISMISS_TOAST:
      return state.map((t) =>
        action.toastId === undefined || t.id === action.toastId
          ? { ...t, open: false }
          : t
      );

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) return [];
      return state.filter((t) => t.id !== action.toastId);

    default:
      return state;
  }
}

// ---- Listeners & dispatch ----
type Listener = (updater: (state: State) => State) => void;
const listeners: Listener[] = [];

function dispatch(action: Action) {
  for (const listener of listeners) {
    listener((state) => reducer(state, action));
  }
}

// ---- Public toast() function ----
export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId();

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  const update = (props: ToasterToast) =>
    dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}

// ---- Hook ----
export function useToast() {
  const [state, setState] = React.useState<State>([]);

  React.useEffect(() => {
    const listener: Listener = (updater) => {
      setState((s) => updater(s));
    };
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toasts: state,
    toast,
  };
}
