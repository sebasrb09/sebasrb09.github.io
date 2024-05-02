import { useState,Component, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/esm/NavItem'
import NavLink from 'react-bootstrap/esm/NavLink'
import Button from 'react-bootstrap/Button'

import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Toast  from 'react-bootstrap/Toast'


/**
 * This component renders a the Rules tab. In it, describes the basic rules of the game.
 *
 * @returns {ReactNode} A React element that renders the rules.
 */
function Rules(){
  return (
    <div>
      <h1>Rules</h1>
      <p>Find sets of three cards</p>
      <p>
        Simple Right?
      </p>
      <p>
        The objetive of the game is to identify a SET of 3 cards from 12 cards. Each card has four features, which can vary as follows:
      </p>
      <p>
        A SET consists of cards in which each of the cards features looked at one-by-one, are the same on each card, or, are different on each card. 
      </p>
    </div>
  )
}

/**
 * This component will have the main logic of the program.
 * It takes care of:
 *  - Initializing the board
 *  - Get the first 12 Cards
 *  - Update the cards once a Set is found
 *  - Evaluate if there is a Set
 * @param {*} props Props contains the initial bag of cards, the set function to update it. It will be empty at the beginning.
 * @returns {ReactNode} A React element that contains the layout of the board, and the game. The layout also contains the Toasters to send messages to the users.
 */
function Game(props){

  const [flag, setFlag] = useState(false)

  const bag = props.bag
  const setImages = props.update_bag
  const [currentSet,setCurrentSet] = useState([])

  const [show, setShow] = useState(false);
  const [errorMessage, setMessage] = useState('');
  const [typeError,setType] = useState('');

  const handleStart2 = () =>{
    //props.load_data_f();
    const arr = load_data()
    console.log(arr)
    setImages(arr)
    setFlag(true);
    const new_vals = get_cards_from_bag(arr,12)
    setCurrentSet(new_vals.selected)
    setImages(new_vals.bag2)
  }

  const removeCards = (indexes) => {
    setCurrentSet({currentSet: currentSet.filter((item, index) => !indexes.includes(index))});
  }

  const update_board = (indexes) =>{
    if (indexes.length === 0){
      setMessage('Nop, that is not a set')
      setType('danger')
      setShow(true)
    } else {
      let upd_current = currentSet.filter((item, index) => !indexes.includes(index))
      let new_vals = get_cards_from_bag(bag,3)
      setCurrentSet([...upd_current,...new_vals.selected])
      setImages(new_vals.bag2)
      setFlag(true);
      setMessage('Correct! That was a set')
      setType('success')
      setShow(true)
    }
    //removeCards(indexes)

  }

  const evaluate_board = () => {
    
    let eval_b = evaluate_whole_board(currentSet)
    if (eval_b){
      setMessage('Nop, there is a SET, keep looking! You can do it!')
      setType('danger')
    } else {
      if (currentSet.length < 12 && bag.length == 0){
        setMessage('You are right. You won!')
        setType('success')
        setFlag(false)
      } else {
        setMessage('You are right, there is no set, reshuffling...')
        setType('primary')
        let new_b = [...bag,...currentSet]
        let new_vals = get_cards_from_bag(new_b,12)
        setCurrentSet(new_vals.selected)
        setImages(new_vals.bag2)
        setFlag(true);
      }
    }
    setShow(true)
  }

  //console.log('currentSet',currentSet)
  //console.log('bag',bag)

  return (
    <div>
      <Container>
        <Col>
          <Row>{ !flag && (<Button variant='success' onClick={() => handleStart2()}>Start Game</Button>)}</Row>
          <Row className="justify-content-md-center">
            <Col></Col>
            <Col xl={9}>
              { flag && (<div><Board arr={currentSet} update={update_board}></Board></div>) }
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>{ flag && (<Button variant='warning' onClick={() => evaluate_board()}>There is no set</Button>) }</Col>
            <Col>
              <Toast bg={typeError} onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Header>
                  <strong className="me-auto">SET game</strong>
                </Toast.Header>
                <Toast.Body>{errorMessage}</Toast.Body>
              </Toast>
            </Col>
          </Row>
        </Col>
      </Container>
    </div>
  )
}

/**
 * Component that will renderize the cards and will also take care of telling the parent component (Game) that a set was selected, and whether it is correct or not
 * @param {Array} arr Current set of 12 cards in the board
 * @param {function} update Function to update the board, once a set is selected
 * @returns A React element that is a container with rows of cards.
 */
function Board({arr,update}){

  const [counter,setCount] = useState(0)
  const [indexes,setIndexes] = useState([])
  const [flagRestart,setFlag] = useState('false')

  const handleThree = (indexes) => {
    if (indexes.length == 3){
      let correct = check_set(arr[indexes[0]],arr[indexes[1]],arr[indexes[2]]);
      console.log('correct',correct)
      if (correct){
        update(indexes)
        setCount(0)
        setIndexes([])
        setFlag('false')
        return 'correct'
      } else {
        update([])
        setCount(0)
        setIndexes([])
        setFlag( flagRestart =='true'?'false':'true')
        return 'noset'
      }
    }
    return 'incomplete'
   
  }

  console.log(counter)
  console.log(indexes)

  return (
    
    <div>
      <Container>
        <Row>{arr.map((o,i)=> i%3==0 ? (<CardComponent counter={counter} setCounter={setCount} handleThree={handleThree} url={o.url} index={i} indexes={indexes} setIndexes={setIndexes} key={o.url + flagRestart}></CardComponent>):null)}</Row>
        <Row>{arr.map((o,i)=> i%3==1 ? (<CardComponent counter={counter} setCounter={setCount} handleThree={handleThree} url={o.url} index={i} indexes={indexes} setIndexes={setIndexes} key={o.url + flagRestart}></CardComponent>):null)}</Row>
        <Row>{arr.map((o,i)=> i%3==2 ? (<CardComponent counter={counter} setCounter={setCount} handleThree={handleThree} url={o.url} index={i} indexes={indexes} setIndexes={setIndexes} key={o.url + flagRestart}></CardComponent>):null)}</Row>
      </Container>
    </div>

  )

}

/**
 * Function that evaluates whether there is a set in the current set of 12 cards.
 * It goes through all possible sets. If it finds one, it returns true and ends the run.
 * It just needs to know if there is one possible set.
 * @param {Array} board An array with all the 12 cards.
 * @returns {boolean} True if there is a set, false is there is no set.
 */
function evaluate_whole_board(board){
  for (let i = 0; i < board.length;i++){
    for (let j = i+1; j < board.length;j++){
      for (let k = i+j+1; k < board.length;k++){
        let set_c = check_set(board[i],board[j],board[k])
        if (set_c){
          return true
        }
      }
    }
  }
  return false
}

/**
 * Function that is the "main" logic of the program.
 * It takes three cards, and compares each of the attributes between them. 
 * If for each attribute all are the same or all different, then it is a set, and returns true.
 * If for one attribute it does not fullfils this rule, then returns false and ends the run.
 * @param {*} card1 Card object, that contains all the attributes 
 * @param {*} card2 Card object, that contains all the attributes
 * @param {*} card3 Card object, that contains all the attributes
 * @returns True if they are a valid set, false if not.
 */
function check_set(card1,card2,card3){

  console.log('cards',card1,card2,card3)

  let arr = ['shape','color','number','filling']
  let flag = true
  for (let i = 0; i < 5; i++) {
    let chart = arr[i]
    if ((card1[chart] == card2[chart] && card1[chart] == card3[chart] && card2[chart] == card3[chart]) 
    || (card1[chart] !== card2[chart] && card1[chart] !== card3[chart] && card2[chart] !== card3[chart])) {
      flag = true
    } else {
      return false
    }
  }
  return flag
}

/**
 * Component that models each card functionality. 
 * @param {*} param0
 * @param {function} setCounter Function to update the counter. It is passed by the parent component, to keep track of how many cards have been selected to for the set.
 * @param {function} handleThree Function to check if three cards have been selected, and see if it is a set or not.  
 * @param {string} url String with the url of the image of the card.
 * @param {int} index Index of the card in the array.
 * @param {Array} indexes List of selected indexes so far, to form the set.
 * @param {function} setIndexes Function to update the list of indexes, by the parent component.
 * @returns React element that is a Card that shows the image of it.
 */
const CardComponent = ({ counter, setCounter,handleThree ,url,index,indexes,setIndexes}) => {

  const [border,setBorder] = useState("light")

  const handleClick = () => {
    if (border == "light"){
      setCounter(prevCounter => {
        return prevCounter + 1
      });
      setIndexes([
          ...indexes,
          index
        ]
      );
      let answer = handleThree([
        ...indexes,
        index
      ]);
      console.log('answer to handle Three',answer)
      setBorder("success");

    } else {
      setCounter(prevCounter => {
        return prevCounter - 1
      });
      setIndexes(indexes.filter((item) => item !== index));
      setBorder("light");
    }
  };

  return (
    <Col>
        <Card border={border} onClick={handleClick} style={{ cursor: "pointer" }}>
          <Card.Img variant='top' src={url}></Card.Img>
        </Card>
    </Col>
  );
};


/**
 * Function that takes the bag of cards, and gets n cards randomly from it.
 * @param {Array} arr Bag of cards 
 * @param {int} n How many cards to sample
 * @returns Two arrays, the first one is the selected n cards, and the second is the new bag without the selected cards.
 */
function get_cards_from_bag(arr,n){

  // Shuffle array
  const shuffled = arr.sort(() => 0.5 - Math.random());

  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, n);

  let bag2 = shuffled.slice(n);

  //console.log(selected)
  //console.log(bag2)

  return {selected,bag2}
  
}

