import { common, Injector, Logger } from "replugged";
import { getTimezoneNameByOffset } from "tzname";

const { messages } = common;
const inject = new Injector();
export const logger = Logger.plugin("TimeUtils");

function parseTimeString(currentdate, input) {
  const units = {
    y: "years",
    o: "months",
    d: "days",
    h: "hours",
    m: "minutes",
    s: "seconds",
  };

  const result = {
    years: currentdate.getFullYear().padStart(4, "0"),
    months: currentdate.getMonth().padStart(2, "0"),
    days: currentdate.getDate().padStart(2, "0"),
    hours: currentdate.getHours().padStart(2, "0"),
    minutes: currentdate.getMinutes().padStart(2, "0"),
    seconds: currentdate.getSeconds().padStart(2, "0"),
  };

  let currentNumber = "";
  let currentUnit = "";

  for (const char of input) {
    if (/[0-9]/.test(char)) {
      currentNumber += char;
    } else if (units[char]) {
      currentUnit = units[char];
    } else {
      continue; // Ignore invalid characters
    }

    if (currentNumber !== "" && currentUnit !== "") {
      // Pad the numeric value based on the unit
      const paddedValue =
        currentUnit === "years" ? currentNumber.padStart(4, "0") : currentNumber.padStart(2, "0");
      result[currentUnit] = paddedValue;
      currentNumber = "";
      currentUnit = "";
    }
  }

  return result;
}

function solver(match: string): string {
  switch (match) {
    case "<ct>":
      return "<t:" + Math.round(new Date().getTime() / 1000).toString() + ">";
    case "<ctc>":
      return "<t:" + Math.round(new Date().getTime() / 1000).toString() + ":R>";
    case "<ctt>":
      return new Date().toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
    default:
      if (match.startsWith("<ctt:")) {
        console.log(match.split(":")[1].slice(0, -1));
        return new Date().toLocaleDateString("en-us", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZone: getTimezoneNameByOffset(
            match.split(":")[1].slice(0, -1).replace("UTC+", "").replace("GMT+", ""),
          ),
          timeZoneName: "shortOffset",
        });
      } else if (match.startsWith("<abstt:")) {
        if (match.split(":").length == 2) {
          const parsedtime = parseTimeString(new Date(), match.split(":")[1].slice(0, -1));
          return new Date(
            parsedtime["years"] +
              "-" +
              parsedtime["months"] +
              "-" +
              parsedtime["days"] +
              "T" +
              parsedtime["hours"] +
              ":" +
              parsedtime["minutes"] +
              ":" +
              parsedtime["seconds"],
          ).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });
        } else if (match.split(":").length == 3) {
          console.log("3");
          const parsedtime = parseTimeString(new Date(), match.split(":")[1]);
          return new Date(
            parsedtime["years"] +
              "-" +
              parsedtime["months"] +
              "-" +
              parsedtime["days"] +
              "T" +
              parsedtime["hours"] +
              ":" +
              parsedtime["minutes"] +
              ":" +
              parsedtime["seconds"],
          ).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZone: getTimezoneNameByOffset(
              match.split(":")[2].slice(0, -1).replace("UTC", "").replace("GMT", ""),
            ),
            timeZoneName: "shortOffset",
          });
        }
      } else if (match.startsWith("<abst:")) {
        const parsedtime = parseTimeString(new Date(), match.split(":")[1].slice(0, -1));
        return (
          "<t:" +
          Math.round(
            new Date(
              parsedtime["years"] +
                "-" +
                parsedtime["months"] +
                "-" +
                parsedtime["days"] +
                "T" +
                parsedtime["hours"] +
                ":" +
                parsedtime["minutes"] +
                ":" +
                parsedtime["seconds"],
            ).getTime() / 1000,
          ).toString() +
          ">"
        );
      } else if (match.startsWith("<abstc:")) {
        const parsedtime = parseTimeString(new Date(), match.split(":")[1].slice(0, -1));
        return (
          "<t:" +
          Math.round(
            new Date(
              parsedtime["years"] +
                "-" +
                parsedtime["months"] +
                "-" +
                parsedtime["days"] +
                "T" +
                parsedtime["hours"] +
                ":" +
                parsedtime["minutes"] +
                ":" +
                parsedtime["seconds"],
            ).getTime() / 1000,
          ).toString() +
          ":R>"
        );
      }
  }
}

export function start(): void {
  inject.before(messages, "sendMessage", (props) => {
    let { content } = props[1];
    const regexPattern = RegExp("<((ctt?|abst+t*)c?[^>]*)(:[^>]*)?>", "gmi");
    content = content.replaceAll(regexPattern, solver);
    props[1].content = content;
    return props;
  });
}

export function stop(): void {
  inject.uninjectAll();
}
