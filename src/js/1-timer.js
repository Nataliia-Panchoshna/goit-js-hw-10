import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateInput = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let countdownInterval = null;
startButton.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate <= Date.now()) {
            iziToast.warning({
                title: "Warning",
                message: "Please choose a date in the future",
                position: "topRight"
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
            userSelectedDate = selectedDate;
        }
    }
};

flatpickr(dateInput, options);

startButton.addEventListener("click", () => {
    if (!userSelectedDate || countdownInterval) return;  // Запобігання багатократному запуску
    startButton.disabled = true;
    dateInput.disabled = true;

    startCountdown();
});

function startCountdown() {
    countdownInterval = setInterval(() => {
        const currentDate = Date.now();
        const leftTime = userSelectedDate - currentDate;

        if (leftTime <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;  // Скидаємо інтервал
            updateTimerDisplay(0, 0, 0, 0);
            iziToast.success({
                title: "Done",
                message: "Countdown finished!",
                position: "topRight"
            });
            dateInput.disabled = false;
            startButton.disabled = true; // Після завершення блокуємо кнопку Start
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(leftTime);
        updateTimerDisplay(days, hours, minutes, seconds);
    }, 1000);
}

function updateTimerDisplay(days, hours, minutes, seconds) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
