let scoreComputer = document.getElementById('scoreComputer');
let scoreUser = document.getElementById('scoreUser');
let computerEmoji = document.getElementById('computerEmoji')
let userEmoji = document.getElementById('userEmoji')
let indicator = document.getElementById('indicator')
let computer = 0;
let user = 0;
let stateUser = "n";
let stateComputer = "n";
let randomNumber
let computerAction
let userAction
let rockConfidence
let paperConfidence
let scissorsConfidence
let model;
let webcamElement;
let resultElement = document.getElementById('result');

async function setupWebcam() {
   webcamElement = document.getElementById('webcam');
   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
   webcamElement.srcObject = stream;
   return new Promise(resolve => {
       webcamElement.onloadedmetadata = () => {
           resolve(webcamElement);
       };
   });
}

async function loadModel() {
   try {
       model = await tf.loadLayersModel('tfjs_rps_model/model.json');
       console.log('Model loaded successfully!');
   } catch (error) {
       console.error('Error loading model:', error);
   }
}

async function predict() {
   if (!model || !webcamElement) return;
   try {
       const img = tf.browser.fromPixels(webcamElement);
       const resized = tf.image.resizeBilinear(img, [300, 200]);
       const normalized = resized.div(255.0);
       const batched = normalized.expandDims(0);
       const predictions = await model.predict(batched);
       const probabilities = await predictions.data();
       tf.dispose([img, resized, normalized, batched, predictions]);
       
       rockConfidence = probabilities[0];
       paperConfidence = probabilities[1];
       scissorsConfidence = probabilities[2];

      console.log(`rock: ${rockConfidence} || paper: ${paperConfidence} || scissors: ${scissorsConfidence}`);
       
       if(rockConfidence > 0.9){
           stateUser = "r";
           play(stateUser);
           updateScores();
           indicator.textContent = "detecting";
       } else if(paperConfidence > 0.9){
           stateUser = "p";
           play(stateUser);
           updateScores();
           indicator.textContent = "detecting";
       } else if(scissorsConfidence > 0.9){
           stateUser = "s";
           play(stateUser);
           updateScores();
           indicator.textContent = "detecting";
       } else{
        indicator.textContent = "gesture not detected";
       }
       
       requestAnimationFrame(predict);
   } catch (error) {
       console.error('Prediction error:', error);
   }
}

function updateScores() {
   scoreUser.textContent = user;
   scoreComputer.textContent = computer;
   computerEmoji.textContent = computerAction;
   userEmoji.textContent = userAction;
}

async function run() {
   resultElement = document.getElementById('result');
   await setupWebcam();
   await loadModel();
   predict();
}

run();

function play(stateUser){
   randomNumber = Math.floor(Math.random() * 3);
   if (randomNumber===0){
       stateComputer = "r"
       computerAction = "✊"
   }
   else if (randomNumber===1){
       stateComputer = "p"
       computerAction = "🖐️"
   }
   else if (randomNumber===2){
       stateComputer = "s"
       computerAction = "✌️"
   }
   
   if (stateUser==="r" && stateComputer==="s"){
       computer += 0;
       user += 1;
       userAction = "✊"
   }
   else if (stateUser==="r" && stateComputer==="p"){
       computer += 1;
       user += 0;
       userAction = "✊"
   }
   else if (stateUser==="p" && stateComputer==="r"){
       computer += 0;
       user += 1;
       userAction = "🖐️"
   }
   else if (stateUser==="p" && stateComputer==="s"){
       computer += 1;
       user += 0;
       userAction = "🖐️"
   }
   else if (stateUser==="s" && stateComputer==="r"){
       computer += 1;
       user += 0;
       userAction = "✌️"
   }
   else if (stateUser==="s" && stateComputer==="p"){
       computer += 0;
       user += 1;
       userAction = "✌️"
   }
}
