document.addEventListener('DOMContentLoaded', () => {
    fetch('scenes.json')
        .then(response => response.json())
        .then(data => {
            const scenes = data.scenes;

            // Create buttons for each scene
            const sceneButtons = document.getElementById('sceneButtons');
            scenes.forEach((scene, index) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn btn-secondary';
                button.textContent = scene.scene;
                button.onclick = () => loadScene(index);
                sceneButtons.appendChild(button);
            });

            let sound, currentClipEndTime, progressInterval;

            // Function to load scene and associated audio
            function loadScene(index) {
                const selectedScene = scenes[index];

                if (sound) {
                    sound.stop();
                }

                sound = new Howl({
                    src: [selectedScene.audioFile],
                    html5: true,
                    onend: function() {
                        clearInterval(progressInterval);
                        updatePlayPauseIcon(true);
                    }
                });

                // Clear previous timestamps
                const audioControls = document.getElementById('audioControls');
                audioControls.querySelectorAll('.clipButton').forEach(button => button.remove());

                // Create buttons for each timestamp
                selectedScene.timestamps.forEach(timestamp => {
                    const clipButton = document.createElement('button');
                    clipButton.type = 'button';
                    clipButton.className = 'btn btn-info clipButton mr-2';
                    clipButton.textContent = timestamp.description;

                    const progressBar = document.createElement('div');
                    progressBar.className = 'progress-bar';
                    clipButton.appendChild(progressBar);

                    clipButton.onclick = () => playClip(timestamp.startTime, timestamp.endTime, progressBar);
                    audioControls.appendChild(clipButton);
                });
            }

            // Function to play a specific clip
            function playClip(startTime, endTime, progressBar) {
                if (sound.playing()) {
                    sound.stop();
                }

                currentClipEndTime = endTime;
                sound.seek(startTime);
                sound.play();

                // Update progress bar
                const duration = endTime - startTime;

                clearInterval(progressInterval);
                progressInterval = setInterval(() => {
                    const currentTime = sound.seek();
                    if (currentTime >= currentClipEndTime) {
                        sound.stop();
                        clearInterval(progressInterval);
                        updatePlayPauseIcon(true);
                    } else {
                        const progress = ((currentTime - startTime) / duration) * 100;
                        progressBar.style.width = `${progress}%`;
                    }
                }, 100);

                updatePlayPauseIcon(false);
            }

            // Function to toggle play/pause
            const playPauseBtn = document.getElementById('playPauseBtn');
            playPauseBtn.onclick = () => {
                if (sound.playing()) {
                    sound.pause();
                    updatePlayPauseIcon(true);
                } else {
                    sound.play();
                    updatePlayPauseIcon(false);
                }
            };

            function updatePlayPauseIcon(isPaused) {
                if (isPaused) {
                    playPauseBtn.classList.remove('playing');
                } else {
                    playPauseBtn.classList.add('playing');
                }
            }
        })
        .catch(error => console.error('Error fetching JSON:', error));
});
