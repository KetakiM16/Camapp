        let videoElem = document.querySelector("video");
        // let audioElem = document.querySelector("audio");
        let recordBtn = document.querySelector(".record");
        // let pauseBtn = document.querySelector(".pause")
        let capturImageBtn = document.querySelector(".click-image")
        let filterArr = document.querySelectorAll(".filter")
        let timings = document.querySelector(".timing")
        let filterColor = "";
        let filterOverlay = document.querySelector(".filter_overlay")
        let plusBtn = document.querySelector(".plus")
        let minusBtn = document.querySelector(".minus")
        let isRecording = false;
        let counter = 0;
        let  scaleLevel = 1
        
        // let isPause = false;
        // user 
        let constraint = {
            // audio : true,
            video : true,
        };
        let recording = [];  // array to store the parts of video
        let mediarecordingObjectCurrentStream;
        
        // promise
        let userMediaPromise = navigator.mediaDevices.getUserMedia(constraint);
        // streeam coming from required
        userMediaPromise
            .then(function(stream){
            videoElem.srcObject = stream;
            // audioElem.srcObject = stream;
            //browser
            mediarecordingObjectCurrentStream = new MediaRecorder(stream) // object 
            //camera a recording start in array
            mediarecordingObjectCurrentStream.ondataavailable = function(e){ // pushing into array parts
                recording.push(e.data);
            }
            // download
            mediarecordingObjectCurrentStream.addEventListener("stop", function(){
                //recording  -> url convert
                //type -> MIME TYPE
                const blob = new Blob(recording, {type : 'video/mp4'});
                const url = window.URL.createObjectURL(blob);
                let a = document.createElement("a") // div creation 
                a.download = "file.mp4";
                a.href = url;
                a.click();
                recording = [];
            })



        })
        .catch(function(err){
            console.log(err);
            alert("please allow video and microphone")
        });
        recordBtn.addEventListener("click", function(){
            if(mediarecordingObjectCurrentStream == undefined){
                
                alert("First select the device ");
                return;
            }
            if(isRecording == false){
                
                mediarecordingObjectCurrentStream.start();
                // recordBtn.innerText = "Recording.....";
                recordBtn.classList.add("record-animation")
                startTimer();
                
            }
            else{
                stopTimer();
                mediarecordingObjectCurrentStream.stop();
                // recordBtn.innerText = "Record";
                recordBtn.classList.remove("record-animation")


            }
            isRecording = !isRecording

            
        })
        capturImageBtn.addEventListener("click", function(){
            //canvas create
            let canvas = document.createElement("canvas")
            
           canvas.height = videoElem.videoHeight
           canvas.width = videoElem.videoWidth
           let tool = canvas.getContext("2d")
           // scaling
    // top left corner
          tool.scale(scaleLevel, scaleLevel);
          const x = (tool.canvas.width / scaleLevel - videoElem.videoWidth) / 2;
          const y = (tool.canvas.height / scaleLevel - videoElem.videoHeight) / 2;
    // console.log(x, y);
          tool.drawImage(videoElem, x, y);
            
          
        //    tool.scale(scaleLevel, scaleLevel);
        //  const x = (tool.canvas.width / scaleLevel - videoElem.videoWidth) / 2;
        //   const y = (tool.canvas.height / scaleLevel - videoElem.videoHeight) / 2;
        //   tool.drawImage(videoElem,x,y);
           // to fill the colour in canvas
           if(filterColor){
               tool.fillStyle = filterColor;
               tool.fillRect(0, 0, canvas.width, canvas.height)
           }
           capturImageBtn.classList.add("position-top-animation")
           let url = canvas.toDataURL(); // in built canvas function
            let a = document.createElement("a");
            a.download = "file.png";  //format
            a.href = url;// giving url
            a.click();
            a.remove;
           
         

        })
        //filter array
        for(let i = 0; i < filterArr.length; i++){
            filterArr[i].addEventListener("click", function () {
                filterColor = filterArr[i].style.backgroundColor;
                filterOverlay.style.backgroundColor = filterColor;
            })
        }
        function startTimer(){
            timings.style.display = " block"; // timer appers
            function fn(){
                let hours = Number.parseInt(counter / 3600)
                let RemSeconds = counter % 3600;
                let mins = Number.parseInt(RemSeconds/60);
                let seconds = RemSeconds % 60;
                hours = hours < 10? `0${hours}` : hours;
                mins = mins < 10? `0${mins}` :`${mins}`;
                seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
                timings.innerText = `${hours} :${mins}:${seconds} `
                counter++;
            }
            clearObj = setInterval(fn, 1000);
        }
        function stopTimer(){
            timings.style.display = "none";
            clearInterval(clearObj);
        }

        plusBtn.addEventListener("click",function(){
            if (scaleLevel < 1.7) {
                scaleLevel = scaleLevel + 0.1;
                videoElem.style.transform = `scale(${scaleLevel})`;
            }

        })
        minusBtn.addEventListener("click", function () {
            if (scaleLevel > 1) {
                scaleLevel = scaleLevel - 0.1;
                videoElem.style.transform = `scale(${scaleLevel})`;
            }
        })
