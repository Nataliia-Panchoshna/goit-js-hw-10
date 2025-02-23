import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const objectsLinks = {
  dateInput: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;
objectsLinks.startBtn.disabled = true;

flatpickr(objectsLinks.dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    objectsLinks.startBtn.disabled = userSelectedDate <= new Date();
    if (objectsLinks.startBtn.disabled) {
      iziToast.error({ message: 'Please choose a date in the future' });
    } else {
      console.log('Выбранная дата:', formatDate(userSelectedDate));
    }
  },
});

objectsLinks.startBtn.addEventListener('click', () => {
  objectsLinks.startBtn.disabled = true;
  objectsLinks.dateInput.disabled = true;
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const timeLeft = userSelectedDate - new Date();
  if (timeLeft <= 0) {
    clearInterval(timerId);
    objectsLinks.dateInput.disabled = false;
    setTimerDisplay(0, 0, 0, 0);
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(timeLeft);
  setTimerDisplay(days, hours, minutes, seconds);
}

function setTimerDisplay(days, hours, minutes, seconds) {
  Object.assign(objectsLinks, {
    days: (objectsLinks.days.textContent = addLeadingZero(days)),
    hours: (objectsLinks.hours.textContent = addLeadingZero(hours)),
    minutes: (objectsLinks.minutes.textContent = addLeadingZero(minutes)),
    seconds: (objectsLinks.seconds.textContent = addLeadingZero(seconds)),
  });
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function formatDate(date) {
  return date
    .toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', ' часы');
}

function convertMs(ms) {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;
  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
}