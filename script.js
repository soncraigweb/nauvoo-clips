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

            // Clear any existing interval
            clearInterval(audioPlayer.endCheckInterval);

            // Set up interval to check if playback has reached endTime
            audioPlayer.endCheckInterval = setInterval(() => {
                if (audioPlayer.currentTime >= endTime) {
                    audioPlayer.pause();
                    clearInterval(audioPlayer.endCheckInterval);
                }
            }, 100);

            // Update progress bar
            const progressBar = document.getElementById('progressIndicator');
            const duration = endTime - startTime;
            audioPlayer.ontimeupdate = () => {
                const currentTime = audioPlayer.currentTime - startTime;
                const progress = (currentTime / duration) * 100;
                progressBar.style.width = `${progress}%`;
            };

            // Play the audio
            audioPlayer.play();
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


// -------------------------------------------------
//   CodePen 
// -------------------------------------------------
var end = song.duration; 
      var current = song.currentTime;
      var percent = current/(end/100);
      //check if song is at the end
      if(current==end){
         reset(btn, song);
      }
      //set inset box shadow
      btn.style.boxShadow = "inset " + btn.offsetWidth * (percent/100) + "px 0px 0px 0px rgba(0,0,0,0.125)"
      //call function again
      progress(btn, song);     
   }, 133.7);
}

nyanBtn.addEventListener('click', function(){
   nyanBtn.classList.toggle('playing');
   playPause(nyan);
   progress(nyanBtn, nyan);
});
