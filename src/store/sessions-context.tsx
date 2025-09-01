import { type ReactNode, createContext, useContext, useReducer } from "react";

// Declare the values needed to define an individual session that
// customers can book using the website.
export type Session = {
  id: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  image: string;
  duration: number;
};

// Declare the array that will hold all the booked sessions.
type SessionState = {
  upcomingSessions: Session[];
};

// Used to create the context.
// Declares the methods and state variables necessary to manage the context.
type SessionContextValue = SessionState & {
  bookSession: (session: Session) => void;
  cancelSession: (sessionId: string) => void;
};

// Allow pages to create the context and store a reference to it.
export const SessionsContext = createContext<SessionContextValue | null>(null);

// Allow pages to get a reference to the context.
export function useSessionsContext() {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error(
      "useSessionsContext must be used within a SessionsContextProvider"
    );
  }
  return context;
}

// REDUCER ACTION TYPES //
type BookSessionAction = {
  type: "BOOK_SESSION";
  session: Session;
};

type CancelSessionAction = {
  type: "CANCEL_SESSION";
  sessionId: string;
};

type SessionsAction = BookSessionAction | CancelSessionAction;

// dispatch calls to the React reducer hook, which further processes them based on the requested action type.
function sessionsReducer(state: SessionState, action: SessionsAction) {
  if (action.type === "BOOK_SESSION") {
    if (
      state.upcomingSessions.some((session) => session.id === action.session.id)
    ) {
      return state;
    }
    return {
      upcomingSessions: state.upcomingSessions.concat(action.session),
    };
  }

  if (action.type === "CANCEL_SESSION") {
    return {
      upcomingSessions: state.upcomingSessions.filter(
        (session) => session.id !== action.sessionId
      ),
    };
  }

  return state;
}

// provides the
export default function SessionsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  // useReducer( reducer, initialState, init)
  // upcomingSessions: [] is the initial state which is defined as an empty array of sessions.
  const [sessionsState, dispatch] = useReducer(sessionsReducer, {
    upcomingSessions: [],
  });

  // sends the calls to the reducer for further processing depending on the the type of request.
  function bookSession(session: Session) {
    dispatch({ type: "BOOK_SESSION", session });
  }

  function cancelSession(sessionId: string) {
    dispatch({ type: "CANCEL_SESSION", sessionId });
  }

  // store a ref(?) to the upcomingSessions array.
  const ctxValue = {
    upcomingSessions: sessionsState.upcomingSessions,
    bookSession,
    cancelSession,
  };

  // finally, return the context JSX and all its children.
  return (
    <SessionsContext.Provider value={ctxValue}>
      {children}
    </SessionsContext.Provider>
  );
}
