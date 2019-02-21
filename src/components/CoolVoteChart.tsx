import * as React from "react";
import { ChartProps, ChartState } from "../types/coolVote";
import ReactBubbleChart from "react-bubble-chart";
//import * as Constants from "../constants/coolVote";
import axios from "axios";
import "react-bubble-chart/src/style.css";
import "../styles/CoolVoteChart.css";
import { ColorLegend } from "../constants/coolVote";
export default class CoolVoteChart extends React.Component<
  ChartProps,
  ChartState
> {
  interval: any;
  constructor(props: ChartProps) {
    super(props);
    this.state = {
      data: []
    };
  }

  axiosFunc = () => {
    axios.get(this.props.url).then(res => {
      console.log(res.data.data);
      this.setState({
        data: res.data.data
      });
    });
  };

  componentDidMount() {
    this.axiosFunc();
    this.interval = setInterval(
      this.axiosFunc,
      this.props.refreshInterval || 5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { data } = this.state;
    if (data.length > 0) {
      return (
        <ReactBubbleChart
          className="CoolVoteChart"
          data={data.map((d, i) => {
            return {
              ...d,
              colorValue: i,
              displayText: d._id
            };
          })}
          legend={false}
          colorLegend={ColorLegend}
        />
      );
    }
    return <div />;
  }
}
