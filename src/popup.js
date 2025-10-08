const api = "http://ec2-3-106-249-206.ap-southeast-2.compute.amazonaws.com/api/detectgreenwash";
const deleteApi = "http://ec2-3-106-249-206.ap-southeast-2.compute.amazonaws.com/api/detectgreenwash/0";
window.onload = function() 
{
	const button = document.getElementById("analyzeButton");
	console.log(button);
	button.addEventListener("click", analyzeText);
};

async function analyzeText()
{
  var userInput = document.getElementById("greenwash-text").value;
  console.log(userInput);
  var result = await getResultFromApi(userInput);
}

async function getResultFromApi(userInput)
{
  var textResult = "computing..."
  document.getElementById("results").innerHTML = textResult;
  try{
    const rawResponse = await fetch(api, 
                                      {
                                        method: "POST",
                                        body: JSON.stringify({'text': userInput}),
                                        headers: { 
                                            'Accept': 'application/json',
                                            'Accept-Encoding': 'gzip, deflate, br',
                                            'Content-Type': 'application/json' 
                                        }
                                      });
    if(!rawResponse.ok)
    {
      throw new Error(`Response status: ${rawResponse.status}`);
    }
    else
    {
      const content = await rawResponse.json();
      const floatResult = parseFloat(content.result);

      if(floatResult < 0.25 && floatResult >= 0)
      {
        textResult = "High probability of greenwashing";
      }
      else if(floatResult < 0.5 && floatResult >= 0.25)
      {
        testResult = "Good chance of greenwashing";
      }
      else if(floatResult < 0.75 && floatResult >= 0.5)
      {
        textResult = "Low chance of greenwashing";
      }
      else if(floatResult <= 1 && floatResult >= 0.75)
      {
        textResult = "Unlikely to be an attempt at greenwashing";
      }
      else
      {
        textResult = "result fell outside range, error maybe?";
      }
    }
  }
  catch(error)
  {
    console.error(error.message);
  }
  document.getElementById("results").innerHTML = textResult;
}
