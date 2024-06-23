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

            let sound, currentClipEndTime, progressInterval, currentProgressBar;

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
                        if (currentProgressBar) {
                            currentProgressBar.style.width = '0%';
                        }
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

                    clipButton.onclick = () => toggleClip(timestamp.startTime, timestamp.endTime, progressBar);
                    audioControls.appendChild(clipButton);
                });
            }

            // Function to toggle play/pause for a specific clip
            function toggleClip(startTime, endTime, progressBar)​⬤
