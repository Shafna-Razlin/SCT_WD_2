document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const lapBtn = document.getElementById('lapBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapsList = document.getElementById('lapsList');
    const totalTimeDisplay = document.getElementById('totalTime');
    const fastestLapDisplay = document.getElementById('fastestLap');
    const lapsCountDisplay = document.getElementById('lapsCount');

    // Variables
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapTimes = [];
    let lapStartTime = 0;

    // Format time to always show 2 digits
    function formatTime(time) {
        return time.toString().padStart(2, '0');
    }

    // Format milliseconds to always show 2 digits
    function formatMilliseconds(ms) {
        return Math.floor(ms / 10).toString().padStart(2, '0');
    }

    // Update the display with current time
    function updateDisplay() {
        const currentTime = Date.now();
        const elapsed = elapsedTime + (isRunning ? currentTime - startTime : 0);
        
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        const milliseconds = elapsed % 1000;
        
        hoursDisplay.textContent = formatTime(hours);
        minutesDisplay.textContent = formatTime(minutes);
        secondsDisplay.textContent = formatTime(seconds);
        millisecondsDisplay.textContent = formatMilliseconds(milliseconds);
    }

    // Start the stopwatch
    function startTimer() {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            lapStartTime = Date.now() - (elapsedTime > 0 ? elapsedTime : 0);
            timerInterval = setInterval(updateDisplay, 10);
            isRunning = true;
            startPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            startPauseBtn.classList.remove('start');
            startPauseBtn.classList.add('pause');
            lapBtn.disabled = false;
        }
    }

    // Pause the stopwatch
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            elapsedTime += Date.now() - startTime;
            isRunning = false;
            startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            startPauseBtn.classList.remove('pause');
            startPauseBtn.classList.add('start');
        }
    }

    // Reset the stopwatch
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedTime = 0;
        lapTimes = [];
        lapStartTime = 0;
        updateDisplay();
        lapsList.innerHTML = '<div class="no-laps">Record your first lap to begin</div>';
        startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        startPauseBtn.classList.remove('pause');
        startPauseBtn.classList.add('start');
        lapBtn.disabled = true;
        updateSummary();
    }

    // Record a lap time
    function recordLap() {
        if (isRunning) {
            const currentTime = Date.now();
            const lapTime = currentTime - lapStartTime;
            lapStartTime = currentTime;
            
            const lapObj = {
                time: lapTime,
                totalTime: elapsedTime + (currentTime - startTime)
            };
            
            lapTimes.push(lapObj);
            renderLaps();
            updateSummary();
        }
    }

    // Render all lap times
    function renderLaps() {
        if (lapTimes.length === 0) return;
        
        if (document.querySelector('.no-laps')) {
            lapsList.innerHTML = '';
        }
        
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        
        const hours = Math.floor(lapTimes[lapTimes.length - 1].time / (1000 * 60 * 60));
        const minutes = Math.floor((lapTimes[lapTimes.length - 1].time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((lapTimes[lapTimes.length - 1].time % (1000 * 60)) / 1000);
        const milliseconds = lapTimes[lapTimes.length - 1].time % 1000;
        
        const lapTimeFormatted = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
        
        const totalHours = Math.floor(lapTimes[lapTimes.length - 1].totalTime / (1000 * 60 * 60));
        const totalMinutes = Math.floor((lapTimes[lapTimes.length - 1].totalTime % (1000 * 60 * 60)) / (1000 * 60));
        const totalSeconds = Math.floor((lapTimes[lapTimes.length - 1].totalTime % (1000 * 60)) / 1000);
        const totalMilliseconds = lapTimes[lapTimes.length - 1].totalTime % 1000;
        
        const totalTimeFormatted = `${formatTime(totalHours)}:${formatTime(totalMinutes)}:${formatTime(totalSeconds)}.${formatMilliseconds(totalMilliseconds)}`;
        
        lapItem.innerHTML = `
            <span>Lap ${lapTimes.length}</span>
            <span>${lapTimeFormatted}</span>
            <span>${totalTimeFormatted}</span>
        `;
        
        lapsList.prepend(lapItem);
    }

    // Update summary statistics
    function updateSummary() {
        if (lapTimes.length > 0) {
            // Calculate total time
            const totalTime = lapTimes[lapTimes.length - 1].totalTime;
            const totalHours = Math.floor(totalTime / (1000 * 60 * 60));
            const totalMinutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
            const totalSeconds = Math.floor((totalTime % (1000 * 60)) / 1000);
            const totalMilliseconds = totalTime % 1000;
            
            totalTimeDisplay.textContent = `${formatTime(totalHours)}:${formatTime(totalMinutes)}:${formatTime(totalSeconds)}.${formatMilliseconds(totalMilliseconds)}`;
            
            // Calculate fastest lap
            const lapDurations = lapTimes.map(lap => lap.time);
            const fastestLap = Math.min(...lapDurations);
            
            const fastestHours = Math.floor(fastestLap / (1000 * 60 * 60));
            const fastestMinutes = Math.floor((fastestLap % (1000 * 60 * 60)) / (1000 * 60));
            const fastestSeconds = Math.floor((fastestLap % (1000 * 60)) / 1000);
            const fastestMilliseconds = fastestLap % 1000;
            
            fastestLapDisplay.textContent = `${formatTime(fastestMinutes)}:${formatTime(fastestSeconds)}.${formatMilliseconds(fastestMilliseconds)}`;
            
            // Update laps count
            lapsCountDisplay.textContent = lapTimes.length;
        } else {
            totalTimeDisplay.textContent = '00:00:00.00';
            fastestLapDisplay.textContent = '--:--.--';
            lapsCountDisplay.textContent = '0';
        }
    }

    // Event Listeners
    startPauseBtn.addEventListener('click', function() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    lapBtn.addEventListener('click', recordLap);

    resetBtn.addEventListener('click', resetTimer);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        } else if (e.code === 'KeyL' && isRunning) {
            recordLap();
        } else if (e.code === 'KeyR') {
            resetTimer();
        }
    });
});