
import React from "react";
import styled from "styled-components";
import {useNavigate } from 'react-router-dom';

export default class App extends React.Component{
  state = {
    open: false,
  };

  handleButtonClick = () => {
    this.setState((state) => {
      return {
        open: !state.open,
      };
    });
  };
  componentDidMount(){
    document.body.style.backgroundColor = "#151E3F";
    document.body.style.color = "#7FC29B";
  }
  
render(){
  
  return (
    <>
   <PageMeta></PageMeta>
      <Head>Chaos Chess</Head>
      <DropDownButton onClick={this.handleButtonClick}>
        {this.state.open ? "Close" : "Open"}
      </DropDownButton>
      {this.state.open && (
      <ButtonDropdown>
        <StyledList>
        <LinkList></LinkList>
</StyledList>
      </ButtonDropdown>
      )}
    </>
   
  )
}
}

const Button = styled.button`
    background-color: #7FC29B;
    color: #151E3F;
    border: solid 4px #151E3F;
    font-size: 20px;
    padding: 10px 60px;
    border-radius: 10px;
    margin: 10px 0px;
    z-index: 2;
    cursor: pointer;
    border: solid 4px #7FC29B;

`;
const Head = styled.h1`
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 50px;
  color: #f5f5f5;
  background-color: #030027;
  padding: 20px;
  margin: 0px;
`;
const ButtonDropdown = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  padding: 10px;
  border: solid 4px #7FC29B;
  border-radius: 10px;
  background-color: #030027;
  color: #7FC29B;
  text-align: center;
  transition: all 0.5s ease;
`;
const DropDownButton = styled.button`
  background-color: #7FC29B;
  color: #151E3F;
  border: solid 4px #151E3F;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 10px;
  margin: 10px 0px;
  z-index: 2;
  cursor: pointer;
  border: solid 4px #878896;
  width: 100%;
`;
const StyledList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`; 
const JoinButtonList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: inline-flex;
`;
const ListItem = styled.li`
 margin: 5px;
`
function LinkList(props) {

  const navigate = useNavigate();
  const joinRules = () => {
    navigate('/rules');
  }
  const toGravity = () => {
    navigate('/play', { state: { type:"gravity"} });
  }
  const toEvolution = () => {
    navigate('/play', { state: { type:"evolution"} });
  }
  const toFourPlayer = () => {
    navigate('/play', { state: { type:"fourPlayer"} });
  }
  return (
    <>
    <JoinButtonList>
      <ListItem>
        <Button onClick={() => { toGravity() }}>Join Gravity
        </Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => {toEvolution()}}>Join Evolution
        </Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => {toFourPlayer()}}>Join Four Player
        </Button>
      </ListItem>
      </JoinButtonList>
      <ListItem>    <Button onClick={() => {
        joinRules()
      }}>Rules</Button></ListItem>
    </>
  );


}
function PageMeta(props) {
  return (
    <>     <title>Chaos Chess</title>
      <head>
        <meta charset="UTF-8"></meta>
          <meta name="description" content="A ton of chess variations"></meta>
            <meta name="keywords" content="HTML, CSS, JavaScript"></meta>
              <meta name="author" content="Charlie Simons"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                </head>
                </>
  );
}