/**
 * Function that loads the data into an Array.
 * @returns The initial array of 81 cards.
 */
function load_data(){
  let data = Array.from({length:81},(x,i) => get_attributes(i+1))
  return data
}

/**
 * Function that will get the card i and get its attributes, and then returns the an object
 * @param {*} i Card i in the files
 * @returns A card object with the attributes.
 */
function get_attributes(i){

  let filling = ''
  let shape = ''
  let color = ''
  let number = ''
  let url = `${import.meta.env.BASE_URL}images/image_name_${i}.png`;
  filling = get_filling(i)
  shape = get_shape(i)
  number = get_number(i)
  color = get_color(i)

  return {filling,shape,color,number,url,counter:0}
}

/**
 * Function to get the filling of the card i
 * @param {*} i 
 * @returns {string} A string with the filling value.
 */
function get_filling(i){
  if ( i < 28){
    return 'full'
  } else if (i > 54){
    return 'empty'
  } else {
    return 'stripes'
  }
}

/**
 * Function to get the shape of the card i
 * @param {*} i 
 * @returns {string} A string with the shape value.
 */
function get_shape(i){
  if (i % 27  == 0) {
    return 'round'
  } else if (i % 27 < 10){
    return 'squiggle'
  } else if (i % 27 > 18){
    return 'round'
  } else {
    return 'diamond'
  }
}

