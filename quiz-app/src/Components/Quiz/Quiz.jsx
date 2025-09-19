import { useRef, useState, useEffect } from "react";
import "./Quiz.css";

const Quiz = ( ) => {
  // --- États existants ---
  let [index, setIndex] = useState(0);
  let [question, setQuestion] = useState({});
  let [data, setData] = useState([]);
  let [lock, setLock] = useState(false);
  let [score, setScore] = useState(0);
  let [result, setResult] = useState(false);
  let [userDetails, setUserDetails] = useState({ name: "", email: "" });
  let [startQuiz, setStartQuiz] = useState(false);

  // --- NOUVEAUX ÉTATS POUR LE CHARGEMENT ET LES ERREURS ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);

  const option_array = [Option1, Option2, Option3, Option4];

  // Cet effet se déclenche quand l'utilisateur clique sur "Start Quiz"
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true); // 1. On commence le chargement
      setError(null);   // On réinitialise les erreurs

      try {
        // 2. CORRECTION MAJEURE : Utiliser la variable d'environnement de votre ConfigMap
        const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/questions`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        let questions = await response.json();

        // Transformation des données pour correspondre à la structure attendue
        questions = questions.map((q) => ({
          ...q,
          options: [q.option1, q.option2, q.option3, q.option4].filter(opt => opt != null), // Filtre les options nulles
          answer: q.ans,
        }));

        if (questions.length > 0) {
          setData(questions);
          setQuestion(questions[0]);
        } else {
          throw new Error("No questions found from the API.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error.message); // On stocke le message d'erreur
      } finally {
        setLoading(false); // 3. On a fini de charger (succès ou échec)
      }
    };

    if (startQuiz) {
      fetchQuestions();
    }
  }, [startQuiz]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userDetails.name && userDetails.email) {
      setStartQuiz(true);
    } else {
      alert("Name and email are required to start the quiz.");
    }
  };

  const checkAns = (e, ans) => {
    if (lock === false) {
      if (question && question.answer === ans) {
        e.target.classList.add("correct");
        setLock(true);
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        setLock(true);
        if (option_array[question.answer - 1].current) {
          option_array[question.answer - 1].current.classList.add("correct");
        }
      }
    }
  };

  const next = () => {
    if (lock === true) {
      if (index === data.length - 1) {
        setResult(true);
      } else {
        const nextIndex = index + 1;
        setIndex(nextIndex);
        setQuestion(data[nextIndex]);
        setLock(false);
        option_array.forEach((option) => {
          if (option.current) {
            option.current.classList.remove("wrong");
            option.current.classList.remove("correct");
          }
        });
      }
    }
  };

  const reset = () => {
    setIndex(0);
    setData([]); // Vider les données pour forcer un nouveau fetch
    setQuestion({});
    setScore(0);
    setLock(false);
    setResult(false);
    setStartQuiz(false);
    setUserDetails({ name: "", email: "" });
  };

  // --- AFFICHAGE ---

  // Écran de connexion initial
  if (!startQuiz) {
    return (
      <div className="container">
        <h1>Quiz App</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div><label htmlFor="name">Name:</label><input type="text" id="name" name="name" value={userDetails.name} onChange={handleInputChange} required /></div>
          <div><label htmlFor="email">Email:</label><input type="email" id="email" name="email" value={userDetails.email} onChange={handleInputChange} required /></div>
          <button type="submit">Start Quiz</button>
        </form>
      </div>
    );
  }

  // 4. NOUVELLE VUE : Écran de chargement
  if (loading) {
    return <div className="container"><h2>Loading questions...</h2></div>;
  }

  // NOUVELLE VUE : Écran d'erreur
  if (error) {
    return <div className="container"><h2>Error: {error}</h2><button onClick={reset}>Try Again</button></div>;
  }

  // Écran du quiz ou des résultats
  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {result ? (
        <>
          <h2>You Scored {score} out of {data.length}</h2>
          <button onClick={reset}>Reset</button>
        </>
      ) : (
        <>
          <h2>{index + 1}. {question?.question}</h2>
          <ul>
            {question?.options?.map((option, idx) => (
              <li key={idx} ref={option_array[idx]} onClick={(e) => { checkAns(e, idx + 1); }}>
                {option}
              </li>
            ))}
          </ul>
          <button onClick={next}>Next</button>
          <div className="index">{index + 1} of {data.length} questions</div>
        </>
      )}
    </div>
  );
};

export default Quiz;
