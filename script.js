// Fetch JSON data
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

        // Function to load scene and associated audio
        function loadScene(index) {
            const selectedScene = scenes[index];
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = selectedScene.audioFile;

            // Clear previous timestamps
            const audioControls = document.getElementById('audioControls');
            audioControls.querySelectorAll('.clipButton').forEach(button => button.remove());

            // Create buttons for each timestamp
            selectedScene.timestamps.forEach(timestamp => {
                const clipButton = document.createElement('button');
                clipButton.type = 'button';
                clipButton.className = 'btn btn-info clipButton mr-2';
                clipButton.textContent = timestamp.description;
                clipButton.onclick = () => playClip(timestamp.startTime, timestamp.endTime);
                audioControls.appendChild(clipButton);
            });
        }

        // Function to play a specific clip
        function playClip(startTime, endTime) {
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.currentTime = startTime;
            audioPlayer.play();

            // Update progress bar
            const progressBar = document.getElementById('progressIndicator');
            const duration = endTime - startTime;
            audioPlayer.ontimeupdate = () => {
                const currentTime = audioPlayer.currentTime - startTime;
                const progress = (currentTime / duration) * 100;
                progressBar.style.width = `${progress}%`;
            };
        }

        // Function to toggle play/pause
        function togglePlay() {
            const audioPlayer = document.getElementById('audioPlayer');
            const playIcon = document.getElementById('playIcon');
            const pauseIcon = document.getElementById('pauseIcon');

            if (audioPlayer.paused) {
                audioPlayer.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline';
            } else {
                audioPlayer.pause();
                playIcon.style.display = 'inline';
                pauseIcon.style.display = 'none';
            }
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));