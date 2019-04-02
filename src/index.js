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

class Setup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { grid: this.props.grid, aliveCells: [] };
    this.selectAliveCell = this.selectAliveCell.bind(this);
    this.startIteration = this.startIteration.bind(this);
    this.isSubset = this.isSubset.bind(this);
  }

  selectAliveCell(event) {
    let id = event.target.id;
    document.getElementById(id).className = "black";
    let newStateArray = this.state.aliveCells.slice();
    newStateArray.push(parseInt(id));
    this.setState({ aliveCells: newStateArray });
  }

  isSubset(set, element) {
    return set.includes(element);
  }

  startIteration() {
    let aliveCells = this.state.aliveCells.slice();
    let iterationGrid = this.state.grid.map(row =>
      row.map(function(column) {
        if (aliveCells.includes(column)) {
          return 1;
        }
        return 0;
      })
    );
    ReactDOM.render(
      <Game grid={iterationGrid} />,
      document.getElementById("root")
    );
  }

  render() {
    return (
      <div className="main-grid">
        <h1>Select initial alive cells</h1>
        {this.props.grid.map(row => (
          <div className="row">
            {row.map(column => (
              <div
                className="white"
                id={column}
                onClick={this.selectAliveCell}
              />
            ))}
          </div>
        ))}
        <button className="done-button" onClick={this.startIteration}>
          done
        </button>
      </div>
    );
  }
}

const generateGrid = function(size) {
  let grid = new Array(size).fill(new Array(size).fill(0));
  let counter = 0;
  let gridvalue = grid.map(row =>
    row.map(column => {
      counter++;
      return counter;
    })
  );
  return gridvalue;
};

ReactDOM.render(
  <Setup grid={generateGrid(20)} />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
