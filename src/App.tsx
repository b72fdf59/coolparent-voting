import * as React from "react";
import CoolVoteChart from "./components/CoolVoteChart";
import "./App.css";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <CoolVoteChart url="/coolparent" />
      </div>
    );
  }
}

export default App;
