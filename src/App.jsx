import './App.css'
import './index.css'
import { app } from "./firebase/config";

console.log("Firebase connected:", app.name);


function App() { 
  return ( 
    <div className="min-h-screen bg-slate-900 flex items-center justify-center"> 
      <h1 className="text-3xl font-bold text-white"> 
        Plow Me – Day 1 Setup 
      </h1> 
    </div> 
  ); 
} 

export default App;