/**
 * Function to get the number of the card i
 * @param {*} i 
 * @returns {string} A string with the number value.
 */
function get_number(i){
  if (i % 3  == 0) {
    return 3
  } else if (i % 3 == 1){
    return 1
  } else if (i % 3 == 2){
    return 2
  }
}

/**
 * Function to get the color of the card i
 * @param {*} i 
 * @returns {string} A string with the color value.
 */
function get_color(i){
  if (i % 9  == 0) {
    return 'green'
  } else if (i % 9 < 4){
    return 'red'
  } else if (i % 9 > 6){
    return 'green'
  } else {
    return 'purple'
  }
}

/**
 * Main component.
 * @returns The main React comppnent to export
 */
function App() {
  const [key,setKey] = useState('game')
  const [bag,setImages] = useState([])

  const loadStart = (arr) => {
    console.log(arr)
    setImages(arr)
  }

  const handleStart = (arr,n) =>{
    const updated_bag = arr
    loadStart(updated_bag)
  }

  return (
    <>
      <h1>Let's play a game of Set!</h1>

      <Tabs id='controlled-tab' activeKey={key} onSelect={(k)=>setKey(k)} className='mb-3'>
        <Tab eventKey='game' title='Game'><Game load_data_f={() => handleStart(load_data(),12)} bag={bag} update_bag={setImages}></Game></Tab>
        <Tab eventKey='rules' title='Rules'><Rules /></Tab>
      </Tabs>
    </>
  )
}

export default App
