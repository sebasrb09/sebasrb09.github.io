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

  console.log('currentSet',currentSet)
  console.log('bag',bag)

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

class Set_Card extends Component {
  state = {filling:'',shape:'',color:'',number:0,url:'',counter:0};
  constructor(props){
    super(props);
    this.state = props
  }

  render(){
    return (
      <Col>
        <Card style={{ cursor: "pointer" }}>
          <Card.Img variant='top' src={this.state.url}></Card.Img>
        </Card>
      </Col>
    )
  }
}



function get_cards_from_bag(arr,n){

  // Shuffle array
  const shuffled = arr.sort(() => 0.5 - Math.random());

  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, n);

  let bag2 = shuffled.slice(n);

  console.log(selected)
  console.log(bag2)

  return {selected,bag2}
  
}

function load_data(){
  let data = Array.from({length:81},(x,i) => get_attributes(i+1))
  return data
}


function get_attributes(i){

  let filling = ''
  let shape = ''
  let color = ''
  let number = ''
  let url = '../images/image_name_'+i+'.png'

  filling = get_filling(i)
  shape = get_shape(i)
  number = get_number(i)
  color = get_color(i)

  let card = new Set_Card({filling,shape,color,number,url,counter:0})

  return {filling,shape,color,number,url,counter:0}
}

function get_filling(i){
  if ( i < 28){
    return 'full'
  } else if (i > 54){
    return 'empty'
  } else {
    return 'stripes'
  }
}

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

function get_number(i){
  if (i % 3  == 0) {
    return 3
  } else if (i % 3 == 1){
    return 1
  } else if (i % 3 == 2){
    return 2
  }
}

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


function App() {
  const [count, setCount] = useState(0)
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
