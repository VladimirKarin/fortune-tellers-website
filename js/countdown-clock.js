export function timer() {
    const Days = document.getElementById('days');
    const Hours = document.getElementById('hours');
    const Minutes = document.getElementById('minutes');
    const Seconds = document.getElementById('seconds');

    if (!Days || !Hours || !Minutes || !Seconds) {
        console.error('Countdown elements not found in the DOM');
        return;
    }

    const targetDate = new Date('May 31 2025 00:00:00').getTime();
    const currentDate = new Date().getTime();
    const timeDifference = targetDate - currentDate; //milliseconds

    const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
    const hours = Math.floor(timeDifference / 1000 / 60 / 60) % 24;
    const minutes = Math.floor(timeDifference / 1000 / 60) % 60;
    const seconds = Math.floor(timeDifference / 1000) % 60;

    Days.innerHTML = days < 10 ? '0' + days : days;
    Hours.innerHTML = hours < 10 ? '0' + hours : hours;
    Minutes.innerHTML = minutes < 10 ? '0' + minutes : minutes;
    Seconds.innerHTML = seconds < 10 ? '0' + seconds : seconds;
}
