// You need React
var React = require('react')

// You need React Native, too
var ReactNative = require('react-native')

// React Native components you want to use
var { AppRegistry, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } = ReactNative

var Firebase = require('firebase')
var firebase = Firebase.initializeApp({
  databaseURL: "https://buyflix-d7037.firebaseio.com/"
})
var database = firebase.database()
var moviesRef = database.ref('/movies')

var Movie = React.createClass({
  onMovieClicked: function() {
    this.props.onMovieClicked(this.props.id)
  },
  render: function() {
    return (
      <TouchableHighlight onPress={this.onMovieClicked} style={styles.thumbnail}>
        <Image source={{uri: this.props.movie.poster}}
               style={styles.thumbnail}
               onClick={this.onMovieClicked} />
      </TouchableHighlight>
    )
  }
})

var BuyflixNative = React.createClass({
  onMovieClicked: function(movieId) {
    var moviesWithoutRemoved = this.state.movies.filter(function(movie) {
      return movie.key !== movieId
    })
    this.setState({movies: moviesWithoutRemoved})
    moviesRef.set(moviesWithoutRemoved)
  },
  componentDidMount: function() {
    moviesRef.on('value', function(snapshot) {
      this.setState({ movies: snapshot.val() })
    }.bind(this))
  },
  getInitialState: function() {
    return {
      movies: []
    }
  },
  renderMovie: function(movie) {
    return <Movie key={movie.key} movie={movie} id={movie.key} onMovieClicked={this.onMovieClicked} />
  },
  render: function() {
    if (this.state.movies == null) {
      return (
        <View style={styles.noMovies}><Text>No movies!</Text></View>
      )
    } else {
      return (
        <View style={styles.scrollView}>
          {this.state.movies.map(this.renderMovie)}
        </View>
      )
    }
  }
})

var styles = StyleSheet.create({
  noMovies: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    backgroundColor: '#000000',
    height: 1000
  },
  thumbnail: {
    width: 70,
    height: 104,
    margin: 5
  }
})

AppRegistry.registerComponent('BuyflixNative', () => BuyflixNative)
