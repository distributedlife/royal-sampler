'use strict';

const millisPerSecond = 1000;
const secondsPerMinute = 60;
const minutesPerHour = 60;
const secondsPerHour = secondsPerMinute * minutesPerHour;

function createSampleFunc (callback, frequency) {
  let timeSinceLast = frequency;

  return function sample (delta, ...props) {
    timeSinceLast += delta;

    if (timeSinceLast >= frequency) {
      timeSinceLast -= frequency;
      return callback(delta, ...props);
    }
  };
}

function createThrottleFunc (callback, frequency) {
  let callsSinceLast = frequency;

  return function throttle (...props) {
    callsSinceLast += 1;

    if (callsSinceLast >= frequency) {
      callsSinceLast = 0;
      return callback(...props);
    }
  };
}

export function execute (fx) {
  return {
    every: function every (n = 1) {
      function milliseconds () {
        return createSampleFunc(fx, n / millisPerSecond);
      }
      function seconds () {
        return createSampleFunc(fx, n);
      }
      function minutes () {
        return createSampleFunc(fx, n * secondsPerMinute);
      }
      function hours () {
        return createSampleFunc(fx, n * secondsPerHour);
      }
      function calls () {
        return createThrottleFunc(fx, n);
      }

      return {
        millisecond: milliseconds,
        milliseconds: milliseconds,
        second: seconds,
        seconds: seconds,
        minute: minutes,
        minutes: minutes,
        hour: hours,
        hours: hours,
        call: calls,
        calls: calls,
      };
    },
    about: function about (i = 1) {
      return {
        timesPer: {
          second: function second () {
            return createSampleFunc(fx, 1 / i);
          },
          minute: function minute () {
            return createSampleFunc(fx, secondsPerMinute / i);
          },
          hour: function hour () {
            return createSampleFunc(fx, secondsPerHour / i);
          }
        }
      };
    }
  };
}