import { useEffect, useState } from "react";
import "./App.css";
import filterFirebaseData from "./helpers/filterFirebaseData";
import { Auth } from "./components/Auth";
import { auth, db, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db, "movies");

  //New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState(2000);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  //File upload state
  const [fileUpload, setFileUpload] = useState(null);

  const uploadFile = async () => {
    //we don't want to send null
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  //New Movie Submission
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newMovieReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  //Movie Title Update
  const [updatedTitle, setUpdatedTitle] = useState("");
  const updateMovieTitle = async (movieId) => {
    const movieDoc = doc(db, "movies", movieId);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };

  //Movie Deletion
  const deleteMovie = async (movieId) => {
    const movieDoc = doc(db, "movies", movieId);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  //Movie Listing
  const getMovieList = async () => {
    //READ THE DATA FROM FIRESTORE (firebase operations must be asynchronous)
    //SET THE MOVIE LIST
    try {
      const data = await getDocs(moviesCollectionRef);
      //console.log(filterFirebaseData(data));
      setMovieList(filterFirebaseData(data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
    //useEffect can't be asynchronous, so we declare and call a method that can
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Auth />
      <div>
        <input
          placeholder="title"
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="release date"
          type="number"
          onChange={(e) => setNewMovieReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>received an oscar</label>
        <button onClick={onSubmitMovie}>submit</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>

            <input
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={(/*arg!*/) => updateMovieTitle(movie.id)}>
              Update title
            </button>

            <p>Date: {movie.releaseDate}</p>

            <button onClick={(/*arg!*/) => deleteMovie(movie.id)}>
              Delete Movie
            </button>
          </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
