const express = require('express');
const math = require('mathjs');
const mathsteps = require('mathsteps');
const app = express();
const dict= require('./enit')
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const translate = require('google-translate-api');



app.get('/api/v1/calculus/:operation/:equation',(req,res)=>{
  const oparation=req.params.operation;
  const equation=req.params.equation;
  const urlencodedEquation=encodeURIComponent(equation);
  console.log(urlencodedEquation)

  fetch(`https://newton.now.sh/api/v2/${oparation}/${urlencodedEquation}`).then(
    async (ansObj)=>{
      const ans= await ansObj.json()
      console.log(urlencodedEquation)
        return res.json({status:'success',ans})
    }
  ).catch(err=>{
    return res.json({status:'error',error: err.message})
  })
})


app.post('/api/v1/algebra/solve', async (req, res) => {
  const  equation  = req.body.equation;
  
    //equation
    if (equation.includes('='))
    {
        // Generate the step-by-step solution
        const steps = mathsteps.solveEquation(equation);
        // mapping object
        const solution = steps.map(step => {

        return {elaboration: step.changeType.toLowerCase().replaceAll('_', ' '),result : step.newEquation.ascii()}
          
            
        });
          res.json({ status:"success",problem:equation, solution });

    }
    //Expression to simplify
    else{
        // Generate the step-by-step solution
        const steps= mathsteps.simplifyExpression(equation);  
        // mapping object
        const solution = steps.map(step => {

            return {elaboration : step.changeType.toLowerCase().replaceAll('_', ' '), result : step.newNode.toString()}
          });
        // Return the solution
        res.json({ status:"success", problem :equation,solution });
    }   
  
});

app.post('/api/v2/:lang/algebra/solve', async (req, res) => {
  const  equation  = req.body.equation;
  
    //equation
    if (equation.includes('='))
    {
        // Generate the step-by-step solution
        const steps = mathsteps.solveEquation(equation);
        // mapping object
        const solution = steps.map(step => {
        if (req.params.lang=='it')
          return {elaboration: dict[step.changeType.toLowerCase().replaceAll('_', ' ')],result : step.newEquation.ascii()}  
        return {elaboration: step.changeType.toLowerCase().replaceAll('_', ' '),result : step.newEquation.ascii()}
          
            
        });
          res.json({ status:"success",problem:equation, solution });

    }
    //Expression to simplify
    else{
        // Generate the step-by-step solution
        const steps= mathsteps.simplifyExpression(equation);  
        // mapping object
        const solution = steps.map(step => {
            if (req.params.lang=='it')
              return {elaboration : dict[step.changeType.toLowerCase().replaceAll('_', ' ')], result : step.newNode.toString()}
            return {elaboration : step.changeType.toLowerCase().replaceAll('_', ' '), result : step.newNode.toString()}
          });
        // Return the solution
        res.json({ status:"success", problem :equation,solution });
    }   
  
});



app.listen(3000, () => {
  console.log('API server started on port 3000');
});