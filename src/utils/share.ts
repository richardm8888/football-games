import { UAParser } from "ua-parser-js";
import { generateEmojiGrid } from "./emoji";
const webShareApiDeviceTypes = ["mobile", "smarttv", "wearable"];
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();

export const shareStatus = (
  difficulty: string,
  gameData: any,
  submittedGuesses: any,
  handleShareToClipboard: any,
  handleShareFailure: any
) => {
  const textToShare =
    `Football Connect #${difficulty}\n\n` +
    generateEmojiGrid(gameData, submittedGuesses).join("\n") + "\n\n" +
    "https://www.football-connect.co.uk";

  const shareData = { text: textToShare };

  let shareSuccess = false;

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData);
      shareSuccess = true;
    }
  } catch (error) {
    shareSuccess = false;
  }

  try {
    if (!shareSuccess) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToShare)
          .then(handleShareToClipboard)
          .catch(handleShareFailure);
      } else {
        handleShareFailure();
      }
    }
  } catch (error) {
    handleShareFailure();
  }
};

const attemptShare = (shareData: any) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf("FIREFOX") === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? "") !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  );
};
