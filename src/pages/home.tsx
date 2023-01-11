import React, { useState } from "react";
import axios from "axios";
import { isValidURL } from "../utils/urlValidator";
import { AnimatePresence, motion } from "framer-motion";

export const Home = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("Default message");
  const [hasSubmited, setHasSubmited] = useState(false);
  const [hasShortened, setHasShortened] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");

  const onSubmitHandler = async () => {
    if (isValidURL(url)) {
      const { data } = await axios.post<string>(
        "http://localhost:3003/api/short",
        {
          origUrl: url,
        }
      );
      setShortenedUrl(data);
      setMessage("URL succesfully shortened!");
      setHasSubmited(true);
      setHasShortened(true);
    } else {
      setMessage("Invalid URL!");
      setHasSubmited(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-clouds">
      <h1 className="text-6xl shadow-2xl text-shadow mb-24 font-bold text-white text-center">
        URL Shortener
      </h1>
      {hasShortened ? (
        <motion.input
          placeholder="shortened url"
          animate={{ opacity: [0, 1] }}
          transition={{ ease: "easeInOut", times: [0, 1, 1.5], duration: 1.5 }}
          disabled
          value={shortenedUrl}
          type="search"
          className="border border-black rounded-2xl p-4"
        />
      ) : (
        <AnimatePresence>
          <motion.div
            key="search"
            className="flex flex-col items-center md:flex-row gap-4 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => onSubmitHandler()}
              className="p-3 rounded-3xl transition ease-in-out duration-300 w-36 hover:text-white active:tracking-wide hover:bg-sky-500 bg-white border-solid border-2 border-sky-500 text-lg font-bold text-sky-500"
            >
              Gerar Link
            </button>
            <input
              value={url}
              placeholder="Please type the link"
              onChange={(e) => setUrl(e.target.value)}
              type="search"
              className="border border-black rounded-2xl p-4"
            />
          </motion.div>
        </AnimatePresence>
      )}

      <div
        className={`text-bold p-2 m-2 ${
          hasShortened ? "text-green-500" : "text-red-500"
        } bg-white rounded-3xl ${hasSubmited ? "visible" : "invisible"}`}
      >
        {message}
      </div>
    </div>
  );
};
