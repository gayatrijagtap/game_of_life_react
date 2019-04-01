import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { grid: props.grid };
    this.iterateGrid = this.iterateGrid.bind(this);
  }

  countNeighbours(row, column, grid) {
    let cell = grid[row][column];
    let neighbours = this.extractNeighbours(row, column, grid);
    let AliveNbs = this.convertTo1D(neighbours).filter(x => x == 1);
    return AliveNbs.length - cell;
  }

  extractNeighbours(row, column, Array_2D) {
    let extractNbWithColumn = this.extractNeighbourElements.bind(null, column);
    return this.extractNeighbourElements(row, Array_2D).map(
      extractNbWithColumn
    );
  }

  iterateGrid() {
    let gridSize = this.state.grid.length;
    let currentState = this.duplicate2dGrid(this.props.grid);
    for (let row = 0; row < gridSize; row++) {
      for (let column = 0; column < gridSize; column++) {
        let noOfNeighbours = this.countNeighbours(row, column, currentState);
        if (noOfNeighbours != 2) {
          this.props.grid[row][column] = this.evaluateStatus(noOfNeighbours);
        }
      }
    }
    this.setState({ grid: this.props.grid });
  }

  evaluateStatus(noOfNeighbours) {
    if (noOfNeighbours == 3) {
      return 1;
    }
    return 0;
  }

  generate2DGrid(rows, columns) {
    let grid = new Array(rows);
    for (let index = 0; index < rows; index++) {
      grid[index] = new Array(columns).fill(0);
    }
    return grid;
  }

  getCellPos(pos, size) {
    let row = parseInt((pos - 1) / size);
    let column = (pos - 1) % size;
    return { row, column };
  }

  convertTo1D(Array_2D) {
    return Array_2D.reduce((x, y) => x.concat(y));
  }

  extractNeighbourElements(pos, array) {
    let extractedArray = [];
    extractedArray.push(array[pos - 1]);
    extractedArray.push(array[pos]);
    extractedArray.push(array[pos + 1]);
    return extractedArray.filter(x => x != undefined);
  }

  duplicate2dGrid(grid) {
    return grid.map(x => x.slice());
  }

  componentDidMount() {
    setInterval(() => this.iterateGrid(), 1000);
  }

  generateColor(row) {
    return row.map(function(column) {
      if (column == 1) {
        return "black";
      }
      return "white";
    });
  }

  render() {
    let grid = this.props.grid.map(this.generateColor);
    let gridView = grid.map(row => (
      <div className="row">
        {row.map(column => (
          <div className={column} />
        ))}
      </div>
    ));
    return <div>{gridView}</div>;
  }
}

ReactDOM.render(
  <Game
    grid={[
      [0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0]
    ]}
  />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
