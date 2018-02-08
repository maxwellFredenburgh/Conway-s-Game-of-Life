import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Resizable} from 'react-resizable';
import { ButtonToolbar } from 'react-bootstrap';

class Box extends React.Component {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		);
	}
}

class Universe extends React.Component{
	render() {
		const width = (this.props.cols * 16)+1;
		var rowsArr = [];

		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;

				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
						selectBox={this.props.selectBox}
					/>
				);
			}
		}

		return (
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}

class Buttons extends React.Component {
	handleSelect = (evt) => {
		this.props.gridSize(evt);
	}
	render() {
		return (
			<div className="center">
				<ButtonToolbar>
					<button className="btn btn-default" onClick={this.props.playButton}>
						Play
					</button>
					<button className="btn btn-default" onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="btn btn-default" onClick={this.props.clear}>
					  Clear
					</button>
					<button className="btn btn-default" onClick={this.props.slow}>
					  Slow
					</button>
					<button className="btn btn-default" onClick={this.props.slow}>
					  Normal
					</button>
					<button className="btn btn-default" onClick={this.props.fast}>
					  Fast
					</button>
					<button className="btn btn-default" onClick={this.props.seed}>
					  Seed
					</button>
				</ButtonToolbar>
			</div>
			)
	}
}

class Main extends React.Component<{}, {width: number, height: number}> {
  constructor(){
    super();
    this.speed=100;
    this.rows=Math.floor(500/15);
    this.cols=Math.floor(950/15);

    this.state = {
      generation: 0,
      width: 950, height: 500,
      gridFull: Array(Math.floor(500/15)).fill().map(() => Array(Math.floor(950/15)).fill(false))
    }
  }

  onResize = (event, {element, size}) => {
    this.setState({width: size.width, height: size.height});
    let q = Array(Math.floor(size.height/15)).fill().map(() => Array(Math.floor(size.width/15)).fill(false));
    this.setState({gridFull: q});
		this.play();
  };

  selectBox=(row,col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col]=!gridCopy[row][col];
    this.setState({
      gridFull: gridCopy
    });
  }
	seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for(let i=0;i<this.rows;i++){
      for(let j=0;j<this.cols;j++){
        if(Math.floor(Math.random()*4) === 1 ){
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy
    });
  }
	playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

	play=() =>{
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation+1
    });
}
	pauseButton = () => {
		clearInterval(this.intervalId);
	}

	slow = () => {
		this.speed = 1000;
		this.playButton();
	}

	slow = () => {
		this.speed = 100;
		this.playButton();
	}

	fast = () => {
		this.speed =10;
		this.playButton();
	}

	clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}

  componentDidMount(){
		this.seed();
		this.playButton();
  }

  render() {
    return (
      <div className="layoutRoot">
				<div class="title">
	      	<h1 class>Conways Game of Life </h1>
	      	<h3>by Maxwell Fredenburgh</h3>
				</div>
				<div class="grid-container">
					<Buttons
						playButton={this.playButton}
						pauseButton={this.pauseButton}
						slow={this.slow}
						fast={this.fast}
						clear={this.clear}
						seed={this.seed}
					/>
						<h1>Rules</h1>
						<h3>
						1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.<br /><br />
						2. Any live cell with two or three live neighbours lives on to the next generation.<br /><br />
						3. Any live cell with more than three live neighbours dies, as if by overpopulation.<br /><br />
						4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
						</h3>
					</div>
					<div class="container">
		        <Resizable className="box1" height={this.state.height} width={this.state.width}
		        onResize={this.onResize} minConstraints={[200, 200]} maxConstraints={[980, 530]}>
		          <div className="box1" style={{width: this.state.width + 'px', height: this.state.height + 'px'}}>
		            <Universe
		              gridFull={this.state.gridFull}

		              height={this.state.height}
		              width={this.state.width}

		              rows={Math.floor(this.state.height/16)}
		              cols={Math.floor(this.state.width/16)}

		              selectBox = {this.selectBox}
		            />
		          </div>
		        </Resizable>
					</div>
				<div class="notes">
					<h3>*Use the RED BOX to change the size of the board</h3>
					<h3>*Use in FULLSCREEN</h3>
				</div>
      </div>
    );
  }
}
function arrayClone(arr){
  return JSON.parse(JSON.stringify(arr));
}
ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
