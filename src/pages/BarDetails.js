import React, { Component } from 'react';
import { withAuth } from "../lib/AuthProvider";
import appService from "../lib/AppService";
import { Link } from "react-router-dom";
import beer from "../beer.svg";
import "react-alice-carousel/lib/scss/alice-carousel.scss";


class BarDetails extends Component {

  state = {
    bar: {},
    address: {},
    reviews: [],
    toiletPictures: [],
    error: null,
    isLoaded: false,
  } 
  
  componentDidMount() {
    this.getBar();
    this.getReviews();
  }

  getBar = () => {
    appService
      .getSingleBar(this.props.match.params)
        .then(bar => {
          this.setState({
            bar,
            address: bar.address,
            toiletPictures: bar.toiletPictures,
            isLoaded: true,
          });
        })
        .catch((error) => {
          this.setState({  
              isLoaded: true,
              error
          });
        }); 
  }
  
  getReviews = () => {
    appService
      .getReviewsFrom(this.props.match.params)
        .then(reviews => {
          this.setState({
            reviews,
            isLoaded: true,
          });
        })
        .catch((error) => {
          this.setState({  
              isLoaded: true,
              error
          });
        }); 
  }
   

  handleDeleteBar = () => {
    const {params} = this.props.match;
    appService
      .deleteBar(params)
      .then(data => {
        this.props.history.push('/home');
      })
      .catch(error => {
      }); 
  }

  addtoFavourite = (idBar) => {   
    const {_id} = this.props.user;   
    appService
        .addBartoFavourite(idBar, _id)
            .then(data => {
            })
            .catch((error) => {            
            })
  }

  render(){
    const { _id, 
      barType, 
      name, 
      price, 
      draftBeer, 
      bottleBeer, 
      averageRating,
      ratingBeer,
      ratingToilet,
      ratingMusic,
     } = this.state.bar;
    const {street, neighbourhood, city} = this.state.address;
    const {reviews, toiletPictures} = this.state;  
    
    return this.state.bar && (

      <div className="card-container">
      <div className="bar-card-title">
      <div className="flex width">
      <div className=" half-box-avatar"><h3 className="left">{name}</h3>
      <p className="left">{neighbourhood}</p> 
      <p className="left">{city}</p>
      <p className="left">{street}</p>
      <p className="left">{barType}</p>
      <p className="left">
      {(() => {
        switch (price) {
          case "range1":   return "1 - 2 €";
          case "range2": return "2 - 3 €";
          case "range3":  return "3 - 4 €";
          default:      return "No range price added";
        }
      })()}
      </p>
      </div>

      <div className="flex-column box-avatar margin">
          <img src={beer} alt="beer"/>
      <p>Rating: {averageRating && averageRating.toFixed(1)}</p>

      <p>Total reviews: {reviews.length}</p>
      </div>

      </div>

      </div>
      <div className="bar-card-beers padding">
        <div className="flex padding">
        <div className="center column">
          <img src={beer} alt="beer"/>
          <p className="align-center">Beers: {ratingBeer}</p>
        </div>
        <div className="center column">
        <img src={beer} alt="beer"/>
          <p className="align-center">Toilet: {ratingToilet}</p>
        </div>
        <div className="center column">
        <img src={beer} alt="beer"/>
          <p className="align-center">Music: {ratingMusic}</p>
        </div>
        </div>
      <h3>Draft beers</h3>
      <hr></hr>
        {draftBeer && (!(draftBeer.length === 0) ? (draftBeer.map((beer, index) =>{
          return (
            <div key = {index}>
              {beer.name}          
            </div>

          )})
          ):(
            <div>
              What a pity! There is no beer registered here yet!
            </div>   
        ))}
      <h3>Bottle beers</h3>
      <hr></hr>
        {bottleBeer && (!(bottleBeer.length === 0) ? (bottleBeer.map((beer, index) =>{
          return (
            <div key = {index}>
              {beer.name}          
            </div>  
            )})
            ):(
              <div>
                What a pity! There is no beer registered here yet!
              </div>
        ))}
      <br/>
      <h3>List of reviews</h3>
      <hr></hr>
      {reviews && reviews.map((review, index) => {
        return (
          <div className="grid-flex" 
            key = {index}>
        <div className="padding box">
        <img className=" circle-avatar" src={review.creator[0].userimage} alt=""></img>
          </div>
          <div className="half-box">
            <h3>{review.title}</h3> 
            <p>{review.comment}</p>
          </div>
          
          </div>
        )
      })}
      <h3>Picture of the toilet</h3>
      <div className="class-picture-slide">
        <div className="class-porta-picture">
        {toiletPictures.map((foto, index) => {
          return (
            <div className="class-imagen" key= {index}><img src={foto} alt="foto baño"/></div>
          )
        })}
        </div>
      </div>
      {this.props.user.username === 'admin' ? (
          <>
           <button onClick={this.handleDeleteBar} className="admin-button">Delete Bar</button><br/>
           <Link to = {`/bars/${_id}/updateBar`}> <button className="admin-button">Edit Bar</button> </Link>
          </>
          ) : (<></>)}
          <Link to = {`/bars/${_id}/addReview`}> <button className="review-button">Add a review</button></Link>
          <button className="button-card-bar" onClick = {() => {this.addtoFavourite(_id)}}>Add to Favorite</button>
      
      </div>
      </div>
    )}
}

export default withAuth(BarDetails);