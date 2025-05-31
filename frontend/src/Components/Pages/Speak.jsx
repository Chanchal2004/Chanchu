import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const Speak = () => {
  // We'll still track 'latest', 'voiceType', and 'voiceSpeed' but won't do any TTS.
  const latest = useSelector((store) => store.authReducer.latest);

  const [voiceType, setVoiceType] = useState("female");
  const [voiceSpeed, setVoiceSpeed] = useState(1.5);

  // Remove or comment out any TTS logic that used `speak` or `voices`.
  useEffect(() => {
    // For now, do nothing with `latest`.
    // Previously we might have called `speak({ text: latest, ... })`.
  }, [latest]);

  // Remove any references to speak or voices in your JSX.
  return (
    <div>
      <select
        value={voiceType}
        onChange={(e) => setVoiceType(e.target.value)}
      >
        <option value="" disabled>
          Voice Type
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select
        value={voiceSpeed}
        onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
      >
        <option value="" disabled>
          Speed
        </option>
        <option value="0.5">0.5</option>
        <option value="1">1</option>
        <option value="1.5">1.5</option>
        <option value="2">2</option>
      </select>

      <button
        // Previously: onClick={speak}
        onClick={() => console.log("Speech button clicked!")}
        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-16"
      >
        Speech
      </button>
    </div>
  );
};
