import { useState, useEffect, useCallback, useRef } from "react";

const usePlaybackVector = (player) => {
  const [playbackVector, setPlaybackVector] = useState([]);

  /**
  * Storing value in a useState would change too frequently, causing a re-render of the callbacks that depend on it.
  * By placing the updated value inside of a ref instead of state on every change, we're able to access
  * the mutable ref within the callback without having to replace/re-render the callback
  *
  * Read more: https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
  */
  const lastRecordedSecondRef = useRef(0);

  /**
  * Slice up the duration of the video so that
  each second of playback can be accounted for individually
  
  We can then send this to a tracker when either the video changes or
  on the window.unload function
  */
  const determinePlaybackVector = useCallback(() => {
    if (!player) return;
    // `player.seekable` returns a time range containing the start and the end of what is seekable, use `.duration` as fallback
    const timeRange = player.seekable;
    if (timeRange.length === 0) return;
    const start = timeRange.start(0);
    const end = Math.ceil(timeRange.end(0));

    // Zero fill the playback vector to the length of the current video duration
    const length = Number.isInteger(end) && Number.isInteger(start) ? end - start : Math.ceil(player.duration);
    const vector = new Array(length).fill(0)

    setPlaybackVector(vector);
  }, [player]);

  useEffect(() => {
    if (!player) return;
    player.addEventListener("loadedmetadata", determinePlaybackVector);
    return () =>
      player.removeEventListener("loadedmetadata", determinePlaybackVector);
  }, [player, determinePlaybackVector]);

  /**
  * Update playback vector on time update
  */
  const updatePlaybackVector = useCallback(async () => {
    // make sure video is playing (check paused state) before marking second as watched
    if (player.paused) return;
    const lastRecordedSecond = lastRecordedSecondRef.current; // Read lastRecordedSecond state from the ref
    const currentSecond = Math.floor(player.currentTime);

    setPlaybackVector((currentPlaybackVector) => {
      // Make a shallow copy of the currentPlaybackVector
      const newPlaybackVector = [...currentPlaybackVector];

      // If first time watching this second, set it to 1
      if (currentPlaybackVector[currentSecond] === 0) {
        newPlaybackVector[currentSecond] = 1;
      }

      // If already watched this second and it's not the last
      // thing we've recorded, increment view for this second.
      if (
        currentPlaybackVector[currentSecond] > 0 &&
        lastRecordedSecond !== currentSecond
      ) {
        newPlaybackVector[currentSecond] =
          currentPlaybackVector[currentSecond] + 1;
      }

      return newPlaybackVector;
    });

    setLastRecordedSecond(currentSecond);
  }, [player]);

  useEffect(() => {
    if (!player) return;
    player.addEventListener("timeupdate", updatePlaybackVector);
    return () => player.removeEventListener("timeupdate", updatePlaybackVector);
  }, [player, updatePlaybackVector]);

  /**
  * Record playback vector
  */
  const recordPlaybackVector = useCallback(async ({ type }) => {
    if (playbackVector.length > 0) {
      // record the value stored in playbackVector on the server
    }

    // Reset the playback vector on emptied
    if (type === "emptied" && playbackVector.length > 0) {
      setPlaybackVector([]);
    }
  }, []);

  /**
  * Bind events which trigger recordPlaybackVector
  */
  useEffect(() => {
    if (!player) return;

    // Send beacon when window closes
    window.addEventListener("unload", recordPlaybackVector, false);

    // track source and playback id changes manually
    // if the source changes, commit the state of the viewing session
    player.addEventListener("emptied", recordPlaybackVector);
    player.addEventListener("loadstart", recordPlaybackVector);

    // you might need to double check that the stream type `streamtypechange` is streamType: `on-demand`

    return () => {
      window.removeEventListener("unload", recordPlaybackVector);
      player.removeEventListener("emptied", recordPlaybackVector);
      player.removeEventListener("loadstart", recordPlaybackVector);
    };
  }, [player, recordPlaybackVector]);

  return playbackVector;
};

export default usePlaybackVector;