var Game = React.createClass({

  getInitialState: function() {
    return { board: new Minesweeper.Board(12, 15) };
  },

  updateGame: function(tile, exploring) {
    if (!exploring) {
      tile.toggleFlag();
    } else {
      tile.explore();
    }
    if (this.state.board.lost()) {
      this.state.board.grid.forEach(function(row) {
        row.forEach(function(tile) {
          tile.explore();
        });
      });
    }

    this.setState({board: this.state.board});
  },

  render: function() {

    var modal = "";
    if (this.state.board.won() || this.state.board.lost()) {
      var text = this.state.board.won() ? "you win!" : "you lose!";
      modal =
        <div>
          <div className="modal active">
            <p>
              {text}
            </p>
            <button onClick={this._restartGame}>Play Again?</button>
          </div>
          <span className="screen"></span>
        </div>;
    }

    return <div>
            {modal}
            <Board board={this.state.board} update={this.updateGame} />
          </div>;
  },

  _restartGame: function() {
    this.setState({board: new Minesweeper.Board(12, 15)});
  }

});

var Board = React.createClass({
  render: function() {

    var grid = [];
    var board = this.props.board;
    board.grid.forEach(function(row, i) {
      var tiles = [];
      row.forEach(function(tile, j) {
        tiles.push(<Tile key={board.gridSize * i + j} tile={this.props.board.grid[i][j]} update={this.props.update} />);
      }.bind(this));
      grid.push(<div key={i} className="row"> {tiles} </div>);
    }.bind(this));

    return (
      <div>
        {grid}
      </div>
    );
  }
});

var Tile = React.createClass({

  render: function() {
    var text;
    var tile = this.props.tile;

    if (tile.flagged) {
      text = "\u2691";
    } else if (tile.explored && tile.bombed) {
      text = "\u2622";
    } else if (tile.explored && this.shouldDisplayCount()) {
      text = this.props.tile.adjacentBombCount();
    } else {
      text = "";
    }

    var classes = "tile " +
                  (tile.explored ? "explored" : "") +
                  (tile.flagged ? "flagged" : "") +
                  (tile.explored && this.shouldDisplayCount() ? " perimeter" : "");
    return <div className={classes} onClick={this._handleClick}>{text}</div>;
  },

  shouldDisplayCount: function () {
    var tile = this.props.tile;
    for (var i = 0; i < tile.neighbors().length; i++) {
      if (!tile.neighbors()[i].explored) {
        return true;
      }
    }
    return false;
  },

  _handleClick: function(e) {
    if (e.altKey) {
      this.props.update(this.props.tile, false);
    } else {
      this.props.update(this.props.tile, true);
    }
  }
});

React.render(<Game/>, document.getElementById('content'));
